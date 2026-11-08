/* Auto Moto Escola Leste 2 — interações (v2) */
(() => {
  const CONFIG = { whatsapp: '5511958342702', mensagem: 'Olá! Vim pelo site da Leste 2 e gostaria de conversar.' };
  const wa = m => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(m)}`;
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const ext = a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; };

  $$('[data-wa]').forEach(a => { a.href = wa(CONFIG.mensagem); ext(a); });
  $$('[data-plan]').forEach(a => { a.href = wa(`Olá! Gostaria de saber mais sobre o ${a.dataset.plan}.`); ext(a); });
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  try { sessionStorage.setItem('l2-intro', '1'); } catch (e) {}
  const intro = $('.intro');
  if (intro && !root.classList.contains('no-intro')) setTimeout(() => intro.remove(), 1900);

  $$('[data-lines]').forEach(h => { h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map((p, i) => `<span class="tl" style="--li:${i}"><span>${p.trim()}</span></span>`).join(''); });
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px', threshold: .12 });
  $$('[data-reveal],[data-lines]').forEach(el => io.observe(el));

  /* Cabeçalho, progresso */
  const header = $('#header'), progress = $('.progress'); let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('scrolled', y > 30);
    header.classList.toggle('hide', y > lastY && y > 700 && !document.body.classList.contains('locked'));
    lastY = y;
    const max = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  };
  addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true }); onScroll();

  /* Menu */
  const mb = $('.menu-btn'), menu = $('#menu'); let lenis = null;
  const setMenu = o => { mb.setAttribute('aria-expanded', o); mb.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu'); menu.classList.toggle('open', o); menu.inert = !o; document.body.classList.toggle('locked', o); if (lenis) o ? lenis.stop() : lenis.start(); };
  mb.addEventListener('click', () => setMenu(mb.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); mb.focus(); } });

  /* Estrada: faixas andando; aceleram com a rolagem */
  const road = $('#road'), hero = $('.hero');
  if (road && !reduce) {
    let off = 0, last = performance.now(), prevY = scrollY, boost = 0, visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
    const tick = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const dy = scrollY - prevY; prevY = scrollY;
      boost += (Math.min(1400, Math.abs(dy) / Math.max(dt, .001)) - boost) * .08;
      if (visible) { off = (off + (260 + boost * .9) * dt) % 150; road.style.setProperty('--off', off.toFixed(1) + 'px'); }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* Objetivo: abas */
  const GOALS = [
    { h: 'Tire sua primeira CNH', p: 'Entenda como começar e quais etapas fazem sentido para você. A equipe orienta sobre o processo e as aulas.', img: 'assets/aula-carro-ilustrativa-720.webp', m: 'Olá! Quero tirar minha primeira habilitação. Como começo?' },
    { h: 'Ganhe segurança ao volante', p: 'Já tem a habilitação ou está perto da prova? Aulas práticas ajudam a ganhar confiança em situações reais de trânsito.', img: 'assets/cena-carro-moto-ilustrativa-720.webp', m: 'Olá! Gostaria de fazer aulas práticas para ganhar mais segurança.' },
    { h: 'Mude de categoria', p: 'Carro, moto ou outra categoria: converse com a equipe sobre a próxima etapa e o que é necessário.', img: 'assets/aula-moto-ilustrativa-720.webp', m: 'Olá! Gostaria de saber sobre mudança de categoria.' },
    { h: 'Cursos especializados', p: 'Pergunte sobre as formações e cursos disponíveis, como reciclagem e cursos a distância, e qual se aplica ao seu caso.', img: 'assets/aula-carro-ilustrativa-720.webp', m: 'Olá! Gostaria de saber sobre os cursos especializados.' }
  ];
  const tabs = $$('.goal-tab'), gImg = $('#goal-img'), gMedia = $('.goal-media'), gCopy = $('.goal-copy'), gH = $('#goal-h'), gP = $('#goal-p'), gCta = $('#goal-cta');
  ext(gCta); gCta.href = wa(GOALS[0].m);
  let gi = 0;
  const setGoal = i => {
    if (i === gi) return; gi = i;
    tabs.forEach((t, k) => { t.classList.toggle('on', k === i); t.setAttribute('aria-selected', k === i); });
    if (reduce) { gImg.src = GOALS[i].img; gH.textContent = GOALS[i].h; gP.textContent = GOALS[i].p; gCta.href = wa(GOALS[i].m); return; }
    gMedia.classList.add('swap'); gCopy.classList.add('swap');
    setTimeout(() => { gImg.src = GOALS[i].img; gH.textContent = GOALS[i].h; gP.textContent = GOALS[i].p; gCta.href = wa(GOALS[i].m); gMedia.classList.remove('swap'); gCopy.classList.remove('swap'); }, 260);
  };
  tabs.forEach((t, k) => t.addEventListener('click', () => setGoal(k)));
  $('.goal-tabs').addEventListener('keydown', e => { if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return; e.preventDefault(); const n = (gi + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length; setGoal(n); tabs[n].focus(); });

  /* Montador de mensagem */
  const form = $('#composer'), out = $('#bubble-text'), bubble = $('.bubble');
  const build = () => {
    const f = new FormData(form), s = f.get('assunto'), nome = ($('#f-name').value || '').trim(), nota = ($('#f-note').value || '').trim();
    let m = `Olá! ${nome ? `Meu nome é ${nome}. ` : ''}Encontrei a Auto Moto Escola Leste 2 pelo site.\nGostaria de conversar sobre ${s}.`;
    if (nota) m += `\n${nota}`;
    return m;
  };
  const refresh = () => { out.textContent = build(); bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };
  form.addEventListener('input', refresh); refresh();
  form.addEventListener('submit', e => { e.preventDefault(); window.open(wa(build()), '_blank', 'noopener,noreferrer'); });

  /* Avaliações: esteira contínua */
  (() => {
    const vp = $('.rv-viewport'), track = $('#rv-track'), orig = [...track.children], n = orig.length, play = $('.rv-play');
    orig.forEach((c, i) => c.style.setProperty('--d', Math.min(i, 5) * .08 + 's'));
    orig.forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.inert = true; k.style.setProperty('--d', '0s'); track.appendChild(k); });
    new IntersectionObserver(([e], o) => { if (e.isIntersecting) { track.classList.add('in'); o.disconnect(); } }, { threshold: .15 }).observe(vp);
    let half = 0, step = 0; const measure = () => { const all = track.children; half = all[n].offsetLeft - all[0].offsetLeft; step = all[1].offsetLeft - all[0].offsetLeft; }; measure(); addEventListener('resize', measure);
    const base = () => innerWidth < 700 ? 34 : 46;
    let pos = 0, speed = 0, on = !reduce, visible = false, hover = false, drag = null, fling = 0, tween = null, last = performance.now();
    const wrap = x => half ? ((x % half) + half) % half : x;
    const setPlay = v => { on = v; play.setAttribute('aria-pressed', v); play.querySelector('span').textContent = v ? 'Pausar' : 'Reproduzir'; };
    setPlay(on); play.addEventListener('click', () => setPlay(!on));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(vp);
    vp.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') hover = true; }); vp.addEventListener('pointerleave', () => hover = false);
    vp.addEventListener('focusin', () => hover = true); vp.addEventListener('focusout', () => hover = false);
    const nudge = d => { tween = { from: pos, to: pos + d * step, t0: performance.now(), dur: reduce ? 1 : 700 }; };
    $$('[data-rv]').forEach(b => b.addEventListener('click', () => nudge(+b.dataset.rv)));
    vp.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1); } });
    vp.addEventListener('pointerdown', e => { if (e.button) return; drag = { x: e.clientX, p: pos, moved: false, lx: e.clientX, lt: performance.now(), v: 0, id: e.pointerId }; tween = null; fling = 0; });
    addEventListener('pointermove', e => { if (!drag || e.pointerId !== drag.id) return; const dx = e.clientX - drag.x; if (!drag.moved) { if (Math.abs(dx) < 6) return; drag.moved = true; vp.classList.add('dragging'); } const now = performance.now(); drag.v = (drag.lx - e.clientX) / Math.max(1, now - drag.lt) * 1000; drag.lx = e.clientX; drag.lt = now; pos = drag.p - dx; });
    const end = e => { if (!drag || (e && e.pointerId !== drag.id)) return; if (drag.moved) { fling = Math.max(-2400, Math.min(2400, drag.v)); vp.classList.remove('dragging'); } drag = null; };
    addEventListener('pointerup', end); addEventListener('pointercancel', end);
    const ease = t => 1 - Math.pow(1 - t, 4);
    const frame = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const target = (on && !drag && !document.hidden) ? base() * (hover ? .25 : 1) : 0;
      speed += (target - speed) * Math.min(1, dt * 3.2);
      if (tween) { const t = Math.min(1, (now - tween.t0) / tween.dur); pos = tween.from + (tween.to - tween.from) * ease(t); if (t >= 1) tween = null; }
      else if (!drag) { pos += speed * dt + fling * dt; fling *= Math.pow(.04, dt); }
      if (visible || drag || tween) track.style.transform = `translate3d(${-wrap(pos)}px,0,0)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  })();

  /* Planos: sem GSAP, acende conforme aparecem */
  const ms = $$('.ms'), route = $('.route');
  const setRoute = p => { route.style.setProperty('--p', p.toFixed(4)); ms.forEach((m, i) => m.classList.toggle('on', p >= (i + .5) / ms.length - .02)); };

  if (reduce || !window.gsap || !window.ScrollTrigger) { ms.forEach(m => m.classList.add('on')); route.style.setProperty('--p', 1); return; }
  const { gsap, ScrollTrigger } = window; gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); window.lenis = lenis;
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); if (id.length < 2) return; const t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: id === '#inicio' ? 0 : -10, duration: 1.4 }); }));
  }

  /* Topo: o para-brisa endireita, a placa sobe */
  gsap.to('#windshield', { rotateY: 0, rotateX: 0, y: -50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.plate', { y: -110, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-copy', { yPercent: -12, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  /* Fita */
  const tape = $('.tape-track'); tape.innerHTML += tape.innerHTML + tape.innerHTML + tape.innerHTML;
  const loop = gsap.to(tape, { xPercent: -25, ease: 'none', duration: 20, repeat: -1 });
  ScrollTrigger.create({ onUpdate: s => { const v = s.getVelocity(); gsap.to(loop, { timeScale: 1 + Math.min(Math.abs(v) / 300, 4) * (v < 0 ? -1 : 1), duration: .2, overwrite: true }); gsap.to(loop, { timeScale: 1, duration: 1.2, delay: .25 }); } });

  /* Planos: o carro percorre a rota (desktop, preso na tela) */
  const mm = gsap.matchMedia();
  mm.add('(min-width:861px)', () => {
    setRoute(0);
    const st = ScrollTrigger.create({ trigger: '.plans', start: 'top top', end: () => '+=' + Math.round(innerHeight * 1.3), pin: '.plans-pin', scrub: true, anticipatePin: 1, onUpdate: s => setRoute(s.progress) });
    return () => st.kill();
  });
  mm.add('(max-width:860px)', () => { ms.forEach(m => new IntersectionObserver(([e], o) => { if (e.isIntersecting) { m.classList.add('on'); o.disconnect(); } }, { threshold: .6 }).observe(m)); });

  /* Rua: imagem com profundidade */
  gsap.fromTo('.street-media', { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1, ease: 'none', scrollTrigger: { trigger: '.street', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.street-pair figure:first-child', { rotateY: 30, y: 80 }, { rotateY: 10, y: 20, ease: 'none', scrollTrigger: { trigger: '.street', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.street-pair figure:last-child', { rotateY: -30, y: 40 }, { rotateY: -10, y: -20, ease: 'none', scrollTrigger: { trigger: '.street', start: 'top bottom', end: 'bottom top', scrub: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
