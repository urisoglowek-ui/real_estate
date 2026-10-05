/* Shared: nav + footer strings, language switching, nav behaviour.
   Page-specific strings live in window.__T (data-i18n="index");
   shared strings below use data-s="key". */
(function(){
 var S={
  he:{about:'אודות',blog:'בלוג',course:'הקורס',home:'הבית',services:'השירותים',deals:'העסקאות',tools:'המחשבונים',reports:'הדוחות',books:'הספרים',sm:'כסף חכם',mentorship:'הליווי',contact:'צרו קשר',menu:'תפריט',
      sig:'להיות הכי טוב — אצל אחרים זו שאיפה. <span>אצלנו זו ירושה.</span>',name:'אורי זוגלובק',disclaimer:'הכלים חינוכיים ואינם ייעוץ פיננסי, משפטי או מיסויי'},
  en:{about:'About',blog:'Blog',course:'The Course',home:'Home',services:'Services',deals:'Our Deals',tools:'Calculators',reports:'Reports',books:'The Books',sm:'Smart Money',mentorship:'Mentorship',contact:'Contact us',menu:'Menu',
      sig:'Being the best — for others, an aspiration. <span>For us, an inheritance.</span>',name:'Uri Soglowek',disclaimer:'Educational tools only — not financial, legal or tax advice'},
  es:{about:'Sobre mí',blog:'Blog',course:'El curso',home:'Inicio',services:'Servicios',deals:'Operaciones',tools:'Calculadoras',reports:'Informes',books:'Los Libros',sm:'Dinero Inteligente',mentorship:'Mentoría',contact:'Contáctanos',menu:'Menú',
      sig:'Ser los mejores — para otros, una aspiración. <span>Para nosotros, una herencia.</span>',name:'Uri Soglowek',disclaimer:'Herramientas educativas — no constituyen asesoría financiera, legal o fiscal'}
 };
 var T=window.__T||{};
 function apply(lang, persist){
  if(!S[lang]) lang='he';
  document.documentElement.lang=lang;
  document.documentElement.dir = lang==='he' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var i=+el.getAttribute('data-i18n');
    if(T[lang]&&T[lang][i]!==undefined) el.innerHTML=T[lang][i];
  });
  document.querySelectorAll('[data-s]').forEach(function(el){
    var v=S[lang][el.getAttribute('data-s')]; if(v!==undefined) el.innerHTML=v;
  });
  document.querySelectorAll('.lang').forEach(function(b){var on=b.dataset.lang===lang;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});
  if(persist!==false){try{localStorage.setItem('lang',lang)}catch(e){}}
  window.__lang=lang;
  if(window.calc){try{calc()}catch(e){}}
 }
 document.querySelectorAll('.lang').forEach(function(b){b.addEventListener('click',function(){apply(b.dataset.lang)})});
 var lock=document.documentElement.getAttribute('data-lang-lock');
 var saved=null; try{saved=localStorage.getItem('lang')}catch(e){}
 if(!saved){
   var nl=(navigator.languages&&navigator.languages.length?navigator.languages[0]:navigator.language||'he').toLowerCase();
   if(nl.indexOf('he')===0||nl.indexOf('iw')===0) saved='he';
   else if(nl.indexOf('es')===0) saved='es';
   else saved='en';
 }
 window.__applyLang=apply;
 if(lock&&S[lock]) apply(lock, false);
 else apply(saved);

 var nav=document.getElementById('nav'),btn=document.getElementById('menubtn');
 if(nav){
  var s=function(){nav.classList.toggle('solid',scrollY>40)}; s(); addEventListener('scroll',s,{passive:true});
  btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  document.querySelectorAll('#links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.setAttribute('aria-expanded',false)})});
 }
 var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
})();
