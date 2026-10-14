// Fawateer Platform Frontend - API Configuration and Integration

const PLATFORM_DATA_EPOCH = '20260725-postgresql-auth-v2';
if (localStorage.getItem('takharuj_platform_epoch') !== PLATFORM_DATA_EPOCH) {
  [
    'auth_token',
    'takharuj_user',
    'takharuj_saas_clients',
    'takharuj_saas_packages',
    'takharuj_saas_team',
    'takharuj_saas_invoices',
    'takharuj_saas_local_audit',
    'takharuj_company_settings'
  ].forEach(key => localStorage.removeItem(key));
  sessionStorage.removeItem('takharuj_user');
  localStorage.setItem('takharuj_platform_epoch', PLATFORM_DATA_EPOCH);
}

// Portfolio preview: no backend session or real credentials are created.
const DEMO_PREVIEW = {
  active() { return sessionStorage.getItem('takharuj_demo_preview') === '1'; },
  user: {id: 1, email: 'demo@example.com', manager_name: 'مستخدم تجريبي', role: 'company_admin', permission_scope: 'full_access', tenant_id: 1, tenant_name: 'شركة المثال', is_active: true},
  tenant: {id: 1, name: 'شركة المثال', tax_registration_number: '300000000000003', commercial_registration_number: '0000000000', location_city: 'الدمام', address_text: 'عنوان تجريبي — الدمام', invoice_seller_name: 'شركة المثال', zatca_status: 'not_linked'},
  clients: [
    {id: 1, name: 'عميل تجريبي أول', email: 'client1@example.com', city: 'الدمام', status: 'active', tenant_name: 'شركة المثال'},
    {id: 2, name: 'عميل تجريبي ثانٍ', email: 'client2@example.com', city: 'الخبر', status: 'active', tenant_name: 'شركة المثال'}
  ],
  invoices: [
    {id: 1, invoice_number: 'DEMO-001', client: 1, client_name: 'عميل تجريبي أول', invoice_type: 'standard', status: 'paid', total_amount: '1150.00', issue_date: '2026-10-01', xml_content: JSON.stringify({buyer: 'عميل تجريبي أول', seller: 'شركة المثال', net: 1000, vatAmount: 150, total: 1150, items: [{description: 'خدمة تجريبية', quantity: 1, unit_price: 1000, line_total: 1000}]})},
    {id: 2, invoice_number: 'DEMO-002', client: 2, client_name: 'عميل تجريبي ثانٍ', invoice_type: 'standard', status: 'draft', total_amount: '575.00', issue_date: '2026-10-10', xml_content: JSON.stringify({buyer: 'عميل تجريبي ثانٍ', seller: 'شركة المثال', net: 500, vatAmount: 75, total: 575, items: [{description: 'استشارة تجريبية', quantity: 1, unit_price: 500, line_total: 500}]})}
  ],
  request(path, options = {}) {
    if ((options.method || 'GET').toUpperCase() !== 'GET') throw new Error('النسخة التجريبية للعرض فقط؛ الحفظ والإرسال غير متاحين. Demo preview is read-only.');
    const route = path.split('?')[0];
    const data = {user: this.user, tenants: [this.tenant], clients: this.clients, invoices: this.invoices, users: [this.user], plans: [], subscriptions: [], zatca_status: 'not_linked', summary: {clients: 2, invoices: 2, team: 1, revenue: 1725, paid: 1150, outstanding: 575, vat: 225}};
    if (['/dashboard/', '/reports/', '/bootstrap/', '/action-log/context/'].includes(route)) return structuredClone(data);
    if (route === '/auth/me/') return {...this.user};
    const collections = {clients: this.clients, invoices: this.invoices, tenants: [this.tenant], users: [this.user], plans: [], subscriptions: [], notifications: [], products: [], 'audit-logs': []};
    const parts = route.split('/').filter(Boolean);
    if (parts[0] in collections) {
      const rows = collections[parts[0]];
      if (parts[1]) return structuredClone(rows.find(row => String(row.id) === parts[1]) || {});
      return structuredClone(rows);
    }
    return {};
  }
};

const API_CONFIG = {
  base_url: (
    ['localhost', '127.0.0.1'].includes(location.hostname)
      ? 'http://localhost:8000/api'
      : (location.pathname.startsWith('/takharuj/')
        ? `${location.origin}/takharuj-api`
        : `${location.origin}/api`)
  ),
  token: localStorage.getItem('auth_token') || null,

  isLoginPage() {
    return location.pathname.endsWith('/login.html');
  },

  pageUrl(page) {
    return new URL(page, location.href).href;
  },

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': this.token ? `Bearer ${this.token}` : ''
    };
  },

  async ensureToken(options = {}) {
    const redirect = options.redirect !== false;
    if (DEMO_PREVIEW.active()) return true;
    if (this.token) return true;

    if (redirect && !this.isLoginPage()) {
      location.href = this.pageUrl('login.html');
    }

    return false;
  },

  async validateSession(options = {}) {
    const redirect = options.redirect !== false;
    if (DEMO_PREVIEW.active()) return true;
    if (!await this.ensureToken({ redirect })) return false;
    try {
      const response = await fetch(`${this.base_url}/auth/me/`, {
        headers: this.getHeaders(),
        cache: 'no-store'
      });
      if (!response.ok) {
        this.clearToken();
        if (redirect && !this.isLoginPage()) location.replace(this.pageUrl('login.html'));
        return false;
      }
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  },

  clearToken() {
    sessionStorage.removeItem('takharuj_demo_preview');
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('takharuj_user');
    sessionStorage.removeItem('takharuj_user');
  },

  logout() {
    this.clearToken();
    location.href = this.pageUrl('login.html');
  }
};

const ApiClient = {
  async request(path, options = {}) {
    if (DEMO_PREVIEW.active()) return DEMO_PREVIEW.request(path, options);
    const hasToken = await API_CONFIG.ensureToken();
    if (!hasToken) throw new Error('Authentication required');

    const isFormData = options.body instanceof FormData;
    const headers = isFormData
      ? { 'Authorization': API_CONFIG.token ? `Bearer ${API_CONFIG.token}` : '', ...(options.headers || {}) }
      : { ...API_CONFIG.getHeaders(), ...(options.headers || {}) };
    const response = await fetch(`${API_CONFIG.base_url}${path}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      API_CONFIG.clearToken();
      location.href = API_CONFIG.pageUrl('login.html');
      throw new Error('Authentication expired');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error ${response.status}:`, errorText);
      let message = errorText || `API request failed with ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        message = errorJson.detail || errorJson.error || message;
        const error = new Error(message);
        error.status = response.status;
        error.data = errorJson;
        throw error;
      } catch (err) {
        if (err.data) throw err;
      }
      const error = new Error(message);
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) return null;
    return await response.json();
  },

  async login(email, password, remember = true) {
    sessionStorage.removeItem('takharuj_demo_preview');
    try {
      const response = await fetch(`${API_CONFIG.base_url}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.access) {
        return { success: false, error: data.detail || data.error || `Login failed (${response.status})` };
      }

      API_CONFIG.token = data.access;
      localStorage.setItem('auth_token', data.access);

      localStorage.removeItem('takharuj_user');
      sessionStorage.removeItem('takharuj_user');

      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async register(accountData) {
    try {
      const response = await fetch(`${API_CONFIG.base_url}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.detail || data.error || `Register failed (${response.status})` };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async requestPasswordReset(identity) {
    try {
      const response = await fetch(`${API_CONFIG.base_url}/auth/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.detail || data.error || `Reset request failed (${response.status})` };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async fetchMe() {
    try {
      return await this.request('/auth/me/');
    } catch (err) {
      console.error('Error fetching current user:', err);
      return null;
    }
  },

  async fetchBootstrap(page = 'dashboard') {
    if (page === 'dashboard') return await this.request('/dashboard/');
    if (page === 'reports') return await this.request('/reports/');
    if (page === 'client-log') return await this.request('/action-log/context/');
    return await this.request(`/bootstrap/?page=${encodeURIComponent(page)}`);
  },

  async resetPassword(uid, token, password) {
    try {
      const response = await fetch(`${API_CONFIG.base_url}/auth/password-reset/confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, token, password })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.detail || data.error || `Password reset failed (${response.status})` };
      }
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async fetchClients() {
    try {
      return await this.request('/clients/');
    } catch (err) {
      console.error('Error fetching clients:', err);
      return [];
    }
  },

  async createClient(clientData) {
    try {
      return await this.request('/clients/', {
        method: 'POST',
        body: JSON.stringify(clientData)
      });
    } catch (err) {
      console.error('Error creating client:', err);
      return { error: err.message };
    }
  },

  async updateClient(id, clientData) {
    return await this.request(`/clients/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(clientData)
    });
  },

  async deleteClient(id) {
    return await this.request(`/clients/${id}/`, { method: 'DELETE' });
  },

  async fetchInvoices() {
    try {
      return await this.request('/invoices/');
    } catch (err) {
      console.error('Error fetching invoices:', err);
      return [];
    }
  },

  async createInvoice(invoiceData) {
    try {
      return await this.request('/invoices/', {
        method: 'POST',
        body: invoiceData instanceof FormData ? invoiceData : JSON.stringify(invoiceData)
      });
    } catch (err) {
      console.error('Error creating invoice:', err);
      return { error: err.message };
    }
  },

  async fetchInvoice(id) {
    return await this.request(`/invoices/${id}/`);
  },

  async updateInvoice(id, invoiceData) {
    return await this.request(`/invoices/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(invoiceData)
    });
  },

  async fetchTenants() {
    return await this.request("/tenants/");
  },

  async fetchTenant(id) {
    return await this.request(`/tenants/${id}/`);
  },

  async updateTenant(id, tenantData) {
    return await this.request(`/tenants/${id}/`, {
      method: "PATCH",
      body: tenantData instanceof FormData ? tenantData : JSON.stringify(tenantData)
    });
  },

  async deleteTenant(id) {
    return await this.request(`/tenants/${id}/`, { method: "DELETE" });
  },

  async uploadTenantLogo(id, file) {
    const formData = new FormData();
    formData.append("logo", file);
    return await this.request(`/tenants/${id}/logo/`, {
      method: "POST",
      body: formData
    });
  },

  async deleteTenantLogo(id) {
    return await this.request(`/tenants/${id}/logo/`, { method: "DELETE" });
  },

  async fetchSubscriptions() {
    try {
      return await this.request('/subscriptions/');
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      return [];
    }
  },

  async fetchSubscription(id) {
    return await this.request(`/subscriptions/${id}/`);
  },

  async createSubscription(subscriptionData) {
    return await this.request('/subscriptions/', {
      method: 'POST',
      body: JSON.stringify(subscriptionData)
    });
  },

  async openAuthenticatedFile(path) {
    if (DEMO_PREVIEW.active()) throw new Error('تحميل الملفات غير متاح في النسخة التجريبية.');
    const popup = window.open('', '_blank', 'noopener');
    const hasToken = await API_CONFIG.ensureToken();
    if (!hasToken) {
      if (popup) popup.close();
      throw new Error('Authentication required');
    }
    const url = /^https?:\/\//i.test(path)
      ? path
      : `${API_CONFIG.base_url}${path.startsWith('/') ? path : `/${path}`}`;
    const response = await fetch(url, {
      headers: { 'Authorization': API_CONFIG.token ? `Bearer ${API_CONFIG.token}` : '' }
    });
    if (!response.ok) {
      if (popup) popup.close();
      throw new Error(`File request failed with ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    if (popup) popup.location.href = blobUrl;
    else window.open(blobUrl, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  },

  async updateSubscription(id, subscriptionData) {
    return await this.request(`/subscriptions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(subscriptionData)
    });
  },

  async fetchAuditLogs(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await this.request(`/audit-logs/${query ? `?${query}` : ''}`);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      return [];
    }
  },

  async fetchNotifications() {
    try {
      return await this.request('/notifications/');
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  },

  async markNotificationsRead(id = null) {
    return await this.request('/notifications/mark-read/', {
      method: 'POST',
      body: JSON.stringify(id ? { id } : {})
    });
  },

  async fetchProducts() {
    try {
      return await this.request('/products/');
    } catch (err) {
      console.error('Error fetching products:', err);
      return [];
    }
  },

  async createProduct(productData) {
    return await this.request('/products/', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  },

  async updateProduct(id, productData) {
    return await this.request(`/products/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(productData)
    });
  },

  async deleteProduct(id) {
    return await this.request(`/products/${id}/`, { method: 'DELETE' });
  },

  async fetchPlans(options = {}) {
    try {
      const query = options.active ? '?active=1' : '';
      return await this.request(`/plans/${query}`);
    } catch (err) {
      console.error('Error fetching plans:', err);
      return [];
    }
  },

  async createPlan(planData) {
    return await this.request('/plans/', {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  },

  async updatePlan(id, planData) {
    return await this.request(`/plans/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(planData)
    });
  },

  async deletePlan(id) {
    return await this.request(`/plans/${id}/`, { method: 'DELETE' });
  },

  async fetchUsers() {
    try {
      return await this.request('/users/');
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    }
  },

  async fetchUser(id) {
    return await this.request(`/users/${id}/`);
  },

  async createUser(userData) {
    return await this.request('/users/', {
      method: 'POST',
      body: userData instanceof FormData ? userData : JSON.stringify(userData)
    });
  },

  async extractVatCertificate(file, tenantId = null) {
    if (DEMO_PREVIEW.active()) throw new Error('رفع الملفات غير متاح في النسخة التجريبية.');
    const hasToken = await API_CONFIG.ensureToken();
    if (!hasToken) throw new Error('Authentication required');
    const formData = new FormData();
    formData.append('certificate', file);
    if (tenantId) formData.append('tenant_id', tenantId);
    const response = await fetch(`${API_CONFIG.base_url}/vat-certificate/extract/`, {
      method: 'POST',
      headers: {
        'Authorization': API_CONFIG.token ? `Bearer ${API_CONFIG.token}` : ''
      },
      body: formData
    });
    if (response.status === 401) {
      API_CONFIG.clearToken();
      location.href = API_CONFIG.pageUrl('login.html');
      throw new Error('Authentication expired');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.detail || data.error || `API request failed with ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  },

  async updateUser(id, userData) {
    return await this.request(`/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
  },

  async deleteUser(id) {
    return await this.request(`/users/${id}/`, { method: 'DELETE' });
  }
};

async function checkApiConnection() {
  if (DEMO_PREVIEW.active()) return true;
  try {
    const response = await fetch(`${API_CONFIG.base_url}/`, { method: 'GET' });
    return response.ok;
  } catch (err) {
    console.warn('Backend API not available:', err.message);
    return false;
  }
}

async function initializeApp() {
  const isOnline = await checkApiConnection();
  console.log(isOnline ? 'Connected to backend' : 'Backend unavailable - database operations disabled');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (!API_CONFIG.isLoginPage()) API_CONFIG.validateSession();
  });
} else if (!API_CONFIG.isLoginPage()) {
  API_CONFIG.validateSession();
}

document.addEventListener('DOMContentLoaded', () => {
  if (!DEMO_PREVIEW.active() || API_CONFIG.isLoginPage()) return;
  const banner = document.createElement('div');
  banner.setAttribute('role', 'status');
  banner.style.cssText = 'position:fixed;bottom:12px;left:50%;transform:translateX(-50%);z-index:9999;padding:10px 18px;border-radius:12px;background:#15384b;color:white;box-shadow:0 4px 20px #0002;font:14px sans-serif;max-width:90vw;text-align:center;pointer-events:none';
  banner.textContent = localStorage.getItem('takharuj_lang') === 'en' ? 'Demo preview · Sample data · Read-only' : 'نسخة تجريبية · بيانات وهمية · للعرض فقط';
  document.body.appendChild(banner);
});
