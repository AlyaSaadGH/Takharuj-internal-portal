import re
from urllib.parse import parse_qs, urlparse
from unittest.mock import patch
from django.core import mail
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth.password_validation import validate_password
from django.test import override_settings, SimpleTestCase
from rest_framework.test import APITestCase
from .certificate_extraction import parse_certificate_text
from .models import AuditLog, Tenant, User, Client, Invoice, SubscriptionPlan, Subscription, KnowledgeArticle

class CertificateExtractionTests(SimpleTestCase):
    def test_national_address_pdf_reversed_arabic_rows(self):
        text = """
        ىنبمل امقر
        8060
        رعاشلا
        كلملا قيرط
        يعرفل امقرلا
        4131
        يحلا
        ليخنلا يح
        يديربلي ازمرلا
        12345
        ةنيدملا
        ضايرلا
        """
        fields = parse_certificate_text(text)
        self.assertEqual(fields["city"], "الرياض")
        self.assertEqual(fields["street"], "طريق الملك")
        self.assertEqual(fields["building_number"], "8060")
        self.assertEqual(fields["district"], "حي النخيل")
        self.assertEqual(fields["postal_code"], "12345")
        self.assertEqual(fields["cr_license_number"], "")

    def test_zatca_compact_address_extracts_only_invoice_fields(self):
        text = """
        Taxpayer Name شركة تجريبية للخدمات اسم المكلف
        VAT Registration Number 310000000000003 رقم التسجيل الضريبي
        Effective Registration Date 2025/02/01 تاريخ نفاذ التسجيل
        Taxpayer Address الرياض،حي النخيل،طريق الملك،12345 عنوان المكلف
        CR / License Contact / ID No 1010101010 رقم السجل التجاري / الرخصة / العقد / الهوية
        Tax Period Quarterly ربع سنوي الفترة الضريبية
        First Filing due date 2025/04/30 تاريخ استحقاق أول إقرار ضريبي
        """
        fields = parse_certificate_text(text)
        self.assertEqual(fields["taxpayer_name"], "شركة تجريبية للخدمات")
        self.assertEqual(fields["vat_registration_number"], "310000000000003")
        self.assertEqual(fields["city"], "الرياض")
        self.assertEqual(fields["district"], "حي النخيل")
        self.assertEqual(fields["street"], "طريق الملك")
        self.assertEqual(fields["postal_code"], "12345")
        self.assertEqual(fields["building_number"], "")


class ApiTests(APITestCase):
    def setUp(self):
        self.a, self.b = Tenant.objects.create(name="A"), Tenant.objects.create(name="B")
        self.admin = User.objects.create_user("admin@example.com", "StrongPass123!", tenant=self.a, role="company_admin")
        self.employee = User.objects.create_user("emp@example.com", "StrongPass123!", tenant=self.a, role="employee", permission_scope="invoices")
        Client.objects.create(tenant=self.a, name="A client")
        Client.objects.create(tenant=self.b, name="B client")
    def login(self, email="admin@example.com"):
        r = self.client.post("/api/auth/login/", {"email": email, "password": "StrongPass123!"}, format="json")
        self.assertEqual(r.status_code, 200); self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {r.data['access']}")
    def test_login_and_me(self):
        self.login(); self.assertEqual(self.client.get("/api/auth/me/").data["email"], "admin@example.com")
    def test_tenant_isolation(self):
        self.login(); rows = self.client.get("/api/clients/").data
        self.assertEqual([x["name"] for x in rows], ["A client"])
    def test_invoice_scope_cannot_access_team(self):
        self.login("emp@example.com")
        self.assertEqual(self.client.get("/api/users/").status_code, 403)
    def test_company_team_is_tenant_isolated(self):
        User.objects.create_user("other@example.com", "StrongPass123!", tenant=self.b, role="employee")
        self.login()
        rows = self.client.get("/api/users/").data
        self.assertEqual({row["email"] for row in rows}, {"admin@example.com", "emp@example.com"})
    def test_company_admin_cannot_be_suspended(self):
        self.login()
        suspended = self.client.patch(f"/api/users/{self.admin.pk}/", {"is_active": False}, format="json")
        self.assertEqual(suspended.status_code, 400)
        self.admin.refresh_from_db()
        self.assertTrue(self.admin.is_active)
    def test_platform_team_contains_platform_users_only(self):
        User.objects.create_user("platform@example.com", "StrongPass123!", role="platform_admin")
        self.login("platform@example.com")
        response = self.client.get("/api/bootstrap/?page=team")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["email"] for row in response.data["users"]], ["platform@example.com"])
    def test_platform_admin_can_create_and_suspend_own_team_employee(self):
        platform = User.objects.create_user(
            "platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin"
        )
        self.login("platform@example.com")
        created = self.client.post("/api/users/", {
            "email": "platform-employee@example.com",
            "password": "StrongPass123!",
            "manager_name": "Platform Employee",
            "role": "employee",
            "permission_scope": "invoices",
        }, format="json")
        self.assertEqual(created.status_code, 201, created.data)
        self.assertEqual(created.data["tenant_id"], str(self.a.pk))
        team = self.client.get("/api/bootstrap/?page=team")
        emails = {row["email"] for row in team.data["users"]}
        self.assertIn("platform@example.com", emails)
        self.assertIn("platform-employee@example.com", emails)
        self.assertTrue(all(row["tenant_id"] == str(self.a.pk) for row in team.data["users"]))
        suspended = self.client.patch(
            f"/api/users/{created.data['id']}/", {"is_active": False}, format="json"
        )
        self.assertEqual(suspended.status_code, 200)
        self.assertFalse(suspended.data["is_active"])
    def test_platform_admin_cannot_be_suspended(self):
        platform = User.objects.create_user("platform@example.com", "StrongPass123!", role="platform_admin")
        self.login("platform@example.com")
        response = self.client.patch(f"/api/users/{platform.pk}/", {"is_active": False}, format="json")
        self.assertEqual(response.status_code, 400)
        platform.refresh_from_db()
        self.assertTrue(platform.is_active)
    def test_registration_disabled(self):
        self.assertEqual(self.client.post("/api/auth/register/", {}).status_code, 403)
    def test_bootstrap_minimal(self):
        self.login(); data = self.client.get("/api/bootstrap/?page=invoices").data
        self.assertIn("clients", data); self.assertNotIn("plans", data)
    def test_client_crud_is_persisted(self):
        self.login()
        created = self.client.post("/api/clients/", {"name": "New client", "vat_number": "310000000000003",
            "email": "billing@example.com", "phone_number": "+966500000000"}, format="json")
        self.assertEqual(created.status_code, 201)
        self.assertEqual(created.data["email"], "billing@example.com")
        updated = self.client.patch(f"/api/clients/{created.data['id']}/", {"city": "Riyadh", "phone_number": "+966511111111"}, format="json")
        self.assertEqual(updated.status_code, 200); self.assertEqual(updated.data["city"], "Riyadh")
        self.assertEqual(updated.data["phone_number"], "+966511111111")
        self.assertEqual(self.client.delete(f"/api/clients/{created.data['id']}/").status_code, 204)
    @patch("core.views.extract_certificate")
    def test_client_certificate_extract_and_upload_is_tenant_scoped(self, extract):
        extract.return_value = ({"taxpayer_name": "Extracted Client", "vat_registration_number": "310000000000003", "cr_license_number": "1010101010", "city": "Riyadh", "street": "King Road", "building_number": "1234", "district": "Olaya", "postal_code": "12345"}, "certificate text")
        self.login()
        certificate = SimpleUploadedFile("certificate.pdf", b"%PDF-1.4 test", content_type="application/pdf")
        response = self.client.post("/api/client-certificate/extract/", {"certificate": certificate}, format="multipart")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["fields"]["taxpayer_name"], "Extracted Client")
        self.assertNotIn("cr_license_number", response.data["fields"])
        self.assertNotIn("cr_license_number", response.data)
        own = Client.objects.get(tenant=self.a)
        upload = SimpleUploadedFile("certificate.pdf", b"%PDF-1.4 saved", content_type="application/pdf")
        saved = self.client.post(f"/api/clients/{own.pk}/certificate/", {"certificate": upload}, format="multipart")
        self.assertEqual(saved.status_code, 200)
        own.refresh_from_db()
        self.assertTrue(bool(own.registration_certificate))
        foreign = Client.objects.get(tenant=self.b)
        blocked = SimpleUploadedFile("certificate.pdf", b"%PDF-1.4 blocked", content_type="application/pdf")
        self.assertEqual(self.client.post(f"/api/clients/{foreign.pk}/certificate/", {"certificate": blocked}, format="multipart").status_code, 404)
    def test_invoice_create_calculates_totals(self):
        self.login()
        client = Client.objects.get(tenant=self.a, name="A client")
        payload = {"client": client.pk, "invoice_type": "standard", "status": "draft", "lines": [
            {"description": "Service", "quantity": "2", "unit_price": "100", "tax_rate": "15"}
        ]}
        response = self.client.post("/api/invoices/", payload, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["subtotal"], "200.00")
        self.assertEqual(response.data["tax_amount"], "30.00")
        self.assertEqual(response.data["total_amount"], "230.00")
    def test_invoice_can_be_created_without_adding_client_record(self):
        self.login()
        before = Client.objects.filter(tenant=self.a).count()
        response = self.client.post("/api/invoices/", {
            "invoice_type": "standard",
            "xml_content": '{"buyer":"One-time buyer"}',
            "lines": [{"description": "Service", "quantity": 1, "unit_price": 10}],
        }, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertIsNone(response.data["client"])
        self.assertEqual(Client.objects.filter(tenant=self.a).count(), before)
    def test_cross_tenant_client_rejected_for_platform(self):
        platform = User.objects.create_user("platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin")
        self.login("platform@example.com")
        foreign = Client.objects.get(tenant=self.b)
        response = self.client.post("/api/invoices/", {"client": foreign.pk, "lines": [
            {"description": "Service", "quantity": 1, "unit_price": 10}
        ]}, format="json")
        self.assertEqual(response.status_code, 400)
    def test_platform_invoice_api_is_scoped_to_own_tenant(self):
        User.objects.create_user("platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin")
        own = Invoice.objects.create(tenant=self.a, invoice_number="INV-PLATFORM")
        foreign = Invoice.objects.create(tenant=self.b, invoice_number="INV-COMPANY")
        self.login("platform@example.com")
        rows = self.client.get("/api/invoices/")
        self.assertEqual(rows.status_code, 200)
        self.assertEqual([row["id"] for row in rows.data], [str(own.pk)])
        self.assertEqual(self.client.get(f"/api/invoices/{foreign.pk}/").status_code, 404)
        self.assertEqual(self.client.patch(f"/api/invoices/{foreign.pk}/", {"status": "approved"}, format="json").status_code, 404)
    def test_invoice_list_orders_newest_first(self):
        older = Invoice.objects.create(tenant=self.a, invoice_number="INV-OLDER")
        newer = Invoice.objects.create(tenant=self.a, invoice_number="INV-NEWER")
        self.login()
        rows = self.client.get("/api/invoices/")
        ids = [row["id"] for row in rows.data]
        self.assertLess(ids.index(str(newer.pk)), ids.index(str(older.pk)))
    def test_platform_invoice_bootstrap_is_scoped_to_own_tenant(self):
        User.objects.create_user("platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin")
        Invoice.objects.create(tenant=self.a, invoice_number="INV-PLATFORM")
        Invoice.objects.create(tenant=self.b, invoice_number="INV-COMPANY")
        self.login("platform@example.com")
        data = self.client.get("/api/bootstrap/?page=invoices").data
        self.assertEqual([row["name"] for row in data["clients"]], ["A client"])
        self.assertEqual([row["invoice_number"] for row in data["invoices"]], ["INV-PLATFORM"])
        self.assertEqual([row["id"] for row in data["tenants"]], [str(self.a.pk)])
        self.assertEqual(data["summary"]["clients"], 1)
        self.assertEqual(data["summary"]["invoices"], 1)
    def test_dashboard_isolated_for_platform_admin(self):
        User.objects.create_user("platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin")
        own = Invoice.objects.create(tenant=self.a, invoice_number="DASH-A", total_amount="115.00")
        Invoice.objects.create(tenant=self.b, invoice_number="DASH-B", total_amount="999.00")
        self.login("platform@example.com")
        response = self.client.get("/api/dashboard/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["id"] for row in response.data["invoices"]], [str(own.pk)])
        self.assertEqual(response.data["summary"]["invoices"], 1)
        self.assertEqual(response.data["summary"]["revenue"], 115)
    def test_reports_are_aggregate_only_and_tenant_isolated(self):
        User.objects.create_user("platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin")
        Invoice.objects.create(
            tenant=self.a, invoice_number="REPORT-A", status="paid",
            total_amount="115.00", tax_amount="15.00",
        )
        Invoice.objects.create(
            tenant=self.b, invoice_number="REPORT-B", status="paid",
            total_amount="999.00", tax_amount="99.00",
        )
        self.login("platform@example.com")
        response = self.client.get("/api/reports/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["tenant_id"], str(self.a.pk))
        self.assertEqual(response.data["summary"]["paid"], 115)
        self.assertEqual(response.data["summary"]["vat"], 15)
        self.assertNotIn("invoices", response.data)
        self.assertNotIn("clients", response.data)
        self.assertNotIn("users", response.data)
    def test_invoice_only_employee_cannot_access_reports(self):
        self.login("emp@example.com")
        self.assertEqual(self.client.get("/api/dashboard/").status_code, 403)
        self.assertEqual(self.client.get("/api/reports/").status_code, 403)
    def test_sensitive_pages_are_not_available_through_generic_bootstrap(self):
        self.login()
        self.assertEqual(self.client.get("/api/bootstrap/?page=dashboard").status_code, 404)
        self.assertEqual(self.client.get("/api/bootstrap/?page=reports").status_code, 404)
        self.assertEqual(self.client.get("/api/bootstrap/?page=client-log").status_code, 404)
    def test_action_log_is_strictly_tenant_isolated_for_platform_admin(self):
        platform = User.objects.create_user(
            "platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin"
        )
        own = AuditLog.objects.create(tenant=self.a, user=platform, action="own_action")
        company_user = User.objects.create_user(
            "company@example.com", "StrongPass123!", tenant=self.a, role="employee"
        )
        AuditLog.objects.create(tenant=self.a, user=company_user, action="company_action")
        AuditLog.objects.create(tenant=self.b, action="foreign_action")
        self.login("platform@example.com")
        context = self.client.get("/api/action-log/context/")
        self.assertEqual(context.status_code, 200)
        self.assertEqual(context.data["tenant_id"], str(self.a.pk))
        response = self.client.get("/api/audit-logs/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([row["id"] for row in response.data], [own.pk])
    def test_action_log_records_actor_and_target(self):
        self.login()
        client = Client.objects.get(tenant=self.a, name="A client")
        response = self.client.patch(
            f"/api/clients/{client.pk}/", {"name": "Updated target"}, format="json"
        )
        self.assertEqual(response.status_code, 200)
        log = self.client.get("/api/audit-logs/").data[0]
        self.assertEqual(log["action"], "client_updated")
        self.assertEqual(log["actor_email"], self.admin.email)
        self.assertEqual(log["target_type"], "client")
        self.assertEqual(log["target_id"], str(client.pk))
        self.assertEqual(log["target_label"], "Updated target")
    def test_invoice_only_employee_cannot_access_action_log(self):
        self.login("emp@example.com")
        self.assertEqual(self.client.get("/api/action-log/context/").status_code, 403)
        self.assertEqual(self.client.get("/api/audit-logs/").status_code, 403)
    def test_platform_client_api_is_scoped_to_own_tenant(self):
        User.objects.create_user("platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin")
        own = Client.objects.get(tenant=self.a)
        foreign = Client.objects.get(tenant=self.b)
        self.login("platform@example.com")
        rows = self.client.get("/api/clients/")
        self.assertEqual(rows.status_code, 200)
        self.assertEqual([row["id"] for row in rows.data], [own.pk])
        self.assertEqual(self.client.get(f"/api/clients/{foreign.pk}/").status_code, 404)
        self.assertEqual(self.client.patch(f"/api/clients/{foreign.pk}/", {"name": "Blocked"}, format="json").status_code, 404)
        self.assertEqual(self.client.delete(f"/api/clients/{foreign.pk}/").status_code, 404)
    def test_subscribers_bootstrap_is_platform_only_and_excludes_clients(self):
        User.objects.create_user("platform@example.com", "StrongPass123!", tenant=self.a, role="platform_admin")
        self.login()
        self.assertEqual(self.client.get("/api/bootstrap/?page=subscribers").status_code, 403)
        self.login("platform@example.com")
        response = self.client.get("/api/bootstrap/?page=subscribers")
        self.assertEqual(response.status_code, 200)
        self.assertNotIn("clients", response.data)
        self.assertIn("tenants", response.data)
    def test_issued_invoice_is_immutable(self):
        self.login()
        invoice = Invoice.objects.create(tenant=self.a, invoice_number="INV-LOCKED", status="issued")
        self.assertEqual(self.client.patch(f"/api/invoices/{invoice.pk}/", {"status": "draft"}, format="json").status_code, 400)
        self.assertEqual(self.client.delete(f"/api/invoices/{invoice.pk}/").status_code, 400)
    def test_employee_cannot_manage_plans(self):
        plan = SubscriptionPlan.objects.create(name="Basic")
        self.login("emp@example.com")
        self.assertEqual(self.client.patch(f"/api/plans/{plan.pk}/", {"name": "Changed"}, format="json").status_code, 403)
    @override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend", FRONTEND_URL="https://example.com/")
    def test_password_reset_flow(self):
        response = self.client.post("/api/auth/password-reset/", {"identity": "admin@example.com"}, format="json")
        self.assertEqual(response.status_code, 200); self.assertEqual(len(mail.outbox), 1)
        url = re.search(r"https://\S+", mail.outbox[0].body).group(0)
        query = parse_qs(urlparse(url).query)
        changed = self.client.post("/api/auth/password-reset/confirm/", {
            "uid": query["uid"][0], "token": query["token"][0], "password": "NewStrongPass456!"
        }, format="json")
        self.assertEqual(changed.status_code, 200)
        self.assertTrue(User.objects.get(email="admin@example.com").check_password("NewStrongPass456!"))
    def test_plan_client_limit(self):
        plan = SubscriptionPlan.objects.create(name="One client", max_clients=1)
        Subscription.objects.create(tenant=self.a, plan=plan)
        self.login()
        response = self.client.post("/api/clients/", {"name": "Over limit"}, format="json")
        self.assertEqual(response.status_code, 400)
    def test_support_knowledge_reply(self):
        KnowledgeArticle.objects.create(title="Invoices", content="يمكنك إنشاء الفاتورة من صفحة الفواتير.", keywords=["فاتورة"])
        self.login()
        conversation = self.client.post("/api/support/conversations/", {"subject": "Help"}, format="json")
        response = self.client.post(f"/api/support/conversations/{conversation.data['id']}/messages/",
            {"body": "كيف أنشئ فاتورة؟"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response.data["ai_message"])
    def test_numeric_password_is_allowed(self):
        validate_password("123456", self.employee)
