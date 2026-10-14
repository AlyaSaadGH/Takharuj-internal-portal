(function(){
  window.dashboardShare=function(id,channel){
    const row=typeof invoiceById==='function'?invoiceById(id):null;
    const number=row?.number||row?.raw?.invoice_number||id;
    const isArabic=typeof lang==='undefined'||lang==='ar';
    const invoiceUrl=new URL(`invoice-detail.html?id=${encodeURIComponent(id)}`,location.href).href;
    const subject=`${isArabic?'فاتورة':'Invoice'} ${number}`;
    const body=isArabic
      ? `مرحباً،\n\nيمكنك معاينة الفاتورة رقم ${number} من الرابط التالي:\n${invoiceUrl}`
      : `Hello,\n\nYou can preview invoice ${number} using this link:\n${invoiceUrl}`;
    const gmail=`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const popup=window.open(gmail,'_blank','noopener,noreferrer');
    if(!popup){
      const link=document.createElement('a');
      link.href=`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      link.click();
    }
  };
})();
