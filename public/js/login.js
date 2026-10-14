let lang = localStorage.getItem('takharuj_lang') || 'ar';
let resetUid = '';
let resetToken = '';
function tx(ar,en){return lang === 'ar' ? ar : en}
function applyLang(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.body.classList.toggle('en', lang === 'en');
  document.querySelectorAll('[data-ar][data-en]').forEach(el => el.textContent = tx(el.dataset.ar, el.dataset.en));
  document.querySelector('.lang').textContent = lang === 'ar' ? 'English' : 'العربية';
}
function toggleLang(){lang = lang === 'ar' ? 'en' : 'ar';localStorage.setItem('takharuj_lang', lang);applyLang();}
function showMsg(message,type){const el=document.getElementById('msg');el.textContent=message;el.className=`msg ${type}`;}
function switchForm(type, clear=true){ if(clear)msg.className='msg'; }
function normalizeEmail(value){const trimmed=value.trim();return trimmed.toLowerCase()==='admin'?'admin@example.com':trimmed;}
function togglePass(id,btn){const input=document.getElementById(id);input.type=input.type==='password'?'text':'password';btn.textContent=input.type==='password'?tx('إظهار','Show'):tx('إخفاء','Hide');}
async function login(event){
  event.preventDefault();
  loginBtn.disabled=true;loginBtn.textContent=tx('جاري الدخول...','Signing in...');
  const result=await ApiClient.login(normalizeEmail(email.value),password.value,remember.checked);
  if(result.success){showMsg(tx('تم تسجيل الدخول بنجاح.','Signed in successfully.'),'ok');setTimeout(()=>location.href=API_CONFIG.pageUrl('index.html'),500);}
  else{showMsg(tx('بيانات الدخول غير صحيحة.','Incorrect login details.'),'err');loginBtn.disabled=false;loginBtn.textContent=tx('تسجيل الدخول','Sign in');}
}
function openReset(){resetModal.classList.add('open');resetIdentity.value=email.value.trim();showResetStep(1);}
function closeReset(){resetModal.classList.remove('open');resetUid='';resetToken='';resetCodeInput.value='';newResetPassword.value='';confirmResetPassword.value='';demoCodeBox.classList.remove('show');demoCodeBox.textContent='';}
function showResetStep(step){[1,2,3].forEach(n=>document.getElementById('resetStep'+n).classList.toggle('active',n===step));}
async function sendResetCode(){
  const identity=resetIdentity.value.trim();
  if(!identity)return alert(tx('يرجى إدخال البريد الإلكتروني.','Enter your email.'));
  sendResetBtn.disabled=true;sendResetBtn.textContent=tx('جاري الإرسال...','Sending...');
  const result=await ApiClient.requestPasswordReset(identity);
  sendResetBtn.disabled=false;sendResetBtn.textContent=tx('إرسال رمز الاستعادة','Send recovery code');
  if(!result.success)return alert(result.error || tx('تعذر إرسال الرمز.','Could not send code.'));
  alert(tx('إذا كان الحساب موجودًا، ستصل رسالة الاستعادة إلى البريد المسجل.','If the account exists, recovery instructions will be emailed.'));
  closeReset();
}
function verifyResetCode(){
  if(resetCodeInput.value.trim()!==resetToken)return alert(tx('رمز الاستعادة غير صحيح.','Incorrect recovery code.'));
  showResetStep(3);
}
async function saveNewPassword(){
  const p1=newResetPassword.value,p2=confirmResetPassword.value;
  if(p1.length<6)return alert(tx('يجب أن تكون كلمة المرور 6 أحرف على الأقل.','Password must be at least 6 characters.'));
  if(p1!==p2)return alert(tx('كلمتا المرور غير متطابقتين.','Passwords do not match.'));
  saveResetBtn.disabled=true;saveResetBtn.textContent=tx('جاري الحفظ...','Saving...');
  const result=await ApiClient.resetPassword(resetUid,resetToken,p1);
  saveResetBtn.disabled=false;saveResetBtn.textContent=tx('حفظ كلمة المرور','Save password');
  if(result.success){const loginEmail=resetIdentity.value.trim();closeReset();email.value=loginEmail;password.value='';switchForm('login',false);showMsg(tx('تم تغيير كلمة المرور. يمكن تسجيل الدخول الآن.','Password changed. You can sign in now.'),'ok');}
  else alert(result.error || tx('تعذر تغيير كلمة المرور.','Could not reset password.'));
}
if(localStorage.getItem('auth_token')){
  API_CONFIG.clearToken();
  showMsg(tx('تم إنهاء الجلسة السابقة. سجّل الدخول بالحساب المطلوب.','Previous session cleared. Sign in with the account you want.'),'ok');
}
const params=new URLSearchParams(location.search);
resetUid=params.get('uid')||'';
resetToken=params.get('token')||'';
if(params.get('reset')==='1'||(resetUid&&resetToken)){
  setTimeout(()=>{openReset();if(resetUid&&resetToken)showResetStep(3);},0);
}
applyLang();

function enterDemo(){
  API_CONFIG.clearToken();
  sessionStorage.setItem('takharuj_demo_preview','1');
  location.href=API_CONFIG.pageUrl('index.html');
}
