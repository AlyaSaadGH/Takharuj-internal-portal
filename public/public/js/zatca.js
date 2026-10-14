let savedState={};try{savedState=JSON.parse(localStorage.getItem('takharuj_saas_state')||'{}')}catch(_){savedState={}}
  let zatcaLang=localStorage.getItem('takharuj_lang')||'ar',currentZatcaStatus='unlinked';
  const zatcaTranslations={
    back:['العودة للإعدادات','Back to settings'],notifications:['الإشعارات','Notifications'],noNotifications:['لا توجد إشعارات جديدة حاليًا.','There are no new notifications.'],logout:['تسجيل خروج','Log out'],
    title:['الربط الإلكتروني للفوترة والامتثال','E-invoicing integration and compliance'],subtitle:['اربط منشأتك بمنصة فاتورة لإصدار Compliance CSID وتجهيز مسار التوقيع الإلكتروني.','Connect your organization to Fatoora to issue a Compliance CSID and prepare the digital-signing workflow.'],
    secure:['اتصال آمن','Secure connection'],encrypted:['البيانات الحساسة مشفّرة','Sensitive data is encrypted'],stepsTitle:['تهيئة منشأتك بخطوات واضحة','Set up your organization in clear steps'],stepsIntro:['أدخل بيانات المنشأة كما تظهر في تسجيلها لدى الهيئة، ثم استخدم رمز التحقق الصادر من بوابة فاتورة.','Enter the organization data exactly as registered with ZATCA, then use the OTP issued by the Fatoora portal.'],
    step1Title:['أنشئ رمز OTP','Generate an OTP'],step1Text:['من بوابة فاتورة ضمن إدارة الأجهزة والحلول.','From Device and Solution Management in the Fatoora portal.'],step2Title:['راجع بيانات المنشأة','Review organization data'],step2Text:['تأكد من الرقم الضريبي ونوع الفواتير.','Verify the VAT number and invoice type.'],step3Title:['ابدأ الربط الآمن','Start secure onboarding'],step3Text:['سيتم توليد CSR وحفظ بيانات CSID مشفّرة.','A CSR will be generated and the CSID credentials stored encrypted.'],
    otpHelpTitle:['كيف تحصل على رمز OTP؟','How do you obtain an OTP?'],otpHelp:['سجّل الدخول إلى بوابة هيئة الزكاة والضريبة والجمارك، افتح منصة فاتورة ثم «إدارة الأجهزة والحلول»، واختر تهيئة جهاز أو حل جديد. انسخ الرمز المكوّن من 6 أرقام قبل انتهاء صلاحيته.','Sign in to the ZATCA portal, open Fatoora, then Device and Solution Management. Choose to onboard a new device or solution and copy the six-digit code before it expires.'],privacy:['لن يتم حفظ رمز OTP أو إظهاره في سجل العمليات.','The OTP is never stored or included in audit logs.'],
    formTitle:['بيانات تهيئة المنشأة','Organization onboarding data'],required:['جميع الحقول مطلوبة لإتمام الربط.','All fields are required to complete onboarding.'],orgName:['اسم المنشأة بالإنجليزية','Organization name in English'],city:['المدينة','City'],invoiceType:['نوع الفواتير','Invoice type'],vat:['الرقم الضريبي','VAT number'],otp:['رمز التحقق OTP','OTP verification code'],submit:['تحقق وربط المنشأة','Verify and connect organization'],loading:['جاري التحقق والربط...','Verifying and connecting...'],keyNote:['يتم توليد المفتاح الخاص داخل الخادم وتشفيره قبل الحفظ في قاعدة البيانات.','The private key is generated on the server and encrypted before database storage.'],
    successTitle:['تم الربط بنجاح','Connected successfully'],successNote:['تم إصدار Compliance CSID وحفظ بيانات التوقيع مشفّرة. أصبح الحل جاهزًا لاختبارات الامتثال التالية.','The Compliance CSID was issued and signing credentials stored encrypted. The solution is ready for the next compliance tests.'],continue:['متابعة','Continue'],unlinked:['غير مرتبط','Unlinked'],linked:['مرتبط','Linked']
  };
  function tr(key){const value=zatcaTranslations[key];return value?value[zatcaLang==='ar'?0:1]:key}
  function applyZatcaTranslations(){
    document.querySelectorAll('[data-i18n]').forEach(node=>{node.textContent=tr(node.dataset.i18n)});
    document.querySelectorAll('[data-placeholder-ar]').forEach(node=>{node.placeholder=zatcaLang==='ar'?node.dataset.placeholderAr:node.dataset.placeholderEn});
    document.querySelectorAll('option[data-ar]').forEach(node=>{node.textContent=zatcaLang==='ar'?node.dataset.ar:node.dataset.en});
    document.title=zatcaLang==='ar'?'منصة فواتير | الربط الإلكتروني':'Invoice Office | E-invoicing Integration';
  }
  function applyZatcaPreferences(){
    document.body.classList.toggle('light',savedState.theme!=='dark');
    document.documentElement.lang=zatcaLang;document.documentElement.dir=zatcaLang==='ar'?'rtl':'ltr';
    document.body.classList.toggle('en',zatcaLang==='en');
    document.getElementById('langBtn').textContent=zatcaLang==='ar'?'English':'عربي';
    document.getElementById('themeBtn').innerHTML=savedState.theme==='dark'?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';
    applyZatcaTranslations();
  }
  function toggleZatcaTheme(){savedState.theme=savedState.theme==='dark'?'light':'dark';localStorage.setItem('takharuj_saas_state',JSON.stringify(savedState));applyZatcaPreferences()}
  function toggleZatcaLang(){zatcaLang=zatcaLang==='ar'?'en':'ar';localStorage.setItem('takharuj_lang',zatcaLang);applyZatcaPreferences();loadZatcaAccount()}
  function toggleZatcaNotifications(){const menu=document.getElementById('notifMenu'),btn=document.getElementById('notifBtn');menu.hidden=!menu.hidden;btn.setAttribute('aria-expanded',String(!menu.hidden))}
  function logoutZatca(){if(typeof API_CONFIG!=='undefined'&&API_CONFIG.logout)API_CONFIG.logout();else location.href='login.html'}
  async function loadZatcaAccount(){
    try{
      const bootstrap=await ApiClient.fetchBootstrap('zatca');
      const account=bootstrap?.user;
      if(account?.permission_scope==='invoices'){
        location.replace('invoices.html');
        return false;
      }
      if(account?.email)document.getElementById('accountName').textContent=account.email;
      const labels={platform_admin:['مدير منصة','Platform admin'],company_admin:['مدير شركة','Company admin'],employee:['موظف','Employee']};
      const label=labels[account?.role]||labels.employee;
      document.getElementById('accountRole').textContent=label[zatcaLang==='ar'?0:1];
      applyZatcaSnapshot(bootstrap?.zatca||{});
      return true;
    }catch(_){return false}
  }
  const form=document.getElementById('zatcaForm'),vat=document.getElementById('vatNumber'),otp=document.getElementById('zatcaOtp');
  const errorBox=document.getElementById('formError'),button=document.getElementById('submitBtn'),buttonText=document.getElementById('buttonText'),spinner=document.getElementById('spinner');
  function digitsOnly(input,count){input.value=input.value.replace(/\D/g,'').slice(0,count);document.getElementById(input===vat?'vatCount':'otpCount').textContent=input.value.length+' / '+count}
  vat.addEventListener('input',()=>digitsOnly(vat,15));otp.addEventListener('input',()=>digitsOnly(otp,6));
  function showError(message){errorBox.textContent=message;errorBox.hidden=false;errorBox.scrollIntoView({behavior:'smooth',block:'center'})}
  function renderZatcaStatus(status){
    currentZatcaStatus=status||'unlinked';
    const linked=status==='linked',badge=document.getElementById('statusBadge');
    otp.required=!linked;
    badge.classList.toggle('linked',linked);
    badge.innerHTML='<i class="fa-solid '+(linked?'fa-circle-check':'fa-circle-xmark')+'"></i><span data-i18n="'+(linked?'linked':'unlinked')+'">'+tr(linked?'linked':'unlinked')+'</span>';
  }
  function applyZatcaSnapshot(data){
    renderZatcaStatus(data.zatca_status);
    document.getElementById('productionCsidBtn').hidden=data.zatca_status!=='linked'||data.has_production_csid;
    if(data.vat_number&&!vat.value){vat.value=data.vat_number;digitsOnly(vat,15)}
    const organization=document.getElementById('organizationName');
    if(data.organization_name&&!organization.value)organization.value=data.organization_name;
    if(data.location_city&&!document.getElementById('locationCity').value)document.getElementById('locationCity').value=data.location_city;
    [['streetName','street_name'],['buildingNumber','building_number'],['citySubdivision','city_subdivision'],['postalZone','postal_zone']].forEach(([id,key])=>{if(data[key]&&!document.getElementById(id).value)document.getElementById(id).value=data[key]});
    const type=document.getElementById('invoiceType');
    if(data.invoice_type&&type.querySelector('option[value="'+data.invoice_type+'"]'))type.value=data.invoice_type;
  }
  async function loadZatcaStatus(){
    try{
      const data=await ApiClient.request('/zatca/onboard');
      applyZatcaSnapshot(data);
    }catch(_){renderZatcaStatus('unlinked')}
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();errorBox.hidden=true;
    if(!/^3\d{13}3$/.test(vat.value))return showError(zatcaLang==='ar'?'الرقم الضريبي يجب أن يتكون من 15 رقمًا ويبدأ وينتهي بالرقم 3.':'The VAT number must contain 15 digits and start and end with 3.');
    if(currentZatcaStatus!=='linked'&&!/^\d{6}$/.test(otp.value))return showError(zatcaLang==='ar'?'رمز OTP يجب أن يتكون من 6 أرقام.':'The OTP must contain exactly six digits.');
    if(!form.reportValidity())return;
    button.disabled=true;buttonText.textContent=tr('loading');spinner.hidden=false;
    try{
      const payload=Object.fromEntries(new FormData(form));
      if(currentZatcaStatus==='linked')delete payload.zatca_otp;
      const data=await ApiClient.request('/zatca/onboard',{method:currentZatcaStatus==='linked'?'PATCH':'POST',body:JSON.stringify(payload)});
      document.getElementById('successMessage').textContent=data.message||'تم حفظ بيانات ZATCA بنجاح.';
      document.getElementById('successModal').hidden=false;
      renderZatcaStatus('linked');
    }catch(error){
      const payload=error.data||{};
      const authorityReason=payload.zatca_error_text&&payload.zatca_error_text!==payload.detail?payload.zatca_error_text:'';
      const networkFallback=zatcaLang==='ar'?'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.':'Could not reach the server. Check your internet connection and try again.';
      const genericMessage=/failed to fetch|networkerror|load failed/i.test(error.message||'')?networkFallback:(error.message||networkFallback);
      showError([payload.detail||genericMessage,authorityReason].filter(Boolean).join(' — '));
    }finally{button.disabled=false;buttonText.textContent=tr('submit');spinner.hidden=true}
  });
  document.getElementById('productionCsidBtn').addEventListener('click',async()=>{try{const data=await ApiClient.request('/zatca/production-csid/',{method:'POST',body:'{}'});document.getElementById('productionCsidBtn').hidden=true;document.getElementById('successMessage').textContent=data.message;document.getElementById('successModal').hidden=false}catch(error){showError(error.data?.detail||error.message||'تعذر إصدار Production CSID')}});
  document.getElementById('closeModal').addEventListener('click',()=>document.getElementById('successModal').hidden=true);
  document.addEventListener('click',event=>{const wrap=document.querySelector('.zatca-notification-wrap');if(wrap&&!wrap.contains(event.target))document.getElementById('notifMenu').hidden=true});
  applyZatcaPreferences();
  loadZatcaAccount();
