
let lang = localStorage.getItem('takharuj_lang') || 'ar';
let invoiceType = 'standard';
let lastPrintableInvoiceHTML = '';
const I18N = {
  'منصة فواتير':'Invoice Office','نظام فواتير وإجراءات مكتبية':'Legal Invoice System',
  'لوحة التحكم':'Dashboard','الفواتير':'Invoices','إنشاء فاتورة':'Create Invoice','العملاء':'Clients','الباقات':'Packages','التقارير':'Reports','الفريق':'Team','الإعدادات':'Settings',
  'واجهة SaaS احترافية لإدارة الفواتير، العملاء، الباقات، الفريق، والإشعارات.':'Professional SaaS interface for invoices, clients, packages, team, and notifications.',
  'عربي / EN':'Arabic / EN','لوحة تحكم منصة فواتير':'Invoice Office Dashboard','نظرة تنفيذية على الإيرادات والفواتير والامتثال':'Executive overview of revenue, invoices, and compliance','جاهز للفوترة':'Ready for invoicing','النشاط':'Activity',
  'فاتورة ضريبية':'Tax Invoice','فاتورة مبسطة':'Simplified Invoice','فاتورة ضريبية مبسطة':'Simplified Tax Invoice','عميل جديد':'New Client','ترقية باقة':'Package Upgrade','الإيرادات':'Revenue','أعضاء الفريق':'Team Members','آخر الفواتير':'Latest Invoices','ملخص سريع بدون نماذج إنشاء داخل لوحة التحكم':'Quick summary without creation forms inside the dashboard',
  'صفحة مستقلة لإنشاء الفواتير الضريبية والمبسطة مع معاينة مباشرة':'Standalone page to create tax and simplified invoices with live preview','إنشاء فاتورة إلكترونية':'Create Electronic Invoice','يرجى تحديد نوع الفاتورة ليتم عرض النموذج المناسب في الصفحة الحالية.':'Choose the invoice type and preview it on the same page','بيانات الفاتورة':'Invoice Data','تحديث المعاينة':'Update Preview','طباعة':'Print','قائمة الفواتير الصادرة':'Issued invoices list',
  'إدارة العملاء':'Client Management','إضافة وتعديل وحذف بيانات العملاء':'Add, edit, and delete client records','بيانات العميل':'Client Details','اسم العميل':'Client Name','الرقم الضريبي':'VAT Number','المدينة':'City','الحالة':'Status','نشط':'Active','غير نشط':'Inactive','معلق':'Suspended','حفظ العميل':'Save Client','مسح':'Clear',
  'إدارة الباقات':'Package Management','إضافة وتعديل وحذف الباقات':'Add, edit, and delete packages','بيانات الباقة':'Package Details','شهري':'Monthly','سنوي':'Yearly','حفظ الباقة':'Save Package','الباقة':'Package','السعر بالريال':'Price SAR','المدة':'Period','المميزات':'Features',
  'تقارير مختصرة بشكل احترافي':'Clean professional summary reports','المدفوع':'Paid','المستحق':'Outstanding','النمو':'Growth',
  'إدارة الفريق':'Team Management','إضافة عضو، تعديله، تعليقه أو حذفه':'Add, edit, suspend, or delete team members','إضافة حساب مدير أو موظف بصلاحيات محددة':'Add manager or employee accounts with limited permissions','بيانات العضو':'Member Details','بيانات الحساب':'Account Details','مدير منصة':'Platform Admin','مدير شركة':'Company Admin','موظف':'Employee','الشركة':'Company','النظام كامل':'Full system','الفواتير':'Invoices','حفظ الحساب':'Save Account','حفظ العضو':'Save Member',
  'مستخدم':'user','إدارة المنصة والشركات المشتركة':'Manage platform and subscribed companies','إضافة شركة مشتركة':'Add Subscribed Company','إضافة منشأة جديدة، وتعيين الباقة المناسبة، وتحديد حساب المسؤول وصلاحياته.':'Create the company, choose its package, and assign its manager access','مدير المنصة':'Platform Admin','صلاحية المدير':'Manager Access','إضافة الشركة وتفعيل الاشتراك':'Add Company and Activate Subscription','اسم مدير الشركة':'Company Manager Name','بريد مدير الشركة':'Manager Email',
  'تحكم في المظهر والتنبيهات':'Control appearance and notifications','الوضع الفاتح':'Light Mode','تبديل بين الدارك واللايت مود':'Switch between dark and light mode','الإشعارات':'Notifications','تشغيل أو إيقاف زر الإشعارات':'Turn notifications on or off',
  'مقبولة':'Accepted','تعديل':'Edit','حذف':'Delete','تعليق':'Suspend','الإجراءات':'Actions','العميل':'Client','الضريبة':'VAT','النوع':'Type','المبلغ':'Amount','الاسم':'Name','البريد الإلكتروني':'Email','الدور':'Role','العضو':'Member',
  'مسودة':'Draft','معتمدة':'Approved','مدفوعة':'Paid','مرسلة':'Sent','ملغاة':'Canceled','كل الحالات':'All statuses','بحث برقم الفاتورة أو العميل':'Search by invoice number or client','الفاتورة':'Invoice','إجراءات':'Actions','عرض':'View','اعتماد':'Approve','تحديد كمرسلة':'Mark as sent','إلغاء':'Cancel','رجوع':'Back','إجراءات الفاتورة':'Invoice Actions','الفاتورة غير موجودة':'Invoice not found','يرجى العودة إلى قائمة الفواتير وتحديد فاتورة محفوظة.':'Go back to the invoices list and choose a saved invoice.','الإجمالي':'Total','جاهز داخل الفاتورة':'Ready in invoice','تعذر تحديث الفاتورة':'Could not update invoice','تم تحديث حالة الفاتورة':'Invoice status updated','تعذر تحميل الفاتورة':'Could not load invoice',
  'البائع':'Seller','المشتري':'Buyer','الخدمة 1':'Item 1','الخدمة 2':'Item 2','نظام فواتير منصة فواتير':'Invoice Office Invoice System','عميل استشارات قانونية':'Legal Consulting Client','استشارة قانونية':'Legal Consultation','صياغة عقد':'Contract Drafting',
  'باقة جديدة':'New Package','عضو جديد':'New Member','25 فاتورة، عميل واحد، دعم أساسي':'25 invoices, one client, basic support','فواتير غير محدودة، تقارير، 5 أعضاء':'Unlimited invoices, reports, 5 members','تكاملات، صلاحيات، دعم أولوية':'Integrations, permissions, priority support',
  'الرقم التسلسلي':'Serial Number','التاريخ':'Date','معلومات البائع':'Seller Information','معلومات المشتري':'Buyer Information','اسم البائع':'Seller Name','اسم المشتري':'Buyer Name','رقم تسجيل ضريبة القيمة المضافة':'VAT Registration Number','رقم السجل التجاري':'Commercial Registration Number','المنتج':'Product','المنتجات':'Products','سعر الوحدة':'Unit Price','الكمية':'Quantity','المجموع الفرعي':'Subtotal','نسبة الضريبة':'VAT Rate','قيمة الضريبة':'VAT Amount','المجموع شامل الضريبة':'Total incl. VAT','المجموع غير شامل ضريبة القيمة المضافة':'Total excl. VAT','ضريبة القيمة المضافة (15%)':'VAT (15%)','المجموع مع الضريبة (15%)':'Total with VAT (15%)','رقم الفاتورة':'Invoice Number','عنوان المتجر':'Store Address','تاريخ':'Date','السعر شامل الضريبة':'Price incl. VAT','خدمة 3':'Service 3','إجمالي المبلغ الخاضع للضريبة':'Total Taxable Amount','إجمالي ضريبة القيمة المضافة':'Total VAT','إجمالي المبلغ المستحق':'Total Amount Due',
  'ابحث في النظام...':'Search the system...','بحث سريع عن عميل أو فاتورة':'Quick search for a client or invoice','جاهز لهيئة الزكاة':'ZATCA Ready','مباشر':'Live',
  'تم تغيير المظهر':'Theme changed','تم تشغيل الإشعارات':'Notifications enabled','تم إيقاف الإشعارات':'Notifications disabled','تم اختيار الفاتورة الضريبية':'Tax invoice selected','تم اختيار الفاتورة المبسطة':'Simplified invoice selected','تم حفظ العميل':'Client saved','تم حذف العميل':'Client deleted','تم حفظ الباقة':'Package saved','تم حذف الباقة':'Package deleted','تم حفظ العضو':'Member saved','تم تحديث حالة العضو':'Member status updated','تم حذف العضو':'Member deleted','تم تحويل اللغة إلى العربية':'Language switched to Arabic','تم تحويل اللغة إلى الإنجليزية':'Language switched to English'
};
Object.assign(I18N, {'هذه الصفحة لمدير المنصة فقط':'This page is for the platform admin only','يرجى إدخال اسم المنشأة وبريد المسؤول':'Enter the company name and manager email','تمت إضافة الشركة وتفعيل الاشتراك':'Company added and subscription activated','تعذر إضافة الشركة':'Could not add company'});
Object.assign(I18N, {'اختر الباقة':'Select a package','لا توجد باقات مفعلة':'No active packages','جارٍ تحميل الباقات...':'Loading packages...','تعذر تحميل الباقات':'Could not load packages'});
I18N['لا توجد فواتير محفوظة']='No saved invoices';
I18N['لا توجد نتائج']='No results found';
Object.assign(I18N, {'الخدمات':'Items','إضافة خدمة':'Add Item','اسم الخدمة':'Item Name','كمية':'Qty','سعر الوحدة':'Unit Price','حذف الخدمة':'Remove Item'});
Object.assign(I18N, {'إشعار جديد':'New notification','تحديد الكل كمقروء':'Mark all as read','لا توجد إشعارات':'No notifications','غير مقروءة':'unread','كل الإشعارات مقروءة':'All notifications are read','تعذر تحديث الإشعار':'Could not update notification','تعذر تحديث الإشعارات':'Could not update notifications','تم إنشاء فاتورة':'Invoice created','تم تحديث فاتورة':'Invoice updated','تمت إضافة عميل':'Client added','تم تعديل عميل':'Client updated','تم حذف عميل':'Client deleted','تم إنشاء حساب شركة':'Company account created','تم إنشاء موظف':'Employee created','تم تعديل حساب':'Account updated','تم حذف حساب':'Account deleted'});
const EN_TO_AR = Object.fromEntries(Object.entries(I18N).map(([ar,en]) => [en, ar]));
Object.assign(EN_TO_AR, {'Seller':'البائع','Buyer':'المشتري','VAT Number':'الرقم الضريبي','Amount':'المبلغ','Item 1':'الخدمة 1','Item 2':'الخدمة 2','Items':'الخدمات','Add Item':'إضافة خدمة','Item Name':'اسم الخدمة','Qty':'كمية','Unit Price':'سعر الوحدة','Remove Item':'حذف الخدمة','Client':'العميل','VAT':'الضريبة','City':'المدينة','Status':'الحالة','Actions':'الإجراءات','Package':'الباقة','Price SAR':'السعر بالريال','Period':'المدة','Features':'المميزات','Paid':'المدفوع','Outstanding':'المستحق','Growth':'النمو','Name':'الاسم','Email':'البريد الإلكتروني','Role':'الدور','Member':'العضو','Ctrl K':'Ctrl K','Starter':'Starter','Professional':'Professional','Enterprise':'Enterprise','Riyadh':'Riyadh','Ahmed Al-Harbi':'Ahmed Al-Harbi','Sara Al-Qahtani':'Sara Al-Qahtani'});
Object.assign(EN_TO_AR, {'Invoice':'الفاتورة','Invoices':'الفواتير','Type':'النوع','Draft':'مسودة','Approved':'معتمدة','Paid':'مدفوعة','Sent':'مرسلة','Canceled':'ملغاة','All statuses':'كل الحالات','View':'عرض','Approve':'اعتماد','Back':'رجوع','Cancel':'إلغاء','Invoice Actions':'إجراءات الفاتورة','Total':'الإجمالي'});
I18N['الإجراءات']='Actions Log';
EN_TO_AR['Actions Log']='الإجراءات';
I18N['الإجراءات']='Actions Log';
I18N['منصة فواتير']='Invoice Office';
I18N['نظام فواتير وإجراءات مكتبية']='Invoice and office actions system';
EN_TO_AR['Actions Log']='الإجراءات';
EN_TO_AR['Invoice Office']='منصة فواتير';
EN_TO_AR['Invoice and office actions system']='نظام فواتير وإجراءات مكتبية';
const pageMap={dashboard:'index.html','create-invoice':'create-invoice.html',invoices:'invoices.html','invoice-detail':'invoice-detail.html',clients:'clients-admin.html','client-form':'client-form.html',subscribers:'subscribers-admin.html','client-log':'client-log.html',packages:'packages.html',reports:'reports.html',team:'team.html',settings:'settings.html',support:'support.html',zatca:'zatca.html'};
const $=id=>document.getElementById(id);
function cleanText(value){return String(value??'').replace(/\s+/g,' ').trim();}
function apiErrorMessage(error,fallback){
  const data=error?.data;
  if(data&&typeof data==='object'){
    const messages=[];
    const collect=value=>{
      if(Array.isArray(value))value.forEach(collect);
      else if(value&&typeof value==='object')Object.values(value).forEach(collect);
      else if(value!==undefined&&value!==null&&String(value).trim())messages.push(String(value).trim());
    };
    collect(data.detail??data);
    if(messages.length)return messages.join(' ');
  }
  return error?.message||fallback;
}
function baseAr(value){const key=cleanText(value);return EN_TO_AR[key]||key;}
function tr(value){const ar=baseAr(value);return lang==='ar'?ar:(I18N[ar]||String(value??''));}
function money(value){return (lang==='ar'?'ر.س ':'SAR ')+Number(value||0).toLocaleString(lang==='ar'?'ar-SA':'en-US');}
function currentUserDisplayName(){const user=currentUser||{};const name=cleanText(user.manager_name||user.full_name||user.first_name||user.name||'');if(name)return name;const email=cleanText(user.email||'');return email||'مستخدم';}
function currentTenantName(){const user=currentUser||{};return cleanText(companySettings.name||user.tenant_name||user.company_name||user.company?.name||user.tenant?.name||companySettings.seller||'');}
function hydrateInvoiceCompanyFields(){const tenantName=currentTenantName();if($("invoiceTenantName"))$("invoiceTenantName").value=tenantName;if($("seller"))$("seller").value=currentUserDisplayName();if($("vat"))$("vat").value=cleanText(companySettings.vat||"");}
function currentLogoUrl(){
  return cleanText(companySettings.logoUrl||currentUser?.tenant_logo_url||currentUser?.tenant?.logo_url||currentUser?.company?.logo_url||'');
}
function syncCompanyLogoFromUser(user=currentUser){
  const url=cleanText(user?.tenant_logo_url||user?.tenant?.logo_url||user?.company?.logo_url||'');
  if(url)companySettings={...companySettings,logoUrl:url};
  applyCompanyBrandLogo();
}
function companyLogoHTML(className='invoice-company-logo'){
  const url=currentLogoUrl();
  return url?`<img class="${className}" src="${escHtml(url)}" alt="${tr('شعار الشركة')}">`:'';
}
function applyCompanyBrandLogo(){
  const url=currentLogoUrl();
  document.querySelectorAll('.sidebar .brand .logo img').forEach(img=>{
    if(!img.dataset.defaultSrc)img.dataset.defaultSrc=img.getAttribute('src')||'';
    img.src=url||img.dataset.defaultSrc;
    img.alt=url?tr('شعار الشركة'):'Fawateer Platform';
    img.closest('.logo')?.classList.toggle('company-logo-active',!!url);
  });
}
const store={get:(k,d)=>JSON.parse(localStorage.getItem(k)||JSON.stringify(d)),set:(k,v)=>localStorage.setItem(k,JSON.stringify(v))};
let currentUser=getSessionUser();
let appState=store.get('takharuj_saas_state',{theme:'light',notifications:true});
let clients=[];
let packages=[];
let team=[];
let tenants=[];
let invoices=[];
let subscriptions=[];
let notifications=[];
let dashboardSummary=null;
let companySettings={name:'',vat:'',cr:'',address:'',seller:'',logoUrl:''};
let clientCertificateFile=null;
let backendDataLoaded=false;
let companySettingsLoaded=false;
let companySettingsLoadPromise=null;
function toastTypeFor(message,type){
  if(type)return type;
  const text=baseAr(message);
  if(/تعذر|فشل|خطأ|ليست|لا يمكن|غير صحيح|مرفوض|انتهت|failed|error|denied/i.test(text))return 'error';
  if(/يرجى|تنبيه|تحذير|راجع|معلق|warning|warn/i.test(text))return 'warning';
  return 'success';
}
function toastIconFor(type){
  return {success:'fa-circle-check',warning:'fa-triangle-exclamation',error:'fa-circle-xmark',info:'fa-circle-info'}[type]||'fa-circle-info';
}
function ensureToastContainer(){
  let container=document.querySelector('.toast-container');
  if(container)return container;
  container=document.createElement('div');
  container.className='toast-container';
  document.body.appendChild(container);
  const legacy=$('toast');
  if(legacy)legacy.setAttribute('aria-hidden','true');
  return container;
}
function showToast(msg,type){
  const container=ensureToastContainer();
  const resolvedType=toastTypeFor(msg,type);
  const message=document.createElement('div');
  message.className=`toast-message toast-${resolvedType}`;
  message.setAttribute('role',resolvedType==='error'?'alert':'status');
  message.innerHTML=`<span class="toast-accent"></span><i class="fa-solid ${toastIconFor(resolvedType)} toast-icon" aria-hidden="true"></i><span class="toast-text">${tr(msg)}</span>`;
  container.appendChild(message);
  const close=()=>{message.classList.add('toast-leaving');setTimeout(()=>message.remove(),260);};
  setTimeout(close,2600);
  message.addEventListener('click',close,{once:true});
}
function navBtn(id){return document.querySelector(`.nav a[data-page="${id}"]`);}
function showPage(id){if(!pageAllowed(id))return showToast('ما عندك صلاحية لهذه الصفحة');showNavigationSkeleton();document.body.classList.add('page-leaving');location.href=pageMap[id]||firstAllowedPage();}
function openMobileMenu(){$('sidebar')?.classList.add('open');$('sidebarBackdrop')?.classList.add('show');document.body.classList.add('sidebar-open');}
function closeMobileMenu(){$('sidebar')?.classList.remove('open');$('sidebarBackdrop')?.classList.remove('show');document.body.classList.remove('sidebar-open');}
window.openMobileMenu=openMobileMenu;
window.closeMobileMenu=closeMobileMenu;
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.mobile-menu').forEach(btn=>{
    btn.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      openMobileMenu();
    });
  });
  $('sidebarBackdrop')?.addEventListener('click',closeMobileMenu);
  document.querySelectorAll('.sidebar .nav a').forEach(link=>link.addEventListener('click',closeMobileMenu));
  renderZatcaStatusBadge();
});
function saveState(){store.set('takharuj_saas_state',appState);}
function applyTheme(){
  const isLight=appState.theme==='light';
  document.body.classList.toggle('light',isLight);
  document.body.classList.toggle('dark',!isLight);
  $('themeSwitch')?.classList.toggle('on',isLight);
  if($('themeBtn'))$('themeBtn').innerHTML=isLight?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';
}
function toggleTheme(){appState.theme=appState.theme==='dark'?'light':'dark';saveState();applyTheme();showToast('تم تغيير المظهر');}
function isZatcaConnected(){
  const value=window.is_zatca_connected;
  if(typeof value==='boolean')return value;
  if(typeof value==='string')return ['1','true','yes','connected','linked'].includes(value.toLowerCase());
  return value===1;
}
function renderZatcaStatusBadge(){
  const actions=document.querySelector('.top .actions');
  if(!actions)return;
  let badge=document.getElementById('zatcaStatusBtn');
  if(currentScope()==='invoices'){
    if(badge)badge.remove();
    return;
  }
  if(!badge){
    badge=document.createElement('button');
    badge.type='button';
    badge.id='zatcaStatusBtn';
    badge.addEventListener('click',()=>{location.href='zatca.html';});
    const languageButton=actions.querySelector('.lang');
    actions.insertBefore(badge,languageButton||actions.firstChild);
  }
  const connected=isZatcaConnected();
  const label=connected?(lang==='ar'?'ZATCA مرتبط':'ZATCA Connected'):(lang==='ar'?'غير مرتبط - ربط ZATCA':'Not connected - Connect ZATCA');
  badge.className='zatca-status-btn '+(connected?'is-connected':'is-disconnected');
  badge.innerHTML='<i class="fa-solid '+(connected?'fa-circle-check':'fa-circle-xmark')+'" aria-hidden="true"></i><span>'+label+'</span>';
  badge.title=label;
  badge.setAttribute('aria-label',label);
}
async function loadZatcaConnectionStatus(){
  if(typeof ApiClient==='undefined')return;
  if(currentScope()==='invoices'){
    window.is_zatca_connected=false;
    renderZatcaStatusBadge();
    return;
  }
  try{
    const data=await ApiClient.request('/zatca/onboard');
    window.is_zatca_connected=data?.zatca_status==='linked';
  }catch(_){
    window.is_zatca_connected=false;
  }
  renderZatcaStatusBadge();
}
function unreadNotifications(){return notifications.filter(n=>!n.is_read).length;}
function applyNotif(){
  const enabled=appState.notifications!==false;
  const unread=unreadNotifications();
  $('notifSwitch')?.classList.toggle('on',enabled);
  $('notifBtn')?.classList.toggle('active',enabled&&unread>0);
  if($('bellDot'))$('bellDot').style.display=enabled&&unread>0?'block':'none';
  if($('notifBtn'))$('notifBtn').title=unread?`${unread} إشعارات جديدة`:'الإشعارات';
}
function notificationText(n){
  const title=tr(n.title||'إشعار جديد');
  const message=tr(n.message||'');
  const company=n.tenant_name?` - ${tr(n.tenant_name)}`:'';
  return {title,message:message+company};
}
function ensureNotificationPanel(){
  let panel=$('notificationPanel');
  if(panel)return panel;
  panel=document.createElement('div');
  panel.id='notificationPanel';
  panel.className='notification-panel';
  document.body.appendChild(panel);
  document.addEventListener('click',event=>{
    const btn=$('notifBtn');
    if(!panel.contains(event.target)&&!btn?.contains(event.target))panel.classList.remove('show');
  });
  return panel;
}
function renderNotificationPanel(){
  const panel=ensureNotificationPanel();
  const unread=unreadNotifications();
  panel.innerHTML=`
    <div class="notification-head">
      <b>${tr('الإشعارات')}</b>
      <button type="button" class="btn small ghost" onclick="markAllNotificationsRead()">${tr('تحديد الكل كمقروء')}</button>
    </div>
    <div class="notification-list">
      ${notifications.length?notifications.slice(0,12).map(n=>{
        const text=notificationText(n);
        return `<button type="button" class="notification-item ${n.is_read?'':'unread'}" onclick="markNotificationRead(${n.id})">
          <span>${text.title}</span>
          <small>${text.message}</small>
          <em>${new Date(n.created_at).toLocaleString(lang==='ar'?'ar-SA':'en-US')}</em>
        </button>`;
      }).join(''):`<div class="notification-empty">${tr('لا توجد إشعارات')}</div>`}
    </div>
    <div class="notification-foot">${unread?`${unread} ${tr('غير مقروءة')}`:tr('كل الإشعارات مقروءة')}</div>`;
}
async function loadNotifications(){
  if(typeof ApiClient==='undefined')return;
  notifications=await ApiClient.fetchNotifications();
  if(!Array.isArray(notifications))notifications=[];
  renderNotificationPanel();
  applyNotif();
}
async function markNotificationRead(id){
  try{
    await ApiClient.markNotificationsRead(id);
    notifications=notifications.map(n=>n.id===id?{...n,is_read:true}:n);
    renderNotificationPanel();
    applyNotif();
  }catch(err){showToast('تعذر تحديث الإشعار');}
}
async function markAllNotificationsRead(){
  try{
    await ApiClient.markNotificationsRead();
    notifications=notifications.map(n=>({...n,is_read:true}));
    renderNotificationPanel();
    applyNotif();
  }catch(err){showToast('تعذر تحديث الإشعارات');}
}
function toggleNotifications(){
  if(appState.notifications===false){
    appState.notifications=true;
    saveState();
    showToast('تم تشغيل الإشعارات');
  }
  renderNotificationPanel();
  const panel=ensureNotificationPanel();
  panel.classList.toggle('show');
  applyNotif();
}
function toggleNotificationSetting(){
  appState.notifications=appState.notifications===false;
  saveState();
  applyNotif();
  if(appState.notifications)loadNotifications();
  showToast(appState.notifications?'تم تشغيل الإشعارات':'تم إيقاف الإشعارات');
}
window.markNotificationRead=markNotificationRead;
window.markAllNotificationsRead=markAllNotificationsRead;
window.toggleNotificationSetting=toggleNotificationSetting;
let navigationSkeletonTimer;
function ensureNavigationSkeleton(){
  let skeleton=document.getElementById('appNavigationSkeleton');
  if(skeleton)return skeleton;
  skeleton=document.createElement('div');
  skeleton.id='appNavigationSkeleton';
  skeleton.className='app-navigation-skeleton';
  skeleton.setAttribute('aria-hidden','true');
  skeleton.innerHTML=`<div class="skeleton-toolbar"></div>
    <div class="skeleton-heading"><div class="skeleton-heading-group"><span class="skeleton-line title"></span><span class="skeleton-line"></span><span class="skeleton-line short"></span></div></div>
    <div class="skeleton-grid"><span class="skeleton-card"></span><span class="skeleton-card"></span><span class="skeleton-card"></span><span class="skeleton-card"></span></div>
    <div class="skeleton-table"></div>`;
  document.body.appendChild(skeleton);
  return skeleton;
}
function showNavigationSkeleton(){
  if(!document.body||document.body.dataset.page==='login')return;
  window.clearTimeout(navigationSkeletonTimer);
  const skeleton=ensureNavigationSkeleton();
  document.body.setAttribute('aria-busy','true');
  skeleton.classList.add('active');
  navigationSkeletonTimer=window.setTimeout(hideNavigationSkeleton,6000);
}
function hideNavigationSkeleton(){
  window.clearTimeout(navigationSkeletonTimer);
  document.getElementById('appNavigationSkeleton')?.classList.remove('active');
  document.body?.removeAttribute('aria-busy');
  document.body?.classList.remove('page-leaving');
}
window.showNavigationSkeleton=showNavigationSkeleton;
window.hideNavigationSkeleton=hideNavigationSkeleton;
window.addEventListener('beforeunload',()=>{
  if(window.skipNextNavigationSkeleton)return;
  document.body?.classList.add('page-leaving');
  showNavigationSkeleton();
});
function setupFastNavigation(){
  const seen=new Set();
  const warm=(href)=>{
    if(!href||seen.has(href)||href.startsWith('#')||href.startsWith('javascript:'))return;
    seen.add(href);
    const link=document.createElement('link');
    link.rel='prefetch';
    link.href=href;
    document.head.appendChild(link);
  };
  document.querySelectorAll('.nav a[href]').forEach(anchor=>{
    const href=anchor.getAttribute('href');
    anchor.addEventListener('pointerenter',()=>warm(href),{passive:true});
    anchor.addEventListener('focus',()=>warm(href));
  });
  document.addEventListener('click',event=>{
    const anchor=event.target.closest('a[href]');
    if(!anchor||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    if(anchor.target==='_blank'||anchor.hasAttribute('download'))return;
    const url=new URL(anchor.href,location.href);
    if(url.origin!==location.origin||url.href===location.href||url.hash&&url.pathname===location.pathname)return;
    document.body.classList.add('page-leaving');
    showNavigationSkeleton();
  },{capture:true});
  window.setTimeout(()=>document.querySelectorAll('.nav a[href]').forEach(a=>warm(a.getAttribute('href'))),1200);
}
function nextId(a){return a.length?Math.max(...a.map(x=>x.id))+1:1;}
function saveAll(){renderAll();}
function isPlatformAdmin(user=currentUser){return !!(user&&(user.is_superuser||user.role==='platform_admin'));}
function isCompanyAdmin(user=currentUser){return !!(user&&(isPlatformAdmin(user)||user.role==='company_admin'||(user.role==='employee'&&user.permission_scope==='full_access')));}
function currentScope(){return isPlatformAdmin()?'full_access':(currentUser?.permission_scope||'full_access');}
function canManageCompany(){return isCompanyAdmin()&&currentScope()==='full_access';}
function allowedPagesForScope(scope=currentScope()){
  if(scope==='full_access')return Object.keys(pageMap).filter(page=>{
    if(page==='subscribers')return isPlatformAdmin();
    if(['clients','client-form'].includes(page))return !isPlatformAdmin();
    return !['packages','support'].includes(page)||isPlatformAdmin();
  });
  if(scope==='invoices')return ['create-invoice','invoices','invoice-detail'];
  return ['invoices'];
}
function firstAllowedPage(scope=currentScope()){return pageMap[allowedPagesForScope(scope)[0]]||'invoices.html';}
function pageAllowed(page,scope=currentScope()){
  if(page==='subscribers')return isPlatformAdmin();
  if(['clients','client-form'].includes(page)&&isPlatformAdmin())return false;
  if(page==='support')return isPlatformAdmin();
  if(page==='packages')return isPlatformAdmin();
  if(scope==='full_access')return true;
  return allowedPagesForScope(scope).includes(page);
}
function applyRoleAccess(){
  const memberRole=$('memberRole');
  if(memberRole&&isPlatformAdmin()){
    const selected=baseAr(memberRole.value||'موظف');
    memberRole.innerHTML='<option value="مدير منصة">مدير منصة</option><option value="موظف">موظف</option>';
    memberRole.value=selected==='مدير منصة'?'مدير منصة':'موظف';
    togglePermissionFields();
  }
  const customerLink=document.querySelector('.nav a[data-page="clients"], .nav a[data-page="subscribers"]');
  if(customerLink){
    customerLink.dataset.page=isPlatformAdmin()?'subscribers':'clients';
    customerLink.href=isPlatformAdmin()?'subscribers-admin.html':'clients-admin.html';
    const label=customerLink.querySelector('span:last-child');
    if(label)label.textContent=isPlatformAdmin()?'الشركات المشتركة':'العملاء';
  }
  const packageLink=document.querySelector('.nav a[data-page="packages"]');
  if(packageLink)packageLink.style.display=isPlatformAdmin()?'':'none';
  const supportLink=document.querySelector('.nav a[data-page="support"]');
  if(supportLink)supportLink.style.display=isPlatformAdmin()?'':'none';
  const addClientButton=$('addClientButton');
  if(addClientButton)addClientButton.style.display=isPlatformAdmin()?'none':'inline-flex';
  const scope=currentScope();
  document.querySelectorAll('.nav a[data-page]').forEach(a=>{
    const page=a.dataset.page;
    if(page==='packages'||page==='support')return;
    a.style.display=pageAllowed(page,scope)?'':'none';
  });
  if(!pageAllowed(document.body.dataset.page,scope)){
    showToast('ما عندك صلاحية لهذه الصفحة');
    const redirectTarget=isPlatformAdmin()&&['clients','client-form'].includes(document.body.dataset.page)?'subscribers-admin.html':firstAllowedPage(scope);
    setTimeout(()=>location.href=redirectTarget,350);
    return;
  }
  renderZatcaStatusBadge();
  if(document.body.dataset.page==='packages'&&!isPlatformAdmin()){
    showToast('الباقات تعرض للمدير فقط');
    setTimeout(()=>location.href='index.html',350);
  }
  const teamSection=document.getElementById('team');
  if(teamSection&&!canManageCompany()){
    teamSection.innerHTML='<div class="section-title"><div><h2>إدارة الفريق</h2><p class="muted">هذه الصفحة متاحة لمدير الشركة فقط.</p></div></div>';
  }
}
function qr(image){if(image)return `<img class="qr qr-real" src="${escHtml(image)}" alt="ZATCA QR Code">`;let s='';for(let i=0;i<81;i++)s+=`<i style="opacity:${(i*7)%5===0?1:.25}"></i>`;return `<div class="qr qr-placeholder">${s}</div>`;}
function invoiceItemRows(){return [...document.querySelectorAll('.invoice-item-row')];}
function parseInvoiceNumber(value){
  let text=String(value??'').trim()
    .replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/\u066c/g,'').replace(/\u066b/g,'.').replace(/\s/g,'');
  if(text.includes(',')&&!text.includes('.'))text=text.replace(',','.');
  text=text.replace(/,/g,'');
  if(!text)return NaN;
  const number=Number(text);
  return Number.isFinite(number)?number:NaN;
}
function invoiceItems(){
  return invoiceItemRows().map(row=>{
    const description=cleanText(row.querySelector('.invoice-item-name')?.value||'');
    const quantityText=cleanText(row.querySelector('.invoice-item-qty')?.value||'');
    const priceText=cleanText(row.querySelector('.invoice-item-price')?.value||'');
    if(!description&&!priceText)return null;
    const quantity=parseInvoiceNumber(quantityText);
    const unit_price=parseInvoiceNumber(priceText);
    const line_total=Number.isFinite(quantity)&&Number.isFinite(unit_price)?quantity*unit_price:NaN;
    return {description,quantity,unit_price,vat_rate:15,line_total};
  }).filter(Boolean);
}
function updateInvoiceAmount(){
  const net=invoiceItems().reduce((sum,item)=>sum+Number(item.line_total||0),0);
  if($('amount'))$('amount').value=net?net.toFixed(2):'';
}
function invoiceItemHTML(item={description:'',quantity:1,unit_price:''}){
  return `<div class="invoice-item-row"><label class="invoice-item-service"><span>${tr('اسم الخدمة')}</span><input class="invoice-item-name" required value="${escHtml(item.description||'')}" oninput="refreshPreview()"></label><label class="invoice-item-quantity"><span>${tr('كمية')}</span><input class="invoice-item-qty" type="number" min="1" required step="1" value="${Number(item.quantity||1)}" oninput="refreshPreview()"></label><label class="invoice-item-unit-price"><span>${tr('سعر الوحدة')}</span><input class="invoice-item-price" type="number" min="0.01" required step="0.01" value="${item.unit_price??''}" oninput="refreshPreview()"></label><div class="invoice-item-vat" aria-label="${tr('ضريبة القيمة المضافة')} 15%"><span>${tr('الضريبة')}</span><b>15%</b></div><button class="btn small danger invoice-item-remove" type="button" title="${tr('حذف الخدمة')}" aria-label="${tr('حذف الخدمة')}" onclick="removeInvoiceItem(this)"><i class="fa-solid fa-trash"></i></button></div>`;
}
function setupInvoiceItems(){
  const box=$('invoiceItems');
  if(!box||box.children.length)return;
  box.innerHTML=invoiceItemHTML({description:'',quantity:1,unit_price:''});
}
function clearInvoiceForm(){
  [
    'buyer','buyerVat','buyerCity','buyerStreet','buyerBuilding',
    'buyerDistrict','buyerPostal','amount'
  ].forEach(id=>{if($(id))$(id).value='';});
  const box=$('invoiceItems');
  if(box){
    box.innerHTML=invoiceItemHTML({description:'',quantity:1,unit_price:''});
  }
  // Keep the invoice type selected by the user when starting the next invoice.
  document.body.dataset.invoiceType=invoiceType;
  hydrateInvoiceCompanyFields();
  lastPrintableInvoiceHTML='';
  refreshPreview();
}
function addInvoiceItem(item){
  const box=$('invoiceItems');
  if(!box)return;
  box.insertAdjacentHTML('beforeend',invoiceItemHTML(item||{}));
  applyLanguage(false);
  refreshPreview();
}
function removeInvoiceItem(button){
  const row=button.closest('.invoice-item-row');
  if(row&&invoiceItemRows().length>1)row.remove();
  else if(row)row.querySelectorAll('input').forEach(input=>input.value=input.classList.contains('invoice-item-qty')?'1':'');
  refreshPreview();
}
function vals(){hydrateInvoiceCompanyFields();let items=invoiceItems(),net=items.reduce((sum,item)=>sum+Number(item.line_total||0),0),vatAmount=net*.15,total=net+vatAmount;if($('amount'))$('amount').value=net?net.toFixed(2):'';return {companyName:currentTenantName(),seller:currentUserDisplayName(),buyer:tr($('buyer')?.value||''),vat:cleanText(companySettings.vat||$('vat')?.value||''),cr:cleanText(companySettings.cr||''),address:cleanText(companySettings.address||''),buyerVat:cleanText($('buyerVat')?.value||''),buyerCity:cleanText($('buyerCity')?.value||''),buyerStreet:cleanText($('buyerStreet')?.value||''),buyerBuilding:cleanText($('buyerBuilding')?.value||''),buyerDistrict:cleanText($('buyerDistrict')?.value||''),buyerPostal:cleanText($('buyerPostal')?.value||''),net,vatAmount,total,items,item1:tr(items[0]?.description||''),item2:tr(items[1]?.description||''),date:new Date().toLocaleDateString(lang==='ar'?'ar-SA':'en-US'),logoUrl:companySettings.logoUrl||''};}
function buildInvoicePayload(){
  const v=vals();
  const content={
    company_name:v.companyName,seller:v.seller,buyer:v.buyer,
    vat_number:v.vat,cr_number:v.cr,address:v.address,buyer_vat_number:v.buyerVat,
    buyer_city:v.buyerCity,buyer_street:v.buyerStreet,
    buyer_building_number:v.buyerBuilding,buyer_district:v.buyerDistrict,
    buyer_postal_code:v.buyerPostal,subtotal:v.net,tax_amount:v.vatAmount,
    total:v.total,items:v.items,logo_url:v.logoUrl
  };
  return {
    invoice_type:invoiceType==='simple'?'simplified':'standard',
    issue_date:new Date().toISOString().slice(0,10),
    status:'draft',
    lines:v.items.map(item=>({
      description:item.description,
      quantity:item.quantity,
      unit_price:item.unit_price,
      tax_rate:15,
      line_total:item.line_total
    })),
    xml_content:JSON.stringify(content),
    _vals:v
  };
}
function standardHTML(){let v=vals();let rows=v.items.map(item=>{const line=Number(item.line_total||0),vat=line*.15;return `<tr><td>${escHtml(tr(item.description||'-'))}</td><td>${Number(item.unit_price||0).toFixed(2)}</td><td>${Number(item.quantity||1)}</td><td>${line.toFixed(2)}</td><td>15%</td><td>${vat.toFixed(2)}</td><td>${(line+vat).toFixed(2)}</td></tr>`;}).join('');return `<div class="invoice-paper standard"><div style="text-align:center">${companyLogoHTML()}<br><div class="invoice-title">${tr('فاتورة ضريبية')}</div></div><div class="serial"><div>${tr('الرقم التسلسلي')}<br>INV10030</div><div>${tr('التاريخ')}<br>${v.date}</div></div><hr><div class="info-row"><div class="info-block"><h4>${tr('معلومات البائع')}</h4><p>الشركة: ${escHtml(v.companyName||'-')}</p><p>${tr('اسم البائع')}: ${escHtml(v.seller)}</p><p>${tr('رقم تسجيل ضريبة القيمة المضافة')}: ${v.vat}</p><p>${tr('رقم السجل التجاري')}: ${escHtml(v.cr||'-')}</p></div><div class="info-block"><h4>${tr('معلومات المشتري')}</h4><p>${tr('اسم المشتري')}: ${v.buyer}</p><p>${tr('رقم تسجيل ضريبة القيمة المضافة')}: ${escHtml(v.buyerVat||'-')}</p><p>المدينة: ${escHtml(v.buyerCity||'-')}</p><p>الشارع: ${escHtml(v.buyerStreet||'-')}</p><p>رقم المبنى: ${escHtml(v.buyerBuilding||'-')}</p><p>الحي: ${escHtml(v.buyerDistrict||'-')}</p><p>الرمز البريدي: ${escHtml(v.buyerPostal||'-')}</p></div></div><table class="invoice-table"><tr><th>${tr('المنتج')}</th><th>${tr('سعر الوحدة')}</th><th>${tr('الكمية')}</th><th>${tr('المجموع الفرعي')}</th><th>${tr('نسبة الضريبة')}</th><th>${tr('قيمة الضريبة')}</th><th>${tr('المجموع شامل الضريبة')}</th></tr>${rows}</table><div class="totals"><div class="total-line cyan"><span>${tr('المجموع غير شامل ضريبة القيمة المضافة')}</span><b>${v.net.toFixed(2)}</b></div><div class="total-line"><span>${tr('ضريبة القيمة المضافة (15%)')}</span><b>${v.vatAmount.toFixed(2)}</b></div><div class="total-line"><span>${tr('المجموع مع الضريبة (15%)')}</span><b>${v.total.toFixed(2)}</b></div></div>${qr()}</div>`;}
function simpleHTML(){let v=vals();let rows=v.items.map(item=>{const line=Number(item.line_total||0),vat=line*.15;return `<tr><td>${escHtml(tr(item.description||'-'))}</td><td>${Number(item.quantity||1)}</td><td>${Number(item.unit_price||0).toFixed(2)}</td><td>${vat.toFixed(2)}</td><td>${(line+vat).toFixed(2)}</td></tr>`;}).join('');return `<div class="invoice-paper simple"><div style="text-align:center">${companyLogoHTML()}</div><div class="invoice-title">${tr('فاتورة ضريبية مبسطة')}</div><div class="green-box" style="display:inline-block">${tr('رقم الفاتورة')}: SINV01011</div><br><div class="store">${escHtml(v.companyName||v.seller)}</div><div>${tr('اسم البائع')}: ${escHtml(v.seller)}</div><br><div class="green-box" style="display:inline-block">${tr('عنوان المتجر')}</div><div class="green-box date">${tr('تاريخ')}: ${v.date}</div><div class="green-box">${tr('رقم تسجيل ضريبة القيمة المضافة')}: ${v.vat}</div><div class="green-box">${tr('رقم السجل التجاري')}: ${escHtml(v.cr||'-')}</div><table class="invoice-table"><tr><th>${tr('المنتجات')}</th><th>${tr('الكمية')}</th><th>${tr('سعر الوحدة')}</th><th>${tr('نسبة الضريبة')}</th><th>${tr('السعر شامل الضريبة')}</th></tr>${rows}</table><div class="totals"><div class="total-line"><span>${tr('إجمالي المبلغ الخاضع للضريبة')}</span><b>${v.net.toFixed(2)}</b></div><div class="total-line"><span>${tr('إجمالي ضريبة القيمة المضافة')}</span><b>${v.vatAmount.toFixed(2)}</b></div><div class="total-line"><span>${tr('إجمالي المبلغ المستحق')}</span><b>${v.total.toFixed(2)}</b></div></div>${qr()}</div>`;}
function hasInvoiceInput(){return cleanText($('buyer')?.value||'')||invoiceItems().some(item=>cleanText(item.description)||Number(item.unit_price||0));}
function refreshPreview(){
  if(!$('preview'))return;
  const html=invoiceType==='standard'?standardHTML():simpleHTML();
  $('preview').innerHTML=html;
  if(hasInvoiceInput())lastPrintableInvoiceHTML=html;
}
function setType(type){
  invoiceType=type;
  document.body.dataset.invoiceType=type;
  const hideBuyer=type==='simple';
  document.querySelectorAll('.invoice-client-picker,.invoice-client-fields,#buyerCertificateField').forEach(element=>{
    element.hidden=hideBuyer;
    element.style.display=hideBuyer?'none':'';
  });
  ['buyer','buyerVat','buyerCity','buyerStreet','buyerBuilding','buyerDistrict','buyerPostal'].forEach(id=>{
    const field=$(id)?.closest('label');
    if(field){field.hidden=hideBuyer;field.style.display=hideBuyer?'none':'';}
  });
  refreshPreview();
  showToast(type==='standard'?'تم اختيار الفاتورة الضريبية':'تم اختيار الفاتورة المبسطة');
}
function printCurrent(){
  if($('printArea')){
    const current=$('preview')?.innerHTML||'';
    $('printArea').innerHTML=hasInvoiceInput()?current:(lastPrintableInvoiceHTML||current);
  }
  window.print();
}
function saveInvoice(){
  if(typeof window.invoiceUxSave==='function')return window.invoiceUxSave(false);
  showToast('تعذر تهيئة نموذج حفظ الفاتورة','error');
}
function setClientCertificateStatus(message,state=''){
  const status=$('clientCertificateStatus');
  if(!status)return;
  status.textContent=message;
  status.classList.remove('is-loading','is-success','is-error');
  if(state)status.classList.add(`is-${state}`);
}
async function extractClientCertificate(input){
  const file=input?.files?.[0];
  if(!file)return;
  clientCertificateFile=file;
  setClientCertificateStatus(`جارٍ قراءة ${file.name} واستخراج البيانات...`,'loading');
  const body=new FormData();
  body.append('certificate',file,file.name);
  try{
    const data=await ApiClient.request('/client-certificate/extract/',{method:'POST',body}),fields={...data,...(data.fields||{})};
    const mapping={clientName:'taxpayer_name',clientVat:'vat_registration_number',clientCity:'city',clientStreet:'street',clientBuilding:'building_number',clientDistrict:'district',clientPostal:'postal_code'};
    let filled=0;
    Object.entries(mapping).forEach(([id,key])=>{if(fields[key]&&$(id)){$(id).value=cleanText(fields[key]);filled+=1;}});
    setClientCertificateStatus(data.message||`تم استخراج ${filled} من الحقول. راجعها قبل الحفظ.`,filled?'success':'error');
    showToast(filled?'تم استخراج بيانات العميل من الشهادة':'لم تُطابق الشهادة حقولًا واضحة',filled?'success':'warning');
  }catch(error){
    clientCertificateFile=null;
    input.value='';
    const message=apiErrorMessage(error,'تعذر استخراج بيانات الشهادة');
    setClientCertificateStatus(message,'error');
    showToast(message,'error');
  }
}
async function saveClient(){
  const id=cleanText($('clientId')?.value||'');
  const payload={
    name:cleanText($('clientName')?.value||''),
    vat_number:cleanText($('clientVat')?.value||''),
    email:cleanText($('clientEmail')?.value||''),
    phone_number:cleanText($('clientPhone')?.value||''),
    city:cleanText($('clientCity')?.value||''),
    street_name:cleanText($('clientStreet')?.value||''),
    building_number:cleanText($('clientBuilding')?.value||''),
    city_subdivision:cleanText($('clientDistrict')?.value||''),
    postal_zone:cleanText($('clientPostal')?.value||''),
    status:apiStatus($('clientStatus')?.value||'نشط')
  };
  if(!payload.name)return showToast('يرجى إدخال اسم العميل');
  if(payload.vat_number&&!/^3\d{13}3$/.test(payload.vat_number))return showToast('الرقم الضريبي يجب أن يتكون من 15 رقماً ويبدأ وينتهي بالرقم 3.');
  if(payload.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))return showToast('يرجى إدخال بريد إلكتروني صحيح.');
  if(payload.phone_number&&!/^\+?[0-9]{8,15}$/.test(payload.phone_number))return showToast('رقم الجوال يجب أن يتكون من 8 إلى 15 رقماً، ويمكن أن يبدأ بعلامة +.');
  try{
    const saved=id?await ApiClient.updateClient(id,payload):await ApiClient.createClient(payload);
    if(saved?.error)throw new Error(saved.error);
    let certificateError=null;
    if(clientCertificateFile){
      const attachment=new FormData();
      attachment.append('certificate',clientCertificateFile,clientCertificateFile.name);
      try{
        await ApiClient.request(`/clients/${encodeURIComponent(saved.id)}/certificate/`,{method:'POST',body:attachment});
      }catch(error){
        certificateError=apiErrorMessage(error,'تعذر حفظ شهادة العميل');
      }
    }
    const item=mapClientFromApi(saved);
    const index=clients.findIndex(client=>String(client.id)===String(item.id));
    if(index>=0)clients[index]=item;else clients.unshift(item);
    if(certificateError){
      if($('clientId'))$('clientId').value=saved.id;
      setClientCertificateStatus(`تم حفظ بيانات العميل، لكن ${certificateError}`,'error');
      renderAll();
      return showToast(`تم حفظ البيانات، لكن ${certificateError}`,'warning');
    }
    clearClientForm();renderAll();showToast('تم حفظ بيانات العميل في قاعدة البيانات');
    if(document.body.dataset.page==='client-form')setTimeout(()=>location.href='clients-admin.html',300);
  }catch(error){
    showToast(apiErrorMessage(error,'تعذر حفظ العميل'));
  }
}
function editClient(id){location.href=`client-form.html?id=${encodeURIComponent(id)}`;}
function createInvoiceForClient(id){
  window.skipNextNavigationSkeleton=true;
  location.assign(`create-invoice.html?client=${encodeURIComponent(id)}`);
}
async function deleteClient(id){
  if(!confirm('هل تريد حذف هذا العميل؟'))return;
  try{
    await ApiClient.deleteClient(id);
    clients=clients.filter(item=>String(item.id)!==String(id));
    renderAll();showToast('تم حذف العميل');
  }catch(error){
    showToast(error?.data?.detail||error.message||'تعذر حذف العميل؛ قد يكون مرتبطًا بفواتير.');
  }
}
function clearClientForm(){
  ['clientId','clientName','clientVat','clientEmail','clientPhone','clientCity','clientStreet','clientBuilding','clientDistrict','clientPostal','clientTenant'].forEach(id=>{if($(id))$(id).value='';});
  if($('clientStatus'))$('clientStatus').value='نشط';
  if($('clientCertificate'))$('clientCertificate').value='';
  clientCertificateFile=null;
  setClientCertificateStatus('سيتم تعبئة الحقول المستخرجة تلقائيًا، ويمكنك مراجعتها قبل الحفظ.');
  applyLanguage();
}
function savePackage(){let item={id:$('packageId')?.value?Number($('packageId').value):nextId(packages),name:$('packageName')?.value||'باقة جديدة',price:Number($('packagePrice')?.value||0),period:baseAr($('packagePeriod')?.value||'شهري'),maxUsers:Number($('packageMaxUsers')?.value||2),features:baseAr($('packageFeatures')?.value||'-')};let i=packages.findIndex(x=>x.id===item.id);i>=0?packages[i]=item:packages.push(item);clearPackageForm();saveAll();showToast('تم حفظ الباقة');}
function editPackage(id){
  if(document.body.dataset.page==='packages'){
    location.hash='edit-'+id;
    loadEditFromHash();
    document.querySelector('#packages .card')?.scrollIntoView({behavior:'smooth',block:'start'});
    showToast('تم تحميل بيانات الباقة للتعديل');
    return;
  }
  location.href='packages.html#edit-'+id;
}
function deletePackage(id){packages=packages.filter(x=>x.id!==id);saveAll();showToast('تم حذف الباقة');}
function clearPackageForm(){['packageId','packageName','packagePrice','packageFeatures'].forEach(id=>{if($(id))$(id).value='';});if($('packageMaxUsers'))$('packageMaxUsers').value='2';if($('packagePeriod'))$('packagePeriod').value='شهري';applyLanguage();}
async function saveMember(){
  if(!canManageCompany())return showToast('هذه الصفحة متاحة للحسابات ذات نطاق النظام كامل فقط');
  const id=Number($('memberId')?.value||0);
  const email=cleanText($('memberEmail')?.value||'');
  const password=cleanText($('memberPassword')?.value||'');
  const role=apiRole($('memberRole')?.value||'موظف');
  const existing=id?team.find(member=>Number(member.id)===id):null;
  if(existing?.isProtectedManager&&apiStatus($('memberStatus')?.value||'نشط')!=='active'){
    return showToast('حساب مدير الشركة محمي ولا يمكن تعطيله أو تعليقه');
  }
  const scope=role==='employee'?apiPermissionScope($('memberPermission')?.value||'الفواتير'):'full_access';
  if(!email)return showToast('يرجى إدخال البريد الإلكتروني');
  if(!id&&password.length<6)return showToast('كلمة المرور للحساب الجديد يجب ألا تقل عن 6 أحرف');
  const payload={
    email,
    manager_name:cleanText($('memberName')?.value||''),
    role,
    permission_scope:scope,
    is_active:apiStatus($('memberStatus')?.value||'نشط')==='active'
  };
  if(password)payload.password=password;
  if(isPlatformAdmin()&&cleanText($('memberCompany')?.value||''))payload.tenant_name=cleanText($('memberCompany').value);
  try{
    const saved=id?await ApiClient.updateUser(id,payload):await ApiClient.createUser(payload);
    const item=mapMemberFromApi(saved);
    const index=team.findIndex(member=>Number(member.id)===Number(item.id));
    if(index>=0)team[index]=item;else team.unshift(item);
    clearMemberForm();renderAll();showToast('تم حفظ العضو');
  }catch(error){
    showToast(error?.data?.detail||error.message||'تعذر حفظ العضو');
  }
}
function editMember(id){
  if(document.body.dataset.page==='team'){
    location.hash='edit-'+id;
    loadEditFromHash();
    document.querySelector('#team .card')?.scrollIntoView({behavior:'smooth',block:'start'});
    showToast('تم تحميل بيانات العضو للتعديل');
    return;
  }
  location.href='team.html#edit-'+id;
}
async function suspendMember(id){
  const member=team.find(item=>Number(item.id)===Number(id));
  if(!member)return;
  if(member.isProtectedManager)return showToast('حساب مدير الشركة محمي ولا يمكن تعطيله أو تعليقه');
  const nextActive=baseAr(member.status)!=='نشط';
  try{
    const saved=await ApiClient.updateUser(id,{is_active:nextActive});
    Object.assign(member,mapMemberFromApi(saved));
    renderAll();showToast('تم تحديث حالة العضو');
  }catch(error){showToast(error?.data?.detail||error.message||'تعذر تحديث حالة العضو');}
}
async function deleteMember(id){
  if(!confirm('هل تريد حذف هذا الحساب نهائيًا؟'))return;
  try{
    await ApiClient.deleteUser(id);
    team=team.filter(item=>Number(item.id)!==Number(id));
    renderAll();showToast('تم حذف العضو');
  }catch(error){showToast(error?.data?.detail||error.message||'تعذر حذف العضو');}
}
function clearMemberForm(){['memberId','memberName','memberEmail','memberPassword','memberCompany'].forEach(id=>{if($(id))$(id).value='';});if($('memberPermission'))$('memberPermission').value='الفواتير';if($('memberRole'))$('memberRole').value='موظف';if($('memberStatus'))$('memberStatus').value='نشط';togglePermissionFields();applyLanguage();}
function renderAll(){if($('dashClients'))$('dashClients').textContent=clients.length;if($('dashTeam'))$('dashTeam').textContent=team.length;if($('clientCount'))$('clientCount').textContent=clients.length;if($('packageCount'))$('packageCount').textContent=packages.length;if($('teamCount'))$('teamCount').textContent=team.length;if($('invoiceRows'))$('invoiceRows').innerHTML=invoices.map(x=>`<tr><td>${x[0]}</td><td>${tr(x[1])}</td><td>${money(x[2])}</td><td><span class="status">${tr(x[3])}</span></td><td><button class="btn small ghost" onclick="printInvoice(${i})"><i class="fa-solid fa-print"></i> <span>${tr('طباعة')}</span></button></td></tr>`).join('');if($('clientsRows'))$('clientsRows').innerHTML=clients.map(c=>`<tr><td>${tr(c.name)}</td><td>${c.vat}</td><td>${tr(c.city)}</td><td><span class="status ${baseAr(c.status)==='نشط'?'':'off'}">${tr(c.status)}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editClient(${c.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small danger" onclick="deleteClient(${c.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></td></tr>`).join('');if($('packagesGrid'))$('packagesGrid').innerHTML=packages.map((p,i)=>`<div class="price-card ${i===1?'featured':''}"><h3>${tr(p.name)}</h3><div class="price">${money(p.price)}</div><div class="features">${renderPackageFeatures(p.features)}</div><p class="muted">${tr(p.period)} - ${Number(p.maxUsers||1)} مستخدم</p><div class="row-actions"><button class="btn small ghost" onclick="editPackage(${p.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small danger" onclick="deletePackage(${p.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></div>`).join('');if($('teamRows'))$('teamRows').innerHTML=team.map(m=>`<tr><td>${tr(m.name)}</td><td>${m.email}</td><td>${tr(m.role)}</td><td><span class="status ${baseAr(m.status)==='نشط'?'':'off'}">${tr(m.status)}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editMember(${m.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small secondary" onclick="suspendMember(${m.id})"><i class="fa-solid fa-ban"></i> <span>${tr('تعليق')}</span></button><button class="btn small danger" onclick="deleteMember(${m.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></td></tr>`).join('');applyLanguage(false);}

const TEXT_NODE_ORIGINALS = new WeakMap();
function registerBilingualPairs(){
  document.querySelectorAll('[data-ar][data-en]').forEach(el=>{
    const ar=cleanText(el.dataset.ar), en=cleanText(el.dataset.en);
    if(ar && en){ I18N[ar]=en; EN_TO_AR[en]=ar; }
  });
}
function setElementTextPreserveChildren(el, value){
  const textNodes=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE && cleanText(n.nodeValue));
  if(textNodes.length){
    textNodes[0].nodeValue=value;
    textNodes.slice(1).forEach(n=>n.nodeValue='');
  }else{
    el.textContent=value;
  }
}
function localizeTextNode(node){
  if(!node || !cleanText(node.nodeValue))return;
  const parent=node.parentElement;
  if(!parent)return;
  if(parent.closest('[data-no-translate]'))return;
  if(['SCRIPT','STYLE','NOSCRIPT'].includes(parent.tagName))return;
  const current=cleanText(node.nodeValue);
  if(!TEXT_NODE_ORIGINALS.has(node)) TEXT_NODE_ORIGINALS.set(node, baseAr(current));
  const original=TEXT_NODE_ORIGINALS.get(node);
  const translated=tr(original);
  if(translated && translated!==current){
    const leading=(node.nodeValue.match(/^\s*/)||[''])[0];
    const trailing=(node.nodeValue.match(/\s*$/)||[''])[0];
    node.nodeValue=leading+translated+trailing;
  }
}
function applyLanguage(withRender=true){
  registerBilingualPairs();
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.body.classList.toggle('en',lang==='en');
  document.body.dir=lang==='ar'?'rtl':'ltr';

  document.querySelectorAll('[data-ar][data-en]').forEach(el=>{
    setElementTextPreserveChildren(el, lang==='ar'?el.dataset.ar:el.dataset.en);
  });

  document.querySelectorAll('input,textarea').forEach(el=>{
    if(el.dataset.placeholderAr&&el.dataset.placeholderEn){
      el.placeholder=lang==='ar'?el.dataset.placeholderAr:el.dataset.placeholderEn;
    }
  });

  document.querySelectorAll('option').forEach(o=>{
    const original=o.getAttribute('data-ar') || baseAr(o.value || o.textContent);
    o.setAttribute('data-ar', original);
    o.textContent=tr(original);
  });

  document.querySelectorAll('.lang').forEach(btn=>btn.textContent=lang==='ar'?'English':'العربية');

  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){
    if(!cleanText(n.nodeValue))return NodeFilter.FILTER_REJECT;
    const p=n.parentElement;
    if(!p || ['SCRIPT','STYLE','NOSCRIPT'].includes(p.tagName))return NodeFilter.FILTER_REJECT;
    if(p.closest('[data-no-translate]'))return NodeFilter.FILTER_REJECT;
    return NodeFilter.FILTER_ACCEPT;
  }});
  let nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(localizeTextNode);

  document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===document.body.dataset.page));
  if(withRender){refreshPreview();}
  document.documentElement.classList.remove('lang-boot');
}
function toggleLang(){lang=lang==='ar'?'en':'ar';localStorage.setItem('takharuj_lang',lang);renderAll();renderZatcaStatusBadge();refreshPreview();showToast(lang==='ar'?'تم تحويل اللغة إلى العربية':'تم تحويل اللغة إلى الإنجليزية');}
function loadEditFromHash(){let m=location.hash.match(/edit-(\d+)/);if(!m)return;let id=Number(m[1]);let c=clients.find(x=>x.id===id);if(c&&$('clientId')){$('clientId').value=c.id;$('clientName').value=tr(c.name);$('clientVat').value=c.vat;$('clientCity').value=tr(c.city);$('clientStatus').value=baseAr(c.status);if($('clientTenant'))$('clientTenant').value=c.tenantName||'';}let p=packages.find(x=>x.id===id);if(p&&$('packageId')){$('packageId').value=p.id;$('packageName').value=p.name;$('packagePrice').value=p.price;if($('packageMaxUsers'))$('packageMaxUsers').value=p.maxUsers||1;$('packagePeriod').value=baseAr(p.period);$('packageFeatures').value=tr(p.features);}let u=team.find(x=>x.id===id);if(u&&$('memberId')){$('memberId').value=u.id;$('memberName').value=u.name;$('memberEmail').value=u.email;if($('memberCompany'))$('memberCompany').value=u.tenantName||'';if($('memberPermission'))$('memberPermission').value=permissionLabel(u.permission);$('memberRole').value=baseAr(u.role);$('memberStatus').value=baseAr(u.status);togglePermissionFields();}}
function apiStatus(value){let v=baseAr(value);if(v==='نشط')return 'active';if(v==='غير نشط')return 'inactive';if(v==='معلق')return 'suspended';return String(value||'active');}
function uiStatus(value){if(value==='active'||value===true)return 'نشط';if(value==='inactive'||value===false)return 'غير نشط';if(value==='suspended')return 'معلق';return value||'نشط';}
function apiPeriod(value){let v=baseAr(value);return v==='سنوي'?'yearly':'monthly';}
function uiPeriod(value){return value==='yearly'?'سنوي':'شهري';}
function apiRole(value){let v=baseAr(value);return {'مدير منصة':'platform_admin','مدير شركة':'company_admin','موظف':'employee'}[v]||String(value||'employee');}
function uiRole(value){return {platform_admin:'مدير منصة',company_admin:'مدير شركة',employee:'موظف'}[value]||value||'موظف';}
function permissionLabel(value){return value||'النظام كامل';}
function accountTypeFor(role){return baseAr(role);}
function togglePermissionFields(){
  const role=baseAr($('memberRole')?.value||'موظف');
  const isManager=role==='مدير منصة'||role==='مدير شركة';
  if($('memberPermission')){
    if(isManager)$('memberPermission').value='النظام كامل';
    $('memberPermission').disabled=isManager;
  }
  const companyField=document.querySelector('[data-company-field]');
  if(companyField)companyField.style.display='none';
  const invoiceCompanyField=document.querySelector('[data-platform-invoice-company]');
  if(invoiceCompanyField)invoiceCompanyField.style.display='none';
  hydrateInvoiceCompanyFields();
}
function mapClientFromApi(c){return {id:c.id,name:c.name,vat:c.vat_number||'',email:c.email||'',phone:c.phone_number||'',city:c.city||'',street:c.street_name||'',building:c.building_number||'',district:c.city_subdivision||'',postal:c.postal_zone||'',status:uiStatus(c.status),tenantName:c.tenant_name||c.tenantName||'',certificateUrl:c.registration_certificate||''};}
function loadClientFormPage(){
  if(document.body.dataset.page!=='client-form')return;
  document.querySelector('.nav a[data-page="clients"]')?.classList.add('active');
  if(isPlatformAdmin()){
    showToast('إدارة بيانات العملاء متاحة لحسابات الشركات المشتركة.');
    return setTimeout(()=>location.href='subscribers-admin.html',500);
  }
  const id=cleanText(new URLSearchParams(location.search).get('id')||'');
  if(!id){if($('clientFormTitle'))$('clientFormTitle').textContent='إضافة عميل جديد';return;}
  const client=clients.find(item=>String(item.id)===id);
  if(!client){showToast('تعذر العثور على العميل المطلوب');return setTimeout(()=>location.href='clients-admin.html',500);}
  const values={clientId:client.id,clientName:client.name,clientVat:client.vat,clientEmail:client.email,clientPhone:client.phone,clientCity:client.city,clientStreet:client.street,clientBuilding:client.building,clientDistrict:client.district,clientPostal:client.postal,clientStatus:baseAr(client.status||'نشط')};
  Object.entries(values).forEach(([field,value])=>{if($(field))$(field).value=value||'';});
  if(client.certificateUrl)setClientCertificateStatus('توجد شهادة محفوظة لهذا العميل. يمكنك رفع ملف جديد لاستبدالها.','success');
  if($('clientFormTitle'))$('clientFormTitle').textContent='تعديل بيانات العميل';
}
function mapPackageFromApi(p){return {id:p.id,name:p.name,description:p.description||'',price:Number(p.price||0),yearlyPrice:Number(p.yearly_price||0),currency:p.currency||'SAR',period:uiPeriod(p.plan_type),maxUsers:Number(p.max_users||1),maxBranches:Number(p.max_branches||1),maxInvoices:Number(p.max_invoices||100),maxClients:Number(p.max_clients||100),maxProducts:Number(p.max_products||100),storage:Number(p.storage_gb||5),status:p.visibility_status||(p.is_active===false?'hidden':'active'),popular:!!p.is_popular,trial:!!p.free_trial_enabled,trialDays:Number(p.trial_days||14),supportType:p.support_type||'دعم أساسي',responseTime:p.response_time||'خلال 24 ساعة',availability:p.support_availability||'أيام العمل',updatedAt:p.updated_at,isActive:p.is_active!==false,enabledFeatures:Array.isArray(p.features)?p.features:[],customFeatures:Array.isArray(p.custom_features)?p.custom_features:[],features:Array.isArray(p.features)?p.features.join('، '):(p.features||'')};}
function uiInvoiceType(value){
  return {
    standard:'فاتورة ضريبية',
    simplified:'فاتورة ضريبية مبسطة',
  }[String(value||'').toLowerCase()]||value||'فاتورة ضريبية';
}
function mapInvoiceFromApi(invoice){
  const raw=invoice&&typeof invoice==='object'?invoice:{};
  let content={};
  try{content=JSON.parse(raw.xml_content||'{}')||{};}catch(_){content={};}
  return {
    id:raw.id,
    number:raw.invoice_number||'-',
    type:uiInvoiceType(raw.invoice_type),
    amount:Number(raw.total_amount||0),
    status:statusLabel(raw.status),
    client:content.buyer||raw.client_name||'',
    date:raw.issue_date||raw.created_at||'',
    raw,
  };
}
function uiPermissionScope(value){return {full_access:'النظام كامل',invoices:'الفواتير'}[value]||value||'النظام كامل';}
function apiPermissionScope(value){let v=baseAr(value);return {'النظام كامل':'full_access','الفواتير':'invoices'}[v]||String(value||'full_access');}
function mapMemberFromApi(u){const platform=u.role==='platform_admin'||u.is_superuser;return {id:u.id,name:u.manager_name||u.first_name||u.email,email:u.email,tenantId:u.tenant_id||null,tenantName:platform?'مسؤول المنصة':(u.tenant_name||''),role:uiRole(u.role),accountType:uiRole(u.role),permission:platform?'النظام كامل':uiPermissionScope(u.permission_scope),status:uiStatus(u.is_active),isOwner:!!u.is_tenant_owner,isProtectedManager:platform||u.role==='company_admin'||!!u.is_tenant_owner};}
function visibleTeamMembers(){
  if(isPlatformAdmin()){
    const tenantId=currentUser?.tenant_id||currentUser?.tenantId||currentUser?.tenant?.id||null;
    return team.filter(m=>tenantId&&String(m.tenantId)===String(tenantId));
  }
  const base=team.filter(m=>baseAr(m.tenantName)!=='مسؤول المنصة');
  const tenantName=currentTenantName();
  const tenantId=currentUser?.tenant_id||currentUser?.tenantId||currentUser?.tenant?.id||companySettings.tenantId||null;
  return base.filter(m=>{
    if(tenantId&&m.tenantId)return String(m.tenantId)===String(tenantId);
    return !tenantName||cleanText(m.tenantName)===tenantName;
  });
}
async function loadBackendData(){
  if(typeof ApiClient==='undefined')return false;
  try{
    const page=document.body.dataset.page||'dashboard';
    const data=await ApiClient.fetchBootstrap(page);
    if(!data?.user)throw new Error('تعذر تحميل جلسة المستخدم.');
    currentUser=data.user;
    syncCompanyLogoFromUser(currentUser);
    tenants=Array.isArray(data.tenants)?data.tenants:[];
    clients=Array.isArray(data.clients)?data.clients.map(mapClientFromApi):[];
    packages=Array.isArray(data.plans)?data.plans.map(mapPackageFromApi):[];
    team=Array.isArray(data.users)?data.users.map(mapMemberFromApi):[];
    invoices=Array.isArray(data.invoices)?data.invoices.map(mapInvoiceFromApi):[];
    subscriptions=Array.isArray(data.subscriptions)?data.subscriptions:[];
    dashboardSummary=data.summary&&Object.keys(data.summary).length?data.summary:null;
    if(page==='reports'&&dashboardSummary){
      if($('reportPaid'))$('reportPaid').textContent=money(dashboardSummary.paid||0);
      if($('reportOutstanding'))$('reportOutstanding').textContent=money(dashboardSummary.outstanding||0);
      if($('reportVat'))$('reportVat').textContent=money(dashboardSummary.vat||0);
      if($('reportInvoices'))$('reportInvoices').textContent=Number(dashboardSummary.invoices||0);
    }
    window.is_zatca_connected=data.zatca_status==='linked';
    const ownTenantId=currentUser?.tenant_id||null;
    const tenant=(ownTenantId?tenants.find(item=>String(item.id)===String(ownTenantId)):null)||(!isPlatformAdmin()?tenants[0]:null);
    if(tenant){
      companySettings={tenantId:tenant.id,name:tenant.name||'',vat:tenant.tax_registration_number||'',cr:tenant.commercial_registration_number||'',address:tenant.address_text||[tenant.street_name,tenant.building_number,tenant.city_subdivision,tenant.location_city,tenant.postal_zone].filter(Boolean).join('، '),seller:tenant.invoice_seller_name||tenant.name||'',logoUrl:tenant.logo_url||'',vatCertificateUrl:tenant.vat_certificate_url||''};
      companySettingsLoaded=true;
      applyCompanyBrandLogo();
    }
    return true;
  }catch(err){
    if(document.body.dataset.page==='subscribers'){
      const user=await ApiClient.fetchMe();
      if(user&&!isPlatformAdmin(user)){
        currentUser=user;
        showToast('صفحة الشركات المشتركة متاحة لمدير المنصة فقط.','error');
        setTimeout(()=>location.href='clients-admin.html',350);
        return false;
      }
    }
    console.warn('Backend sync failed:', err.message);
    showToast("تعذر تحميل بيانات المنصة. تحقق من الاتصال ثم أعد المحاولة.","error");
    return false;
  }
}
function renderAll(){if($('dashClients'))$('dashClients').textContent=clients.length;if($('dashTeam'))$('dashTeam').textContent=team.length;if($('clientCount'))$('clientCount').textContent=clients.length;if($('packageCount'))$('packageCount').textContent=packages.length;if($('teamCount'))$('teamCount').textContent=team.length;if($('invoiceRows'))$('invoiceRows').innerHTML=invoices.map((x,i)=>{let row=Array.isArray(x)?{number:x[0],type:x[1],amount:x[2],status:x[3]}:x;return `<tr><td>${row.number}</td><td>${tr(row.type)}</td><td>${money(row.amount)}</td><td><span class="status">${tr(row.status)}</span></td><td><button class="btn small ghost" onclick="printInvoice(${i})"><i class="fa-solid fa-print"></i> <span>${tr('طباعة')}</span></button></td></tr>`;}).join('');if($('clientsRows'))$('clientsRows').innerHTML=clients.map(c=>`<tr><td>${tr(c.name)}</td><td>${c.vat}</td><td>${tr(c.city)}</td><td><span class="status ${baseAr(c.status)==='نشط'?'':'off'}">${tr(c.status)}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editClient(${c.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small danger" onclick="deleteClient(${c.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></td></tr>`).join('');if($('packagesGrid'))$('packagesGrid').innerHTML=packages.map((p,i)=>`<div class="price-card ${i===1?'featured':''}"><h3>${tr(p.name)}</h3><div class="price">${money(p.price)}</div><div class="features">${renderPackageFeatures(p.features)}</div><p class="muted">${tr(p.period)} - ${Number(p.maxUsers||1)} مستخدم</p><div class="row-actions"><button class="btn small ghost" onclick="editPackage(${p.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small danger" onclick="deletePackage(${p.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></div>`).join('');if($('teamRows'))$('teamRows').innerHTML=team.map(m=>`<tr><td>${tr(m.name)}</td><td>${m.email}</td><td>${tr(m.role)}</td><td><span class="status ${baseAr(m.status)==='نشط'?'':'off'}">${tr(m.status)}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editMember(${m.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small secondary" onclick="suspendMember(${m.id})"><i class="fa-solid fa-ban"></i> <span>${tr('تعليق')}</span></button><button class="btn small danger" onclick="deleteMember(${m.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></td></tr>`).join('');applyLanguage(false);}
function renderAll(){if($('dashClients'))$('dashClients').textContent=clients.length;if($('dashTeam'))$('dashTeam').textContent=team.length;if($('clientCount'))$('clientCount').textContent=clients.length;if($('packageCount'))$('packageCount').textContent=packages.length;if($('teamCount'))$('teamCount').textContent=team.length;if($('invoiceRows'))$('invoiceRows').innerHTML=invoices.length?invoices.map((x,i)=>{let row=Array.isArray(x)?{number:x[0],type:x[1],amount:x[2],status:x[3]}:x;return `<tr><td>${row.number||'-'}</td><td>${tr(row.type||'-')}</td><td>${money(row.amount||0)}</td><td><span class="status">${tr(row.status||'مسودة')}</span></td><td><button class="btn small ghost" onclick="printInvoice(${i})"><i class="fa-solid fa-print"></i> <span>${tr('طباعة')}</span></button></td></tr>`;}).join(''):`<tr><td colspan="5">${tr('لا توجد فواتير محفوظة')}</td></tr>`;if($('clientsRows'))$('clientsRows').innerHTML=clients.map(c=>`<tr><td>${tr(c.name)}</td><td>${c.vat}</td><td>${tr(c.city)}</td><td><span class="status ${baseAr(c.status)==='نشط'?'':'off'}">${tr(c.status)}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editClient(${c.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small danger" onclick="deleteClient(${c.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></td></tr>`).join('');if($('packagesGrid'))$('packagesGrid').innerHTML=packages.map((p,i)=>`<div class="price-card ${i===1?'featured':''}"><h3>${tr(p.name)}</h3><div class="price">${money(p.price)}</div><div class="features">${renderPackageFeatures(p.features)}</div><p class="muted">${tr(p.period)} - ${Number(p.maxUsers||1)} مستخدم</p><div class="row-actions"><button class="btn small ghost" onclick="editPackage(${p.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small danger" onclick="deletePackage(${p.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></div>`).join('');if($('teamRows'))$('teamRows').innerHTML=team.map(m=>`<tr><td>${tr(m.name)}</td><td>${m.email}</td><td>${tr(m.accountType||accountTypeFor(m.role))}</td><td>${tr(permissionLabel(m.permission))}</td><td><span class="status ${baseAr(m.status)==='نشط'?'':'off'}">${tr(m.status)}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editMember(${m.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small secondary" onclick="suspendMember(${m.id})"><i class="fa-solid fa-ban"></i> <span>${tr('تعليق')}</span></button><button class="btn small danger" onclick="deleteMember(${m.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></td></tr>`).join('');togglePermissionFields();applyLanguage(false);}
const renderAllBase=renderAll;
renderAll=function(){
  if(document.body.dataset.page==='team')team=visibleTeamMembers();
  renderAllBase();
  const rows=$('teamRows');
  if(!rows)return;
  rows.innerHTML=visibleTeamMembers().map(member=>{
    const active=baseAr(member.status)==='نشط';
    const toggleLabel=active?'تعليق':'تنشيط';
    const toggleIcon=active?'fa-ban':'fa-circle-check';
    const toggleAction=member.isProtectedManager
      ? `<span class="status"><i class="fa-solid fa-shield-halved"></i> ${tr('محمي من التعطيل')}</span>`
      : `<button class="btn small ${active?'secondary':'success'}" onclick="suspendMember(${Number(member.id)})"><i class="fa-solid ${toggleIcon}"></i> <span>${tr(toggleLabel)}</span></button>`;
    const deleteAction=member.isProtectedManager?'':`<button class="btn small danger" onclick="deleteMember(${Number(member.id)})"><i class="fa-regular fa-trash-can"></i> <span>${tr('حذف')}</span></button>`;
    return `<tr><td>${escHtml(tr(member.name))}</td><td>${escHtml(member.email)}</td><td>${escHtml(tr(member.tenantName||'-'))}</td><td>${escHtml(tr(member.accountType||accountTypeFor(member.role)))}</td><td>${escHtml(tr(permissionLabel(member.permission)))}</td><td><span class="status ${active?'':'off'}">${escHtml(tr(member.status))}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editMember(${Number(member.id)})"><i class="fa-regular fa-pen-to-square"></i> <span>${tr('تعديل')}</span></button>${toggleAction}${deleteAction}</div></td></tr>`;
  }).join('');
};
function escHtml(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
function renderPackageFeatures(value){
  return String(tr(value)||'').split(/[،,\n]/).map(cleanText).filter(Boolean).map(feature=>`<span><i class="fa-solid fa-circle-check"></i>${escHtml(feature)}</span>`).join('');
}
function parseInvoiceContent(row){try{return JSON.parse(row?.raw?.xml_content||'{}')||{};}catch{return {};}}
function invoicePrintData(row){
  const raw=row?.raw||{},content=parseInvoiceContent(row);
  const total=Number(row?.amount||raw.total_amount||content.total||0);
  const vat=Number(raw.vat_amount||content.vat_amount||(total?total*15/115:0));
  const subtotal=Number(content.subtotal||(total-vat)||0);
  const items=Array.isArray(content.items)&&content.items.length?content.items:[{description:content.item1||tr('الخدمة 1'),quantity:1,unit_price:subtotal,line_total:subtotal}];
  return {number:row?.number||raw.invoice_number||'-',type:row?.type||uiInvoiceType(raw.invoice_type)||'فاتورة ضريبية',companyName:content.company_name||companySettings.name||'منصة فواتير',seller:content.seller||companySettings.seller||companySettings.name||'منصة فواتير',buyer:content.buyer||raw.client_name||'-',vatNumber:content.vat_number||companySettings.vat||'-',crNumber:content.cr_number||companySettings.cr||'-',address:content.address||companySettings.address||'',date:raw.issue_date||content.date||new Date().toLocaleDateString(lang==='ar'?'ar-SA':'en-US'),subtotal,vat,total,items,qrImage:raw.qr_code_image||'',buyerVat:content.buyer_vat_number||'',buyerCity:content.buyer_city||'',buyerStreet:content.buyer_street||'',buyerBuilding:content.buyer_building_number||'',buyerDistrict:content.buyer_district||'',buyerPostal:content.buyer_postal_code||'',logoUrl:content.logo_url||raw.logo_url||raw.tenant?.logo_url||companySettings.logoUrl||''};
}
function invoicePrintHTML(row){
  const d=invoicePrintData(row);
  const logo=d.logoUrl?`<img class="invoice-company-logo" src="${escHtml(d.logoUrl)}" alt="${tr('شعار الشركة')}">`:companyLogoHTML();
  const itemRows=d.items.map(item=>{const qty=Number(item.quantity||1),unit=Number(item.unit_price||0),line=Number(item.line_total||(qty*unit)||0),itemVat=line*.15;return `<tr><td>${escHtml(item.description||'-')}</td><td>${unit.toFixed(2)}</td><td>${qty}</td><td>${line.toFixed(2)}</td><td>15%</td><td>${itemVat.toFixed(2)}</td><td>${(line+itemVat).toFixed(2)}</td></tr>`;}).join('');
  return `<div class="invoice-paper standard"><div style="text-align:center">${logo}<br><div class="invoice-title">${escHtml(tr(d.type))}</div></div><div class="serial"><div>${tr('الرقم التسلسلي')}<br>${escHtml(d.number)}</div><div>${tr('التاريخ')}<br>${escHtml(d.date)}</div></div><hr><div class="info-row ${invoiceTypeValue(row)==='simplified'?'invoice-buyer-hidden':''}"><div class="info-block"><h4>${tr('معلومات البائع')}</h4><p>الشركة: ${escHtml(d.companyName||'-')}</p><p>${tr('اسم البائع')}: ${escHtml(d.seller)}</p><p>${tr('رقم تسجيل ضريبة القيمة المضافة')}: ${escHtml(d.vatNumber)}</p><p>${tr('رقم السجل التجاري')}: ${escHtml(d.crNumber)}</p><p>${tr('عنوان المتجر')}: ${escHtml(d.address)}</p></div><div class="info-block"><h4>${tr('معلومات المشتري')}</h4><p>${tr('اسم المشتري')}: ${escHtml(d.buyer)}</p><p>${tr('رقم تسجيل ضريبة القيمة المضافة')}: ${escHtml(d.buyerVat||'-')}</p><p>المدينة: ${escHtml(d.buyerCity||'-')}</p><p>الشارع: ${escHtml(d.buyerStreet||'-')}</p><p>رقم المبنى: ${escHtml(d.buyerBuilding||'-')}</p><p>الحي: ${escHtml(d.buyerDistrict||'-')}</p><p>الرمز البريدي: ${escHtml(d.buyerPostal||'-')}</p></div></div><table class="invoice-table"><tr><th>${tr('المنتج')}</th><th>${tr('سعر الوحدة')}</th><th>${tr('الكمية')}</th><th>${tr('المجموع الفرعي')}</th><th>${tr('نسبة الضريبة')}</th><th>${tr('قيمة الضريبة')}</th><th>${tr('المجموع شامل الضريبة')}</th></tr>${itemRows}</table><div class="totals"><div class="total-line cyan"><span>${tr('المجموع غير شامل ضريبة القيمة المضافة')}</span><b>${d.subtotal.toFixed(2)}</b></div><div class="total-line"><span>${tr('ضريبة القيمة المضافة (15%)')}</span><b>${d.vat.toFixed(2)}</b></div><div class="total-line"><span>${tr('المجموع مع الضريبة (15%)')}</span><b>${d.total.toFixed(2)}</b></div></div>${qr(d.qrImage)}</div>`;
}
function printInvoice(index){
  const row=invoices[index];
  if(!row)return showToast('تعذر طباعة الفاتورة');
  if($('printArea'))$('printArea').innerHTML=invoicePrintHTML(Array.isArray(row)?{number:row[0],type:row[1],amount:row[2],status:row[3]}:row);
  window.print();
}
function invoiceById(id){return invoices.find(inv=>String(inv.id)===String(id)||String(inv.raw?.id)===String(id)||String(inv.number)===String(id)||String(inv.raw?.invoice_number)===String(id));}
function invoiceDetailUrl(id){location.href=`invoice-detail.html?id=${encodeURIComponent(id)}`;}
function statusLabel(value){return {draft:'مسودة',approved:'مدفوعة',submitted:'مرسلة',rejected:'ملغاة','مسودة':'مسودة','مقبولة':'معتمدة','مرسلة':'مرسلة','مرفوضة':'ملغاة','معتمدة':'معتمدة','ملغاة':'ملغاة'}[value]||value||'مسودة';}
function apiStatusValue(value){return {'مسودة':'draft','معتمدة':'approved','مدفوعة':'approved','مقبولة':'approved','مرسلة':'submitted','ملغاة':'rejected','مرفوضة':'rejected'}[value]||value||'draft';}
function invoiceStatusClass(value){const s=apiStatusValue(value);return s==='rejected'?'off':(s==='approved'||s==='submitted'?'':'draft');}
function invoiceTypeValue(row){return row?.raw?.invoice_type || (baseAr(row?.type)==='فاتورة ضريبية مبسطة'?'simplified':'standard');}
function zatcaStatusValue(value){const v=String(value||'pending').toLowerCase();if(['accepted','cleared','reported'].includes(v))return 'accepted';if(['warning','accepted_with_warning'].includes(v))return 'warning';if(['rejected','failed'].includes(v))return 'rejected';return 'pending';}
function zatcaStatusLabel(value){return {pending:'لم تُرسل',accepted:'مقبولة',warning:'مقبولة مع تحذير',rejected:'مرفوضة'}[zatcaStatusValue(value)]||'لم تُرسل';}
function invoiceRowData(row){const d=invoicePrintData(row);const raw=row?.raw||{};return {id:row.id||raw.id||row.number||raw.invoice_number,number:d.number,client:d.buyer||'-',date:raw.issue_date||d.date,type:row.type||uiInvoiceType(raw.invoice_type),typeValue:invoiceTypeValue(row),total:Number(row.amount||d.total||0),invoiceStatus:statusLabel(row.status||raw.status),invoiceStatusValue:apiStatusValue(row.status||raw.status),zatcaStatus:zatcaStatusLabel(raw.zatca_status),zatcaStatusValue:zatcaStatusValue(raw.zatca_status),vat:d.vatNumber||'',raw};}
function toggleInvoiceMenu(button,event){
  event?.stopPropagation();
  const menu=button.nextElementSibling,wasOpen=menu?.classList.contains('show');
  document.querySelectorAll('.action-menu.show').forEach(item=>item.classList.remove('show'));
  if(!menu||wasOpen)return;
  const rect=button.getBoundingClientRect();
  menu.style.top=(rect.bottom+8)+'px';
  menu.style.insetInlineEnd='auto';
  menu.style.left=Math.max(8,Math.min(rect.right-168,window.innerWidth-176))+'px';
  menu.classList.add('show');
}
function editInvoice(id){invoiceDetailUrl(id);}
function copyInvoice(id){const row=invoiceById(id);const text=row?invoicePrintData(row).number:id;navigator.clipboard?.writeText(text);showToast('تم نسخ رقم الفاتورة');}
function cancelInvoice(id){updateInvoiceStatus(id,'rejected');}
async function checkInvoiceCompliance(id){
  const row=invoiceById(id);if(!row)return showToast('تعذر العثور على الفاتورة');
  try{
    const result=await ApiClient.request(`/invoices/${encodeURIComponent(row.id)}/zatca-compliance/`,{method:'POST',body:'{}'});
    if(row.raw&&result.invoice)Object.assign(row.raw,result.invoice);
    showToast(result.message||'اجتازت الفاتورة فحص الامتثال');renderAll();renderInvoiceDetailPage();
  }catch(err){showToast(err?.data?.detail||err?.message||'فشل فحص امتثال الفاتورة');}
}
document.addEventListener('click',()=>document.querySelectorAll('.action-menu.show').forEach(menu=>menu.classList.remove('show')));
function addLocalAudit(){ /* Django creates authoritative audit records. */ }
async function updateInvoiceStatus(id,status){
  const row=invoiceById(id);
  if(!row)return showToast('تعذر تحديث الفاتورة');
  const apiStatus=apiStatusValue(status);
  try{
    let updated=null;
    if(row.id&&typeof ApiClient!=='undefined')updated=await ApiClient.updateInvoice(row.id,{status:apiStatus});
    const persistedStatus=updated?.status||apiStatus;
    if(row.raw)Object.assign(row.raw,updated||{status:persistedStatus});
    row.status=statusLabel(persistedStatus);
    
    addLocalAudit('invoice_status_updated',{invoice:row.number,status:row.status});
    renderAll();
    renderInvoiceDetailPage();
    showToast('تم تحديث حالة الفاتورة');
  }catch(err){
    console.error('Invoice status update failed:',err);
    showToast(err?.data?.detail||err?.response?.data?.detail||err?.message||'تعذر تحديث حالة الفاتورة');
  }
}
function downloadInvoicePDF(id){
  const row=invoiceById(id);
  if(!row)return showToast('تعذر تحميل الفاتورة');
  if($('printArea'))$('printArea').innerHTML=invoicePrintHTML(row);
  window.print();
}
async function loadCompanySettingsForm(){
  if(!$('companyName'))return;
  if(!companySettingsLoaded&&!companySettingsLoadPromise&&typeof ApiClient!=="undefined"){
    companySettingsLoadPromise=(async()=>{
      try{
        const tenantList=await ApiClient.fetchTenants();
        const ownTenantId=currentUser?.tenant_id||null;
        const tenant=Array.isArray(tenantList)?((ownTenantId?tenantList.find(item=>String(item.id)===String(ownTenantId)):null)||(!isPlatformAdmin()?tenantList[0]:null)):null;
        if(tenant){
          companySettings={...companySettings,tenantId:tenant.id,name:tenant.name||'',vat:tenant.tax_registration_number||'',cr:tenant.commercial_registration_number||'',address:tenant.address_text||[tenant.street_name,tenant.building_number,tenant.city_subdivision,tenant.location_city,tenant.postal_zone].filter(Boolean).join('، '),seller:tenant.invoice_seller_name||tenant.name||'',logoUrl:tenant.logo_url||'',vatCertificateUrl:tenant.vat_certificate_url||''};
        }
      }catch(err){console.warn("Company settings sync skipped:",err.message);}
      companySettingsLoaded=true;
      companySettingsLoadPromise=null;
    })();
    await companySettingsLoadPromise;
  }
  $('companyName').value=companySettings.name||'';
  $('companyVat').value=companySettings.vat||'';
  $('companyCr').value=companySettings.cr||'';
  $('companyAddress').value=companySettings.address||'';
  setCompanyLogoPreview(companySettings.logoUrl||'');
  const certificateLink=$('companyVatCertificateLink');
  if(certificateLink)certificateLink.style.display=companySettings.vatCertificateUrl?'inline-flex':'none';
  applyCompanyBrandLogo();
}
function openCompanyVatCertificate(){
  if(!companySettings.vatCertificateUrl)return showToast('لا توجد شهادة ضريبية محفوظة.');
  ApiClient.openAuthenticatedFile(companySettings.vatCertificateUrl)
    .catch(err=>showToast(err.message||'تعذر فتح الشهادة الضريبية.'));
}
function setCompanyLogoPreview(url){
  const preview=$('companyLogoPreview');
  const removeBtn=$('companyLogoRemove');
  if(preview)preview.innerHTML=url?`<img src="${escHtml(url)}" alt="${tr('شعار الشركة')}">`:`<span>${tr('LOGO')}</span>`;
  if(removeBtn)removeBtn.disabled=!url;
}
async function uploadCompanyLogo(input){
  const file=input?.files?.[0];
  if(!file)return;
  if(!companySettings.tenantId)return showToast('تعذر تحديد حساب الشركة المرتبط.');
  try{
    const result=await ApiClient.uploadTenantLogo(companySettings.tenantId,file);
    companySettings={...companySettings,logoUrl:result.logo_url||''};
    setCompanyLogoPreview(companySettings.logoUrl);
    applyCompanyBrandLogo();
    refreshPreview();
    showToast('تم حفظ شعار الشركة');
  }catch(err){showToast(err?.data?.detail||err.message||'تعذر رفع شعار الشركة');}
  finally{if(input)input.value='';}
}
async function removeCompanyLogo(){
  if(!companySettings.tenantId)return showToast('تعذر تحديد حساب الشركة المرتبط.');
  try{
    await ApiClient.deleteTenantLogo(companySettings.tenantId);
    companySettings={...companySettings,logoUrl:''};
    setCompanyLogoPreview('');
    applyCompanyBrandLogo();
    refreshPreview();
    showToast('تم حذف شعار الشركة');
  }catch(err){showToast(err?.data?.detail||err.message||'تعذر حذف شعار الشركة');}
}

async function saveCompanySettings(){
  const fields=['companyName','companyVat','companyCr','companyAddress'];
  if(fields.some(id=>!cleanText($(id)?.value||'')))return showToast('يرجى تعبئة جميع حقول إعدادات الشركة قبل الحفظ.');
  if(!/^3\d{13}3$/.test(cleanText($('companyVat').value)))return showToast('يجب أن يتكون الرقم الضريبي من 15 رقماً ويبدأ وينتهي بالرقم 3.');
  const nextSettings={...companySettings,name:cleanText($('companyName').value),vat:cleanText($('companyVat').value),cr:cleanText($('companyCr').value),address:cleanText($('companyAddress').value)};
  if(typeof ApiClient!=="undefined"){
    try{
      let tenantId=nextSettings.tenantId;
      if(!tenantId){const tenantList=await ApiClient.fetchTenants();tenantId=Array.isArray(tenantList)?tenantList[0]?.id:null;}
      if(!tenantId)return showToast("تعذر تحديد حساب الشركة المرتبط.");
      await ApiClient.updateTenant(tenantId,{name:nextSettings.name,tax_registration_number:nextSettings.vat,commercial_registration_number:nextSettings.cr,address_text:nextSettings.address});
      nextSettings.tenantId=tenantId;
    }catch(err){console.error("Company settings save failed:",err);return showToast(err.message||"تعذر حفظ بيانات الشركة في الخادم");}
  }
  companySettings=nextSettings;
  
  addLocalAudit('company_settings_updated',{company:companySettings.name});
  showToast('تم حفظ إعدادات الشركة');
  refreshPreview();
}
function renderPlatformSettings(){
  const panel=$('platformOnboarding');
  if(panel)panel.style.display=isPlatformAdmin()?'':'none';
  const select=$('subCompanyPlan');
  if(!select)return;
  const current=select.value;
  const planOptions=packages.filter(plan=>plan.isActive!==false);
  select.replaceChildren();
  const placeholder=new Option(planOptions.length?tr('اختر الباقة'):tr('لا توجد باقات مفعلة'),'');
  placeholder.disabled=true;
  placeholder.selected=true;
  placeholder.dataset.ar=planOptions.length?'اختر الباقة':'لا توجد باقات مفعلة';
  placeholder.dataset.en=planOptions.length?'Select a package':'No active packages';
  select.appendChild(placeholder);
  planOptions.forEach(plan=>{
    const price=Number(plan.price||0);
    const users=Number(plan.maxUsers||1);
    const option=new Option('',String(plan.id));
    option.dataset.ar=`${plan.name} - ${price.toLocaleString('ar-SA')} ر.س - ${users} مستخدم`;
    option.dataset.en=`${plan.name} - ${price.toLocaleString('en-US')} SAR - ${users} users`;
    option.textContent=lang==='ar'?option.dataset.ar:option.dataset.en;
    select.appendChild(option);
  });
  select.disabled=!planOptions.length;
  if(current&&planOptions.some(plan=>String(plan.id)===String(current)))select.value=current;
  else if(planOptions.length)select.value='';
}
async function loadCompanyPlanOptions(){
  const select=$('subCompanyPlan');
  if(!select||!isPlatformAdmin()||typeof ApiClient==='undefined')return;
  select.disabled=true;
  select.innerHTML=`<option value="">${tr('جارٍ تحميل الباقات...')}</option>`;
  try{
    const apiPlans=await ApiClient.fetchPlans({active:true});
    packages=Array.isArray(apiPlans)?apiPlans.map(mapPackageFromApi):[];
    
    renderPlatformSettings();
  }catch(error){
    console.error('Active plans loading failed:',error);
    select.innerHTML=`<option value="">${tr('تعذر تحميل الباقات')}</option>`;
  }
}
let subscribedCompanyEdit=null;
let subscribedCompanyVatCertificateFile=null;
function subscriptionForTenantName(name){
  const wanted=cleanText(name||'').toLowerCase();
  return subscriptions.find(s=>cleanText(s.tenant?.name||'').toLowerCase()===wanted)||null;
}
function groupPrimaryMember(group){
  return group.members.find(m=>m.isOwner)||group.members.find(m=>baseAr(m.accountType)==='مدير')||group.members[0]||null;
}
function setSubscribedCompanyFormMode(edit){
  const title=$('subCompanyTitle');
  const button=$('subCompanySaveText');
  const cancel=$('subCompanyCancel');
  if(title)title.textContent=edit?'تعديل بيانات الشركة والحساب':'إضافة شركة مشتركة';
  if(button)button.textContent=edit?'حفظ التعديلات':'إضافة الشركة وتفعيل الاشتراك';
  if(cancel)cancel.style.display=edit?'inline-flex':'none';
}
function clearSubscribedCompanyForm(){
  ['subCompanyName','subCompanyVat','subCompanyCr','subClientCity','subClientStreet','subClientBuilding','subClientDistrict','subClientPostal','subManagerName','subManagerEmail','subManagerPassword'].forEach(id=>{if($(id))$(id).value='';});
  if($('subManagerPermission'))$('subManagerPermission').value='full_access';
  if($('subAccountType'))$('subAccountType').value='مدير';
  if($('subMemberRole'))$('subMemberRole').value='مدير';
  if($('subAccountStatus'))$('subAccountStatus').value='نشط';
  subscribedCompanyEdit=null;
  subscribedCompanyVatCertificateFile=null;
  setVatCertificateFileName('');
  setSavedVatCertificateLink('');
  setSubscribedCompanyFormMode(false);
}
function fillSubscribedCompanyForm(companyName,member,subscription){
  if($('subCompanyName'))$('subCompanyName').value=companyName||member?.tenantName||'';
  if($('subCompanyVat'))$('subCompanyVat').value=subscription?.tenant?.tax_registration_number||subscription?.tenant?.vat_number||'';
  if($('subCompanyCr'))$('subCompanyCr').value=subscription?.tenant?.commercial_registration_number||'';
  if($('subClientCity'))$('subClientCity').value=subscription?.tenant?.location_city||'';
  if($('subClientStreet'))$('subClientStreet').value=subscription?.tenant?.street_name||'';
  if($('subClientBuilding'))$('subClientBuilding').value=subscription?.tenant?.building_number||'';
  if($('subClientDistrict'))$('subClientDistrict').value=subscription?.tenant?.city_subdivision||'';
  if($('subClientPostal'))$('subClientPostal').value=subscription?.tenant?.postal_zone||'';
  const certificateUrl=subscription?.tenant?.vat_certificate_url||subscription?.tenant?.vat_certificate||'';
  setSavedVatCertificateLink(certificateUrl);
  subscribedCompanyVatCertificateFile=null;
  setVatCertificateFileName(certificateUrl?'تم حفظ شهادة سابقة':'PDF أو صورة');
  const currentPackageId=subscription?.package_id||subscription?.plan?.id;
  if($('subCompanyPlan')&&currentPackageId){renderPlatformSettings();$('subCompanyPlan').value=String(currentPackageId);}
  if($('subManagerName'))$('subManagerName').value=member?.name&&member.name!==member?.email?member.name:'';
  if($('subManagerEmail'))$('subManagerEmail').value=member?.email||'';
  if($('subManagerPassword'))$('subManagerPassword').value='';
  if($('subManagerPermission'))$('subManagerPermission').value='full_access';
  if($('subAccountType'))$('subAccountType').value='مدير';
  if($('subMemberRole'))$('subMemberRole').value='مدير';
  if($('subAccountStatus'))$('subAccountStatus').value='نشط';
  setSubscribedCompanyFormMode(true);
  $('platformOnboarding')?.scrollIntoView({behavior:'smooth',block:'start'});
}
async function editSubscribedCompany(encodedName){
  const name=decodeURIComponent(encodedName);
  const group=companyTeamGroups().find(g=>g.name===name)||{name,members:visibleTeamMembers().filter(m=>m.tenantName===name)};
  const member=groupPrimaryMember(group);
  const subscription=subscriptionForTenantName(name);
  const tenantId=group.tenantId||member?.tenantId||subscription?.tenant?.id||null,userId=member?.id||null,subscriptionId=subscription?.id||null;
  subscribedCompanyEdit={type:'company',companyName:name,tenantId,userId,subscriptionId,planId:subscription?.package_id||subscription?.plan?.id||null};
  try{
    const [tenantResult,userResult,subscriptionResult]=await Promise.allSettled([
      tenantId?ApiClient.fetchTenant(tenantId):Promise.resolve(null),
      userId?ApiClient.fetchUser(userId):Promise.resolve(null),
      subscriptionId?ApiClient.fetchSubscription(subscriptionId):Promise.resolve(null)
    ]);
    const detailedSubscription=subscriptionResult.status==='fulfilled'&&subscriptionResult.value?subscriptionResult.value:{...subscription,tenant:tenantResult.status==='fulfilled'&&tenantResult.value?tenantResult.value:subscription?.tenant};
    const detailedMember=userResult.status==='fulfilled'&&userResult.value?mapMemberFromApi(userResult.value):member;
    subscribedCompanyEdit.planId=detailedSubscription?.package_id||detailedSubscription?.plan?.id||subscribedCompanyEdit.planId;
    fillSubscribedCompanyForm(name,detailedMember,detailedSubscription);
  }catch(error){console.error('Company details loading failed:',error);fillSubscribedCompanyForm(name,member,subscription);showToast('تعذر تحميل بعض بيانات الشركة');}
}
async function editCompanyAccount(id){
  const member=team.find(m=>Number(m.id)===Number(id));
  if(!member)return showToast('تعذر العثور على الحساب');
  const subscription=subscriptionForTenantName(member.tenantName);
  const tenantId=member.tenantId||subscription?.tenant?.id||null,subscriptionId=subscription?.id||null;
  subscribedCompanyEdit={type:'member',companyName:member.tenantName,tenantId,userId:member.id,subscriptionId,planId:subscription?.package_id||subscription?.plan?.id||null};
  const [tenantResult,userResult,subscriptionResult]=await Promise.allSettled([tenantId?ApiClient.fetchTenant(tenantId):Promise.resolve(null),ApiClient.fetchUser(member.id),subscriptionId?ApiClient.fetchSubscription(subscriptionId):Promise.resolve(null)]);
  const detailedSubscription=subscriptionResult.status==='fulfilled'&&subscriptionResult.value?subscriptionResult.value:{...subscription,tenant:tenantResult.status==='fulfilled'?tenantResult.value:subscription?.tenant};
  const detailedMember=userResult.status==='fulfilled'?mapMemberFromApi(userResult.value):member;
  subscribedCompanyEdit.planId=detailedSubscription?.package_id||detailedSubscription?.plan?.id||subscribedCompanyEdit.planId;
  fillSubscribedCompanyForm(member.tenantName,detailedMember,detailedSubscription);
}
async function deleteSubscribedCompany(encodedName){
  if(!isPlatformAdmin())return showToast('هذه الصفحة لمدير المنصة فقط');
  const name=decodeURIComponent(encodedName);
  const group=companyTeamGroups().find(g=>g.name===name)||{name,members:visibleTeamMembers().filter(m=>m.tenantName===name)};
  const member=groupPrimaryMember(group);
  const subscription=subscriptionForTenantName(name);
  const tenantId=group.tenantId||member?.tenantId||subscription?.tenant?.id||null;
  if(!tenantId)return showToast('تعذر تحديد العميل للحذف');
  const ok=window.confirm(`هل أنت متأكد من حذف العميل ${name}؟`);
  if(!ok)return;
  try{
    await Promise.all(group.members.map(m=>ApiClient.deleteUser(m.id)));
    await ApiClient.deleteTenant(tenantId);
    team=team.filter(m=>m.tenantName!==name&&m.tenantId!==tenantId);
    tenants=tenants.filter(t=>String(t.id)!==String(tenantId)&&cleanText(t.name)!==name);
    subscriptions=subscriptions.filter(s=>s.tenant?.id!==tenantId&&s.tenant?.name!==name);
    clients=clients.filter(c=>c.tenantName!==name&&c.name!==name);
    expandedCompanyTeams.delete(name);
    if(subscribedCompanyEdit?.companyName===name)clearSubscribedCompanyForm();
    
    
    addLocalAudit('subscribed_company_deleted',{company:name,tenant_id:tenantId});
    renderAll();
    showToast('تم حذف العميل');
  }catch(err){
    console.error('Subscribed company delete failed:',err);
    showToast(err.data?.detail||err.message||'تعذر حذف العميل');
  }
}
function fillIfPresent(id,value){
  const el=$(id);
  const text=value!==undefined&&value!==null?String(value).trim():'';
  if(!el||!text)return;
  el.value=text;
  el.dispatchEvent(new Event('input',{bubbles:true}));
  el.dispatchEvent(new Event('change',{bubbles:true}));
}
function setVatCertificateFileName(name){
  const label=$('subVatCertificateName');
  if(label)label.textContent=name||'PDF أو صورة';
}
function setSavedVatCertificateLink(url){
  const link=$('subVatCertificateLink');
  if(!link)return;
  if(url){
    link.href='#';
    link.dataset.url=url;
    link.onclick=event=>{
      event.preventDefault();
      if(typeof ApiClient!=='undefined'&&typeof ApiClient.openAuthenticatedFile==='function'){
        ApiClient.openAuthenticatedFile(url).catch(err=>showToast(err.message||'تعذر فتح شهادة الضريبة المحفوظة'));
      }
    };
    link.style.display='inline-flex';
  }else{
    link.removeAttribute('href');
    delete link.dataset.url;
    link.onclick=null;
    link.style.display='none';
  }
}
function formDataFromPayload(payload,file){
  const formData=new FormData();
  Object.entries(payload).forEach(([key,value])=>{
    if(value!==undefined&&value!==null)formData.append(key,value);
  });
  if(file)formData.append('vat_certificate',file,file.name);
  return formData;
}
async function uploadSubscribedCompanyVatCertificate(input){
  if(input?.dataset?.vatUploading==='1')return;
  const file=input?.files?.[0];
  if(!file)return;
  if(!['.pdf','.png','.jpg','.jpeg','.webp'].some(ext=>file.name.toLowerCase().endsWith(ext))){
    input.value='';
    setVatCertificateFileName('');
    return showToast('يرجى رفع ملف PDF أو صورة بصيغة PNG أو JPG أو WEBP.');
  }
  setVatCertificateFileName(file.name);
  subscribedCompanyVatCertificateFile=file;
  input.dataset.vatUploading='1';
  try{
    showToast('جاري قراءة شهادة التسجيل الضريبي...');
    let result;
    if(typeof ApiClient!=='undefined'&&typeof ApiClient.extractVatCertificate==='function'){
      result=await ApiClient.extractVatCertificate(file, subscribedCompanyEdit?.tenantId || null);
    }else{
      const formData=new FormData();
      formData.append('certificate',file);
      if(subscribedCompanyEdit?.tenantId)formData.append('tenant_id',subscribedCompanyEdit.tenantId);
      const baseUrl=(typeof API_CONFIG!=='undefined'&&API_CONFIG.base_url)?API_CONFIG.base_url:('/api');
      const token=(typeof API_CONFIG!=='undefined'&&API_CONFIG.token)?API_CONFIG.token:localStorage.getItem('auth_token');
      const response=await fetch(`${baseUrl}/vat-certificate/extract/`,{method:'POST',headers:{Authorization:token?`Bearer ${token}`:''},body:formData});
      result=await response.json().catch(()=>({}));
      if(!response.ok)throw Object.assign(new Error(result.detail||result.error||'تعذر قراءة شهادة التسجيل الضريبي.'),{status:response.status,data:result});
    }
    console.info('VAT certificate extraction response',result);
    const responseData=result?.data||result||{};
    const data={...responseData,...(responseData.fields||{})};
    if(data.vat_certificate_url)setSavedVatCertificateLink(data.vat_certificate_url);
    fillIfPresent('subCompanyName',data.taxpayer_name);
    fillIfPresent('subCompanyVat',data.vat_registration_number);
    fillIfPresent('subCompanyCr',data.cr_license_number);
    fillIfPresent('subClientCity',data.city);
    fillIfPresent('subClientStreet',data.street);
    fillIfPresent('subClientBuilding',data.building_number);
    fillIfPresent('subClientDistrict',data.district);
    fillIfPresent('subClientPostal',data.postal_code);
    const filled=['taxpayer_name','vat_registration_number','cr_license_number','city','street','building_number','district','postal_code'].filter(key=>data[key]);
    if(filled.length){
      showToast('تمت قراءة الشهادة وتعبئة البيانات المتاحة.');
    }else{
      showToast(data.message||'تم حفظ الشهادة ويمكن الاطلاع عليها في أي وقت. أدخل البيانات يدويًا.');
    }
  }catch(err){
    console.error('VAT certificate extraction failed:',err);
    showToast(err.data?.detail||err.message||'تعذر قراءة شهادة التسجيل الضريبي.');
  }finally{
    if(input?.dataset)input.dataset.vatUploading='0';
  }
}
document.addEventListener('change',event=>{
  const input=event.target;
  if(input&&input.id==='subVatCertificate')uploadSubscribedCompanyVatCertificate(input);
});
async function saveSubscribedCompany(){
  if(!isPlatformAdmin())return showToast('هذه الصفحة لمدير المنصة فقط');
  const company=cleanText($('subCompanyName')?.value||'');
  const companyVat=cleanText($('subCompanyVat')?.value||'');
  const companyCr=cleanText($('subCompanyCr')?.value||'');
  const clientCity=cleanText($('subClientCity')?.value||'');
  const clientStreet=cleanText($('subClientStreet')?.value||'');
  const clientBuilding=cleanText($('subClientBuilding')?.value||'');
  const clientDistrict=cleanText($('subClientDistrict')?.value||'');
  const clientPostal=cleanText($('subClientPostal')?.value||'');
  const email=cleanText($('subManagerEmail')?.value||'');
  const managerName=cleanText($('subManagerName')?.value||'');
  const selectedPlanId=cleanText($('subCompanyPlan')?.value||'');
  if(companyVat&&!/^3\d{13}3$/.test(companyVat))return showToast('الرقم الضريبي يجب أن يتكون من 15 رقماً ويبدأ وينتهي بالرقم 3.');
  if(clientBuilding&&!/^\d{4}$/.test(clientBuilding))return showToast('رقم مبنى العميل يجب أن يتكون من 4 أرقام.');
  if(clientPostal&&!/^\d{5}$/.test(clientPostal))return showToast('الرمز البريدي للعميل يجب أن يتكون من 5 أرقام.');
  const isEdit=!!subscribedCompanyEdit;
  const requiredBase=['subCompanyName','subCompanyVat','subClientCity','subClientStreet','subClientBuilding','subClientDistrict','subClientPostal','subManagerName','subManagerEmail'];
  const required=isEdit?requiredBase:['subManagerName','subManagerPassword',...requiredBase];
  if(required.some(id=>!cleanText($(id)?.value||'')))return showToast('يرجى تعبئة جميع بيانات المنشأة وحساب المسؤول.');
  const password=cleanText($('subManagerPassword')?.value||'');
  if(password&&password.length<6)return showToast('كلمة المرور يجب ألا تقل عن 6 أحرف.');
  const accountType='مدير شركة';
  const roleValue='مدير شركة';
  const permissionScope='full_access';
  const accountActive=true;
  const payload={
    email,
    manager_name:managerName,
    role:apiRole(roleValue),
    permission_scope:permissionScope,
    is_active:accountActive,
    tenant_name:company,
    tenant_vat:companyVat,
    tenant_cr:companyCr,
    tenant_city:clientCity,
    tenant_street:clientStreet,
    tenant_building:clientBuilding,
    tenant_district:clientDistrict,
    tenant_postal:clientPostal
  };
  if(selectedPlanId)payload.plan_id=selectedPlanId;
  if(password)payload.password=password;
  try{
    let saved;
    if(isEdit){
      if(subscribedCompanyEdit.tenantId){
        const tenantPayload={name:company,tax_registration_number:companyVat,commercial_registration_number:companyCr,location_city:clientCity,street_name:clientStreet,building_number:clientBuilding,city_subdivision:clientDistrict,postal_zone:clientPostal};
        const tenantBody=subscribedCompanyVatCertificateFile?formDataFromPayload(tenantPayload,subscribedCompanyVatCertificateFile):tenantPayload;
        await ApiClient.updateTenant(subscribedCompanyEdit.tenantId,tenantBody);
      }
      if(payload.plan_id){
        if(subscribedCompanyEdit.subscriptionId)await ApiClient.updateSubscription(subscribedCompanyEdit.subscriptionId,{plan_id:payload.plan_id,status:'active'});
        else if(subscribedCompanyEdit.tenantId&&typeof ApiClient.createSubscription==='function')await ApiClient.createSubscription({tenant_id:subscribedCompanyEdit.tenantId,plan_id:payload.plan_id,status:'active'});
      }
      if(subscribedCompanyEdit.userId)saved=await ApiClient.updateUser(subscribedCompanyEdit.userId,payload);
    }else{
      const createBody=subscribedCompanyVatCertificateFile?formDataFromPayload(payload,subscribedCompanyVatCertificateFile):payload;
      saved=await ApiClient.createUser(createBody);
    }
    if(!saved&&subscribedCompanyEdit?.userId)saved=team.find(m=>Number(m.id)===Number(subscribedCompanyEdit.userId));
    if(saved){
      const item=mapMemberFromApi(saved);
      item.name=$('subManagerName')?.value||item.name;
      item.tenantName=company;
      item.accountType=accountType;
      item.role=roleValue;
      item.permission=uiPermissionScope(payload.permission_scope);
      item.status=uiStatus(payload.is_active);
      let idx=team.findIndex(m=>Number(m.id)===Number(item.id));
      if(idx>=0)team[idx]=item;else team.unshift(item);
    }
    if(isEdit&&subscribedCompanyEdit.companyName&&subscribedCompanyEdit.companyName!==company){
      team=team.map(m=>m.tenantName===subscribedCompanyEdit.companyName?{...m,tenantName:company}:m);
    }
    if(typeof ApiClient!=='undefined'){
      const [usersResult,subscriptionsResult]=await Promise.allSettled([ApiClient.fetchUsers(),ApiClient.fetchSubscriptions()]);
      if(usersResult.status==='fulfilled'&&Array.isArray(usersResult.value))team=usersResult.value.map(mapMemberFromApi).filter(m=>baseAr(m.tenantName)!=='مسؤول المنصة');
      if(subscriptionsResult.status==='fulfilled'&&Array.isArray(subscriptionsResult.value))subscriptions=subscriptionsResult.value;
    }
    
    addLocalAudit(isEdit?'subscribed_company_updated':'subscribed_company_created',{company,email,plan_id:payload.plan_id});
    clearSubscribedCompanyForm();
    renderAll();
    showToast(isEdit?'تم حفظ تعديلات الشركة والحساب':(payload.plan_id?'تمت إضافة الشركة وتفعيل الاشتراك':'تمت إضافة الشركة بدون باقة'));
  }catch(err){
    console.error('Subscribed company save failed:',err);
    showToast(apiErrorMessage(err,'تعذر حفظ بيانات الشركة'));
  }
}
function toggleInvoiceFilters(force){const panel=$('invoiceFiltersPanel');if(!panel)return;const show=typeof force==='boolean'?force:!panel.classList.contains('show');panel.classList.toggle('show',show);}
function applyInvoiceFilters(){renderAll();toggleInvoiceFilters(false);}
function clearInvoiceFilters(){['invoiceStatusFilter','invoiceTypeFilter','invoiceZatcaFilter'].forEach(id=>{if($(id))$(id).value='all';});['invoiceClientFilter','invoiceDateFrom','invoiceDateTo','invoiceAmountMin','invoiceAmountMax'].forEach(id=>{if($(id))$(id).value='';});renderAll();}
function filteredInvoices(){
  const q=cleanText($('invoiceSearch')?.value||'').toLowerCase();
  const status=$('invoiceStatusFilter')?.value||'all';
  const type=$('invoiceTypeFilter')?.value||'all';
  const client=cleanText($('invoiceClientFilter')?.value||'').toLowerCase();
  const dateFrom=$('invoiceDateFrom')?.value||'';
  const dateTo=$('invoiceDateTo')?.value||'';
  const amountMin=Number($('invoiceAmountMin')?.value||0)||0;
  const amountMax=Number($('invoiceAmountMax')?.value||0)||0;
  const zatca=$('invoiceZatcaFilter')?.value||'all';
  return invoices.map((x,i)=>({row:Array.isArray(x)?{number:x[0],type:x[1],amount:x[2],status:x[3],id:x[0]}:x,index:i})).map(item=>({...item,data:invoiceRowData(item.row)})).filter(({data})=>{
    const text=[data.number,data.client,data.vat,data.type,data.invoiceStatus,data.zatcaStatus,data.raw?.xml_content].join(' ').toLowerCase();
    const matchText=!q||text.includes(q);
    const matchStatus=status==='all'||data.invoiceStatusValue===status;
    const matchType=type==='all'||data.typeValue===type;
    const matchClient=!client||String(data.client||'').toLowerCase().includes(client);
    const matchDate=(!dateFrom||String(data.date||'')>=dateFrom)&&(!dateTo||String(data.date||'')<=dateTo);
    const matchAmount=(!amountMin||data.total>=amountMin)&&(!amountMax||data.total<=amountMax);
    const matchZatca=zatca==='all'||data.zatcaStatusValue===zatca;
    return matchText&&matchStatus&&matchType&&matchClient&&matchDate&&matchAmount&&matchZatca;
  });
}
function filteredClients(){
  const q=cleanText($('clientSearch')?.value||'').toLowerCase();
  if(!q)return clients;
  return clients.filter(c=>[c.name,c.vat,c.email,c.phone,c.city,c.status,c.tenantName].map(x=>tr(x||'')).join(' ').toLowerCase().includes(q));
}
function renderInvoiceDetailPage(){
  if(document.body.dataset.page!=='invoice-detail')return;
  const id=new URLSearchParams(location.search).get('id');
  const row=invoiceById(id);
  const box=$('invoiceDetail');
  if(!box)return;
  if(!row){box.innerHTML=`<div class="card"><h2>${tr('الفاتورة غير موجودة')}</h2><p class="muted">${tr('يرجى العودة إلى قائمة الفواتير وتحديد فاتورة محفوظة.')}</p></div>`;return;}
  const d=invoicePrintData(row);
  box.innerHTML=`<div class="section-title"><div><h2>${escHtml(d.number)}</h2><p class="muted">${escHtml(tr(d.type))} - ${escHtml(tr(statusLabel(row.status||row.raw?.status)))}</p></div><div class="row-actions"><button class="btn ghost" onclick="location.href='invoices.html'"><i class="fa-solid fa-arrow-right"></i> ${tr('رجوع')}</button><button class="btn" onclick="downloadInvoicePDF('${escHtml(row.id||row.raw?.id||row.number)}')"><i class="fa-solid fa-file-pdf"></i> PDF / ${tr('طباعة')}</button></div></div><div class="invoice-detail-grid"><div class="card">${invoicePrintHTML(row)}</div><div class="card"><h3>${tr('إجراءات الفاتورة')}</h3><div class="status-stack"><button class="btn ghost" onclick="checkInvoiceCompliance('${escHtml(row.id||row.raw?.id||row.number)}')"><i class="fa-solid fa-shield-halved"></i> فحص الامتثال</button><button class="btn ghost" onclick="updateInvoiceStatus('${escHtml(row.id||row.raw?.id||row.number)}','approved')">${tr('اعتماد')}</button><button class="btn ghost" onclick="updateInvoiceStatus('${escHtml(row.id||row.raw?.id||row.number)}','submitted')">${tr('تحديد كمرسلة')}</button><button class="btn danger" onclick="updateInvoiceStatus('${escHtml(row.id||row.raw?.id||row.number)}','rejected')">${tr('إلغاء')}</button></div><hr><p><b>${tr('العميل')}:</b> ${escHtml(d.buyer)}</p><p><b>${tr('الإجمالي')}:</b> ${money(d.total)}</p><p><b>${tr('الضريبة')}:</b> ${money(d.vat)}</p><p><b>QR:</b> ${escHtml(row.raw?.qr_code||tr('جاهز داخل الفاتورة'))}</p><p><b>ZATCA:</b> ${escHtml(row.raw?.zatca_status||'pending')}</p></div></div>`;
}
function searchableText(el){
  return cleanText(el.innerText||el.textContent||'').toLowerCase();
}
function searchPageTarget(query){
  const q=cleanText(query).toLowerCase();
  const aliases=[
    ['dashboard','لوحة','تحكم','الرئيسية','home','index'],
    ['create-invoice','انشاء','إنشاء','فاتورة جديدة','create','new invoice'],
    ['invoices','الفواتير','فاتوره','فاتورة','invoice','invoices'],
    ['clients','العملاء','عميل','client','clients'],
    ['client-log','الاجراءات','الإجراءات','actions','log'],
    ['packages','الباقات','باقة','package','packages'],
    ['reports','التقارير','تقرير','report','reports'],
    ['team','الفريق','موظف','الموظفين','team','users'],
    ['settings','الاعدادات','الإعدادات','settings']
  ];
  const found=aliases.find(([page,...words])=>words.some(word=>q===word||q.includes(word)));
  return found?.[0];
}
function applyGlobalSearch(){
  const input=document.querySelector('.top .search input');
  if(!input)return;
  const q=cleanText(input.value).toLowerCase();
  document.querySelectorAll('[data-search-empty]').forEach(el=>el.remove());
  const tables=[...document.querySelectorAll('.page.active table.app-table tbody')];
  tables.forEach(tbody=>{
    let visible=0;
    [...tbody.rows].forEach(row=>{
      if(row.cells.length===1&&row.cells[0].colSpan>1)return;
      const match=!q||searchableText(row).includes(q);
      row.style.display=match?'':'none';
      if(match)visible++;
    });
    if(q&&!visible){
      const cols=tbody.closest('table')?.querySelectorAll('thead th').length||1;
      const emptyRow=document.createElement('tr');
      emptyRow.dataset.searchEmpty='1';
      emptyRow.innerHTML=`<td colspan="${cols}">${tr('لا توجد نتائج')}</td>`;
      tbody.appendChild(emptyRow);
    }
  });
  const cards=[...document.querySelectorAll('.page.active .price-card,.page.active .mini-item')];
  cards.forEach(card=>{card.style.display=!q||searchableText(card).includes(q)?'':'none';});
  renderGlobalSearchResults();
}
function globalSearchRows(query){
  const q=cleanText(query).toLowerCase();
  if(!q)return [];
  const rows=[];
  const add=(type,title,meta,href,onclick)=>rows.push({type,title,meta,href,onclick});
  invoices.forEach(inv=>{
    const row=Array.isArray(inv)?{number:inv[0],type:inv[1],amount:inv[2],status:inv[3],id:inv[0]}:inv;
    const data=invoicePrintData(row);
    const text=[data.number,data.buyer,data.seller,data.type,row.status,row.raw?.xml_content].join(' ').toLowerCase();
    if(text.includes(q))add(tr('الفاتورة'),data.number,`${tr(data.type)} - ${data.buyer} - ${money(data.total)}`,`invoice-detail.html?id=${encodeURIComponent(row.id||row.raw?.id||row.number)}`);
  });
  if(isPlatformAdmin()){
    clients.forEach(c=>{
      const text=[c.name,c.vat,c.city,c.status].join(' ').toLowerCase();
      if(text.includes(q))add(tr('العميل'),tr(c.name),`${c.vat||'-'} - ${tr(c.city||'-')}`,`client-form.html?id=${encodeURIComponent(c.id)}`);
    });
  }
  visibleTeamMembers().forEach(m=>{
    const text=[m.name,m.email,m.tenantName,m.role,m.permission,m.status].join(' ').toLowerCase();
    if(text.includes(q))add(tr('الفريق'),m.email,`${tr(m.tenantName||'-')} - ${tr(m.role||'-')}`,'team.html');
  });
  const companies=[...new Set(visibleTeamMembers().map(m=>m.tenantName).filter(Boolean))];
  companies.forEach(name=>{
    if(cleanText(name).toLowerCase().includes(q))add(tr('الشركة'),tr(name),tr('الفريق'),'team.html');
  });
  packages.forEach(p=>{
    const text=[p.name,p.period,p.features,p.price,p.maxUsers].join(' ').toLowerCase();
    if(text.includes(q)&&pageAllowed('packages'))add(tr('الباقة'),tr(p.name),`${money(p.price)} - ${Number(p.maxUsers||1)} ${tr('مستخدم')}`,'packages.html');
  });
  return rows.slice(0,8);
}
function renderGlobalSearchResults(){
  const input=document.querySelector('.top .search input');
  const box=document.querySelector('.top .search');
  if(!input||!box)return;
  let panel=document.getElementById('globalSearchResults');
  if(!panel){
    panel=document.createElement('div');
    panel.id='globalSearchResults';
    panel.className='global-search-results';
    box.appendChild(panel);
  }
  const q=cleanText(input.value);
  const rows=globalSearchRows(q);
  if(!q){panel.classList.remove('show');panel.innerHTML='';return;}
  panel.classList.add('show');
  panel.innerHTML=rows.length?rows.map((r,i)=>`<button type="button" class="global-search-item" data-index="${i}"><b>${escHtml(r.title)}</b><span>${escHtml(r.type)} - ${escHtml(r.meta||'')}</span></button>`).join(''):`<div class="global-search-empty">${tr('لا توجد نتائج')}</div>`;
  panel.querySelectorAll('.global-search-item').forEach(btn=>{
    btn.onclick=()=>{
      const item=rows[Number(btn.dataset.index)];
      if(item.onclick){
        sessionStorage.setItem('takharuj_pending_action', item.onclick);
      }
      location.href=item.href;
    };
  });
}
function runPendingSearchAction(){
  const action=sessionStorage.getItem('takharuj_pending_action');
  if(!action)return;
  sessionStorage.removeItem('takharuj_pending_action');
  if(/^editClient\(\d+\)$/.test(action)){
    setTimeout(()=>{try{eval(action);}catch(err){console.warn('Pending action failed:',err.message);}},250);
  }
}
function setupGlobalSearch(){
  const input=document.querySelector('.top .search input');
  const box=document.querySelector('.top .search');
  if(!input||input.dataset.searchReady==='1')return;
  input.dataset.searchReady='1';
  box?.addEventListener('click',()=>input.focus());
  input.addEventListener('input',applyGlobalSearch);
  input.addEventListener('focus',renderGlobalSearchResults);
  input.addEventListener('keydown',event=>{
    if(event.key==='Enter'){
      const rows=globalSearchRows(input.value);
      if(rows[0]){
        if(rows[0].onclick)sessionStorage.setItem('takharuj_pending_action', rows[0].onclick);
        location.href=rows[0].href;
        return;
      }
      const target=searchPageTarget(input.value);
      if(target&&pageAllowed(target))showPage(target);
    }
  });
  document.addEventListener('click',event=>{
    if(!box.contains(event.target))document.getElementById('globalSearchResults')?.classList.remove('show');
  });
  document.addEventListener('keydown',event=>{
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){
      event.preventDefault();
      input.focus();
      input.select();
    }
  });
}
function reportDate(value,withTime=false){
  if(!value)return '-';
  const date=new Date(value);
  if(Number.isNaN(date.getTime()))return '-';
  return date.toLocaleString(lang==='ar'?'ar-SA':'en-US',withTime?{dateStyle:'medium',timeStyle:'short'}:{dateStyle:'medium'});
}
function subscriptionStatusLabel(value){return {active:'نشط',expired:'منتهي',suspended:'معلق'}[value]||value||'-';}
function renderCompanySubscriptionReport(){
  const page=$('reports');
  if(!page||!isPlatformAdmin())return;
  let section=$('companySubscriptionsReport');
  if(!section){
    section=document.createElement('div');
    section.id='companySubscriptionsReport';
    section.className='card';
    section.style.marginTop='20px';
    page.appendChild(section);
  }
  const oldSearch=$('companyReportSearch');
  const searchHadFocus=oldSearch===document.activeElement;
  const q=cleanText(oldSearch?.value||'').toLowerCase();
  const rows=subscriptions.filter(s=>!q||[s.tenant?.name,s.plan?.name,subscriptionStatusLabel(s.effective_status)].join(' ').toLowerCase().includes(q));
  const active=subscriptions.filter(s=>s.effective_status==='active').length;
  const expiring=subscriptions.filter(s=>s.effective_status==='active'&&Number(s.days_remaining)<=7).length;
  const expired=subscriptions.filter(s=>s.effective_status==='expired').length;
  section.innerHTML=`<div class="section-title"><div><h3>اشتراكات الشركات</h3><p class="muted">متابعة الباقات، المدة المتبقية، حالة الحساب وآخر نشاط لكل شركة.</p></div><span class="pill">${subscriptions.length} شركة</span></div>
    <div class="kpis" style="margin-bottom:18px"><div class="card kpi"><div class="kpi-ico" style="background:rgba(34,197,94,.15);color:#22c55e"><i class="fa-solid fa-building-circle-check"></i></div><div><small>اشتراكات نشطة</small><h3>${active}</h3></div></div><div class="card kpi"><div class="kpi-ico" style="background:rgba(245,158,11,.15);color:#f59e0b"><i class="fa-solid fa-hourglass-half"></i></div><div><small>تنتهي خلال 7 أيام</small><h3>${expiring}</h3></div></div><div class="card kpi"><div class="kpi-ico" style="background:rgba(239,68,68,.13);color:#ef4444"><i class="fa-solid fa-calendar-xmark"></i></div><div><small>منتهية</small><h3>${expired}</h3></div></div></div>
    <div class="filters-bar"><div class="search"><i class="fa-solid fa-magnifying-glass"></i><input id="companyReportSearch" placeholder="ابحث باسم الشركة أو الباقة أو الحالة..." value="${escHtml(q)}" oninput="renderCompanySubscriptionReport()"></div></div>
    <div class="table-wrap"><table class="app-table"><thead><tr><th>الشركة</th><th>الباقة</th><th>بداية الاشتراك</th><th>نهاية الاشتراك</th><th>المتبقي</th><th>الحالة</th><th>آخر نشاط</th><th>الحسابات</th><th>ZATCA</th></tr></thead><tbody>${rows.length?rows.map(s=>{const days=Number(s.days_remaining||0),status=s.effective_status||s.status,urgent=status==='expired'||days===0,warning=status==='active'&&days<=7;return `<tr><td><b>${escHtml(s.tenant?.name||'-')}</b></td><td>${escHtml(s.plan?.name||'-')}<br><small class="muted">${s.plan?.plan_type==='yearly'?'سنوية':'شهرية'}</small></td><td>${reportDate(s.started_at)}</td><td>${reportDate(s.effective_ends_at||s.ends_at)}</td><td><span class="status ${urgent?'off':''}" style="${warning?'color:#f59e0b':''}">${status==='expired'?'انتهى':days+' يوم'}</span></td><td><span class="status ${status==='active'?'':'off'}">${subscriptionStatusLabel(status)}</span></td><td>${s.last_activity?reportDate(s.last_activity,true):'لا يوجد نشاط'}</td><td>${Number(s.active_users||0)} نشط / ${Number(s.total_users||0)}</td><td><span class="status ${s.zatca_status==='linked'?'':'off'}">${s.zatca_status==='linked'?'مرتبط':'غير مرتبط'}</span></td></tr>`;}).join(''):'<tr><td colspan="9">لا توجد اشتراكات مطابقة</td></tr>'}</tbody></table></div>`;
  const input=$('companyReportSearch');
  if(input&&searchHadFocus){input.focus();input.setSelectionRange(input.value.length,input.value.length);}
}
const expandedCompanyTeams=new Set();
function companyTeamGroups(){
  const q=cleanText($('clientSearch')?.value||'').toLowerCase();
  const grouped=new Map();
  tenants.forEach(tenant=>{
    const company=cleanText(tenant.name||'')||'بدون شركة';
    if(baseAr(company)==='مسؤول المنصة')return;
    grouped.set(company,{tenantId:tenant.id,members:[]});
  });
  subscriptions.forEach(subscription=>{
    const company=cleanText(subscription.tenant?.name||'');
    if(!company||baseAr(company)==='مسؤول المنصة')return;
    if(!grouped.has(company))grouped.set(company,{tenantId:subscription.tenant?.id||null,members:[]});
  });
  team.forEach(member=>{
    const company=cleanText(member.tenantName||'')||'بدون شركة';
    if(baseAr(company)==='مسؤول المنصة')return;
    if(!grouped.has(company))grouped.set(company,{tenantId:member.tenantId||null,members:[]});
    const group=grouped.get(company);
    if(!group.tenantId&&member.tenantId)group.tenantId=member.tenantId;
    group.members.push(member);
  });
  return [...grouped.entries()]
    .map(([name,group])=>({name,tenantId:group.tenantId,members:group.members}))
    .filter(group=>!q||[group.name,...group.members.flatMap(m=>[m.name,m.email,m.role,m.accountType,m.permission,m.status])].join(' ').toLowerCase().includes(q))
    .sort((a,b)=>a.name.localeCompare(b.name,'ar'));
}
function toggleCompanyTeam(encodedName){
  const name=decodeURIComponent(encodedName);
  if(expandedCompanyTeams.has(name))expandedCompanyTeams.delete(name);else expandedCompanyTeams.add(name);
  renderAll();
}
function renderCompanyTeams(){
  const body=$('clientsRows');
  if(!body)return;
  const table=body.closest('table');
  const groups=companyTeamGroups();
  if($('clientCount'))$('clientCount').textContent=groups.length;
  if(table){
    const header=table.querySelector('thead tr');
    if(header)header.innerHTML='<th>الشركة</th><th>عدد الحسابات</th><th>الحسابات النشطة</th><th>الحالة</th><th>الفريق والصلاحيات</th>';
  }
  body.innerHTML=groups.length?groups.map(group=>{
    const open=expandedCompanyTeams.has(group.name);
    const active=group.members.filter(m=>baseAr(m.status)==='نشط').length;
    const encoded=encodeURIComponent(group.name).replace(/'/g,'%27');
    const accounts=group.members.map(m=>`<tr><td><b>${escHtml(m.name||m.email)}</b><br><small class="muted">${escHtml(m.email)}</small></td><td>${escHtml(tr(m.accountType||accountTypeFor(m.role)))}</td><td>${escHtml(tr(m.role||'-'))}</td><td>${escHtml(tr(permissionLabel(m.permission)))}</td><td><span class="status ${baseAr(m.status)==='نشط'?'':'off'}">${escHtml(tr(m.status))}</span></td><td><button class="btn small ghost" onclick="editCompanyAccount(${Number(m.id)})"><i class="fa-solid fa-pen"></i> ${tr('تعديل')}</button></td></tr>`).join('');
    return `<tr class="company-row"><td><b>${escHtml(group.name)}</b></td><td>${group.members.length}</td><td>${active}</td><td><span class="status ${active?'':'off'}">${active?'نشط':'غير نشط'}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editSubscribedCompany('${encoded}')"><i class="fa-solid fa-pen"></i> ${tr('تعديل')}</button><button class="btn small danger" onclick="deleteSubscribedCompany('${encoded}')"><i class="fa-solid fa-trash"></i> ${tr('حذف')}</button><button class="btn small ghost" onclick="toggleCompanyTeam('${encoded}')"><i class="fa-solid fa-chevron-${open?'up':'down'}"></i> ${open?'إخفاء الفريق':'عرض الفريق'}</button></div></td></tr>${open?`<tr class="company-team-row"><td colspan="5"><div class="card" style="margin:8px 0"><h4 style="margin-top:0">فريق ${escHtml(group.name)}</h4><div class="table-wrap"><table class="app-table"><thead><tr><th>الحساب</th><th>نوع الحساب</th><th>الدور</th><th>صلاحية الوصول</th><th>الحالة</th><th>الإجراءات</th></tr></thead><tbody>${accounts||'<tr><td colspan="6">لا توجد حسابات مضافة</td></tr>'}</tbody></table></div></div></td></tr>`:''}`;
  }).join(''):'<tr><td colspan="5">لا توجد شركات أو حسابات مطابقة</td></tr>';
}
function renderAll(){
  const visibleTeam=visibleTeamMembers();
  if($('dashClients'))$('dashClients').textContent=dashboardSummary?.clients??clients.length;
  if($('dashInvoices'))$('dashInvoices').textContent=dashboardSummary?.invoices??invoices.length;
  if($('dashRevenue')){
    const revenue=dashboardSummary?.revenue??invoices.reduce((sum,row)=>sum+Number((Array.isArray(row)?row[2]:row.amount)||0),0);
    $('dashRevenue').innerHTML=`<span class="stat-value">${revenue.toLocaleString(lang==='ar'?'ar-SA':'en-US')}</span><span class="stat-unit">${lang==='ar'?'ر.س':'SAR'}</span>`;
  }
  if($('dashTeam'))$('dashTeam').textContent=dashboardSummary?.team??visibleTeam.length;
  if($('clientCount'))$('clientCount').textContent=document.body.dataset.page==='subscribers'?companyTeamGroups().length:clients.length;
  if($('packageCount'))$('packageCount').textContent=packages.length;
  if($('teamCount'))$('teamCount').textContent=visibleTeam.length;
  if($('invoiceRows')){
    const rows=filteredInvoices();
    const empty=$('invoiceEmptyState');
    const cards=$('invoiceCards');
    if(empty)empty.style.display=rows.length?'none':'grid';
    $('invoiceRows').innerHTML=rows.map(({data})=>`<tr><td><button type="button" class="invoice-number-copy" data-copy-hint="اضغط للنسخ" title="اضغط للنسخ" aria-label="نسخ رقم الفاتورة ${escHtml(data.number)}" onclick="copyInvoice('${escHtml(data.id)}',this)"><span>${escHtml(data.number)}</span><i class="fa-regular fa-copy" aria-hidden="true"></i></button></td><td>${escHtml(data.client)}</td><td>${escHtml(data.date||'-')}</td><td>${tr(data.type||'-')}</td><td>${money(data.total||0)}</td><td><span class="status ${invoiceStatusClass(data.invoiceStatusValue)}">${tr(data.invoiceStatus)}</span></td><td><span class="status zatca-${data.zatcaStatusValue}">${tr(data.zatcaStatus)}</span></td><td><div class="action-wrap"><button class="icon-btn small" onclick="toggleInvoiceMenu(this,event)"><i class="fa-solid fa-ellipsis-vertical"></i></button><div class="action-menu"><button onclick="invoiceDetailUrl('${escHtml(data.id)}')"><i class="fa-solid fa-eye"></i>${tr('عرض')}</button><button onclick="editInvoice('${escHtml(data.id)}')"><i class="fa-solid fa-pen"></i>${tr('تعديل')}</button><button onclick="downloadInvoicePDF('${escHtml(data.id)}')"><i class="fa-solid fa-file-pdf"></i>PDF</button><button onclick="updateInvoiceStatus('${escHtml(data.id)}','submitted')"><i class="fa-solid fa-paper-plane"></i>${tr('إرسال')}</button><button class="danger-text" onclick="cancelInvoice('${escHtml(data.id)}')"><i class="fa-solid fa-ban"></i>${tr('إلغاء')}</button></div></div></td></tr>`).join('');
    if(cards)cards.innerHTML=rows.map(({data})=>`<article class="invoice-card"><div><button type="button" class="invoice-number-copy" data-copy-hint="اضغط للنسخ" title="اضغط للنسخ" aria-label="نسخ رقم الفاتورة ${escHtml(data.number)}" onclick="copyInvoice('${escHtml(data.id)}',this)"><span>${escHtml(data.number)}</span><i class="fa-regular fa-copy" aria-hidden="true"></i></button><small>${escHtml(data.client)}</small></div><strong>${money(data.total||0)}</strong><div class="invoice-card-meta"><span class="status ${invoiceStatusClass(data.invoiceStatusValue)}">${tr(data.invoiceStatus)}</span><span class="status zatca-${data.zatcaStatusValue}">${tr(data.zatcaStatus)}</span></div><button class="btn small ghost" onclick="invoiceDetailUrl('${escHtml(data.id)}')">${tr('عرض')}</button></article>`).join('');
  }
  if($('clientsRows')&&document.body.dataset.page==='subscribers'){
    renderCompanyTeams();
  }else if($('clientsRows')){
    const q=cleanText($('clientSearch')?.value||'').toLowerCase();
    const rows=clients.filter(c=>!q||[c.name,c.vat,c.email,c.phone,c.city,c.status].join(' ').toLowerCase().includes(q));
    $('clientsRows').innerHTML=rows.length?rows.map(c=>`<tr><td><b>${escHtml(tr(c.name))}</b></td><td>${escHtml(c.vat||'-')}</td><td>${c.phone?`<a href="tel:${escHtml(c.phone)}">${escHtml(c.phone)}</a>`:'-'}<br><small>${c.email?`<a href="mailto:${escHtml(c.email)}">${escHtml(c.email)}</a>`:'-'}</small></td><td>${escHtml(tr(c.city||'-'))}</td><td><span class="status ${baseAr(c.status)==='نشط'?'':'off'}">${tr(c.status)}</span></td><td><div class="row-actions"><button class="btn small" onclick="createInvoiceForClient(${c.id})"><i class="fa-solid fa-file-circle-plus"></i> <span>إنشاء فاتورة</span></button><button class="btn small ghost" onclick="editClient(${c.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small danger" onclick="deleteClient(${c.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></td></tr>`).join(''):`<tr><td colspan="6">${tr('لا توجد نتائج')}</td></tr>`;
  }
  if($('packagesGrid'))$('packagesGrid').innerHTML=packages.length?packages.map((p,i)=>`<div class="price-card ${i===1?'featured':''}"><h3>${tr(p.name)}</h3><div class="price">${money(p.price)}</div><div class="features">${renderPackageFeatures(p.features)}</div><p class="muted">${tr(p.period)} - ${Number(p.maxUsers||1)} مستخدم</p><div class="row-actions"><button class="btn small ghost" onclick="editPackage(${p.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small danger" onclick="deletePackage(${p.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></div>`).join(''):'<div class="card"><p class="muted">لا توجد باقات مسجلة حاليًا.</p></div>';
  if($('teamRows'))$('teamRows').innerHTML=visibleTeam.length?visibleTeam.map(m=>{const suspended=baseAr(m.status)==='معلق';return `<tr><td>${tr(m.name)}</td><td>${m.email}</td><td>${tr(m.tenantName||'-')}</td><td>${tr(m.accountType||accountTypeFor(m.role))}</td><td>${tr(permissionLabel(m.permission))}</td><td><span class="status ${baseAr(m.status)==='نشط'?'':'off'}">${tr(m.status)}</span></td><td><div class="row-actions"><button class="btn small ghost" onclick="editMember(${m.id})"><i class="fa-solid fa-pen"></i> <span>${tr('تعديل')}</span></button><button class="btn small ${suspended?'success':'danger'}" aria-pressed="${suspended}" onclick="suspendMember(${m.id})"><i class="fa-solid fa-ban"></i> <span>${tr(suspended?'نشط':'تعليق')}</span></button><button class="btn small danger" onclick="deleteMember(${m.id})"><i class="fa-solid fa-trash"></i> <span>${tr('حذف')}</span></button></div></td></tr>`;}).join(''):'<tr><td colspan="7">لا توجد حسابات مستخدمين مرتبطة بالمستأجرين حتى الآن.</td></tr>';
  renderCompanySubscriptionReport();togglePermissionFields();applyCompanyBrandLogo();if(document.body.dataset.page==='settings')loadCompanySettingsForm();renderPlatformSettings();renderInvoiceDetailPage();applyLanguage(false);setupGlobalSearch();applyGlobalSearch();runPendingSearchAction();
}
function getSessionUser(){ return {}; }
function setupUserMenu(){
  const user=document.querySelector('.actions .user');
  if(!user)return;
  const session=currentUser&&currentUser.email?currentUser:getSessionUser();
  const email=session.email||'';
  const displayName=cleanText(session.manager_name||session.full_name||session.name||session.first_name||'');
  const name=displayName||email.split('@')[0]||'مستخدم';
  const subtitle=uiRole(session.role)||session.tenant_name||email||'';
  const avatar=user.querySelector('.avatar');
  const label=user.querySelector('b');
  const role=user.querySelector('small');
  if(avatar)avatar.textContent=name.charAt(0).toUpperCase();
  if(label)label.textContent=name;
  if(role)role.textContent=subtitle;
  let btn=user.querySelector('.logout-btn');
  if(!btn){
    btn=document.createElement('button');
    btn.type='button';
    btn.className='logout-btn';
    btn.title='تسجيل الخروج';
    btn.innerHTML='<i class="fa-solid fa-right-from-bracket"></i><span>تسجيل خروج</span>';
    btn.onclick=()=>API_CONFIG.logout();
    user.appendChild(btn);
  }
}
window.addEventListener('pageshow',async event=>{
  if(!event.persisted)return;
  hideNavigationSkeleton();
  try{
    const me=await ApiClient.fetchMe();
    if(me){currentUser=me;syncCompanyLogoFromUser(currentUser);}
    const staleAdminBlock=document.body.textContent.includes('هذه الصفحة متاحة لمدير المنصة فقط');
    if(staleAdminBlock&&isPlatformAdmin()){
      const url=new URL(location.href);
      url.searchParams.set('access_refresh',Date.now());
      location.replace(url.href);
    }else{
      applyRoleAccess();renderAll();
    }
  }catch(error){console.error('Session role refresh failed',error)}
});
document.addEventListener('DOMContentLoaded',async ()=>{
  // Never keep the interface hidden when authentication or API loading fails.
  document.documentElement.classList.remove('lang-boot');
  const hasRequestedInvoiceClient=document.body.dataset.page==='create-invoice'&&new URLSearchParams(location.search).has('client');
  if(!hasRequestedInvoiceClient)showNavigationSkeleton();
  applyTheme();
  applyNotif();
  setupFastNavigation();
  const hasToken=await API_CONFIG.ensureToken();
  if(!hasToken){hideNavigationSkeleton();return;}
  const loaded=await loadBackendData();
  if(!loaded){hideNavigationSkeleton();return;}
  setupUserMenu();applyTheme();applyNotif();applyRoleAccess();renderAll();
  if(document.body.dataset.page==='create-invoice'){clearInvoiceForm();window.preselectRequestedInvoiceClient?.();refreshPreview();}
  else if(document.body.dataset.page==='client-form')loadClientFormPage();
  else refreshPreview();
  window.backendDataReady=true;
  window.dispatchEvent(new CustomEvent('backend-data-ready'));
  loadEditFromHash();applyLanguage(false);
  window.setTimeout(hideNavigationSkeleton,80);
  if(appState.notifications!==false){
    const loadDeferredNotifications=()=>loadNotifications();
    if('requestIdleCallback' in window)requestIdleCallback(loadDeferredNotifications,{timeout:1500});
    else setTimeout(loadDeferredNotifications,500);
  }
});

/* Searchable customer selector for invoice creation. */
(function(){
  function enhanceInvoiceClientPicker(){
    if(document.body.dataset.page!=='create-invoice'||document.getElementById('invoiceClientSelect'))return;
    const input=document.getElementById('invoiceClientSearch');
    const list=document.getElementById('invoiceClientOptions');
    const row=input?.closest('.invoice-client-picker-row');
    if(!input||!list||!row)return;

    input.classList.add('invoice-client-native-input');
    const select=document.createElement('div');
    select.className='invoice-client-select-wrap';
    select.innerHTML='<button type="button" class="invoice-client-select" id="invoiceClientSelect" aria-haspopup="listbox" aria-expanded="false"><span id="invoiceClientValue">اختر العميل من القائمة</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button><div class="invoice-client-dropdown" id="invoiceClientDropdown" hidden><div class="invoice-client-search-wrap"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><input id="invoiceClientSearchInput" type="search" autocomplete="off" placeholder="ابحث باسم العميل أو رقمه الضريبي..."></div><div class="invoice-client-options" id="invoiceClientSelectOptions" role="listbox"></div></div>';
    input.before(select);
    list.hidden=true;

    const button=select.querySelector('#invoiceClientSelect');
    const value=select.querySelector('#invoiceClientValue');
    const dropdown=select.querySelector('#invoiceClientDropdown');
    const search=select.querySelector('#invoiceClientSearchInput');
    const options=select.querySelector('#invoiceClientSelectOptions');
    const rows=()=>[...list.querySelectorAll('option')];
    const render=()=>{
      const query=search.value.trim().toLowerCase();
      const matches=rows().filter(option=>`${option.value} ${option.label||''}`.toLowerCase().includes(query));
      options.innerHTML=matches.length?matches.map(option=>`<button type="button" class="invoice-client-option" role="option" data-value="${escHtml(option.value)}"><b>${escHtml(option.value)}</b><small>${escHtml(option.label||'لا توجد بيانات إضافية')}</small></button>`).join(''):'<p class="invoice-client-empty">لا توجد نتائج مطابقة</p>';
      options.querySelectorAll('[data-value]').forEach(option=>option.addEventListener('click',()=>{
        input.value=option.dataset.value;
        input.dispatchEvent(new Event('change',{bubbles:true}));
        value.textContent=option.dataset.value;
        close();
      }));
    };
    const open=()=>{dropdown.hidden=false;button.setAttribute('aria-expanded','true');render();search.focus();};
    const close=()=>{dropdown.hidden=true;button.setAttribute('aria-expanded','false');};
    button.addEventListener('click',()=>dropdown.hidden?open():close());
    search.addEventListener('input',render);
    search.addEventListener('keydown',event=>{if(event.key==='Escape')close();});
    document.addEventListener('click',event=>{if(!select.contains(event.target))close();});
    new MutationObserver(render).observe(list,{childList:true,subtree:true});

    const originalSave=window.invoiceUxSave;
    if(typeof originalSave==='function')window.invoiceUxSave=async function(){
      const result=await originalSave.apply(this,arguments);
      if(!input.value)value.textContent='اختر العميل من القائمة';
      return result;
    };
  }
  window.addEventListener('load',enhanceInvoiceClientPicker);
})();

/* Invoice action menu: keep it visible at both ends of the viewport. */
(function(){
  const closeInvoiceMenus=()=>document.querySelectorAll('.action-menu.show').forEach(menu=>menu.classList.remove('show'));
  window.toggleInvoiceMenu=function(button,event){
    event?.stopPropagation();
    const menu=button?.nextElementSibling;
    const wasOpen=menu?.classList.contains('show');
    closeInvoiceMenus();
    if(!menu||wasOpen)return;

    menu.classList.add('show');
    const rect=button.getBoundingClientRect();
    const width=menu.offsetWidth||168;
    const height=menu.offsetHeight;
    const gap=8;
    const opensUp=rect.bottom+gap+height>window.innerHeight-gap;
    menu.style.insetInlineEnd='auto';
    menu.style.bottom='auto';
    menu.style.left=Math.max(gap,Math.min(rect.right-width,window.innerWidth-width-gap))+'px';
    menu.style.top=Math.max(gap,opensUp?rect.top-height-gap:rect.bottom+gap)+'px';
  };

  window.cancelInvoice=function(id){
    if(window.confirm('هل تريد إلغاء هذه الفاتورة؟'))return updateInvoiceStatus(id,'rejected');
  };
  window.copyInvoice=async function(id,trigger=null){
    const row=invoiceById(id);
    const text=row?invoicePrintData(row).number:id;
    try{
      if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(text);
      else{
        const field=document.createElement('textarea');
        field.value=text;
        field.style.position='fixed';
        field.style.opacity='0';
        document.body.append(field);
        field.select();
        document.execCommand('copy');
        field.remove();
      }
      if(trigger){
        const idleHint=trigger.getAttribute('title')||trigger.dataset.copyHint||'اضغط للنسخ';
        const copiedHint=lang==='ar'?'تم النسخ':'Copied';
        trigger.classList.add('copied');
        trigger.dataset.copyHint=copiedHint;
        window.setTimeout(()=>{
          trigger.classList.remove('copied');
          trigger.dataset.copyHint=idleHint;
        },1400);
      }
      showToast(lang==='ar'?'تم نسخ رقم الفاتورة':'Invoice number copied');
    }catch(error){showToast(lang==='ar'?'تعذر نسخ رقم الفاتورة':'Could not copy invoice number');}
  };

  function normalizeInvoiceActionLabels(){
    document.querySelectorAll('#invoiceRows .action-menu').forEach(menu=>{
      const buttons=menu.querySelectorAll('button');
      if(buttons.length<5)return;
      if(buttons[0].textContent.trim()!=='عرض التفاصيل')buttons[0].innerHTML='<i class="fa-solid fa-eye"></i>عرض التفاصيل';
      buttons[1].hidden=false;
      if(buttons[1].textContent.trim()!=='تعديل الفاتورة')buttons[1].innerHTML='<i class="fa-solid fa-pen"></i>تعديل الفاتورة';
      if(buttons[2].textContent.trim()!=='طباعة / حفظ PDF')buttons[2].innerHTML='<i class="fa-solid fa-print"></i>طباعة / حفظ PDF';
      if(buttons[3].textContent.trim()!=='تحديد كمرسلة')buttons[3].innerHTML='<i class="fa-solid fa-paper-plane"></i>تحديد كمرسلة';
      if(buttons[4].textContent.trim()!=='إلغاء الفاتورة')buttons[4].innerHTML='<i class="fa-solid fa-ban"></i>إلغاء الفاتورة';
    });
  }
  new MutationObserver(normalizeInvoiceActionLabels).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',normalizeInvoiceActionLabels);
  window.addEventListener('resize',closeInvoiceMenus);
  window.addEventListener('scroll',closeInvoiceMenus,true);
})();

/* Invoice number copy affordance and invoice edit flow. */
(function(){
  function tuneInvoiceActions(){
    document.querySelectorAll('#invoiceRows .action-menu').forEach(menu=>{
      const buttons=menu.querySelectorAll('button');
      if(buttons.length<5)return;
      buttons[1].hidden=false;
      if(buttons[1].textContent.trim()!=='تعديل الفاتورة')buttons[1].innerHTML='<i class="fa-solid fa-pen"></i>تعديل الفاتورة';
      const number=menu.closest('tr')?.querySelector('.invoice-number-copy');
      const action=buttons[0].getAttribute('onclick')||'';
      const match=action.match(/invoiceDetailUrl\('([^']+)'\)/);
      if(!number||!match)return;
      const invoiceId=match[1];
      number.classList.add('invoice-number-copy');
      number.tabIndex=0;
      number.setAttribute('role','button');
      number.setAttribute('title','اضغط للنسخ');
      number.dataset.copyHint='اضغط للنسخ';
      number.onclick=()=>copyInvoice(invoiceId,number);
    });
  }
  new MutationObserver(tuneInvoiceActions).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',tuneInvoiceActions);

  window.editInvoice=function(id){
    window.skipNextNavigationSkeleton=true;
    location.assign(`create-invoice.html?edit=${encodeURIComponent(id)}`);
  };

  function editValues(raw){
    let content={};
    try{content=JSON.parse(raw.xml_content||'{}')||{};}catch(error){}
    return {content,lines:Array.isArray(raw.lines)&&raw.lines.length?raw.lines:(Array.isArray(content.items)?content.items:[])};
  }
  function populateInvoiceEditor(raw){
    const {content,lines}=editValues(raw);
    window.invoiceEditRaw=raw;
    const isSimple=raw.invoice_type==='simplified';
    window.setType?.(isSimple?'simple':'standard');
    [['buyer','buyer'],['buyerVat','buyer_vat_number'],['buyerCity','buyer_city'],['buyerStreet','buyer_street'],['buyerBuilding','buyer_building_number'],['buyerDistrict','buyer_district'],['buyerPostal','buyer_postal_code']].forEach(([id,key])=>{const field=document.getElementById(id);if(field)field.value=content[key]||'';});
    const clientInput=document.getElementById('invoiceClientSearch');
    if(clientInput){clientInput.value=raw.client_name||content.buyer||'';if(raw.client)clientInput.dataset.id=raw.client;}
    const clientValue=document.getElementById('invoiceClientValue');
    if(clientValue)clientValue.textContent=raw.client_name||content.buyer||'اختر العميل من القائمة';
    const items=document.getElementById('invoiceItems');
    if(items)items.innerHTML=(lines.length?lines:[{description:'',quantity:1,unit_price:''}]).map(line=>invoiceItemHTML(line)).join('');
    document.querySelector('#create-invoice .section-title h2')?.replaceChildren(document.createTextNode('تعديل فاتورة'));
    const save=document.querySelector('#create-invoice .invoice-form-actions .btn');
    if(save)save.innerHTML='<i class="fa-solid fa-floppy-disk"></i> حفظ التعديلات';
    const submit=document.getElementById('invoiceZatcaSave');
    if(submit)submit.hidden=true;
    refreshPreview();
  }
  function validEditPayload(payload){
    const values=payload._vals;
    const invalidItem=!values.items.length||values.items.some(item=>!item.description||!Number.isInteger(item.quantity)||item.quantity<1||!Number.isFinite(item.unit_price)||item.unit_price<=0);
    if(!values.seller||!/^3\d{13}3$/.test(values.vat)||invalidItem||values.net<=0)return false;
    if(invoiceType==='standard'&&(!values.buyer||!/^3\d{13}3$/.test(values.buyerVat)||!values.buyerCity||!values.buyerStreet||!/^\d{4}$/.test(values.buyerBuilding)||!values.buyerDistrict||!/^\d{5}$/.test(values.buyerPostal)))return false;
    return true;
  }
  async function saveInvoiceEdit(){
    const raw=window.invoiceEditRaw;
    const payload=buildInvoicePayload();
    if(!validEditPayload(payload))return showToast('يرجى إكمال بيانات العميل والخدمات بالقيم الصحيحة');
    const clientId=document.getElementById('invoiceClientSearch')?.dataset.id||raw.client;
    delete payload._vals;
    delete payload.status;
    delete payload.issue_date;
    if(clientId)payload.client=clientId;
    const button=document.querySelector('#create-invoice .invoice-form-actions .btn');
    if(button)button.disabled=true;
    try{
      await ApiClient.updateInvoice(raw.id,payload);
      showToast('تم حفظ تعديلات الفاتورة');
      setTimeout(()=>location.assign('invoices.html'),350);
    }catch(error){showToast(error?.data?.detail||error?.message||'تعذر حفظ تعديلات الفاتورة');}
    finally{if(button)button.disabled=false;}
  }
  function installInvoiceEdit(){
    const id=new URLSearchParams(location.search).get('edit');
    if(!id||document.body.dataset.page!=='create-invoice')return;
    const originalSave=window.invoiceUxSave;
    if(typeof originalSave==='function')window.invoiceUxSave=function(send){return window.invoiceEditRaw?saveInvoiceEdit():originalSave.call(this,send);};
    const loadRequestedInvoice=async()=>{
      try{
        const raw=await ApiClient.fetchInvoice(id);
        if(!raw?.id)throw new Error('Invoice response is empty');
        populateInvoiceEditor(raw);
      }catch(error){
        console.error('Invoice edit load failed',error);
        showToast(error?.data?.detail||'تعذر تحميل الفاتورة للتعديل');
      }
    };
    if(window.backendDataReady)loadRequestedInvoice();
    else window.addEventListener('backend-data-ready',loadRequestedInvoice,{once:true});
  }
  window.addEventListener('load',installInvoiceEdit);
})();
