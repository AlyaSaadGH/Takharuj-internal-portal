(function(){
  if(document.body.dataset.page!=='create-invoice'||typeof window.invoiceUxSave!=='function')return;
  const persistInvoice=window.invoiceUxSave;
  document.body.insertAdjacentHTML('beforeend',`<div class="zatca-confirm-overlay" id="zatcaConfirmOverlay" role="dialog" aria-modal="true" aria-labelledby="zatcaConfirmTitle"><div class="zatca-confirm-dialog"><div class="zatca-confirm-icon"><i class="fa-solid fa-triangle-exclamation"></i></div><h3 id="zatcaConfirmTitle">تأكيد إصدار الفاتورة</h3><p>هل أنت مقتنع ببيانات الفاتورة وتود إصدارها وإرسالها رسمياً لهيئة الزكاة والضريبة والجمارك؟</p><p class="zatca-confirm-warning">تنبيه: لا يمكن تعديل الفاتورة أو حذفها بعد الإصدار.</p><div class="zatca-confirm-actions"><button type="button" class="btn ghost" onclick="closeZatcaConfirmation()">إلغاء</button><button type="button" class="btn confirm" id="zatcaFinalConfirm" onclick="confirmZatcaIssue()"><i class="fa-solid fa-shield-halved"></i> نعم، تأكيد الإصدار والإرسال</button></div></div></div>`);
  const overlay=document.getElementById('zatcaConfirmOverlay');
  function open(){overlay.classList.add('open');document.body.style.overflow='hidden';setTimeout(()=>document.getElementById('zatcaFinalConfirm')?.focus(),40)}
  function close(){overlay.classList.remove('open');document.body.style.overflow=''}
  window.invoiceUxSave=function(send){
    if(send){open();return Promise.resolve(false)}
    return persistInvoice(false);
  };
  window.closeZatcaConfirmation=close;
  window.confirmZatcaIssue=async function(){
    const button=document.getElementById('zatcaFinalConfirm');
    if(button.disabled)return;
    button.disabled=true;
    close();
    try{return await persistInvoice(true)}
    finally{button.disabled=false}
  };
  overlay.addEventListener('click',event=>{if(event.target===overlay)close()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&overlay.classList.contains('open'))close()});
})();
