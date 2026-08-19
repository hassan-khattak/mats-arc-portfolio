const canvas = document.querySelector('#particle-canvas');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let points = [];

function resize() {
  const ratio = Math.min(devicePixelRatio, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  points = Array.from({ length: Math.min(55, Math.floor(innerWidth / 20)) }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    radius: Math.random() + .25,
    speed: Math.random() * .12 + .03
  }));
}

function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  points.forEach(point => {
    point.y -= point.speed;
    if (point.y < 0) point.y = innerHeight;
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(84,232,255,.35)';
    ctx.fill();
  });
  if (!reducedMotion) requestAnimationFrame(draw);
}

function updateProgress() {
  const available = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.scroll-progress').style.width = `${available > 0 ? scrollY / available * 100 : 0}%`;
}

resize();
draw();
addEventListener('resize', resize, { passive: true });
addEventListener('scroll', updateProgress, { passive: true });
