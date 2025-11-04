
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href.length > 1) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({behavior:'smooth'});
    }
  });
});

// Render timeline
async function renderTimeline() {
  const res = await fetch('assets/data/timeline.json');
  const items = await res.json();
  const wrap = document.querySelector('#timeline');
  items.forEach(it => {
    const m = document.createElement('div');
    m.className = 'milestone card';
    m.innerHTML = `<div><small class='mono'>${it.year} • ${it.region}</small><p style="margin:.3rem 0 0">${it.text}</p></div>`;
    wrap.appendChild(m);
  });
}
renderTimeline();

// Lightweight "Use of Funds" donut chart (canvas)
function donut(el, data) {
  const total = Object.values(data).reduce((a,b)=>a+b,0);
  const canvas = document.getElementById(el);
  const ctx = canvas.getContext('2d');
  const cx = canvas.width/2, cy = canvas.height/2, r = Math.min(cx, cy) - 4;
  let start = -Math.PI/2;
  const colors = ['#4DFFB0','#9D7FEA','#8AE3FF','#FFD166','#EF476F'];
  let i = 0;
  for (const [label, value] of Object.entries(data)) {
    const angle = (value/total) * Math.PI*2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, start + angle);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    start += angle;
    i++;
  }
  // inner cutout
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx, cy, r*0.58, 0, Math.PI*2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
}
donut('uof', {
  "Fleet + Network + DSS": 1.45, // illustrative midpoint of WG vs UVify packages
  "Facilities & Grounds": 0.25,
  "Working Capital": 0.32,
  "Marketing": 0.18,
  "Tools & Spares": 0.08
});

// Copy-to-clipboard helper for repo commands
function copyText(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.innerText.trim());
  el.innerText = 'Copied ✔';
  setTimeout(()=>{ el.innerText='Copy'; }, 1300);
}
