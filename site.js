/* Shared: nav + footer strings, language switching, nav behaviour.
   Page-specific strings live in window.__T (data-i18n="index");
   shared strings below use data-s="key". */
(function(){
 var S={
  he:{about:'אודות',blog:'בלוג',home:'הבית',services:'השירותים',deals:'העסקאות',tools:'המחשבונים',reports:'הדוחות',books:'הספרים',sm:'כסף חכם',mentorship:'הליווי',contact:'צרו קשר',menu:'תפריט',
      sig:'להיות הכי טוב — אצל אחרים זו שאיפה. <span>אצלנו זו ירושה.</span>',name:'אורי זוגלובק',disclaimer:'הכלים חינוכיים ואינם ייעוץ פיננסי, משפטי או מיסויי'},
  en:{about:'About',blog:'Blog',home:'Home',services:'Services',deals:'Our Deals',tools:'Calculators',reports:'Reports',books:'The Books',sm:'Smart Money',mentorship:'Mentorship',contact:'Contact us',menu:'Menu',
      sig:'Being the best — for others, an aspiration. <span>For us, an inheritance.</span>',name:'Uri Soglowek',disclaimer:'Educational tools only — not financial, legal or tax advice'},
  es:{about:'Sobre mí',blog:'Blog',home:'Inicio',services:'Servicios',deals:'Operaciones',tools:'Calculadoras',reports:'Informes',books:'Los Libros',sm:'Dinero Inteligente',mentorship:'Mentoría',contact:'Contáctanos',menu:'Menú',
      sig:'Ser los mejores — para otros, una aspiración. <span>Para nosotros, una herencia.</span>',name:'Uri Soglowek',disclaimer:'Herramientas educativas — no constituyen asesoría financiera, legal o fiscal'}
 };
 var T=window.__T||{};
 var LOCK=window.__LOCK;   // a page written in one language only (e.g. an English investor brief)
 if(LOCK) document.querySelectorAll('.langs').forEach(function(e){e.remove()});
 function apply(lang){
  if(LOCK) lang=LOCK;
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
  if(!LOCK){ try{localStorage.setItem('lang',lang)}catch(e){} }
  window.__lang=lang;
  if(window.calc){try{calc()}catch(e){}}
 }
 document.querySelectorAll('.lang').forEach(function(b){b.addEventListener('click',function(){apply(b.dataset.lang)})});
 var saved=null; try{saved=localStorage.getItem('lang')}catch(e){}
 if(!saved){
   var nl=(navigator.languages&&navigator.languages.length?navigator.languages[0]:navigator.language||'he').toLowerCase();
   if(nl.indexOf('he')===0||nl.indexOf('iw')===0) saved='he';
   else if(nl.indexOf('es')===0) saved='es';
   else saved='en';
 }
 window.__applyLang=apply; apply(saved);

 var nav=document.getElementById('nav'),btn=document.getElementById('menubtn');
 if(nav){
  var s=function(){nav.classList.toggle('solid',scrollY>40)}; s(); addEventListener('scroll',s,{passive:true});
  btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
  document.querySelectorAll('#links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');btn.setAttribute('aria-expanded',false)})});
 }
 var yr=document.getElementById('yr'); if(yr) yr.textContent=new Date().getFullYear();
})();

/* Scroll reveal: blocks rise into place as they enter the screen — the same motion as the page-load text.
   Groups (grids and lists) reveal their items one after another. Off for reduced motion; content stays
   visible if this script never runs. */
(function(){
 if(!('IntersectionObserver' in window)) return;
 if(document.documentElement.hasAttribute('data-own-reveal')) return;   // page runs its own reveal
 if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 var GROUPS='.chain,.principles,.rows,.dgrid,.steps,.steps4,.split,.kpis,.chips,.industry,.growth-row,.page .grid,.fgrid';
 var BLOCKS=['main section .h2','main section h2','.lede','.letter .side > *','.letter .body > *','.contact > *',
  '.chapter','.story-close','.statement','.cta-line','.legal','.prose > *','.post-foot .wrap > *','.note',
  '.roadsign','.buycta','.alerts','.signup > *','.page section > *','.chart-card','.feature a'].join(',');
 var skip=function(el){ return el.closest('header,.hero,.phero,.rise,.nav,#scgate,.gate'); };
 var targets=[], set=new Set();
 var inside=function(el){ for(var p=el.parentElement;p;p=p.parentElement){ if(set.has(p)) return true; } return false; };
 document.querySelectorAll(GROUPS).forEach(function(g){
  if(skip(g)||inside(g)) return;                              // a group inside an animated block moves with it
  [].forEach.call(g.children,function(c,i){ c.style.transitionDelay=(i%6)*90+'ms'; targets.push(c); set.add(c); });
 });
 document.querySelectorAll(BLOCKS).forEach(function(el){
  if(skip(el)||set.has(el)) return;
  if(el.matches(GROUPS)||el.querySelector(GROUPS)) return;   // its items animate on their own
  if(inside(el)) return;
  set.add(el); targets.push(el);
 });
 if(!targets.length) return;
 document.documentElement.classList.add('rv-on');
 var io=new IntersectionObserver(function(entries){
  entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
 },{rootMargin:'0px 0px -8% 0px',threshold:0.08});
 targets.forEach(function(t){ t.classList.add('rv'); io.observe(t); });
 // at the very bottom of the page, show whatever is left (short blocks can sit below the trigger line)
 var end=function(){ if(innerHeight+scrollY>=document.documentElement.scrollHeight-4){
  targets.forEach(function(t){ t.classList.add('in'); }); removeEventListener('scroll',end); } };
 addEventListener('scroll',end,{passive:true});
})();
