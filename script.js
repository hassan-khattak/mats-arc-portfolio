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

const gameData = {
  void: { title:'VOID RUNNERS', genre:'Cyberpunk Action / Racing', image:'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85', description:'Burn through a neon megacity where every shortcut is a gamble. Build your ride, recruit a crew, and outrun the corporations hunting you.' },
  mythic: { title:'MYTHIC LEGENDS', genre:'Fantasy Action RPG', image:'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=85', description:'Awaken ancient powers and cross a fractured realm shaped by your choices. Every ruin hides a story—and every legend demands a price.' },
  rival: { title:'ARC RIVAL', genre:'Sci-Fi Hero Shooter', image:'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=85', description:'Choose your fighter, master kinetic abilities, and reshape the arena in a fast team shooter designed around bold plays and sharper rivalries.' },
  chrono: { title:'CHRONO KNIGHT', genre:'Steampunk Adventure', image:'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=85', description:'Bend time inside a clockwork empire. Solve impossible machinery, duel mechanical guardians, and rewrite the moment that ended the world.' }
};
const modal = document.querySelector('#gameModal');
document.querySelectorAll('[data-game]').forEach((button, index) => button.addEventListener('click', () => {
  const game = gameData[button.dataset.game];
  modal.querySelector('img').src = game.image; modal.querySelector('img').alt = game.title;
  modal.querySelector('h2').textContent = game.title; modal.querySelector('.modal-genre').textContent = game.genre;
  modal.querySelector('.modal-description').textContent = game.description;
  modal.querySelector('.modal-index').textContent = `FILE // 0${index + 1}`;
  modal.showModal();
}));
modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

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
