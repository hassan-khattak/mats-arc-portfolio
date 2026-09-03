const canvas = document.querySelector('#particle-canvas');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let particles = [];

function resizeCanvas() {
  const ratio = Math.min(devicePixelRatio, 2);
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  particles = Array.from({ length: Math.min(90, Math.floor(innerWidth / 14)) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    r: Math.random() * 1.4 + .2, speed: Math.random() * .22 + .05,
    alpha: Math.random() * .55 + .15
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of particles) {
    p.y -= p.speed;
    if (p.y < -3) { p.y = innerHeight + 3; p.x = Math.random() * innerWidth; }
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(107, 224, 255, ${p.alpha})`; ctx.fill();
  }
  for (let i = 0; i < particles.length; i += 3) {
    const a = particles[i], b = particles[(i + 7) % particles.length];
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    if (distance < 150) {
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(84,232,255,${(1 - distance / 150) * .08})`; ctx.stroke();
    }
  }
  if (!reducedMotion) requestAnimationFrame(drawParticles);
}

resizeCanvas(); drawParticles();
addEventListener('resize', resizeCanvas, { passive: true });

addEventListener('load', () => setTimeout(() => document.querySelector('.page-loader').classList.add('done'), 350));

const nav = document.querySelector('.navbar');
const topButton = document.querySelector('#scrollTopBtn');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 30);
  topButton.classList.toggle('visible', scrollY > 600);
  document.querySelector('.scroll-progress').style.width = `${scrollY / (document.documentElement.scrollHeight - innerHeight) * 100}%`;
}, { passive: true });
topButton.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

const toggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.addEventListener('click', () => navLinks.classList.remove('open'));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('in-view');
  entry.target.querySelectorAll?.('[data-count]').forEach(counter => {
    const target = Number(counter.dataset.count);
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / 1100, 1);
      counter.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  observer.unobserve(entry.target);
}), { threshold: .14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
  const glow = document.querySelector('.cursor-glow');
  addEventListener('pointermove', e => {
    glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`;
  }, { passive: true });
  document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.transform = `perspective(900px) rotateX(${(r.height / 2 - y) / 35}deg) rotateY(${(x - r.width / 2) / 35}deg)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('pointermove', e => {
      const r = button.getBoundingClientRect();
      button.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.12}px)`;
    });
    button.addEventListener('pointerleave', () => button.style.transform = '');
  });
}

const hero = document.querySelector('.hero-section');
const heroBackdrop = hero.querySelector('.hero-backdrop');
const heroImages = [...heroBackdrop.querySelectorAll('img')];
const heroCaption = hero.querySelector('.scene-caption strong');
const sceneButtons = [...hero.querySelectorAll('[data-scene]')];
const sceneSelector = hero.querySelector('.hero-scenes');
const heroScenes = {
  prime: ['assets/images/mats-arc-hero.webp', 'ARC PRIME'],
  void: ['assets/images/void-runners.webp', 'VOID RUNNERS'],
  mythic: ['assets/images/mythic-legends.webp', 'MYTHIC LEGENDS'],
  rival: ['assets/images/arc-rival.webp', 'ARC RIVAL'],
  chrono: ['assets/images/chrono-knight.webp', 'CHRONO KNIGHT']
};
let activeScene = 0;
let activeHeroLayer = 0;
let sceneTimer;
let sceneSwapTimer;
let transitionId = 0;

async function selectScene(index) {
  if (index === activeScene && heroImages[activeHeroLayer].classList.contains('active')) return;
  activeScene = index;
  const button = sceneButtons[index];
  const [image, label] = heroScenes[button.dataset.scene];
  sceneButtons.forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  const currentTransition = ++transitionId;
  const outgoing = heroImages[activeHeroLayer];
  const nextLayer = activeHeroLayer === 0 ? 1 : 0;
  const incoming = heroImages[nextLayer];
  incoming.src = image;
  try { await incoming.decode(); } catch {}
  if (currentTransition !== transitionId) return;
  clearTimeout(sceneSwapTimer);
  heroCaption.textContent = label;
  hero.dataset.activeScene = button.dataset.scene;
  if (reducedMotion) {
    outgoing.className = '';
    incoming.className = 'active';
    activeHeroLayer = nextLayer;
    return;
  }
  heroBackdrop.classList.remove('changing');
  void heroBackdrop.offsetWidth;
  heroBackdrop.classList.add('changing');
  outgoing.className = 'outgoing';
  incoming.className = 'entering';
  activeHeroLayer = nextLayer;
  sceneSwapTimer = setTimeout(() => {
    outgoing.className = '';
    incoming.className = 'active';
    heroBackdrop.classList.remove('changing');
  }, 900);
}

function startSceneCycle() {
  if (reducedMotion) return;
  clearInterval(sceneTimer);
  sceneTimer = setInterval(() => selectScene((activeScene + 1) % sceneButtons.length), 4000);
}

sceneButtons.forEach((button, index) => button.addEventListener('click', () => {
  selectScene(index);
  startSceneCycle();
}));
sceneSelector.addEventListener('mouseenter', () => clearInterval(sceneTimer));
sceneSelector.addEventListener('mouseleave', startSceneCycle);
sceneSelector.addEventListener('focusin', () => clearInterval(sceneTimer));
sceneSelector.addEventListener('focusout', startSceneCycle);
if (!reducedMotion && matchMedia('(pointer:fine)').matches) hero.addEventListener('pointermove', event => {
  const x = (event.clientX / innerWidth - .5) * -10;
  const y = (event.clientY / innerHeight - .5) * -7;
  heroImages.forEach(image => image.style.translate = `${x}px ${y}px`);
}, { passive:true });
startSceneCycle();
document.addEventListener('visibilitychange', () => {
  if (document.hidden) clearInterval(sceneTimer);
  else startSceneCycle();
});

if (!reducedMotion) setInterval(() => {
  const title = document.querySelector('.hero-title'); title.classList.add('glitch');
  setTimeout(() => title.classList.remove('glitch'), 350);
}, 6500);

const sections = [...document.querySelectorAll('main [id]')];
const links = [...document.querySelectorAll('.nav-links a')];
new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -60%' }).observe(sections[0]);
sections.slice(1).forEach(section => new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', link.hash === `#${entry.target.id}`));
}), { rootMargin: '-35% 0px -60%' }).observe(section));
