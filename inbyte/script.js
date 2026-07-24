/* ================================================================
   For Issu — a little handmade proposal page
   Vanilla JS only. No external libraries, no external audio files
   (all sound is synthesized with the Web Audio API).
   ================================================================ */

(() => {
  'use strict';

  const stage   = document.getElementById('stage');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ==============================================================
     0. TINY DAISY FACTORY
     ============================================================== */
  let daisyGradId = 0;
  function daisySVG(size) {
    const gid = 'petalGrad' + (daisyGradId++);
    const cid = 'centerGrad' + daisyGradId;
    return `
      <svg viewBox="0 0 40 40" width="${size}" height="${size}">
        <defs>
          <radialGradient id="${gid}" cx="35%" cy="20%" r="85%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="55%" stop-color="#FFF6D7"/>
            <stop offset="100%" stop-color="#f3e3ad"/>
          </radialGradient>
          <radialGradient id="${cid}" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stop-color="#FFE79A"/>
            <stop offset="100%" stop-color="#FFC94A"/>
          </radialGradient>
        </defs>
        <g>
          ${[0,60,120,180,240,300].map((a, i) => `
            <ellipse cx="20" cy="${9 - (i % 2)}" rx="${5.2 + (i % 3) * 0.3}" ry="${9.2 + (i % 2) * 0.6}"
              fill="url(#${gid})" stroke="rgba(91,70,54,.18)" stroke-width="0.5"
              transform="rotate(${a + (i % 2 ? 2 : -2)} 20 20)"/>
          `).join('')}
          <circle cx="20" cy="20" r="5.4" fill="url(#${cid})" stroke="rgba(91,70,54,.15)" stroke-width="0.4"/>
        </g>
      </svg>`;
  }
  function makeDaisy(size) {
    const wrap = document.createElement('div');
    wrap.className = 'daisy';
    wrap.style.setProperty('--sdur', rand(3.5, 5.5).toFixed(2) + 's');
    wrap.style.setProperty('--sdelay', rand(0, 3).toFixed(2) + 's');
    wrap.style.width = size + 'px';
    wrap.style.height = size + 'px';
    wrap.innerHTML = daisySVG(size);
    return wrap;
  }

  function sunflowerSVG(size) {
    const petals = Array.from({ length: 12 }, (_, i) => {
      const a = i * 30;
      return `<ellipse cx="26" cy="10" rx="4.6" ry="10.5" fill="#F6B93B" stroke="rgba(120,70,20,.3)" stroke-width="0.5" transform="rotate(${a} 26 26)"/>`;
    }).join('');
    return `
      <svg viewBox="0 0 52 52" width="${size}" height="${size}">
        <g>${petals}</g>
        <circle cx="26" cy="26" r="8" fill="#7A4A23"/>
        <circle cx="26" cy="26" r="8" fill="url(#sfSeeds)" opacity="0.5"/>
        <defs>
          <radialGradient id="sfSeeds" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stop-color="#a3702f"/>
            <stop offset="100%" stop-color="#5c3416"/>
          </radialGradient>
        </defs>
      </svg>`;
  }

  function makePlant(headSVG, size, stemHeight, { thickStem = false } = {}) {
    const wrap = document.createElement('div');
    wrap.className = 'plant';
    wrap.style.setProperty('--sdur', rand(3.5, 5.5).toFixed(2) + 's');
    wrap.style.setProperty('--sdelay', rand(0, 3).toFixed(2) + 's');
    wrap.style.width = size + 'px';
    wrap.style.height = (size + stemHeight) + 'px';

    const stem = document.createElement('div');
    stem.className = thickStem ? 'plant-stem thick' : 'plant-stem';
    stem.style.height = stemHeight + 'px';

    const head = document.createElement('div');
    head.className = 'plant-head';
    head.style.width = size + 'px';
    head.style.height = size + 'px';
    head.style.bottom = stemHeight + 'px';
    head.innerHTML = headSVG;

    wrap.appendChild(stem);
    wrap.appendChild(head);
    return wrap;
  }

  function scatterDaisies(container, count, sizeRange) {
    for (let i = 0; i < count; i++) {
      const size = Math.round(rand(sizeRange[0], sizeRange[1]));
      const stemHeight = Math.round(rand(10, 46));
      const plant = makePlant(daisySVG(size), size, stemHeight);
      plant.classList.add('daisy-plant');
      plant.style.position = 'absolute';
      plant.style.left = rand(-4, 46) + 'px';
      container.appendChild(plant);
    }
  }

  function scatterMeadow(container, count) {
    for (let i = 0; i < count; i++) {
      const depth = Math.random();
      const size = Math.round(14 + depth * 22);
      const stemHeight = Math.max(4, Math.round(8 + depth * 30 + rand(-4, 4)));
      const plant = makePlant(daisySVG(size), size, stemHeight);
      plant.classList.add('daisy-plant');
      plant.style.position = 'absolute';
      plant.style.left = rand(-3, 97) + '%';
      plant.style.zIndex = String(Math.round(depth * 5));
      plant.style.opacity = String(0.75 + depth * 0.25);
      container.appendChild(plant);
    }
  }

  function makeGrass(size) {
    const wrap = document.createElement('div');
    wrap.className = 'grass';
    wrap.style.setProperty('--sdur', rand(3, 4.5).toFixed(2) + 's');
    wrap.style.setProperty('--sdelay', rand(0, 3).toFixed(2) + 's');
    const blades = [0, 1, 2, 3].map(i => {
      const lean = rand(-9, 9).toFixed(1);
      const h = size * rand(0.8, 1.05);
      return `<path d="M ${10 + i*6} 40 Q ${10 + i*6 + lean*0.4} ${40 - h*0.5} ${10 + i*6 + lean} ${40 - h}"
        fill="none" stroke="rgba(122,150,96,.8)" stroke-width="2.4" stroke-linecap="round"/>`;
    }).join('');
    wrap.innerHTML = `<svg viewBox="0 0 40 40" width="${size}" height="${size}">${blades}</svg>`;
    return wrap;
  }

  function scatterGrass(container, count) {
    for (let i = 0; i < count; i++) {
      const g = makeGrass(Math.round(rand(24, 40)));
      g.style.position = 'absolute';
      g.style.left = rand(-2, 96) + '%';
      g.style.bottom = '0px';
      g.style.zIndex = '0';
      g.style.opacity = String(rand(0.55, 0.9));
      container.appendChild(g);
    }
  }

  const daisiesBL = document.getElementById('daisies-bl');
  const daisiesBR = document.getElementById('daisies-br');
  const daisiesBottom = document.getElementById('daisies-bottom');
  scatterGrass(daisiesBottom, 22);
  scatterDaisies(daisiesBL, 5, [24, 36]);
  scatterDaisies(daisiesBR, 5, [24, 36]);
  scatterMeadow(daisiesBottom, 34);

  (function plantSunflower() {
    const size = 46;
    const stemHeight = 70;
    const plant = makePlant(sunflowerSVG(size), size, stemHeight, { thickStem: true });
    plant.classList.add('sunflower-plant');
    plant.style.position = 'absolute';
    plant.style.left = rand(58, 72) + '%';
    plant.style.zIndex = '-1';
    daisiesBottom.appendChild(plant);
  })();

  function bloomExtraDaisies(count = 6) {
    for (let i = 0; i < count; i++) {
      const size = Math.round(rand(16, 26));
      const stemHeight = Math.round(rand(12, 42));
      const plant = makePlant(daisySVG(size), size, stemHeight);
      plant.classList.add('bloom-in');
      plant.style.position = 'absolute';
      plant.style.left = rand(2, 96) + '%';
      plant.style.zIndex = String(Math.round(rand(0, 5)));
      plant.style.setProperty('--grow-delay', (i * 70) + 'ms');
      daisiesBottom.appendChild(plant);
      setTimeout(() => plant.remove(), 9000);
    }
  }

  function growLetterDaisies(count = 5) {
    const host = document.getElementById('letter-daisies');
    if (!host) return;
    for (let i = 0; i < count; i++) {
      const size = rand(14, 21);
      const d = makeDaisy(Math.round(size));
      d.classList.add('grow-in');
      d.style.position = 'absolute';
      d.style.left = rand(2, 88) + '%';
      d.style.bottom = rand(-4, 4) + 'px';
      d.style.setProperty('--grow-delay', (i * 90) + 'ms');
      host.appendChild(d);
    }
  }

  function scatterLetterDoodles() {
    const letterEl = document.getElementById('letter');
    if (!letterEl || !letterEl.getClientRects().length) return;

    const cat    = document.querySelector('.doodle-cat');
    const cup    = document.querySelector('.doodle-cup');
    const flower = document.querySelector('.doodle-flower');
    const moon   = document.querySelector('.doodle-moon');
    const title  = document.querySelector('.letter-title');
    const yesBtns = document.querySelectorAll('.yes-btn');

    const letterRect = letterEl.getBoundingClientRect();
    const toLocal = (rect) => ({
      top: rect.top - letterRect.top,
      left: rect.left - letterRect.left,
      width: rect.width,
      height: rect.height,
    });

    function place(el, { left, top, right, w, h, opacity, z }) {
      if (!el) return;
      el.style.position = 'absolute';
      el.style.width = w.toFixed(1) + 'px';
      el.style.height = h.toFixed(1) + 'px';
      el.style.top = top.toFixed(1) + 'px';
      if (right != null) { el.style.right = right.toFixed(1) + 'px'; el.style.left = ''; }
      else { el.style.left = left.toFixed(1) + 'px'; el.style.right = ''; }
      el.style.opacity = opacity.toFixed(2);
      el.style.transform =
        `rotate(${rand(-30, 30).toFixed(1)}deg) skew(${rand(-6, 6).toFixed(1)}deg, ${rand(-3, 3).toFixed(1)}deg)`;
      el.style.pointerEvents = 'none';
      if (z) el.style.zIndex = String(z);
    }

    if (cat && title) {
      const w = rand(16, 30), h = w;
      const t = toLocal(title.getBoundingClientRect());
      const safeRight = t.left - w - 6;
      const left = Math.max(6, rand(Math.min(20, Math.max(6, safeRight)), Math.max(6, safeRight)));
      const top = t.top + rand(-2, Math.max(0, t.height - h + 2));
      place(cat, { left, top, w, h, opacity: rand(.4, .65) });
    }

    if (cup) {
      const w = rand(13, 19), h = w;
      const right = rand(2, 7);
      const top = letterRect.height * rand(.24, .34);
      place(cup, { right, top, w, h, opacity: rand(.4, .65) });
    }

    const rightBtn = yesBtns[yesBtns.length - 1];
    if (flower && rightBtn) {
      const w = rand(17, 29), h = w / (30 / 40);
      const b = toLocal(rightBtn.getBoundingClientRect());
      const top = b.top - h - rand(12, 22);
      const left = b.left + rand(0, Math.max(0, b.width - w));
      place(flower, { left, top, w, h, opacity: rand(.45, .7) });
    }

    const leftBtn = yesBtns[0];
    if (moon && leftBtn) {
      const w = rand(13, 23), h = w;
      const b = toLocal(leftBtn.getBoundingClientRect());
      const top = b.top - h - rand(12, 22);
      const left = b.left + rand(0, Math.max(0, b.width - w));
      place(moon, { left, top, w, h, opacity: rand(.4, .6), z: 6 });
    }
  }

  /* ==============================================================
     1. STARS + DUST
     ============================================================== */
  const sky = document.getElementById('sky');

  for (let i = 0; i < 130; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = rand(0, 100) + '%';
    s.style.top  = rand(0, 62) + '%';
    s.style.setProperty('--s', rand(1, 2.6).toFixed(1) + 'px');
    s.style.setProperty('--dur', rand(2, 5).toFixed(2) + 's');
    s.style.setProperty('--delay', rand(0, 5).toFixed(2) + 's');
    sky.appendChild(s);
  }

  for (let i = 0; i < 16; i++) {
    const d = document.createElement('div');
    d.className = 'dust';
    d.style.left = rand(4, 96) + '%';
    d.style.top  = rand(30, 92) + '%';
    d.style.setProperty('--ddur', rand(9, 15).toFixed(2) + 's');
    d.style.setProperty('--ddelay', rand(0, 10).toFixed(2) + 's');
    sky.appendChild(d);
  }

  /* ==============================================================
     2. FIREFLIES
     ============================================================== */
  const fireflyLayer = document.getElementById('fireflies');

  function makeFirefly({ temporary = false } = {}) {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.left = rand(8, 92) + '%';
    f.style.top  = rand(35, 88) + '%';
    f.style.setProperty('--x1', rand(-24, 24).toFixed(0) + 'px');
    f.style.setProperty('--y1', rand(-30, -8).toFixed(0) + 'px');
    f.style.setProperty('--x2', rand(-24, 24).toFixed(0) + 'px');
    f.style.setProperty('--y2', rand(-40, -14).toFixed(0) + 'px');
    f.style.setProperty('--x3', rand(-24, 24).toFixed(0) + 'px');
    f.style.setProperty('--y3', rand(-20, -4).toFixed(0) + 'px');
    f.style.setProperty('--fdur', rand(4, 7).toFixed(2) + 's');
    f.style.setProperty('--pdur', rand(7, 11).toFixed(2) + 's');
    f.style.setProperty('--fdelay', rand(0, 4).toFixed(2) + 's');
    fireflyLayer.appendChild(f);
    if (temporary) setTimeout(() => f.remove(), 9000);
    return f;
  }
  const baseFireflyCount = reduceMotion ? 6 : 14;
  for (let i = 0; i < baseFireflyCount; i++) makeFirefly();

  function spawnExtraFireflies(count = 6) {
    for (let i = 0; i < count; i++) makeFirefly({ temporary: true });
  }

  /* ==============================================================
     3b. FALLING PETALS
     ============================================================== */
  const fxLayer = document.getElementById('fx-layer');
  let petalGradId = 0;

  function petalSVG(size) {
    const gid = 'petalFallGrad' + (petalGradId++);
    return `
      <svg viewBox="0 0 20 30" width="${size}" height="${Math.round(size * 1.5)}">
        <defs>
          <linearGradient id="${gid}" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stop-color="#FFFDF6"/>
            <stop offset="60%" stop-color="#FFF1BE"/>
            <stop offset="100%" stop-color="#F6D365"/>
          </linearGradient>
        </defs>
        <path d="M10 2 C 15.5 7, 16 19, 10 28 C 4 19, 4.5 7, 10 2 Z"
          fill="url(#${gid})" stroke="rgba(91,70,54,.22)" stroke-width="0.5"/>
        <path d="M10 5 C 9 12, 9 20, 10 25" fill="none" stroke="rgba(91,70,54,.16)" stroke-width="0.5"/>
      </svg>`;
  }

  function spawnWindPetals(count = 14) {
    const stageRect = stage.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
      const size = rand(9, 15);
      const p = document.createElement('div');
      p.className = 'petal';
      p.style.left = '0px';
      p.style.top = '0px';
      p.style.opacity = '0';
      p.innerHTML = petalSVG(size);
      fxLayer.appendChild(p);

      const startX = rand(0, stageRect.width);
      const startY = rand(-60, -10);
      const endY = stageRect.height + 20;
      const startDelay = rand(0, 1400);

      if (reduceMotion) {
        p.style.transform = `translate(${startX}px, ${stageRect.height * 0.5}px)`;
        p.style.opacity = '.8';
        setTimeout(() => p.remove(), 4000);
        continue;
      }

      const fallDuration = rand(4200, 6800);
      const driftTotal   = rand(-70, 70);
      const swayAmp      = rand(16, 32);
      const swayFreq     = rand(1.6, 3.2);
      const swayPhase    = rand(0, Math.PI * 2);
      const rotAmp       = rand(18, 40);
      const rotFreq      = rand(1.2, 2.4);
      const rotPhase     = rand(0, Math.PI * 2);
      const netRotation  = pick([-1, 1]) * rand(40, 140);

      let start = null;
      let raf = null;

      function step(now) {
        if (start === null) start = now;
        const elapsed = now - start;

        const t = Math.min(1, elapsed / fallDuration);
        const y = startY + (endY - startY) * t;
        const x = startX + driftTotal * t + Math.sin(t * swayFreq * Math.PI * 2 + swayPhase) * swayAmp;
        const rot = Math.sin(t * rotFreq * Math.PI * 2 + rotPhase) * rotAmp + netRotation * t;

        let opacity = 1;
        if (t < 0.08) opacity = t / 0.08;
        else if (t > 0.82) opacity = Math.max(0, (1 - t) / 0.18);

        p.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
        p.style.opacity = String(opacity);

        if (t < 1) {
          raf = requestAnimationFrame(step);
        } else {
          p.remove();
        }
      }

      setTimeout(() => { raf = requestAnimationFrame(step); }, startDelay);
      setTimeout(() => { if (raf) cancelAnimationFrame(raf); p.remove(); }, startDelay + fallDuration + 300);
    }
  }

  /* ==============================================================
     3b-ii. AMBIENT DRIFTING PETALS — for the final scene.
     ============================================================== */
  let ambientPetalCount = 0;
  const MAX_AMBIENT_PETALS = 6;
  let ambientPetalsRunning = false;

  function edgePoint(edge, w, h) {
    switch (edge) {
      case 'top':    return { x: rand(0, w), y: -24 };
      case 'bottom': return { x: rand(0, w), y: h + 24 };
      case 'left':   return { x: -24, y: rand(0, h) };
      default:       return { x: w + 24, y: rand(0, h) };
    }
  }

  function spawnAmbientPetal() {
    if (reduceMotion || ambientPetalCount >= MAX_AMBIENT_PETALS) return;

    const stageRect = stage.getBoundingClientRect();
    const edges = ['top', 'bottom', 'left', 'right'];
    const startEdge = pick(edges);
    const endEdge = pick(edges.filter(e => e !== startEdge));
    const start = edgePoint(startEdge, stageRect.width, stageRect.height);
    const end   = edgePoint(endEdge, stageRect.width, stageRect.height);

    const dx = end.x - start.x, dy = end.y - start.y;
    const dist = Math.hypot(dx, dy) || 1;
    const perpX = -dy / dist, perpY = dx / dist;

    const size = rand(9, 15);
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.left = '0px';
    p.style.top = '0px';
    p.style.opacity = '0';
    p.innerHTML = petalSVG(size);
    fxLayer.appendChild(p);
    ambientPetalCount++;

    const duration  = rand(7500, 12000);
    const swayAmp   = rand(24, 46);
    const swayFreq  = rand(1.2, 2.4);
    const swayPhase = rand(0, Math.PI * 2);
    const rotAmp    = rand(16, 32);
    const rotFreq   = rand(0.9, 1.8);
    const rotPhase  = rand(0, Math.PI * 2);
    const netRotation = pick([-1, 1]) * rand(25, 90);

    let startTs = null;
    let raf = null;

    function step(now) {
      if (startTs === null) startTs = now;
      const t = Math.min(1, (now - startTs) / duration);

      const bx = start.x + dx * t;
      const by = start.y + dy * t;
      const sway = Math.sin(t * swayFreq * Math.PI * 2 + swayPhase) * swayAmp
                 * Math.sin(Math.PI * t);
      const x = bx + perpX * sway;
      const y = by + perpY * sway;
      const rot = Math.sin(t * rotFreq * Math.PI * 2 + rotPhase) * rotAmp + netRotation * t;

      let opacity = 1;
      if (t < 0.1) opacity = t / 0.1;
      else if (t > 0.85) opacity = Math.max(0, (1 - t) / 0.15);

      p.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      p.style.opacity = String(opacity);

      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        p.remove();
        ambientPetalCount--;
      }
    }
    raf = requestAnimationFrame(step);
  }

  function startAmbientPetals() {
    if (ambientPetalsRunning || reduceMotion) return;
    ambientPetalsRunning = true;
    (function loop() {
      spawnAmbientPetal();
      setTimeout(loop, rand(900, 2000));
    })();
  }

  /* ==============================================================
     3c. BUTTERFLY — flies in and lands on a yes button
     ============================================================== */
  function makeButterflyEl() {
    const b = document.createElement('div');
    b.className = 'butterfly';
    b.innerHTML = `
      <svg viewBox="0 0 40 30" width="26" height="20">
        <g class="wing-left"><path d="M18 15 C 6 1, 0 9, 9 15 C 1 21, 6 29, 18 17 Z" fill="#FFD54A" stroke="rgba(91,70,54,.35)" stroke-width="0.6"/></g>
        <g class="wing-right"><path d="M22 15 C 34 1, 40 9, 31 15 C 39 21, 34 29, 22 17 Z" fill="#FFF6D7" stroke="rgba(91,70,54,.35)" stroke-width="0.6"/></g>
        <line x1="20" y1="9" x2="20" y2="21" stroke="#5B4636" stroke-width="1.2" stroke-linecap="round"/>
      </svg>`;
    return b;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function spawnButterfly() {
    const yesButtons = Array.from(document.querySelectorAll('.yes-btn'));
    if (!yesButtons.length) return;
    const target = pick(yesButtons);
    const stageRect = stage.getBoundingClientRect();
    const btnRect = target.getBoundingClientRect();

    const landX = btnRect.left - stageRect.left + btnRect.width * 0.5 - 13;
    const landY = btnRect.top - stageRect.top - 12;

    const fromLeft = Math.random() < 0.5;
    const startX = fromLeft ? -50 : stageRect.width + 50;
    const startY = rand(60, stageRect.height * 0.45);

    const b = makeButterflyEl();
    b.style.left = '0px';
    b.style.top = '0px';
    b.style.opacity = '0';
    fxLayer.appendChild(b);

    if (reduceMotion) {
      b.style.transform = `translate(${landX}px, ${landY}px)`;
      b.style.opacity = '1';
      b.classList.add('landed');
      return;
    }

    const duration = rand(6200, 7400);
    const wobblePhaseX = rand(0, Math.PI * 2);
    const wobblePhaseY = rand(0, Math.PI * 2);
    const arcHeight = rand(50, 90);
    let start = null;
    let flightRAF = null;

    function flightStep(now) {
      if (start === null) start = now;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      const settle = 1 - eased;

      const baseX = startX + (landX - startX) * eased;
      const baseY = startY + (landY - startY) * eased;
      const arc = -Math.sin(eased * Math.PI) * arcHeight * (0.35 + settle * 0.65);
      const wobbleX = Math.sin(elapsed / 420 + wobblePhaseX) * 16 * settle;
      const wobbleY = Math.cos(elapsed / 540 + wobblePhaseY) * 10 * settle;

      const x = baseX + wobbleX;
      const y = baseY + arc + wobbleY;

      b.style.transform = `translate(${x}px, ${y}px)`;
      b.style.opacity = String(Math.min(1, elapsed / 260));

      if (t < 1) {
        flightRAF = requestAnimationFrame(flightStep);
      } else {
        b.classList.add('landed');
        startOrbit();
      }
    }
    flightRAF = requestAnimationFrame(flightStep);

    function startOrbit() {
      const rx = rand(15, 22);
      const ry = rand(7, 11);
      const speed = rand(5200, 7000);
      const wobbleSpeed = speed * rand(0.4, 0.6);
      const angleOffset = rand(0, Math.PI * 2);
      let orbitStart = null;

      function orbitStep(now) {
        if (orbitStart === null) orbitStart = now;
        const elapsed = now - orbitStart;
        const angle = angleOffset + (elapsed / speed) * Math.PI * 2;
        const flutter = Math.sin(elapsed / wobbleSpeed * Math.PI * 2) * 3;

        const x = landX + Math.cos(angle) * rx;
        const y = landY + Math.sin(angle) * ry - Math.abs(Math.sin(angle)) * 3 + flutter * 0.3;

        b.style.transform = `translate(${x}px, ${y}px)`;
        flightRAF = requestAnimationFrame(orbitStep);
      }
      flightRAF = requestAnimationFrame(orbitStep);
    }
  }

  /* ==============================================================
     3d. FINAL-SCENE BUTTERFLIES
     ============================================================== */
  function randomStagePoint(margin = 20) {
    const r = stage.getBoundingClientRect();
    return { x: rand(margin, r.width - margin), y: rand(margin, r.height * 0.68) };
  }

  function outsideStagePoint() {
    const r = stage.getBoundingClientRect();
    const edge = pick(['left', 'right', 'top']);
    if (edge === 'left')  return { x: -40, y: rand(40, r.height * 0.5) };
    if (edge === 'right') return { x: r.width + 40, y: rand(40, r.height * 0.5) };
    return { x: rand(0, r.width), y: -40 };
  }

  function plantLandingPoint(plantEl) {
    const stageRect = stage.getBoundingClientRect();
    const head = plantEl.querySelector('.plant-head') || plantEl;
    const headRect = head.getBoundingClientRect();
    return {
      x: headRect.left - stageRect.left + headRect.width * 0.5 - 13,
      y: headRect.top - stageRect.top - 9,
    };
  }

  function flyLeg(b, from, to, duration, arcHeight, onDone) {
    const wobblePhaseX = rand(0, Math.PI * 2);
    const wobblePhaseY = rand(0, Math.PI * 2);
    let start = null;

    function step(now) {
      if (start === null) start = now;
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeInOutCubic(t);
      const settle = Math.sin(t * Math.PI);

      const baseX = from.x + (to.x - from.x) * eased;
      const baseY = from.y + (to.y - from.y) * eased;
      const arc = -Math.sin(eased * Math.PI) * arcHeight;
      const wobbleX = Math.sin(elapsed / 380 + wobblePhaseX) * 10 * settle;
      const wobbleY = Math.cos(elapsed / 460 + wobblePhaseY) * 7 * settle;

      b.style.transform = `translate(${(baseX + wobbleX).toFixed(1)}px, ${(baseY + arc + wobbleY).toFixed(1)}px)`;

      if (t < 1) requestAnimationFrame(step);
      else if (onDone) onDone();
    }
    requestAnimationFrame(step);
  }

  function startFlowerSway(b, landPoint) {
    const rx = rand(3, 6), ry = rand(2, 4);
    const speed = rand(2600, 4000);
    let s = null;
    function step(now) {
      if (s === null) s = now;
      const angle = ((now - s) / speed) * Math.PI * 2;
      const x = landPoint.x + Math.cos(angle) * rx;
      const y = landPoint.y + Math.sin(angle) * ry;
      b.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function launchFinalButterfly(landTarget, startDelay) {
    const b = makeButterflyEl();
    b.style.left = '0px';
    b.style.top = '0px';
    b.style.opacity = '0';
    fxLayer.appendChild(b);

    const entry = outsideStagePoint();

    if (reduceMotion) {
      const rest = landTarget ? plantLandingPoint(landTarget.el) : randomStagePoint();
      b.style.transform = `translate(${rest.x}px, ${rest.y}px)`;
      b.style.opacity = '1';
      if (landTarget) b.classList.add('landed');
      return;
    }

    let pos = entry;
    b.style.transform = `translate(${pos.x}px, ${pos.y}px)`;

    setTimeout(() => {
      b.style.transition = 'opacity .6s ease';
      b.style.opacity = '1';

      const totalLegs = landTarget ? Math.round(rand(3, 5)) : Infinity;
      let leg = 0;

      function nextLeg() {
        leg++;
        const isLastLeg = landTarget && leg >= totalLegs;
        const to = isLastLeg ? plantLandingPoint(landTarget.el) : randomStagePoint();
        const dist = Math.hypot(to.x - pos.x, to.y - pos.y);
        const duration = Math.max(1400, Math.min(5200, dist * rand(16, 24)));
        const arcHeight = rand(20, 50);

        flyLeg(b, pos, to, duration, arcHeight, () => {
          pos = to;
          if (isLastLeg) {
            b.classList.add('landed');
            startFlowerSway(b, to);
          } else {
            setTimeout(nextLeg, rand(150, 500));
          }
        });
      }
      nextLeg();
    }, startDelay);
  }

  function spawnFinalButterflies() {
    if (reduceMotion) return;
    const count = Math.round(rand(3, 5));
    const daisyPlants = Array.from(document.querySelectorAll('.daisy-plant'));
    const sunflowerPlant = document.querySelector('.sunflower-plant');
    const daisyPlant = daisyPlants.length ? pick(daisyPlants) : null;

    const targets = [];
    if (sunflowerPlant) targets.push({ el: sunflowerPlant });
    if (daisyPlant) targets.push({ el: daisyPlant });

    for (let i = 0; i < count; i++) {
      launchFinalButterfly(targets[i] || null, i * rand(300, 650) + rand(0, 400));
    }
  }

  /* ==============================================================
     4. TAP SPARKLES
     ============================================================== */
  stage.addEventListener('pointerdown', (e) => {
    const rect = stage.getBoundingClientRect();
    const s = document.createElement('div');
    s.className = 'tap-sparkle';
    s.style.left = (e.clientX - rect.left - 4) + 'px';
    s.style.top  = (e.clientY - rect.top - 4) + 'px';
    stage.appendChild(s);
    setTimeout(() => s.remove(), 750);
    markInteraction();
  });

  /* ==============================================================
     5. SYNTHESISED AUDIO
     ============================================================== */
  let actx = null;
  let musicNodes = null;
  let musicPlaying = false;

  function ensureAudio() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    return actx;
  }

  function noiseBuffer(ctx, duration) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function startMusic() {
    const ctx = ensureAudio();
    const master = ctx.createGain();
    master.gain.value = 0.0001;
    master.connect(ctx.destination);
    master.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 1.4);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    filter.connect(master);

    const notes = [220, 277.18, 329.63, 440];
    const oscs = [];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = rand(-4, 4);

      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.22;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = rand(0.05, 0.12);
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.08;
      lfo.connect(lfoGain);
      lfoGain.connect(g.gain);

      osc.connect(g);
      g.connect(filter);
      osc.start();
      lfo.start();
      oscs.push(osc, lfo);
    });

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer(ctx, 2);
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 900;
    noiseFilter.Q.value = 0.6;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.015;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(master);
    noise.start();

    musicNodes = { master, oscs, noise };
    musicPlaying = true;
  }

  function stopMusic() {
    if (!musicNodes || !actx) return;
    const { master, oscs, noise } = musicNodes;
    const now = actx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    setTimeout(() => {
      oscs.forEach(o => { try { o.stop(); } catch (e) {} });
      try { noise.stop(); } catch (e) {}
    }, 900);
    musicNodes = null;
    musicPlaying = false;
  }

  function duckMusic() {
    if (!musicNodes || !actx) return;
    const now = actx.currentTime;
    musicNodes.master.gain.cancelScheduledValues(now);
    musicNodes.master.gain.setValueAtTime(musicNodes.master.gain.value, now);
    musicNodes.master.gain.linearRampToValueAtTime(0.05, now + 0.6);
  }

  function playRipSound() {
    const ctx = ensureAudio();
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.45);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 4;
    filter.frequency.setValueAtTime(1800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(3200, ctx.currentTime + 0.35);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.42);
    src.connect(filter); filter.connect(g); g.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + 0.45);
  }

  function playPageTurn() {
    const ctx = ensureAudio();
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx, 0.35);
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(700, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.3);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);
    src.connect(filter); filter.connect(g); g.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + 0.35);
  }

  function chirp(delay, freqA, freqB) {
    const ctx = ensureAudio();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const g = ctx.createGain();
    osc.frequency.setValueAtTime(freqA, t0);
    osc.frequency.exponentialRampToValueAtTime(freqB, t0 + 0.12);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t0); osc.stop(t0 + 0.2);
  }

  function playBirdSounds() {
    chirp(0.0, 1800, 2400);
    chirp(0.22, 2100, 1600);
    chirp(0.5, 1700, 2300);
    chirp(0.85, 2200, 1900);
    chirp(1.3, 1900, 2500);
  }

  const musicBtn = document.getElementById('music-btn');
  musicBtn.addEventListener('click', () => {
    ensureAudio();
    if (musicPlaying) {
      stopMusic();
      musicBtn.setAttribute('aria-pressed', 'false');
      musicBtn.setAttribute('aria-label', 'Play soft music');
    } else {
      startMusic();
      musicBtn.setAttribute('aria-pressed', 'true');
      musicBtn.setAttribute('aria-label', 'Pause music');
    }
  });

  /* ==============================================================
     6. INTRO TIMELINE
     ============================================================== */
  const introText   = document.getElementById('intro-text');
  const ticketScene = document.getElementById('ticket-scene');

  requestAnimationFrame(() => stage.classList.add('sky-in'));

  setTimeout(() => introText.classList.add('show'), 2000);
  setTimeout(() => introText.classList.remove('show'), 4600);
  setTimeout(() => ticketScene.classList.add('show'), 6300);

  /* ==============================================================
     7. IDLE FIREFLY LANDING ON "OPEN TICKET"
     ============================================================== */
  let lastInteraction = Date.now();
  let ticketOpened = false;
  function markInteraction() { lastInteraction = Date.now(); }
  ['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, markInteraction));

  if (!reduceMotion) {
    setInterval(() => {
      if (ticketOpened) return;
      if (!ticketScene.classList.contains('show')) return;
      if (Date.now() - lastInteraction < 15000) return;
      landFireflyOnButton();
      lastInteraction = Date.now();
    }, 1000);
  }

  function landFireflyOnButton() {
    const perch = document.getElementById('ticket-firefly-perch');
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.animation = 'none';
    f.style.left = '50%';
    f.style.top = '-40px';
    f.style.opacity = '0';
    f.style.transform = 'translate(-50%,0)';
    f.style.transition = 'opacity 1s ease, transform 1.2s ease, box-shadow .6s ease';
    perch.appendChild(f);
    requestAnimationFrame(() => {
      f.style.opacity = '1';
      f.style.transform = 'translate(-50%,-6px)';
    });
    setTimeout(() => {
      f.style.boxShadow = '0 0 16px 5px rgba(255,213,74,.95)';
    }, 1200);
    setTimeout(() => {
      f.style.opacity = '0';
      f.style.transform = 'translate(-50%,-40px)';
    }, 2400);
    setTimeout(() => f.remove(), 3400);
  }

  /* ==============================================================
     8. TICKET EASTER EGG
     ============================================================== */
  const issuerBtn = document.getElementById('issuer-btn');
  const toast = document.getElementById('toast');
  let toastTimer = null;
  issuerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toast.textContent = 'I was smiling while making this.';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  });

  /* ==============================================================
     9. LETTER PAGINATION
     Measures the real, rendered size of a letter page (with and
     without the title) and splits the proposal text into exactly as
     many pages as it needs to fit without ever clipping. The closing
     "I love you" line rides along at the end of the last text page
     if there's room, or gets a dedicated page of its own if not.
     A final page (the question + the buttons) is always appended.
     ============================================================== */
  /* ==============================================================
     9. LETTER PAGES (manual)
     The proposal text is split by hand into exactly three pages —
     edit the strings below directly to change what appears on each
     page. A fourth page (the closing question + buttons) is always
     appended after them. Each page's text box scrolls internally if
     a page ever gets too much text for its height, so nothing is
     ever silently clipped — but with three fixed pages you're in
     full control of what lands where.
     ============================================================== */
  const LETTER_PAGES = [
    "I have a  smol smol plan to spend a whole day (one day of the weeknd, or or or could be both days) with you. It goes like this, we wake up to each others voice and i love yous and good meowrnings in our ears. zen we get fewd, have  breakfast together (me bill guts eu coffee, black, iced or not, whichever eu want). zen zen zen we watshh and finsih summer strike (pliiijjj, onliii 3 eps left so 3 hrs onliii, so less less taim).",
    "by then it will be evening zere, sauu we gew on a walk, tek zee bewkk, eu ken send me pics after every 2 minutes or so while we stay on the call, or you can just put the video on, totally upto you. zenn zenn zenn ummm, we find a place teu read ze bewkk if eu kens, eu read and me listens. and zen zen zen hehe we gutt ice cream (rocky roads) as we walk beck teu ze house. and zen zen zen uhhh we justt gut beck, kiss, hug, cuddle and uhh ehm ehm.... sleep dummyy. hehe.",
    "so deu eu accept or deu eu accept or liek if eu want, liek no pressure, eu ken also accept (please accept). that is if eu is not busy love, since me knows eu are moving house and all, so no pressure at all cupcake, the proposal is for any or every weeknd eu wants teu deu diss wid me. sau deu eu accept or are still liekk uhhh thinking about accepting. let me know."
  ];

  function buildLetterPages() {
    const pagesRoot = document.getElementById('letter-pages');
    if (!pagesRoot) return;

    const titleNode     = document.querySelector('.letter-title');
    const catNode       = document.querySelector('.doodle-cat');
    const cupNode       = document.querySelector('.doodle-cup');
    const heartBgNode   = document.querySelector('.doodle-heart-bg');
    const flowerNode    = document.querySelector('.doodle-flower');
    const moonNode      = document.querySelector('.doodle-moon');
    const starNode      = document.querySelector('.doodle-star');
    const pawNode       = document.querySelector('.doodle-paw');
    const cloudNode     = document.querySelector('.doodle-cloud');
    const butterflyNode = document.querySelector('.doodle-butterfly');
    const questionInner = document.querySelector('.page-back-inner');
    const daisiesHost   = document.getElementById('letter-daisies');

    pagesRoot.innerHTML = '';

    // ---------- build the three proposal-text pages ----------
    const pageEls = [];

    LETTER_PAGES.forEach((chunk, i) => {
      const page = document.createElement('div');
      page.className = 'letter-page text-page';

      if (i === 0) {
        page.appendChild(titleNode);
        page.appendChild(catNode);
        page.appendChild(cupNode);
        page.appendChild(heartBgNode);
      }
      if (i === 1) {
        page.appendChild(starNode);
        page.appendChild(pawNode);
      }
      if (i === 2) {
        page.appendChild(cloudNode);
        page.appendChild(butterflyNode);
      }

      const body = document.createElement('div');
      body.className = 'letter-body';
      const note = document.createElement('div');
      note.className = 'letter-note';
      const p = document.createElement('p');
      p.className = 'hand-text';
      p.textContent = chunk;
      note.appendChild(p);

      const isLastTextChunk = (i === LETTER_PAGES.length - 1);
      if (isLastTextChunk) {
        const love = document.createElement('p');
        love.className = 'love-words';
        love.innerHTML = 'I LOVE YOU MY CUTIII <span class="love-heart" aria-hidden="true">❤</span>';
        note.appendChild(love);
      }

      body.appendChild(note);
      page.appendChild(body);
      pageEls.push(page);
    });

    // ---------- the final question / buttons page ----------
    const questionPage = document.createElement('div');
    questionPage.className = 'letter-page page-back';
    questionPage.appendChild(flowerNode);
    questionPage.appendChild(moonNode);
    questionPage.appendChild(daisiesHost);
    questionPage.appendChild(questionInner);
    pageEls.push(questionPage);

    // ---------- wire up stacking order, arrows, and flip logic ----------
    function turnPage(fromIndex, toIndex) {
      ensureAudio();
      playPageTurn();
      if (toIndex > fromIndex) {
        pageEls[fromIndex].classList.add('flipped');
        pageEls[fromIndex].inert = true;
        pageEls[toIndex].inert = false;
        setTimeout(() => pageEls[toIndex].focus({ preventScroll: true }), 550);
      } else {
        pageEls[toIndex].classList.remove('flipped');
        pageEls[toIndex].inert = false;
        pageEls[fromIndex].inert = true;
      }
    }

    pageEls.forEach((page, i) => {
      page.style.zIndex = String(pageEls.length - i);
      page.tabIndex = -1;
      page.inert = i !== 0;

      if (i < pageEls.length - 1) {
        const hint = document.createElement('span');
        hint.className = 'page-flip-hint';
        hint.textContent = 'turn the page';
        page.appendChild(hint);

        const next = document.createElement('button');
        next.type = 'button';
        next.className = 'page-flip-btn';
        next.setAttribute('aria-label', 'Turn the page');
        next.innerHTML = '<svg viewBox="0 0 46 28" width="40" height="24" aria-hidden="true"><path class="sketch-shaft" d="M3 20 C 12 8, 24 6, 33 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path class="sketch-head" d="M25 6.5 C 29.5 9, 33.5 11.5, 36 13.5 C 33.5 15.5, 29 18.5, 24.5 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        next.addEventListener('click', () => turnPage(i, i + 1));
        page.appendChild(next);
      }
      if (i > 0) {
        const back = document.createElement('button');
        back.type = 'button';
        back.className = 'page-flip-btn back';
        back.setAttribute('aria-label', 'Go back a page');
        back.innerHTML = '<svg viewBox="0 0 46 28" width="34" height="20" aria-hidden="true"><path class="sketch-shaft" d="M43 20 C 34 8, 22 6, 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path class="sketch-head" d="M21 6.5 C 16.5 9, 12.5 11.5, 10 13.5 C 12.5 15.5, 17 18.5, 21.5 21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        back.addEventListener('click', () => turnPage(i, i - 1));
        page.appendChild(back);
      }

      pagesRoot.appendChild(page);
    });
  }

  /* ==============================================================
     10. OPEN TICKET SEQUENCE
     ============================================================== */
  const ticketEl   = document.getElementById('ticket');
  const tearLine   = ticketEl.querySelector('.tear-line');
  const openBtn    = document.getElementById('open-ticket-btn');
  const letterScene = document.getElementById('letter-scene');

  openBtn.addEventListener('click', () => {
    if (ticketOpened) return;
    ticketOpened = true;
    ensureAudio();

    duckMusic();
    stage.classList.add('anim-paused');
    openBtn.style.pointerEvents = 'none';
    openBtn.style.opacity = '.6';

    ticketEl.classList.add('shake');

    setTimeout(() => {
      tearLine.classList.add('show');
    }, 480);

    setTimeout(() => {
      playRipSound();
      ticketEl.classList.add('split');
      ticketScene.classList.add('opened');
    }, 760);

    setTimeout(() => {
      stage.classList.remove('anim-paused');
      letterScene.hidden = false;
      requestAnimationFrame(() => {
        letterScene.classList.add('show');
        requestAnimationFrame(() => {
          buildLetterPages();
          scatterLetterDoodles();
          const title = document.querySelector('.letter-title');
          if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
        });
      });
    }, 1650);
  });

  /* ==============================================================
     11. REFUSE BUTTON — never actually refuses
     ============================================================== */
  document.addEventListener('click', (e) => {
    const refuseBtn = e.target.closest('#refuse-btn');
    if (!refuseBtn) return;

    const convinceText = document.getElementById('convince-text');
    const state = refuseBtn.dataset.state || 'idle';

    if (state === 'idle') {
      refuseBtn.dataset.state = 'convincing';
      refuseBtn.textContent = '🥺 Can I convince you instead?';

      bloomExtraDaisies(6);
      spawnExtraFireflies(6);
      spawnWindPetals(14);
      growLetterDaisies(5);
      spawnButterfly();
      stage.classList.add('glow-bright');

      if (convinceText) {
        convinceText.hidden = false;
        requestAnimationFrame(() => convinceText.classList.add('show'));
      }

      setTimeout(() => {
        refuseBtn.dataset.state = 'redirect';
        refuseBtn.textContent = '🌼 Try the other buttons?';
      }, 1600);
    } else {
      document.querySelectorAll('.yes-btn').forEach(btn => {
        btn.classList.remove('spotlight');
        void btn.offsetWidth;
        btn.classList.add('spotlight');
      });
    }
  });

  /* ==============================================================
     12. ACCEPTANCE
     ============================================================== */
  const finalCard = document.getElementById('final-card');
  let accepted = false;

  document.addEventListener('click', (e) => {
    const yesBtn = e.target.closest('[data-yes]');
    if (!yesBtn || accepted) return;
    accepted = true;
    document.querySelectorAll('.yes-btn, .refuse-btn').forEach(b => b.style.pointerEvents = 'none');

    stage.classList.add('dawn');
    bloomExtraDaisies(8);

    setTimeout(playBirdSounds, 900);

    setTimeout(() => {
      letterScene.classList.add('folding');
    }, 1900);
    setTimeout(() => {
      letterScene.hidden = true;
      ticketScene.hidden = true;
    }, 2750);

    setTimeout(() => {
      finalCard.hidden = false;
      requestAnimationFrame(() => finalCard.classList.add('show'));
      startAmbientPetals();
      spawnFinalButterflies();
    }, 2850);

    setTimeout(() => {
      const star = document.createElement('div');
      star.className = 'shooting-star';
      star.style.left = '72%';
      star.style.top = '18%';
      star.style.animation = 'shoot 1.4s ease-out forwards';
      sky.appendChild(star);
      setTimeout(() => star.remove(), 1600);
    }, 3400);

    if (musicPlaying) duckMusic();
  });

})();