// L'Oréal Groupe × BIG · «Porque lo valen». El desfile.
// La pasarela está siempre viva: los creadores salen de a uno, posan y vuelven, y el público saca fotos.
// Tocar a uno abre su salida: avanza marca por marca por la pasarela mientras se cuenta su historia, y sus videos se ven en la tarjeta.
(() => {
  'use strict';
  const P = window.PERFILES, DIVISIONES = window.DIVISIONES, MOMENTOS = window.MOMENTOS, CONTACTO = window.CONTACTO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const espera = ms => new Promise(r => setTimeout(r, reduced ? Math.min(ms, 40) : ms));
  const foto = p => `assets/fotos/${p.foto}.webp`;
  const rostroDe = p => p.rostro ?? [0, .06, 1, .667];
  const divDe = id => DIVISIONES.find(d => d.id === id);
  const dos = n => String(n).padStart(2, '0');

  const ICON = {
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-3.2 1.7-4.8 4.9-4.9 1.2-.1 1.6-.1 4.8-.1zm0 4.7a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm5.3-9.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"/></svg>',
    tt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.6 2c.3 2.5 1.7 4 4.2 4.2v3.2c-1.5.1-2.9-.4-4.1-1.2v6.3c0 8-8.7 10.5-12.2 4.8-2.2-3.7-.8-10.2 6.3-10.5v3.4c-.5.1-1.1.2-1.6.4-1.6.5-2.5 1.5-2.2 3.3.5 3.4 6.7 4.4 6.2-2.2V2h3.4z"/></svg>',
    yt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15.3V8.7l5.8 3.3-5.8 3.3z"/></svg>',
  };
  const RED = { ig: 'Instagram', tt: 'TikTok', yt: 'YouTube' };
  const FLECHA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const VOLVER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
  const LUPA = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4-4"/></svg>';
  const PLAY = '<svg viewBox="0 0 10 12" aria-hidden="true"><path d="M0 0l10 6-10 6z"/></svg>';
  const ETAPAS = ['Se apagan las luces', 'Arranca la música', 'Primera salida', '¡Salen todos!'];

  // ── El estado
  const videos = P.map(() => 1); // cuántos videos de cada salida
  let filtro = '', division = 'todas', actual = 0, momento = 0, vista = '', cerrando = false, enVideo = null;
  const total = () => videos.reduce((a, b) => a + b, 0);
  const elegidos = () => P.map((p, i) => i).filter(i => videos[i]);
  const marcas = idx => new Set(idx.map(i => P[i].marca)).size;
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;
  const resumen = () => `${plural(total(), 'video', 'videos')} · ${plural(marcas(elegidos()), 'marca', 'marcas')}`;
  const salida = i => elegidos().indexOf(i) + 1; // su número en el orden del desfile

  const panel = $('.app'), escenario = $('.escenario'), capa = $('.modelos');

  function correo() {
    const lista = elegidos().map((i, n) => `- Salida ${dos(n + 1)} · ${P[i].nombre} × ${P[i].marca} (${P[i].linea}): ${plural(videos[i], 'video', 'videos')}`);
    const cuerpo = `Hola, BIG.\n\nQueremos avanzar con este desfile para L'Oréal Groupe:\n\n${lista.join('\n')}\n\nTotal: ${resumen()}`;
    return `mailto:${CONTACTO}?subject=${encodeURIComponent("L'Oréal Groupe × BIG: Porque lo valen")}&body=${encodeURIComponent(cuerpo)}`;
  }

  // ══ La sala: la pasarela en perspectiva, el público y las luces ══
  // Profundidad z: 1 es el borde de la pasarela, más cerca de la cámara; 12 es la puerta del backstage.
  const sala = $('.sala'), ctx = sala.getContext('2d');
  let G = null, fondo = null, cabezas = [], dpr = 1;
  const Z_PUERTA = 12, Z_POSE = 1.5, MARCAS = [5.2, 3.2, 2.05, 1.32];
  const pisoY = z => G.horizonte + (G.base - G.horizonte) / z;

  function medir() {
    const W = innerWidth, H = innerHeight, movil = W <= 900;
    const ar = panel.getBoundingClientRect();
    const x1 = movil ? W : ar.left - 8;
    const techo = movil ? 56 : 0, piso = movil ? ar.top - 4 : H;
    const alto = piso - techo;
    const horizonte = techo + alto * (movil ? .36 : .44);
    const base = piso - (movil ? 2 : alto * .025);
    const CH = (base - horizonte) * (movil ? 1.06 : 1.12), CW = CH * 9 / 16;
    G = { W, H, movil, x1, cx: x1 / 2, techo, piso, horizonte, base, CH, CW, R: CW * .8 };
    dpr = Math.min(2, devicePixelRatio || 1);
    sala.width = Math.round(W * dpr); sala.height = Math.round(H * dpr);
    capa.style.setProperty('--cw', `${CW}px`); capa.style.setProperty('--ch', `${CH}px`);
    $$('.modelo', capa).forEach(el => { el.style.width = `${CW}px`; el.style.height = `${CH}px`; });
    pintarFondo();
  }

  function pintarFondo() {
    const { W, H, cx, horizonte, R, CW, CH, techo } = G;
    fondo = document.createElement('canvas');
    fondo.width = sala.width; fondo.height = sala.height;
    const c = fondo.getContext('2d');
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    // el fondo del salón y la pared del backstage
    let g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#120f0d'); g.addColorStop(.45, '#1b1613'); g.addColorStop(1, '#070605');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (let x = cx % 46 - 46; x < W; x += 46) { // cortinado
      g = c.createLinearGradient(x, 0, x + 46, 0);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,240,220,.035)'); g.addColorStop(1, 'rgba(0,0,0,.12)');
      c.fillStyle = g; c.fillRect(x, techo, 46, horizonte - techo);
    }
    // la puerta por donde salen, con su luz
    const pz = Z_PUERTA, pw = CW * 1.5 / pz, ph = CH * 1.25 / pz, py = pisoY(pz);
    g = c.createRadialGradient(cx, py - ph / 2, 0, cx, py - ph / 2, ph * 3);
    g.addColorStop(0, 'rgba(255,226,170,.45)'); g.addColorStop(1, 'rgba(255,226,170,0)');
    c.fillStyle = g; c.fillRect(cx - ph * 3, py - ph * 3.5, ph * 6, ph * 4);
    c.fillStyle = '#fff3dc'; c.fillRect(cx - pw / 2, py - ph, pw, ph);
    // la parrilla de luces
    for (let i = 0; i < 9; i++) {
      const x = cx + (i - 4) * Math.min(W, 1100) * .1, y = techo + 22;
      g = c.createRadialGradient(x, y, 0, x, y, 16); g.addColorStop(0, 'rgba(255,236,200,.9)'); g.addColorStop(1, 'rgba(255,236,200,0)');
      c.fillStyle = g; c.fillRect(x - 16, y - 16, 32, 32);
    }
    // el piso del salón
    g = c.createLinearGradient(0, horizonte, 0, H);
    g.addColorStop(0, '#1a1512'); g.addColorStop(1, '#050404');
    c.fillStyle = g; c.fillRect(0, horizonte, W, H - horizonte);
    // la pasarela
    const borde = (z, s) => [cx + s * R / z, pisoY(z)];
    const zc = .45;
    c.beginPath(); c.moveTo(...borde(Z_PUERTA, -1)); c.lineTo(...borde(Z_PUERTA, 1)); c.lineTo(...borde(zc, 1)); c.lineTo(...borde(zc, -1)); c.closePath();
    g = c.createLinearGradient(0, horizonte, 0, H);
    g.addColorStop(0, '#5f574f'); g.addColorStop(.35, '#cfc6bb'); g.addColorStop(1, '#f7f2eb');
    c.fillStyle = g; c.fill();
    // el brillo del piso laqueado
    c.beginPath(); c.moveTo(...borde(Z_PUERTA, -.25)); c.lineTo(...borde(Z_PUERTA, .25)); c.lineTo(...borde(zc, .25)); c.lineTo(...borde(zc, -.25)); c.closePath();
    g = c.createLinearGradient(0, horizonte, 0, H);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.45)');
    c.fillStyle = g; c.fill();
    // las luces de los bordes
    for (let z = 1; z <= Z_PUERTA; z += .45) for (const s of [-1, 1]) {
      const [x, y] = borde(z, s * 1.02), r = Math.max(1, 5 / z);
      g = c.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, 'rgba(255,214,140,.95)'); g.addColorStop(1, 'rgba(255,214,140,0)');
      c.fillStyle = g; c.fillRect(x - r * 4, y - r * 4, r * 8, r * 8);
    }
    // el público, sentado a los costados: de atrás hacia adelante
    cabezas = [];
    const filas = [R + CW * .42, R + CW * .9, R + CW * 1.38, R + CW * 1.86];
    const asientos = [];
    for (let z = Z_PUERTA - 1; z >= 1.05; z -= .42) for (const off of filas) for (const s of [-1, 1]) asientos.push({ z: z + (Math.random() - .5) * .12, x: cx + s * (off + (Math.random() - .5) * CW * .1) / z, s });
    asientos.sort((a, b) => b.z - a.z);
    for (const a of asientos) {
      const k = 1 / a.z, y = pisoY(a.z) - CH * .5 * k, r = CW * .085 * k;
      if (a.x < -r * 4 || a.x > W + r * 4) continue;
      c.fillStyle = '#0b0908';
      c.beginPath(); c.ellipse(a.x, y + r * 2.6, r * 2.1, r * 1.6, 0, Math.PI, 0); c.fill();
      c.fillRect(a.x - r * 2.1, y + r * 2.6, r * 4.2, CH * .5 * k);
      c.beginPath(); c.arc(a.x, y, r, 0, 7); c.fill();
      // la luz de la pasarela les toca el costado de la cara
      const lado = a.x < cx ? 1 : -1, luz = c.createRadialGradient(a.x + lado * r * .7, y, 0, a.x + lado * r * .7, y, r * 1.1);
      luz.addColorStop(0, `rgba(255,222,180,${.16 * clamp(1.5 - a.z / 7)})`); luz.addColorStop(1, 'rgba(255,222,180,0)');
      c.fillStyle = luz; c.beginPath(); c.arc(a.x, y, r, 0, 7); c.fill();
      if (a.z > 1.6 && Math.random() < .1) { // un celular grabando
        const pw = r * .5, ph = r * .85, px = a.x + lado * r * 1.25, py = y - ph * .1;
        const gl = c.createRadialGradient(px, py + ph / 2, 0, px, py + ph / 2, ph * 1.4);
        gl.addColorStop(0, 'rgba(170,200,255,.28)'); gl.addColorStop(1, 'rgba(170,200,255,0)');
        c.fillStyle = gl; c.fillRect(px - ph * 1.4, py + ph / 2 - ph * 1.4, ph * 2.8, ph * 2.8);
        c.fillStyle = 'rgba(205,224,255,.85)'; c.fillRect(px - pw / 2, py, pw, ph);
      }
      if (a.z < 8) cabezas.push({ x: a.x, y, r, z: a.z });
    }
    // dos cañones de luz sobre el frente de la pasarela
    c.globalCompositeOperation = 'lighter';
    for (const s of [-1, 1]) {
      const ox = cx + s * Math.min(W * .5, 700), oy = techo, tx = cx, ty = pisoY(1.6);
      g = c.createLinearGradient(ox, oy, tx, ty);
      g.addColorStop(0, 'rgba(255,236,200,.10)'); g.addColorStop(1, 'rgba(255,236,200,.02)');
      c.fillStyle = g; c.beginPath(); c.moveTo(ox - 20, oy); c.lineTo(ox + 20, oy); c.lineTo(tx + s * R * .9, ty); c.lineTo(tx - s * R * .9, ty); c.closePath(); c.fill();
    }
    g = c.createRadialGradient(cx, pisoY(1.6), 0, cx, pisoY(1.6), R * 1.4);
    g.addColorStop(0, 'rgba(255,240,215,.22)'); g.addColorStop(1, 'rgba(255,240,215,0)');
    c.fillStyle = g; c.fillRect(cx - R * 1.4, pisoY(1.6) - R * 1.4, R * 2.8, R * 2.8);
    c.globalCompositeOperation = 'source-over';
  }

  // los flashes del público
  let flashes = [], ritmo = .8, rafaga = 0;
  function flash(x, y, r, fuerza = 1) { flashes.push({ x, y, r, t: 0, v: 1.8 + Math.random() * 1.6, f: fuerza }); }
  function flashPublico(n = 1, cerca = 8) {
    const opciones = cabezas.filter(c => c.z < cerca);
    for (let k = 0; k < n && opciones.length; k++) { const c = opciones[Math.random() * opciones.length | 0]; flash(c.x, c.y, Math.max(10, c.r * 5)); }
  }
  function destello() {
    if (reduced) return;
    const d = $('.destellos'); d.classList.remove('is-flash'); void d.offsetWidth; d.classList.add('is-flash');
  }

  function pintarSala(dt) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(fondo, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (vista === 'perfil') { // las marcas en el piso donde se frena
      MARCAS.forEach((z, k) => {
        const y = pisoY(z), w = G.R * .5 / z, h = Math.max(2, 7 / z), on = k === momento, ok = k < momento;
        ctx.fillStyle = on ? '#c9a35a' : ok ? 'rgba(201,163,90,.55)' : 'rgba(20,16,13,.35)';
        ctx.fillRect(G.cx - w / 2, y - h / 2, w, h);
        ctx.font = `600 ${Math.max(9, 22 / z)}px Inter, sans-serif`; ctx.textAlign = 'center';
        ctx.fillText(String(k + 1), G.cx + w / 2 + Math.max(10, 26 / z), y + Math.max(3, 7 / z));
      });
    }
    // flashes nuevos según el clima del momento
    if (!reduced) {
      const tasa = ritmo + rafaga;
      if (Math.random() < tasa * dt) flashPublico(1);
      rafaga = Math.max(0, rafaga - dt * 6);
    }
    ctx.globalCompositeOperation = 'lighter';
    flashes = flashes.filter(f => {
      f.t += dt * f.v;
      const a = Math.pow(1 - f.t, 2) * f.f;
      if (a <= 0) return false;
      const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 2.2);
      g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(.25, `rgba(235,242,255,${a * .5})`); g.addColorStop(1, 'rgba(235,242,255,0)');
      ctx.fillStyle = g; ctx.fillRect(f.x - f.r * 2.2, f.y - f.r * 2.2, f.r * 4.4, f.r * 4.4);
      ctx.fillStyle = `rgba(255,255,255,${a * .55})`; // la estrella del flash
      ctx.fillRect(f.x - f.r * 3, f.y - .6, f.r * 6, 1.2); ctx.fillRect(f.x - .6, f.y - f.r * 1.6, 1.2, f.r * 3.2);
      return f.t < 1;
    });
    ctx.globalCompositeOperation = 'source-over';
  }

  // ══ Los creadores en la pasarela ══
  const caminantes = new Map(); // i → { el, z, xw, a, estado, t, fase, destino }
  const encuadre = p => { const [x, , a] = rostroDe(p), vis = (9 / 16) / (2 / 3); return `${clamp((x + a / 2 - vis / 2) / (1 - vis)) * 100}% 40%`; };
  function crearCaminante(i) {
    const p = P[i], el = document.createElement('div');
    el.className = 'modelo'; el.dataset.i = i;
    el.setAttribute('role', 'button'); el.setAttribute('aria-label', `${p.nombre} × ${p.marca}`); el.tabIndex = -1;
    el.style.width = `${G.CW}px`; el.style.height = `${G.CH}px`;
    el.innerHTML = `<div class="modelo__marco"><img src="${foto(p)}" alt="" style="object-position:${encuadre(p)}" draggable="false"><span class="modelo__n"></span><div class="modelo__rotulo"><span>${esc(p.marca)}</span><b>${esc(p.nombre)}</b></div></div>`;
    capa.appendChild(el);
    const w = { i, el, z: Z_PUERTA, xw: -G.R * .3, elev: 0, a: 0, estado: 'entra', t: 0, fase: Math.random() * 6, destino: null };
    caminantes.set(i, w);
    return w;
  }
  function sacar(w) { w.el.remove(); caminantes.delete(w.i); }

  let ultimaSalida = -1e9, cola = 0;
  function moverDesfile(dt, ahora) {
    const V = G.movil ? 2.1 : 2.3;
    if (vista !== 'perfil' && vista !== 'listo' && vista !== 'cierre') { // el desfile de siempre: de a uno, en orden
      const lista = elegidos();
      if (lista.length && ahora - ultimaSalida > (reduced ? 4000 : 2500)) {
        for (let k = 0; k < lista.length; k++) {
          const i = lista[(cola + k) % lista.length];
          if (!caminantes.has(i)) { crearCaminante(i); cola = (cola + k + 1) % lista.length; ultimaSalida = ahora; break; }
        }
      }
    }
    caminantes.forEach(w => {
      let camina = false;
      if (w.estado === 'entra') {
        w.z -= V * dt; camina = true; w.a = Math.min(1, w.a + dt * 2.5);
        w.xw += (-G.R * .3 - w.xw) * dt * 2;
        if (w.z <= Z_POSE) { w.z = Z_POSE; w.estado = 'pose'; w.t = 0; rafaga += 7; }
      } else if (w.estado === 'pose') {
        w.t += dt; w.xw += (0 - w.xw) * dt * 4;
        if (w.t > 1.4) w.estado = 'vuelve';
      } else if (w.estado === 'vuelve') {
        w.z += V * dt; camina = true; w.xw += (G.R * .55 - w.xw) * dt * 2.5;
        if (w.z > 7.5) w.a = Math.max(0, w.a - dt * 1.2);
        if (w.z >= Z_PUERTA || w.a <= 0) return sacar(w);
      } else if (w.estado === 'fuera') {
        w.a -= dt * 3.5;
        if (w.a <= 0) return sacar(w);
      } else if (w.estado === 'va') { // va hacia un destino: su marca en la pasarela o su lugar en el final
        const [zd, xd, ed = 0] = w.destino, dz = zd - w.z, paso = V * 1.25 * dt;
        w.elev += (ed - w.elev) * Math.min(1, dt * 2.5);
        w.a = Math.min(1, w.a + dt * 2.5);
        if (Math.abs(dz) > .01) { w.z += Math.sign(dz) * Math.min(Math.abs(dz), paso * Math.max(.5, w.z / 3)); camina = Math.abs(dz) > .03; }
        w.xw += (xd - w.xw) * Math.min(1, dt * 3);
        if (!camina && !w.llego) { w.llego = true; w.alLlegar?.(); }
      }
      if (camina) w.fase += dt * 8.5;
      const s = 1 / w.z, X = G.cx + w.xw * s, Y = pisoY(w.z) - w.elev * s;
      const bob = camina ? -Math.abs(Math.sin(w.fase)) * 7 * s : 0, giro = camina ? Math.sin(w.fase) * 1.1 : 0;
      w.el.style.transform = `translate3d(${X - G.CW / 2}px,${Y - G.CH + bob}px,0) scale(${s}) rotate(${giro}deg)`;
      w.el.style.opacity = w.a;
      w.el.style.zIndex = Math.round(3000 - w.z * 200);
      w.el.style.filter = w.estado === 'vuelve' ? 'brightness(.75)' : '';
      const n = salida(w.i); w.el.querySelector('.modelo__n').textContent = n ? `SALIDA ${dos(n)}` : '';
    });
  }
  function irA(w, z, xw, alLlegar, elev = 0) { w.estado = 'va'; w.destino = [z, xw, elev]; w.llego = false; w.alLlegar = alLlegar; }

  // ══ La app ══
  const cara = (p, clase = '') => {
    const [x, y, a, b] = rostroDe(p), pos = (v, t) => (t < 1 ? v / (1 - t) * 100 : 50);
    return `<i class="cara ${clase}" role="img" aria-label="${esc(p.nombre)}" style="background-image:url(${foto(p)});background-size:${100 / a}% ${100 / b}%;background-position:${pos(x, a)}% ${pos(y, b)}%"></i>`;
  };
  const redes = p => ['ig', 'tt', 'yt'].filter(r => p[r]);
  const contador = (i, n) => `<div class="stepper" data-i="${i}"><button type="button" data-d="-1" aria-label="Sacar un video">−</button><b>${n}</b><button type="button" data-d="1" aria-label="Sumar un video">+</button></div>`;
  const fila = (p, i, num) => `<li class="row${videos[i] ? '' : ' is-off'}" style="--c:${p.color}">
      <button class="row__abrir" type="button" data-abrir="${i}"${num ? ` data-n="${dos(num)}"` : ''}>${cara(p)}<span class="row__t"><b>${esc(p.nombre)}${p.videos.length ? `<span class="play" title="Tiene videos">${PLAY}${p.videos.length}</span>` : ''}</b><span class="row__m"><i class="punto"></i><span>${esc(p.marca)} · ${esc(p.linea)}</span></span></span></button>
      ${videos[i] ? contador(i, videos[i]) : `<button class="add" type="button" data-add="${i}" aria-label="Sumar a ${esc(p.nombre)}">+</button>`}
    </li>`;
  const porDivision = (lista, hacer) => DIVISIONES.map(d => {
    const f = lista.filter(i => P[i].division === d.id);
    return f.length ? `<li class="grupo">${d.nombre}</li>${f.map(hacer).join('')}` : '';
  }).join('');
  const miniatura = v => (v.yt ? `https://i.ytimg.com/vi/${v.yt}/hqdefault.jpg` : null);
  const fuente = v => (v.yt ? `https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&playsinline=1&rel=0&modestbranding=1`
    : v.tt ? `https://www.tiktok.com/player/v1/${v.tt}?autoplay=1&rel=0` : `https://www.instagram.com/reel/${v.ig}/embed`);
  const esVertical = v => v.vertical !== false;

  const vistas = {
    lista() {
      panel.innerHTML = `<div class="tarjeta">
        <header class="cab">
          <p class="kicker">L'Oréal Groupe × BIG</p>
          <h2>Armá el desfile</h2>
          <p class="cab__bajada">En París, L'Oréal Paris salió a la pasarela a decir <em>Expresá tu valor</em>. Esta es la pasarela de BIG: cada salida es un creador con una marca del grupo, y la marca entra en su video de siempre.</p>
          <label class="buscar">${LUPA}<input type="search" placeholder="Buscar creador, marca o producto" aria-label="Buscar creador, marca o producto" value="${esc(filtro)}"></label>
          <div class="filtros" role="group" aria-label="División del grupo">${[{ id: 'todas', corto: 'Todas' }, ...DIVISIONES].map(d => `<button type="button" data-div="${d.id}" aria-pressed="${division === d.id}">${d.corto}</button>`).join('')}</div>
        </header>
        <ul class="lista"></ul>
      </div>
      <footer class="pie"><span class="pie__n"></span><button class="ir" type="button" data-ir="desfile">Ver desfile ${FLECHA}</button></footer>`;
      const input = $('input', panel);
      input.addEventListener('input', () => { filtro = input.value; pintarLista(); });
      pintarLista();
    },
    perfil() {
      const p = P[actual];
      const tiles = p.videos.map((v, k) => {
        const m = miniatura(v);
        return `<button class="video" type="button" data-video="${k}" aria-label="Ver: ${esc(v.t)}">${m ? `<img src="${m}" alt="" loading="lazy">` : `<img src="${foto(p)}" alt="">`}<i>${PLAY}</i><span>${esc(v.t)}</span></button>`;
      }).join('');
      const perfiles = redes(p).map(r => `<a class="video video--red" href="${p.links[r]}" target="_blank" rel="noopener"><i>${ICON[r]}</i><span>Ver su ${RED[r]}</span></a>`).join('');
      panel.innerHTML = `<div class="tarjeta">
        <header class="t__top">
          <button class="back" type="button" data-ir="lista" aria-label="Volver a la lista">${VOLVER}</button>
          ${cara(p, 'cara--g')}
          <div class="t__id"><h2>${esc(p.nombre)}</h2><p><span class="chip"></span><a href="${p.links.ig}" target="_blank" rel="noopener">@${esc(p.usuario)}</a></p></div>
          <span class="anillo" aria-hidden="true"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5"/><circle class="anillo__v" cx="18" cy="18" r="15.5" pathLength="100"/></svg><b>1</b></span>
        </header>
        <div class="t__marca" style="--c:${p.color}"><i class="punto"></i><div><span>${divDe(p.division).nombre} · ${esc(p.rubro)}</span><b>${esc(p.marca)}</b><i>${esc(p.linea)}</i></div></div>
        <div class="t__redes">${redes(p).map(r => `<a href="${p.links[r]}" target="_blank" rel="noopener" aria-label="${RED[r]}: ${p[r]} seguidores">${ICON[r]}${p[r]}</a>`).join('')}</div>
        <p class="t__prueba"><b>Ya lo hace</b><span>${esc(p.prueba)}</span></p>
        <h3 class="t__titulo">${esc(p.titulo)}</h3>
        <ol class="pasos">${MOMENTOS.map((m, j) => `<li><button class="paso" type="button" data-m="${j}"><span class="paso__n">${j + 1}</span><span class="paso__c"><b>${m}</b><span>${esc(p.momentos[j])}</span></span></button></li>`).join('')}</ol>
        <h4 class="t__sub">${p.videos.length ? 'En sus redes' : 'Su contenido'}</h4>
        <div class="videos">${tiles || perfiles}</div>
      </div>
      <footer class="pie"></footer>`;
    },
    desfile() {
      const sel = elegidos();
      panel.innerHTML = `<div class="tarjeta">
        <header class="t__top t__top--simple"><button class="back" type="button" data-ir="lista" aria-label="Volver a la lista">${VOLVER}</button><h2>El desfile</h2></header>
        ${sel.length ? `<ul class="lista orden">${sel.map((i, n) => fila(P[i], i, n + 1)).join('')}</ul>` : '<p class="vacio">No hay salidas todavía. Volvé a la lista y sumá creadores.</p>'}
        <dl class="resumen">
          <div><dt>Salidas</dt><dd>${sel.length}</dd></div>
          <div><dt>Marcas</dt><dd>${marcas(sel)}</dd></div>
          <div><dt>Videos</dt><dd>${total()}</dd></div>
        </dl>
        <p class="nota">Cada video sale en Reels y TikTok, con stories de apoyo. Inversión, usos y fechas los definimos con ustedes.</p>
      </div>
      <footer class="pie pie--cta"><button class="cta" type="button" data-cerrar ${total() ? '' : 'disabled'}>Que empiece el desfile</button></footer>`;
    },
    cierre() {
      panel.innerHTML = `<div class="tarjeta tarjeta--centro" aria-live="polite">
        <p class="kicker">${resumen()}</p>
        <h2 class="etapa">${ETAPAS[0]}</h2>
        <div class="barra">${ETAPAS.map(() => '<i><b></b></i>').join('')}</div>
      </div>`;
    },
    listo() {
      const sel = elegidos();
      panel.innerHTML = `<div class="tarjeta tarjeta--centro">
        <h2 class="fin"><span>Porque lo valen.</span><span>¿Hablamos?</span></h2>
        <div class="caras">${sel.slice(0, 9).map(i => cara(P[i])).join('')}</div>
        <p class="kicker">${resumen()}</p>
        <a class="cta" href="${correo()}">Escribir a BIG</a>
        <p class="correo">${CONTACTO}</p>
      </div>
      <footer class="pie"><span class="pie__n">${plural(sel.length, 'salida', 'salidas')}</span><button class="ir" type="button" data-otra>Armar otro ${FLECHA}</button></footer>`;
    },
  };

  function pintarLista() {
    const ul = $('.lista', panel), q = norm(filtro.trim());
    if (!ul) return;
    const lista = P.map((p, i) => i).filter(i => { const p = P[i]; return (division === 'todas' || p.division === division) && (!q || norm(`${p.nombre} ${p.marca} ${p.linea} ${p.tag} ${p.rubro} ${divDe(p.division).nombre}`).includes(q)); });
    ul.innerHTML = lista.length ? porDivision(lista, i => fila(P[i], i)) : `<li class="vacio">No hay salidas con «${esc(filtro)}».</li>`;
    $('.pie__n', panel).textContent = resumen();
    $('[data-ir="desfile"]', panel).disabled = !total();
  }
  function pintarPie() {
    const pie = $('.pie', panel), chip = $('.chip', panel), n = videos[actual];
    if (!pie) return;
    chip.textContent = n ? `Salida ${dos(salida(actual))}` : 'Fuera del desfile';
    chip.classList.toggle('is-on', n > 0);
    const izq = n ? contador(actual, n) : `<button class="add add--txt" type="button" data-add="${actual}">+ Sumar</button>`;
    const der = momento < MOMENTOS.length - 1
      ? `<button class="ir" type="button" data-seguir>Seguir ${FLECHA}</button>`
      : `<button class="ir" type="button" data-sig>Siguiente salida ${FLECHA}</button>`;
    pie.innerHTML = izq + der;
  }

  // ── Su salida: camina hasta cada marca a medida que avanza la historia
  function protagonista() {
    let w = caminantes.get(actual);
    if (!w) w = crearCaminante(actual);
    caminantes.forEach(o => { if (o !== w) o.estado = 'fuera'; });
    w.el.classList.add('is-elegido');
    return w;
  }
  function ponerMomento(k) {
    momento = clamp(k, 0, MOMENTOS.length - 1);
    cerrarVideo(false);
    const v = $('.anillo__v', panel);
    if (v) { v.style.strokeDashoffset = 100 - (momento + 1) / MOMENTOS.length * 100; $('.anillo b', panel).textContent = momento + 1; }
    $$('.paso', panel).forEach((p, j) => { p.classList.toggle('is-on', j === momento); p.classList.toggle('is-ok', j < momento); p.setAttribute('aria-current', j === momento ? 'step' : 'false'); });
    const w = protagonista(), m = momento;
    irA(w, MARCAS[m], 0, () => { rafaga += 3 + m * 4; if (m === MOMENTOS.length - 1) { flashPublico(10, 4); destello(); } });
    pintarPie();
  }

  // ── Sus videos: los verticales se ven en la tarjeta, en primer plano; los horizontales y en el celular, en un visor
  let visor = null;
  function verVideo(k) {
    const p = P[actual], v = p.videos[k];
    if (!v) return;
    cerrarVideo(false);
    enVideo = k;
    $$('.video', panel).forEach((b, j) => b.classList.toggle('is-on', j === k));
    const iframe = `<iframe src="${fuente(v)}" title="${esc(v.t)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    if (G.movil || !esVertical(v)) {
      visor = document.createElement('div');
      visor.className = `visor${esVertical(v) ? ' visor--v' : ''}`;
      visor.innerHTML = `<div class="visor__caja">${iframe}</div><p class="visor__t">${esc(p.nombre)} · ${esc(v.t)}</p><button class="visor__cerrar" type="button" aria-label="Cerrar video">×</button>`;
      visor.addEventListener('click', e => { if (e.target === visor || e.target.closest('.visor__cerrar')) cerrarVideo(); });
      body.appendChild(visor);
      return;
    }
    const w = protagonista();
    irA(w, 1, 0, () => {
      if (enVideo !== k) return;
      w.el.classList.add('is-video');
      w.el.querySelector('.modelo__marco').insertAdjacentHTML('beforeend', iframe.replace('<iframe', '<iframe class="modelo__video"'));
    });
  }
  function cerrarVideo(volver = true) {
    if (enVideo == null) return;
    enVideo = null;
    visor?.remove(); visor = null;
    $$('.modelo__video').forEach(f => f.remove());
    $$('.modelo.is-video').forEach(m => m.classList.remove('is-video'));
    $$('.video', panel).forEach(b => b.classList.remove('is-on'));
    if (volver && vista === 'perfil') irA(protagonista(), MARCAS[momento], 0);
  }

  function cambiar(i, d) {
    videos[i] = clamp(videos[i] + d, 0, 5);
    if (vista === 'desfile') vistas.desfile();
    else if (vista === 'perfil') pintarPie();
    else pintarLista();
  }
  function ir(v) {
    const antes = vista;
    if (antes === 'perfil' && v !== 'perfil') {
      cerrarVideo(false);
      caminantes.forEach(w => { w.el.classList.remove('is-elegido'); if (w.estado === 'va') { w.estado = 'vuelve'; } });
    }
    if (antes === 'listo' && v !== 'listo') caminantes.forEach(w => { w.estado = 'fuera'; });
    vista = v; body.dataset.vista = v;
    vistas[v]();
    ritmo = v === 'perfil' ? .5 : v === 'listo' ? 2.5 : .9;
    if (antes && antes !== v && !reduced) $$(':scope > *', panel).forEach((el, j) => el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 420, delay: j * 50, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
  }
  function abrirPerfil(i) {
    if (cerrando) return;
    actual = i;
    ir('perfil');
    ponerMomento(0);
  }

  // ── El final: salen todos juntos y se quedan al frente
  async function cerrar() {
    if (!total() || cerrando) return;
    cerrando = true;
    ir('cierre');
    caminantes.forEach(w => { w.estado = 'fuera'; });
    ritmo = 0;
    const etapa = $('.etapa', panel), barras = $$('.barra b', panel);
    for (let i = 0; i < ETAPAS.length; i++) {
      etapa.textContent = ETAPAS[i];
      etapa.classList.remove('is-nueva'); void etapa.offsetWidth; etapa.classList.add('is-nueva');
      barras[i].style.width = '100%';
      if (i === 2) formacion();
      await espera(1000);
    }
    rafaga += 25; destello();
    cerrando = false;
    ir('listo');
  }
  function formacion() { // la foto grupal: filas que entran en el cuadro, las de atrás sobre una tarima
    const sel = elegidos(), n = sel.length, filas = n <= 6 ? 1 : n <= 12 ? 2 : 3;
    const porFila = Math.ceil(n / filas), ancho = G.x1 * .9;
    let zAnt = 0, pieAnt = 0, altoAnt = 0;
    const filasDe = [];
    for (let f = 0; f < filas; f++) {
      const m = Math.min(porFila, n - f * porFila);
      let z = Math.max(1.55, m * G.CW * 1.06 / ancho);
      if (f) z = Math.max(z, zAnt * 1.22);
      // el pie de esta fila asoma por encima de las cabezas de la fila de adelante
      const pie = f ? pieAnt - altoAnt * .72 : pisoY(z), elev = (pisoY(z) - pie) * z;
      filasDe.push({ z, elev, m, desde: f * porFila });
      zAnt = z; pieAnt = pie; altoAnt = G.CH / z;
    }
    sel.forEach((i, k) => {
      const f = filasDe.find(r => k >= r.desde && k < r.desde + r.m), j = k - f.desde;
      const paso = G.CW * 1.04, x = (j - (f.m - 1) / 2) * paso;
      setTimeout(() => {
        if (caminantes.has(i)) sacar(caminantes.get(i));
        const w = crearCaminante(i);
        w.xw = x; w.elev = f.elev;
        irA(w, f.z, x, () => flashPublico(2, 5), f.elev);
      }, reduced ? 0 : k * 120);
    });
  }

  // ── Los toques
  document.addEventListener('click', e => {
    const t = e.target.closest('button');
    const modelo = e.target.closest('.modelo');
    if (modelo && !t) { // tocar a quien está en su salida hace avanzar la historia
      const i = +modelo.dataset.i;
      if (vista === 'perfil' && i === actual) return enVideo != null ? null : momento < MOMENTOS.length - 1 ? ponerMomento(momento + 1) : null;
      return vista === 'cierre' ? null : abrirPerfil(i);
    }
    if (!t) return;
    const d = t.dataset;
    if (d.abrir) return abrirPerfil(+d.abrir);
    if (d.ir) return ir(d.ir);
    if (d.add) return cambiar(+d.add, 1);
    if (d.d) return cambiar(+t.closest('.stepper').dataset.i, +d.d);
    if (d.div) { division = d.div; $$('.filtros button', panel).forEach(b => b.setAttribute('aria-pressed', b === t)); return pintarLista(); }
    if (d.m) return ponerMomento(+d.m);
    if (d.seguir !== undefined) return ponerMomento(momento + 1);
    if (d.sig !== undefined) { const lista = elegidos(), pos = lista.indexOf(actual); return abrirPerfil(lista.length ? lista[(pos + 1) % lista.length] : (actual + 1) % P.length); }
    if (d.video) return enVideo === +d.video ? cerrarVideo() : verVideo(+d.video);
    if (d.cerrar !== undefined) return cerrar();
    if (d.otra !== undefined) { videos.fill(1); return ir('lista'); }
  });
  // tocar la sala es sacar una foto
  sala.addEventListener('pointerdown', e => { flash(e.clientX, e.clientY, 34, 1.2); rafaga += 2; destello(); });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input')) return;
    if (e.key === 'Escape') { if (enVideo != null) return cerrarVideo(); if (vista === 'perfil') ir('lista'); return; }
    if (vista !== 'perfil') return;
    if (e.key === 'ArrowRight') { if (momento < MOMENTOS.length - 1) ponerMomento(momento + 1); else $('[data-sig]', panel)?.click(); }
    else if (e.key === 'ArrowLeft' && momento > 0) ponerMomento(momento - 1);
  });

  // ── Arranca
  let ultimo = performance.now();
  function cuadro(ahora) {
    const dt = Math.min(.1, (ahora - ultimo) / 1000); ultimo = ahora;
    if (!body.classList.contains('is-loading')) moverDesfile(dt, ahora);
    pintarSala(dt);
    requestAnimationFrame(cuadro);
  }
  ir('lista');
  medir();
  addEventListener('resize', () => { medir(); });
  requestAnimationFrame(cuadro);

  (async () => {
    const etapa = $('.carga__etapa'), barras = $$('.carga__barra b');
    const textos = ['Armando el backstage', 'Probando las luces', '¡A la pasarela!'];
    const listo = Promise.all([document.fonts?.ready, ...P.map(p => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = foto(p); }))]);
    for (let i = 0; i < textos.length; i++) {
      etapa.textContent = textos[i];
      etapa.classList.remove('is-nueva'); void etapa.offsetWidth; etapa.classList.add('is-nueva');
      barras[i].style.transition = `width ${reduced ? 10 : 620}ms cubic-bezier(.22,1,.36,1)`;
      barras[i].style.width = '100%';
      await espera(680);
      if (i === 1) await Promise.race([listo, espera(4000)]);
    }
    $('.loader').classList.add('is-out');
    body.classList.remove('is-loading');
    medir();
    setTimeout(() => $('.loader')?.remove(), 1200);
  })();
})();
