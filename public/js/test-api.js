// تحقق من الاتصال عند التحميل
    window.addEventListener('DOMContentLoaded', async function() {
      const isConnected = await checkApiConnection();
      const status = document.getElementById('connectionStatus');
      
      if (isConnected) {
        status.innerHTML = '✅ <b>الاتصال سليم!</b> الخادم يعمل على ' + API_CONFIG.base_url;
        status.className = 'status success';
      } else {
        status.innerHTML = '❌ <b>خطأ في الاتصال</b> - تأكد من تشغيل الخادم على http://localhost:8000';
        status.className = 'status error';
      }
    });

    // دالة عرض النتائج
    function showResult(title, data, isError = false) {
      const resultsDiv = document.getElementById('results');
      const resultHTML = `
        <div class="results">
          <h3>${isError ? '❌' : '✅'} ${title}</h3>
          <pre><code>${JSON.stringify(data, null, 2)}</code></pre>
        </div>
      `;
      resultsDiv.innerHTML = resultHTML + resultsDiv.innerHTML;
    }

    // اختبر الاتصال بالـ API
    async function testApiConnection() {
      console.log('⏳ جاري اختبار الاتصال...');
      const isConnected = await checkApiConnection();
      
      if (isConnected) {
        showResult('اختبار الاتصال', { 
          status: 'نجح',
          url: API_CONFIG.base_url,
          message: 'الخادم يستجيب بنجاح'
        });
      } else {
        showResult('اختبار الاتصال', { 
          status: 'فشل',
          url: API_CONFIG.base_url,
          message: 'لا يمكن الوصول للخادم - تأكد من تشغيل Django'
        }, true);
      }
    }

    // جلب العملاء من الباكند
    async function fetchClientsFromAPI() {
      console.log('⏳ جاري جلب العملاء...');
      const clients = await ApiClient.fetchClients();
      
      if (clients && clients.length > 0) {
        showResult('العملاء من الباكند', clients);
      } else if (clients && Array.isArray(clients)) {
        showResult('العملاء من الباكند', { 
          status: 'نجح',
          data: [],
          message: 'لا توجد عملاء حالياً'
        });
      } else {
        showResult('خطأ في جلب العملاء', clients, true);
      }
    }

    // أضف عميل اختبار
    async function createTestClient() {
      const testClient = {
        name: 'عميل اختبار - ' + new Date().getTime(),
        vat_number: '300000000000003',
        city: 'الرياض',
        status: 'active'
      };
      
      console.log('⏳ جاري إضافة عميل اختبار...');
      const result = await ApiClient.createClient(testClient);
      
      showResult('إضافة عميل جديد', result, result.error ? true : false);
    }

    // جلب الفواتير
    async function fetchInvoicesFromAPI() {
      console.log('⏳ جاري جلب الفواتير...');
      const invoices = await ApiClient.fetchInvoices();
      
      if (invoices && invoices.length > 0) {
        showResult('الفواتير من الباكند', invoices);
      } else if (invoices && Array.isArray(invoices)) {
        showResult('الفواتير من الباكند', { 
          status: 'نجح',
          data: [],
          message: 'لا توجد فواتير حالياً'
        });
      } else {
        showResult('خطأ في جلب الفواتير', invoices, true);
      }
    }

    // اذهب للتوثيق
    function viewSwagger() {
      window.open('http://localhost:8000/api/docs/', '_blank');
    }
