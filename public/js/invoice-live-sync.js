(function(){
  if(document.body.dataset.page!=='create-invoice')return;
  const root=document.getElementById('create-invoice');
  if(!root)return;
  const state=window.invoiceLiveState={type:typeof invoiceType==='undefined'?'standard':invoiceType,fields:{},items:[],totals:{subtotal:0,vat:0,total:0}};
  const tracked=['seller','buyer','vat','buyerVat','buyerCity','buyerStreet','buyerBuilding','buyerDistrict','buyerPostal'];
  function capture(){
    tracked.forEach(id=>state.fields[id]=document.getElementById(id)?.value||'');
    state.type=typeof invoiceType==='undefined'?state.type:invoiceType;
    state.items=typeof invoiceItems==='function'?invoiceItems():[];
    const subtotal=state.items.reduce((sum,item)=>sum+(Number(item.line_total)||0),0);
    state.totals={subtotal,vat:subtotal*.15,total:subtotal*1.15};
  }
  function totals(){
    const locale=(typeof lang==='undefined'||lang==='ar')?'ar-SA':'en-US';
    const format=n=>`${Number(n||0).toLocaleString(locale,{minimumFractionDigits:2,maximumFractionDigits:2})} ${(typeof lang==='undefined'||lang==='ar')?'ر.س':'SAR'}`;
    const values={uxSubtotal:state.totals.subtotal,uxVat:state.totals.vat,uxTotal:state.totals.total};
    Object.entries(values).forEach(([id,value])=>{const node=document.getElementById(id);if(node)node.textContent=format(value)});
  }
  function markType(){
    root.querySelectorAll('.invoice-actions button').forEach(button=>{
      const action=button.getAttribute('onclick')||'';
      button.classList.toggle('invoice-type-active',action.includes(`setType('${state.type}')`));
    });
    const preview=document.getElementById('preview');if(preview)preview.dataset.invoiceType=state.type;
  }
  function sync(){
    capture();
    if(typeof refreshPreview==='function')refreshPreview();
    totals();markType();
  }
  root.addEventListener('input',event=>{if(event.target.matches('input,textarea,select'))sync()},true);
  root.addEventListener('change',event=>{if(event.target.matches('input,textarea,select'))sync()},true);
  root.addEventListener('click',event=>{if(event.target.closest('.invoice-actions button,[onclick*="addInvoiceItem"],[onclick*="removeInvoiceItem"]'))setTimeout(sync,0)},true);
  const originalSetType=window.setType;
  window.setType=function(type){state.type=type;if(typeof originalSetType==='function')originalSetType(type);else{invoiceType=type;if(typeof refreshPreview==='function')refreshPreview()}sync()};
  window.printCurrent=function(){
    const preview=document.getElementById('preview'),printArea=document.getElementById('printArea');
    sync();
    if(printArea&&preview)printArea.innerHTML=preview.innerHTML;
    window.print();
  };
  const observer=new MutationObserver(()=>{capture();totals();markType()});
  const items=document.getElementById('invoiceItems');if(items)observer.observe(items,{childList:true});
  document.addEventListener('DOMContentLoaded',sync);
  sync();
})();
