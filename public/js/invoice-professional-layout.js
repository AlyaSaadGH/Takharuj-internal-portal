(function(){
  if(document.body.dataset.page!=='create-invoice')return;
  const wrap=document.querySelector('#create-invoice .invoice-preview-wrap');
  if(!wrap||wrap.querySelector('.invoice-preview-shell-head'))return;
  const head=document.createElement('div');
  head.className='invoice-preview-shell-head';
  head.innerHTML=`<div class="invoice-preview-live"><i></i><div>معاينة مباشرة<small>تتحدث تلقائياً أثناء الإدخال</small></div></div>`;
  wrap.prepend(head);
})();
