let actionLogEntries = [];
let actionFilter = '';

const ACTION_LABELS = {
  client_created: 'إنشاء عميل',
  client_updated: 'تعديل عميل',
  client_deleted: 'حذف عميل',
  user_created: 'إنشاء مستخدم',
  user_updated: 'تعديل مستخدم',
  user_deleted: 'حذف مستخدم',
  invoice_created: 'إنشاء فاتورة',
  invoice_updated: 'تعديل فاتورة',
  invoice_deleted: 'حذف فاتورة',
  user_deleted: 'حذف مستخدم',
  product_updated: 'تعديل منتج',
  product_deleted: 'حذف منتج',
  client_certificate_uploaded: 'رفع شهادة عميل',
  product_created: 'إنشاء منتج',
  tenant_created: 'إنشاء شركة',
  account_registered: 'تسجيل حساب'
};

function formatLogDate(value, part){
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  const locale = document.body.classList.contains('en') ? 'en-US' : 'ar-SA';
  return part === 'time'
    ? date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString(locale, { year: 'numeric', month: '2-digit', day: '2-digit' });
}
function getLogDetails(log){
  if (log.details_data && typeof log.details_data === 'object') return log.details_data;
  try { return JSON.parse(log.details || '{}'); } catch { return {}; }
}
function actionTarget(log, details){
  const typeLabels = {invoice:'فاتورة',user:'مستخدم',client:'عميل',product:'منتج',tenant:'شركة',creditnote:'إشعار دائن',debitnote:'إشعار مدين'};
  const type = log.target_type || details.target_type || '';
  const label = log.target_label || details.target_label || details.client_name || details.user_email || details.invoice_number || details.product_name || details.tenant_name || '';
  if(type === 'client' && label) return label;
  return [typeLabels[type] || type, label].filter(Boolean).join(' — ') || '-';
}
function actionTargetHtml(log, details){
  const type = log.target_type || details.target_type || '';
  const label = log.target_label || details.target_label || details.invoice_number || '';
  if(type === 'invoice' && label){
    return `<button type="button" class="invoice-number-copy" data-copy-hint="اضغط للنسخ" title="اضغط للنسخ" aria-label="نسخ رقم الفاتورة ${escHtml(label)}" onclick="copyInvoice('${escHtml(label)}',this)"><span>${escHtml(label)}</span><i class="fa-regular fa-copy" aria-hidden="true"></i></button>`;
  }
  return escHtml(actionTarget(log, details));
}
function actionDetails(details){
  const parts = [];
  if(details.city) parts.push(`المدينة: ${details.city}`);
  if(details.status) parts.push(`الحالة: ${details.status}`);
  if(details.role) parts.push(`الدور: ${details.role}`);
  if(details.package) parts.push(`الباقة: ${details.package}`);
  if(details.max_users) parts.push(`حد المستخدمين: ${details.max_users}`);
  return parts.join(' - ') || '-';
}
function setActionFilter(value){
  actionFilter = value;
  renderActionLogs();
}
function renderActionLogs(){
  const rows = document.getElementById('actionLogRows');
  const count = document.getElementById('actionLogCount');
  const term = (document.getElementById('actionSearch')?.value || '').trim().toLowerCase();
  const filtered = actionLogEntries.filter(log => {
    const details = getLogDetails(log);
    const action = log.action || '';
    if(actionFilter && !action.startsWith(actionFilter)) return false;
    const text = [action, ACTION_LABELS[action], actionTarget(log, details), actionDetails(details), details.created_by, details.updated_by, details.deleted_by, log.actor_email].join(' ').toLowerCase();
    return !term || text.includes(term);
  });
  count.textContent = filtered.length;
  if (!filtered.length) {
    rows.innerHTML = '<tr><td colspan="6">لا يوجد إجراءات حتى الآن</td></tr>';
    return;
  }
  rows.innerHTML = filtered.map(log => {
    const details = getLogDetails(log);
    const actor = log.actor_email || details.actor_email || details.created_by || details.updated_by || details.deleted_by || log.user_email || log.user?.email || '-';
    return `<tr>
      <td>${escHtml(ACTION_LABELS[log.action] || log.action || '-')}</td>
      <td>${actionTargetHtml(log, details)}</td>
      <td>${escHtml(actor)}</td>
      <td>${escHtml(formatLogDate(log.created_at, 'date'))}</td>
      <td>${escHtml(formatLogDate(log.created_at, 'time'))}</td>
      <td>${escHtml(actionDetails(details))}</td>
    </tr>`;
  }).join('');
}
document.addEventListener('DOMContentLoaded', async () => {
  const hasToken = await API_CONFIG.ensureToken();
  if (!hasToken) return;
  try {
    actionLogEntries = await ApiClient.fetchAuditLogs();
    renderActionLogs();
  } catch (err) {
    document.getElementById('actionLogCount').textContent = '0';
    document.getElementById('actionLogRows').innerHTML = '<tr><td colspan="6">لا تملك صلاحية عرض سجل الإجراءات</td></tr>';
  }
});
