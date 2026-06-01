const canvas = document.querySelector('#shader');
const ctx = canvas.getContext('2d', { alpha: true });
const gate = document.querySelector('#gate');
const sound = document.querySelector('#sound');
const music = document.querySelector('#music');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let started = false;
let muted = false;
let width = 0;
let height = 0;
let dpr = 1;
let lastFrame = 0;
let tick = 0;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw(now = 0) {
  if (reduceMotion) return;

  if (now - lastFrame < 42) {
    requestAnimationFrame(draw);
    return;
  }

  lastFrame = now;
  tick += 0.012;
  ctx.clearRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(255, 212, 90, 0.08)');
  gradient.addColorStop(0.52, 'rgba(255, 179, 44, 0.06)');
  gradient.addColorStop(1, 'rgba(255, 236, 153, 0.055)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let line = 0; line < 5; line += 1) {
    ctx.beginPath();
    for (let x = 0; x <= width; x += 36) {
      const y = height * (0.18 + line * 0.15) + Math.sin(x * 0.008 + tick * (1.2 + line * 0.18)) * (18 + line * 6);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255, ${205 - line * 10}, 82, ${0.025 + line * 0.006})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = 0; i < 16; i += 1) {
    const x = (Math.sin(tick + i * 8.21) * 0.5 + 0.5) * width;
    const y = (Math.cos(tick * 0.7 + i * 5.13) * 0.5 + 0.5) * height;
    const radius = 1.5 + ((i * 11) % 10);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 212, 90, 0.11)' : 'rgba(255, 236, 153, 0.075)';
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

async function playMusic() {
  try {
    music.volume = 0.55;
    music.muted = muted;
    await music.play();
    sound.classList.toggle('is-muted', muted);
    sound.setAttribute('aria-pressed', String(!muted));
  } catch (_error) {
    sound.classList.add('is-muted');
    sound.setAttribute('aria-pressed', 'false');
  }
}

function enter() {
  if (started) return;
  started = true;
  gate.classList.add('is-hidden');
  playMusic();
}

gate.addEventListener('click', enter);
gate.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') enter();
});

sound.addEventListener('click', () => {
  if (!started) enter();

  muted = !muted;
  music.muted = muted;
  sound.classList.toggle('is-muted', muted);
  sound.setAttribute('aria-pressed', String(!muted));
});

window.addEventListener('pointermove', (event) => {
  document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
  document.documentElement.style.setProperty('--my', `${event.clientY}px`);
});

window.addEventListener('resize', resize);
resize();
requestAnimationFrame(draw);
