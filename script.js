/* ===== Year ===== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Sidebar ===== */
const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('scrim');
const openBtn = document.getElementById('openSidebar');
const closeBtn = document.getElementById('closeSidebar');

function openSide(){ sidebar.classList.add('open'); scrim.classList.add('show'); sidebar.setAttribute('aria-hidden', 'false'); }
function closeSide(){ sidebar.classList.remove('open'); scrim.classList.remove('show'); sidebar.setAttribute('aria-hidden', 'true'); }

openBtn?.addEventListener('click', openSide);
closeBtn?.addEventListener('click', closeSide);
scrim?.addEventListener('click', closeSide);
sidebar?.addEventListener('click', e => { if (e.target.matches('.side-links a')) closeSide(); });

/* ===== Scroll progress ===== */
const progress = document.getElementById('progress');
function setProgress(){
  const scrolled = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = ((scrolled/height)*100) + '%';
}
addEventListener('scroll', setProgress, {passive:true}); setProgress();

/* ===== Reveal on scroll ===== */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('show'); });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

/* ===== Typewriter ===== */
const typewriterEl = document.querySelector('.typewriter');
if (typewriterEl){
  const lines = [
    "Frontend Developer & UI Engineer",
    "I build fast, accessible interfaces",
    "Beautiful details. Real impact."
  ];
  let i=0, j=0, del=false;
  (function tick(){
    const full = lines[i];
    typewriterEl.textContent = del ? full.slice(0, j--) : full.slice(0, j++);
    if(!del && j === full.length+1){ del = true; return setTimeout(tick, 1100); }
    if(del && j === 0){ del = false; i = (i+1)%lines.length; }
    setTimeout(tick, del ? 36 : 60);
  })();
}

/* ===== Particles background (lightweight) ===== */
(function particles(){
  const c = document.getElementById('particles');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w, h, dots = [];
  function resize(){ w = c.width = innerWidth; h = c.height = document.querySelector('.hero').offsetHeight; }
  addEventListener('resize', resize); resize();

  const COUNT = Math.min(130, Math.floor(w/12));
  function init(){
    dots = Array.from({length: COUNT}).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      vx: (Math.random()-0.5)*0.35,
      vy: (Math.random()-0.5)*0.35,
      r: Math.random()*1.6+0.3
    }));
  }
  init();

  function step(){
    ctx.clearRect(0,0,w,h);
    const themeDark = document.documentElement.getAttribute('data-theme') !== 'light';
    ctx.fillStyle = themeDark ? '#7bf0b0' : '#179b6b';
    for(const d of dots){
      d.x += d.vx; d.y += d.vy;
      if(d.x<0||d.x>w) d.vx*=-1;
      if(d.y<0||d.y>h) d.vy*=-1;
      ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
    }
    // lines
    ctx.strokeStyle = themeDark ? 'rgba(123,240,176,.08)' : 'rgba(23,155,107,.10)';
    for(let i=0;i<dots.length;i++){
      for(let j=i+1;j<dots.length;j++){
        const a = dots[i], b = dots[j];
        const dx=a.x-b.x, dy=a.y-b.y, dist = Math.hypot(dx,dy);
        if(dist<90){ ctx.globalAlpha = (90-dist)/900; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
      }
    }
    requestAnimationFrame(step);
  }
  step();
})();

/* ===== Dark/Light toggle (saved) ===== */
const root = document.documentElement;
const toggleBtn = document.getElementById('toggleTheme');
const saved = localStorage.getItem('theme');
if (saved) root.setAttribute('data-theme', saved);
toggleBtn.textContent = (root.getAttribute('data-theme') === 'light') ? '🌓' : '☀';

toggleBtn?.addEventListener('click', () => {
  const isLight = root.getAttribute('data-theme') === 'light';
  root.setAttribute('data-theme', isLight ? 'dark' : 'light');
  localStorage.setItem('theme', isLight ? 'dark' : 'light');
  toggleBtn.textContent = isLight ? '☀' : '🌓';
});

/* ===== 3D Tilt + Shine on project cards ===== */
document.querySelectorAll('.tilt').forEach(card=>{
  const shine = card.querySelector('.shine');
  const strength = 12; // tilt degrees
  function move(e){
    const b = card.getBoundingClientRect();
    const px = (e.clientX - b.left) / b.width;
    const py = (e.clientY - b.top) / b.height;
    const rx = (py - 0.5) * -2 * strength;
    const ry = (px - 0.5) *  2 * strength;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    if(shine){
      shine.style.setProperty('--mx', (px*100) + '%');
    }
  }
  function leave(){
    card.style.transform = '';
  }
  card.addEventListener('mousemove', move);
  card.addEventListener('mouseleave', leave);
});

/* ===== Smooth scroll for same-page links ===== */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

/* ===== Contact Form (EmailJS-ready) ===== */
const form = document.getElementById('contactForm');
form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const status = document.getElementById('formStatus');
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if(!name || !email || !message){
    status.textContent = "Please fill out all fields.";
    status.style.color = "#ff6b6b";
    return;
  }

  // 🔒 Default: client-only success (no backend)
  status.textContent = "✅ Message sent! I’ll reply shortly.";
  status.style.color = "#17c964";
  form.reset();

  /* ✅ To send real emails with EmailJS:
  1) Uncomment the <script> tag in index.html
  2) emailjs.init("YOUR_PUBLIC_KEY");
  3) Replace SERVICE_ID and TEMPLATE_ID below
  */
  /*
  try {
    emailjs.init("YOUR_PUBLIC_KEY");
    await emailjs.send("SERVICE_ID","TEMPLATE_ID",{
      from_name: name,
      from_email: email,
      message: message
    });
    status.textContent = "✅ Message sent! I’ll reply shortly.";
    status.style.color = "#17c964";
    form.reset();
  } catch(err){
    status.textContent = "❌ Could not send. Please try again later.";
    status.style.color = "#ff6b6b";
  }
  */
});