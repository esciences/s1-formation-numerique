/* ==========================================================================
   NÉON-86 — décors des lieux (SVG dessiné en code, aucune image externe)
   Chaque scène : 1200 × 675, même perspective (point de fuite 600, 260),
   même éclairage. L'état de la partie (E) modifie le décor.
   E = { resolu: {A1:true,...}, boulon: 0..6 (pièces remontées), final: bool, signal: bool }
   ========================================================================== */
(function () {
  "use strict";
  const W = 1200, H = 675;
  const R = (E, id) => !!(E.resolu && E.resolu[id]);

  /* ---------- définitions communes ---------- */
  const DEFS = `<defs>
    <linearGradient id="gMur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9b29e"/><stop offset=".55" stop-color="#a49c86"/><stop offset="1" stop-color="#8a8370"/></linearGradient>
    <linearGradient id="gMurG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6f6a5b"/><stop offset="1" stop-color="#8f8873"/></linearGradient>
    <linearGradient id="gMurD" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#6f6a5b"/><stop offset="1" stop-color="#8f8873"/></linearGradient>
    <linearGradient id="gSol" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b4f58"/><stop offset="1" stop-color="#2a2d33"/></linearGradient>
    <linearGradient id="gPlafond" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5c5a52"/><stop offset="1" stop-color="#2f2e2a"/></linearGradient>
    <linearGradient id="gBeige" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eee4c6"/><stop offset="1" stop-color="#cfc2a0"/></linearGradient>
    <linearGradient id="gBeigeF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9cca8"/><stop offset="1" stop-color="#b3a684"/></linearGradient>
    <linearGradient id="gAcier" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9aa3ad"/><stop offset="1" stop-color="#5f6872"/></linearGradient>
    <linearGradient id="gBois" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7e8b97"/><stop offset="1" stop-color="#55606b"/></linearGradient>
    <radialGradient id="gCrt" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#173a2c"/><stop offset="1" stop-color="#06120d"/></radialGradient>
    <radialGradient id="gCrtA" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#3a2a0a"/><stop offset="1" stop-color="#120c03"/></radialGradient>
    <radialGradient id="gEspace" cx=".5" cy=".6" r=".8"><stop offset="0" stop-color="#1c2a5e"/><stop offset="1" stop-color="#050816"/></radialGradient>
    <radialGradient id="gHalo" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#fff2c4" stop-opacity=".55"/><stop offset="1" stop-color="#fff2c4" stop-opacity="0"/></radialGradient>
    <radialGradient id="gHaloV" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#bff7ff" stop-opacity=".5"/><stop offset="1" stop-color="#bff7ff" stop-opacity="0"/></radialGradient>
    <radialGradient id="gVignette" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
    <radialGradient id="gTerre" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="#5fb4ff"/><stop offset=".6" stop-color="#1f5fb0"/><stop offset="1" stop-color="#0b2552"/></radialGradient>
    <pattern id="pGrille" width="12" height="8" patternUnits="userSpaceOnUse"><rect width="12" height="8" fill="#3a3a36"/><rect y="1" width="12" height="3" fill="#15150f"/></pattern>
    <pattern id="pRayures" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="28" height="28" fill="#f2b705"/><rect width="14" height="28" fill="#1d1a14"/></pattern>
    <pattern id="pBalayage" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000" opacity=".22"/></pattern>
    <pattern id="pTable" width="30" height="30" patternUnits="userSpaceOnUse"><rect width="30" height="30" fill="#dff6ff"/><path d="M30 0H0V30" fill="none" stroke="#7cc8de" stroke-width="1"/></pattern>
    <filter id="fLueur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="fOmbre" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#000" flood-opacity=".45"/></filter>
  </defs>`;

  /* ---------- briques de décor ---------- */
  const vis = (x, y, r = 4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#d8d2c0" stroke="#5a5546" stroke-width="1.5"/><path d="M${x - r * .6} ${y}h${r * 1.2}" stroke="#5a5546" stroke-width="1.2"/>`;
  const plaque = (x, y, w, h, txt, fs = 15, fond = "#1d1a14", coul = "#f2e6c2") =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fond}" stroke="#000" stroke-opacity=".5"/>${vis(x + 7, y + h / 2, 3)}${vis(x + w - 7, y + h / 2, 3)}
     <text x="${x + w / 2}" y="${y + h / 2 + fs * .36}" text-anchor="middle" font-family="DejaVu Sans Mono, Courier New, monospace" font-size="${fs}" font-weight="bold" fill="${coul}" letter-spacing="1">${txt}</text></g>`;
  const voyant = (x, y, on, coul = "#7cffb2", r = 7) =>
    `<circle cx="${x}" cy="${y}" r="${r + 3}" fill="#1d1a14"/><circle cx="${x}" cy="${y}" r="${r}" fill="${on ? coul : "#3b3a33"}" ${on ? 'filter="url(#fLueur)"' : ""}/><circle cx="${x - r / 3}" cy="${y - r / 3}" r="${r / 3}" fill="#fff" opacity="${on ? .7 : .25}"/>`;
  const etoiles = (x, y, w, h, n, graine = 1) => Array.from({ length: n }, (_, i) => {
    const a = (i * 97 + graine * 31) % 1000 / 1000, b = (i * 53 + graine * 17) % 1000 / 1000;
    return `<circle cx="${x + a * w}" cy="${y + b * h}" r="${i % 7 ? 1.1 : 2}" fill="#fff" opacity="${.35 + (i % 5) / 8}"/>`;
  }).join("");

  function coque(E, energie, opt = {}) {
    // pièce : plafond, murs latéraux, mur du fond, sol en perspective
    const pf = 600, pv = 260;
    let sol = "";
    for (let i = -6; i <= 6; i++) sol += `<line x1="${600 + i * 70}" y1="455" x2="${600 + i * 230}" y2="${H}" stroke="#1a1c20" stroke-width="2"/>`;
    [470, 500, 545, 610].forEach((y) => (sol += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#1a1c20" stroke-width="2"/>`));
    let panneaux = "";
    for (let x = 175; x < 1030; x += 143) panneaux += `<line x1="${x}" y1="72" x2="${x}" y2="452" stroke="#6d6756" stroke-width="2"/><line x1="${x + 2}" y1="72" x2="${x + 2}" y2="452" stroke="#cfc8b2" stroke-width="1" opacity=".6"/>${vis(x + 12, 88, 3)}${vis(x + 12, 436, 3)}`;
    const lampe = energie > .66 ? "url(#gHaloV)" : "url(#gHalo)";
    return `
      <rect width="${W}" height="${H}" fill="#14161b"/>
      <polygon points="0,0 ${W},0 1030,70 170,70" fill="url(#gPlafond)"/>
      ${[300, 600, 900].map((x) => `<rect x="${x - 70}" y="18" width="140" height="22" rx="4" fill="#2b2a26"/><rect x="${x - 62}" y="22" width="124" height="12" rx="3" fill="${energie > 0 ? (energie > .66 ? "#d9fbff" : "#ffe7a8") : "#5a5647"}"/>`).join("")}
      <polygon points="0,0 170,70 170,455 0,${H}" fill="url(#gMurG)"/>
      <polygon points="${W},0 1030,70 1030,455 ${W},${H}" fill="url(#gMurD)"/>
      <rect x="170" y="70" width="860" height="385" fill="url(#gMur)"/>
      ${panneaux}
      <rect x="170" y="405" width="860" height="50" fill="#7d7766"/><rect x="170" y="405" width="860" height="4" fill="#cfc8b2" opacity=".6"/>
      <rect x="185" y="420" width="120" height="22" fill="url(#pGrille)"/><rect x="895" y="420" width="120" height="22" fill="url(#pGrille)"/>
      <polygon points="170,455 1030,455 ${W},${H} 0,${H}" fill="url(#gSol)"/>${sol}
      <polygon points="0,${H - 18} ${W},${H - 18} ${W},${H} 0,${H}" fill="url(#pRayures)" opacity=".85"/>
      <path d="M0 120 C 60 150, 110 140, 170 160" stroke="#262626" stroke-width="7" fill="none"/><path d="M0 140 C 70 175, 120 165, 170 185" stroke="#8a2b1d" stroke-width="5" fill="none"/>
      <polygon points="0,0 ${W},0 1030,70 170,70" fill="${lampe}" opacity=".9"/>
      ${opt.sansCadre ? "" : ""}`;
  }
  function eclairage(energie) {
    // mode secours ambre -> lumière froide
    const ambre = Math.max(0, .32 * (1 - energie)), sombre = Math.max(0, .38 * (1 - energie));
    return `<rect width="${W}" height="${H}" fill="#ff9a1a" opacity="${ambre}" style="mix-blend-mode:multiply"/>
      <rect width="${W}" height="${H}" fill="#000" opacity="${sombre}"/>
      <rect width="${W}" height="${H}" fill="url(#gVignette)"/>`;
  }
  function porte(x, y, w, h, nom, ouverte) {
    return `<g filter="url(#fOmbre)"><rect x="${x - 10}" y="${y - 10}" width="${w + 20}" height="${h + 10}" rx="10" fill="#4d4a40"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="url(#gAcier)"/>
      <rect x="${x}" y="${y}" width="${w}" height="16" fill="url(#pRayures)"/>
      <line x1="${x + w / 2}" y1="${y + 16}" x2="${x + w / 2}" y2="${y + h}" stroke="#2c3138" stroke-width="3"/>
      <rect x="${x + 12}" y="${y + 40}" width="${w / 2 - 22}" height="${h * .3}" rx="4" fill="#1d2230" opacity=".8"/><rect x="${x + w / 2 + 10}" y="${y + 40}" width="${w / 2 - 22}" height="${h * .3}" rx="4" fill="#1d2230" opacity=".8"/>
      ${plaque(x - 12, y - 44, w + 24, 28, nom, 12)}
      ${voyant(x + w + 18, y + 30, true, ouverte ? "#7cffb2" : "#ffb000", 6)}</g>`;
  }
  function crt(x, y, w, h, contenu, ambre) {
    return `<g filter="url(#fOmbre)"><rect x="${x - 16}" y="${y - 14}" width="${w + 32}" height="${h + 40}" rx="16" fill="url(#gBeige)" stroke="#7c7056" stroke-width="2"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="url(#${ambre ? "gCrtA" : "gCrt"})" stroke="#2a2a22" stroke-width="4"/>
      <g>${contenu}</g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="url(#pBalayage)"/>
      <path d="M${x + 14} ${y + 12} q ${w * .3} -6 ${w * .55} 0" stroke="#fff" stroke-width="5" opacity=".08" fill="none"/>
      ${voyant(x + w - 10, y + h + 14, true, ambre ? "#ffb000" : "#7cffb2", 4)}
      <rect x="${x + 14}" y="${y + h + 9}" width="${w * .3}" height="8" rx="3" fill="#8f8468"/></g>`;
  }
  function boulonSVG(x, y, s, parts, humeur) {
    // parts 0..6 : 1 roues, 2 torse, 3 bras, 4 tête, 5 yeux, 6 antenne
    const g = [];
    if (parts >= 1) g.push(`<circle cx="-22" cy="92" r="13" fill="#2b2b2b"/><circle cx="22" cy="92" r="13" fill="#2b2b2b"/><circle cx="-22" cy="92" r="4" fill="#999"/><circle cx="22" cy="92" r="4" fill="#999"/>`);
    if (parts >= 2) g.push(`<rect x="-34" y="34" width="68" height="52" rx="8" fill="#7f97ad" stroke="#2d3a46" stroke-width="3"/><rect x="-22" y="46" width="12" height="12" fill="#ffb000"/><rect x="-5" y="46" width="12" height="12" fill="#7cffb2"/><rect x="12" y="46" width="8" height="12" fill="#ff5c8a"/><rect x="-24" y="66" width="48" height="8" rx="3" fill="#2d3a46"/>`);
    if (parts >= 3) g.push(`<rect x="-52" y="40" width="14" height="34" rx="6" fill="#9fb4c7" stroke="#2d3a46" stroke-width="3"/><rect x="38" y="${humeur === "salut" ? 10 : 40}" width="14" height="34" rx="6" fill="#9fb4c7" stroke="#2d3a46" stroke-width="3" ${humeur === "salut" ? 'transform="rotate(-25 45 40)"' : ""}/>`);
    if (parts >= 4) g.push(`<rect x="-36" y="-14" width="72" height="46" rx="10" fill="#9fb4c7" stroke="#2d3a46" stroke-width="3"/><path d="M-12 22 h24" stroke="#2d3a46" stroke-width="3" stroke-linecap="round"/>`);
    if (parts >= 5) g.push(`<circle cx="-15" cy="6" r="9" fill="#fff" stroke="#2d3a46" stroke-width="2"/><circle cx="-13" cy="6" r="4" fill="#1b1b2f"/><circle cx="15" cy="6" r="9" fill="#fff" stroke="#2d3a46" stroke-width="2"/><circle cx="17" cy="6" r="4" fill="#1b1b2f"/>`);
    else if (parts >= 4) g.push(`<path d="M-22 6 h14 M8 6 h14" stroke="#2d3a46" stroke-width="3"/>`);
    if (parts >= 6) g.push(`<line x1="0" y1="-14" x2="0" y2="-34" stroke="#2d3a46" stroke-width="3"/><circle cx="0" cy="-38" r="6" fill="#ff5c8a" filter="url(#fLueur)"/>`);
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#fOmbre)">${g.join("")}</g>`;
  }
  function piecesEnVrac(x, y, restantes) {
    // pièces de Boulon pas encore remontées, posées sur l'établi
    const p = [];
    if (restantes >= 1) p.push(`<rect x="0" y="-8" width="38" height="24" rx="6" fill="#9fb4c7" stroke="#2d3a46" stroke-width="2" transform="rotate(-12)"/>`);
    if (restantes >= 2) p.push(`<circle cx="70" cy="6" r="12" fill="#2b2b2b"/>`);
    if (restantes >= 3) p.push(`<rect x="100" y="-6" width="12" height="30" rx="5" fill="#9fb4c7" stroke="#2d3a46" stroke-width="2" transform="rotate(35 106 9)"/>`);
    if (restantes >= 4) p.push(`<circle cx="150" cy="4" r="8" fill="#fff" stroke="#2d3a46" stroke-width="2"/>`);
    if (restantes >= 5) p.push(`<line x1="180" y1="10" x2="200" y2="-12" stroke="#2d3a46" stroke-width="3"/><circle cx="202" cy="-14" r="5" fill="#ff5c8a"/>`);
    return `<g transform="translate(${x} ${y})">${p.join("")}</g>`;
  }
  function etabli(x, y, w) {
    return `<g filter="url(#fOmbre)"><polygon points="${x},${y} ${x + w},${y} ${x + w + 40},${y + 46} ${x - 40},${y + 46}" fill="#8b6a43"/>
      <rect x="${x - 40}" y="${y + 46}" width="${w + 80}" height="16" fill="#5e4528"/>
      <rect x="${x - 26}" y="${y + 62}" width="16" height="86" fill="#3d3326"/><rect x="${x + w + 10}" y="${y + 62}" width="16" height="86" fill="#3d3326"/></g>`;
  }
  function bacs(x, y, couleurs) {
    return couleurs.map((c, i) => `<g filter="url(#fOmbre)"><polygon points="${x + i * 86},${y} ${x + i * 86 + 76},${y} ${x + i * 86 + 70},${y + 50} ${x + i * 86 + 6},${y + 50}" fill="${c}" stroke="#1d1a14" stroke-width="2"/>
      <rect x="${x + i * 86 + 14}" y="${y + 16}" width="48" height="14" rx="2" fill="#f2e6c2"/></g>`).join("");
  }
  function hublot(cx, cy, rx, ry, contenu, graine) {
    return `<g><ellipse cx="${cx}" cy="${cy}" rx="${rx + 26}" ry="${ry + 26}" fill="#5b5f66" stroke="#2c2f35" stroke-width="4"/>
      ${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return vis(cx + Math.cos(a) * (rx + 13), cy + Math.sin(a) * (ry + 13), 4); }).join("")}
      <clipPath id="clip${graine}"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/></clipPath>
      <g clip-path="url(#clip${graine})"><rect x="${cx - rx}" y="${cy - ry}" width="${rx * 2}" height="${ry * 2}" fill="url(#gEspace)"/>${etoiles(cx - rx, cy - ry, rx * 2, ry * 2, 70, graine)}${contenu}</g>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#c9ccd2" stroke-width="3"/>
      <path d="M${cx - rx * .6} ${cy - ry * .7} q ${rx * .4} -${ry * .2} ${rx * .9} -${ry * .05}" stroke="#fff" stroke-width="8" opacity=".09" fill="none"/></g>`;
  }
  function comete(x, y, s, amarree) {
    return `<g transform="translate(${x} ${y}) scale(${s})">
      ${amarree ? "" : `<path d="M-120 6 L-20 -6 L-20 18 Z" fill="#7ee8ff" opacity=".35"/>`}
      <rect x="-20" y="-14" width="70" height="36" rx="12" fill="#e9e2cf" stroke="#3a3326" stroke-width="3"/>
      <rect x="50" y="-6" width="18" height="20" rx="4" fill="#ffb000"/>
      <rect x="-4" y="-8" width="40" height="10" rx="3" fill="#1d5fa8"/>
      <text x="15" y="16" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="9" font-weight="bold" fill="#3a3326">COMÈTE</text></g>`;
  }
  function faceGladys(x, y, s, mode) {
    // mode : "secours" | "partiel" | "ok"
    const c = mode === "secours" ? "#ffb000" : "#7cffb2";
    const yeux = mode === "secours" ? `<path d="M-38 -6h22M16 -6h22" stroke="${c}" stroke-width="7" stroke-linecap="round"/>` : `<rect x="-36" y="-18" width="18" height="22" fill="${c}"/><rect x="18" y="-18" width="18" height="22" fill="${c}"/>`;
    const bouche = mode === "ok" ? `<path d="M-26 22 q26 22 52 0" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>` : mode === "secours" ? `<path d="M-22 30 q22 -14 44 0" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>` : `<path d="M-22 24 h44" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
    return `<g transform="translate(${x} ${y}) scale(${s})" filter="url(#fLueur)">${yeux}${bouche}</g>`;
  }
  function texteEcran(x, y, lignes, coul = "#7cffb2", fs = 15) {
    return lignes.map((l, i) => `<text x="${x}" y="${y + i * (fs + 5)}" font-family="DejaVu Sans Mono, Courier New, monospace" font-size="${fs}" font-weight="bold" fill="${coul}">${l}</text>`).join("");
  }

  /* ---------- POSTE DE PILOTAGE ---------- */
  function hub(E) {
    const n = ["A1", "A2", "B1", "B2", "B3", "C1", "C2", "C3", "C4"].filter((i) => R(E, i)).length;
    const energie = E.final && E.signal ? 1 : n / 12;
    const mode = E.final && E.signal ? "ok" : n >= 5 ? "partiel" : "secours";
    const secteurOk = (ids) => ids.every((i) => R(E, i));
    const cx = E.final && E.signal ? 640 : 860 - n * 18, cy = E.final && E.signal ? 250 : 150 + n * 6, cs = E.final && E.signal ? 1.4 : .45 + n * .07;
    const amarrage = E.final && E.signal ? `<rect x="${cx + 12}" y="${cy + 25}" width="18" height="${323 - cy}" fill="#c9ccd2" stroke="#3a3326" stroke-width="2"/><rect x="${cx + 6}" y="${cy + 40}" width="30" height="8" fill="#7cffb2" filter="url(#fLueur)"/>` : "";
    const contenuHublot = `${amarrage}<ellipse cx="600" cy="420" rx="380" ry="120" fill="url(#gTerre)"/><ellipse cx="600" cy="420" rx="380" ry="120" fill="none" stroke="#9fd8ff" stroke-width="4" opacity=".5"/>${comete(cx, cy, cs, E.final && E.signal)}`;
    const plan = (x, y) => {
      const mod = (mx, my, lbl, ok) => `<rect x="${mx - 34}" y="${my - 20}" width="68" height="40" rx="6" fill="${ok ? "#1f6b45" : "#3a2a0a"}" stroke="${ok ? "#7cffb2" : "#ffb000"}" stroke-width="2"/><text x="${mx}" y="${my + 6}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="15" font-weight="bold" fill="${ok ? "#7cffb2" : "#ffb000"}">${lbl}</text>`;
      return `<g filter="url(#fOmbre)"><rect x="${x}" y="${y}" width="230" height="200" rx="8" fill="#10223a" stroke="#c9c2ad" stroke-width="6"/>
        ${texteEcran(x + 14, y + 26, ["PLAN DE LA STATION"], "#9fd8ff", 13)}
        <path d="M${x + 115} ${y + 110} L${x + 50} ${y + 70} M${x + 115} ${y + 110} L${x + 180} ${y + 70} M${x + 115} ${y + 110} L${x + 115} ${y + 165}" stroke="#9fd8ff" stroke-width="3" stroke-dasharray="5 4"/>
        <circle cx="${x + 115}" cy="${y + 110}" r="20" fill="#1d3557" stroke="#9fd8ff" stroke-width="2"/><text x="${x + 115}" y="${y + 115}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="12" fill="#9fd8ff">PP</text>
        ${mod(x + 50, y + 66, "A", secteurOk(["A1", "A2"]))}${mod(x + 180, y + 66, "B", secteurOk(["B1", "B2", "B3"]))}${mod(x + 115, y + 172, "C", secteurOk(["C1", "C2", "C3", "C4"]))}</g>`;
    };
    const ecranG = mode === "ok" ? texteEcran(470, 452, ["MÉMOIRE 100 %", "SIGNAL ENVOYÉ"], "#7cffb2", 14)
      : texteEcran(474, 452, [mode === "secours" ? "MODE SECOURS" : "RÉCUPÉRATION…", `SYSTÈMES ${n}/9`], mode === "secours" ? "#ffb000" : "#7cffb2", 14);
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="scene-svg" aria-hidden="true">${DEFS}${coque(E, energie)}
      ${hublot(600, 205, 230, 118, contenuHublot, 1)}
      ${plaque(505, 345, 190, 26, "NÉON-86 · MODÈLE 86", 12)}
      ${plan(196, 120)}
      ${porte(60, 190, 90, 260, "SECTEUR A", true)}
      ${porte(1050, 190, 90, 260, "SECTEUR B", true)}
      ${porte(880, 150, 110, 255, "SECTEUR C", true)}
      <g filter="url(#fOmbre)"><polygon points="300,520 900,520 980,640 220,640" fill="url(#gBeigeF)" stroke="#7c7056" stroke-width="3"/>
        <polygon points="300,520 900,520 905,535 295,535" fill="#efe6c8"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${330 + i * 22}" y="560" width="16" height="10" rx="2" fill="${i < n ? "#7cffb2" : "#5a5446"}"/>`).join("")}
        ${[0, 1, 2].map((i) => `<rect x="${720 + i * 50}" y="555" width="34" height="18" rx="3" fill="#3a3a36"/><rect x="${728 + i * 50}" y="${i % 2 ? 557 : 562}" width="18" height="9" rx="2" fill="#c9c2ad"/>`).join("")}
        <rect x="560" y="590" width="80" height="12" rx="3" fill="#1d1a14"/>${Array.from({ length: 11 }, (_, i) => `<rect x="${404 + i * 36}" y="610" width="26" height="8" rx="2" fill="${E.final ? "#ffb000" : "#1d1a14"}"/>`).join("")}</g>
      ${crt(450, 400, 300, 115, `${faceGladys(690, 450, .5, mode)}${ecranG}`, mode === "secours")}
      <g filter="url(#fOmbre)"><rect x="930" y="480" width="150" height="90" rx="8" fill="url(#gBeige)" stroke="#7c7056" stroke-width="2"/><rect x="945" y="470" width="120" height="16" fill="#3a3a36"/>
        <path d="M955 470 q 20 -40 -5 -80 q 30 10 60 0 q -25 40 -5 80 z" fill="#fffdf2" stroke="#bfb69c"/>${[0, 1, 2, 3].map((i) => `<line x1="965" y1="${400 + i * 14}" x2="1010" y2="${400 + i * 14}" stroke="#999" stroke-width="1.5"/>`).join("")}
        ${plaque(950, 540, 110, 22, "IMPRIMANTE", 11)}</g>
      ${eclairage(energie)}</svg>`;
  }

  /* ---------- SALLE DES MACHINES (A) ---------- */
  function salleA(E) {
    const ok = ["A1", "A2"].filter((i) => R(E, i)).length;
    const energie = .15 + ok * .42;
    const parts = R(E, "A1") ? 6 : E.boulon || 0;
    const archivesOk = R(E, "A2");
    const meuble = `<g filter="url(#fOmbre)"><rect x="200" y="150" width="190" height="300" rx="6" fill="#6d7d68" stroke="#2f3a2c" stroke-width="3"/>
      ${[0, 1, 2, 3].map((i) => `<rect x="214" y="${166 + i * 70}" width="162" height="58" rx="4" fill="#82937d" stroke="#2f3a2c" stroke-width="2"/><rect x="270" y="${186 + i * 70}" width="50" height="10" rx="4" fill="#d6d0bf"/><rect x="230" y="${174 + i * 70}" width="44" height="14" fill="#f2e6c2"/>`).join("")}
      ${archivesOk ? "" : `<rect x="214" y="306" width="180" height="58" rx="4" fill="#82937d" stroke="#2f3a2c" stroke-width="2" transform="translate(18 6)"/>`}
      ${archivesOk ? "" : `<g transform="translate(250 400) rotate(-8)"><rect width="70" height="50" fill="#f6efd8" stroke="#8c816a"/><text x="35" y="30" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="12" font-weight="bold" fill="#8a2b1d">.ZIP</text></g>`}
      ${plaque(214, 116, 162, 26, "ARCHIVES", 13)}</g>`;
    const terminal = crt(700, 175, 200, 140, texteEcran(716, 205, archivesOk ? ["> ARCHIVES", "  RESTAURÉES", "> MÉMOIRE v03", "  CHARGÉE ✔"] : ["> ARCHIVES", "  COMPRESSÉES", "> SAUVEGARDE ?", "  INTROUVABLE_"], archivesOk ? "#7cffb2" : "#ffb000", 15), !archivesOk);
    const tableau = `<g filter="url(#fOmbre)"><rect x="935" y="150" width="80" height="210" rx="6" fill="#4a4e55" stroke="#22252a" stroke-width="3"/>
      ${voyant(975, 185, ok >= 1, "#7cffb2", 8)}${voyant(975, 220, ok >= 2, "#7cffb2", 8)}
      <rect x="962" y="${ok >= 2 ? 250 : 300}" width="26" height="46" rx="5" fill="#c43c2a" stroke="#1d1a14" stroke-width="2"/><rect x="972" y="252" width="6" height="90" fill="#1d1a14" opacity=".5"/>
      ${plaque(930, 118, 90, 24, "COURANT", 11)}</g>`;
    const boulon = R(E, "A1") ? boulonSVG(600, 360, 1.15, 6, "salut") : boulonSVG(560, 380, 1, parts, "");
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="scene-svg" aria-hidden="true">${DEFS}${coque(E, energie)}
      ${plaque(445, 88, 310, 32, "SALLE DES MACHINES · A", 15)}
      <rect x="420" y="140" width="250" height="170" fill="#2f3438" stroke="#1d1a14" stroke-width="3"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="432" y="${152 + i * 30}" width="226" height="18" fill="url(#pGrille)"/>`).join("")}
      ${meuble}${terminal}${tableau}
      ${etabli(380, 470, 470)}
      ${bacs(400, 430, ["#c96b2c", "#3d7bbf", "#3f9a5b"])}
      ${R(E, "A1") ? "" : piecesEnVrac(690, 455, 6 - parts)}
      ${boulon}
      ${plaque(470, 640, 260, 24, R(E, "A1") ? "BOULON : OPÉRATIONNEL" : "BOULON : EN PIÈCES", 12, R(E, "A1") ? "#1f6b45" : "#6b1f1f")}
      ${eclairage(energie)}</svg>`;
  }

  /* ---------- ANTENNE (B) ---------- */
  function salleB(E) {
    const ok = ["B1", "B2", "B3"].filter((i) => R(E, i)).length;
    const energie = .15 + ok * .28;
    const cablesOk = R(E, "B1");
    const cab = (x1, y1, x2, y2, c) => `<path d="M${x1} ${y1} C ${x1} ${y1 + 60}, ${x2} ${y2 + 60}, ${x2} ${y2}" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    const prises = [0, 1, 2, 3, 4, 5];
    const tableau = `<g filter="url(#fOmbre)"><rect x="190" y="130" width="250" height="280" rx="8" fill="#2f3438" stroke="#15181c" stroke-width="4"/>
      ${prises.map((i) => `<circle cx="${222 + i * 37}" cy="170" r="9" fill="#111"/><circle cx="${222 + i * 37}" cy="330" r="9" fill="#111"/>`).join("")}
      ${cablesOk ? prises.map((i) => cab(222 + i * 37, 170, 222 + i * 37, 330, ["#e94f37", "#3d7bbf", "#f2b705", "#3f9a5b", "#c45ab3", "#e9e2cf"][i])).join("")
        : [[0, 3], [1, 0], [2, 5], [3, 1], [4, 4], [5, 2]].map(([a, b], i) => cab(222 + a * 37, 170, 222 + b * 37, 330, ["#e94f37", "#3d7bbf", "#f2b705", "#3f9a5b", "#c45ab3", "#e9e2cf"][i])).join("")}
      ${voyant(225, 380, cablesOk, "#7cffb2", 7)}${voyant(260, 380, cablesOk, "#7cffb2", 7)}${voyant(295, 380, !cablesOk, "#ff5c5c", 7)}
      ${plaque(200, 96, 230, 26, "TABLEAU DE BRANCHEMENT", 11)}</g>`;
    const parabole = `<g transform="translate(600 200)">
      <path d="M-60 40 L0 80 L60 40" stroke="#c9ccd2" stroke-width="6" fill="none"/>
      <g transform="rotate(${ok === 3 ? -20 : 25})"><path d="M-80 0 Q0 70 80 0 Z" fill="#e9e2cf" stroke="#3a3326" stroke-width="3"/><line x1="0" y1="35" x2="0" y2="-30" stroke="#3a3326" stroke-width="4"/><circle cx="0" cy="-32" r="7" fill="${ok === 3 ? "#7cffb2" : "#555"}"/></g>
      ${ok === 3 ? [0, 1, 2].map((i) => `<path d="M${30 + i * 26} -60 q 20 20 0 40" stroke="#7cffb2" stroke-width="4" fill="none" opacity="${.9 - i * .25}"/>`).join("") : ""}</g>`;
    const balise = `<g transform="translate(${R(E, "B2") ? 740 : 715} ${R(E, "B2") ? 120 : 140})"><rect x="-10" y="-10" width="20" height="26" rx="4" fill="#c9ccd2" stroke="#333"/><circle cx="0" cy="-16" r="${R(E, "B2") ? 6 : 8}" fill="${R(E, "B2") ? "#5a6" : "#ff5c8a"}" filter="url(#fLueur)"/></g>`;
    const questor = crt(830, 175, 170, 120, cablesOk
      ? texteEcran(845, 205, ["QUESTOR", R(E, "B3") ? "16 h 45 ✔" : "PRÊT_", "[ RECHERCHE ]"], "#7cffb2", 15)
      : texteEcran(845, 205, ["QUESTOR", "HORS LIGNE", "✖ ✖ ✖"], "#ffb000", 15), !cablesOk);
    const oscillo = `<g filter="url(#fOmbre)"><polygon points="300,500 900,500 960,600 240,600" fill="url(#gBeigeF)" stroke="#7c7056" stroke-width="3"/>
      <rect x="470" y="440" width="260" height="62" rx="6" fill="#0c1a14" stroke="#c9c2ad" stroke-width="5"/>
      <path d="${Array.from({ length: 26 }, (_, i) => `${i ? "L" : "M"}${480 + i * 9.6} ${470 + (ok === 3 ? Math.sin(i * .9) * 16 : ok ? Math.sin(i * 2.3) * 6 * ((i * 7) % 3) : (i % 5 === 0 ? -8 : 0))}`).join(" ")}" stroke="#7cffb2" stroke-width="2.5" fill="none" filter="url(#fLueur)"/>
      ${plaque(520, 520, 160, 22, "SIGNAL " + ["0 %", "35 %", "70 %", "100 %"][ok], 11)}</g>`;
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="scene-svg" aria-hidden="true">${DEFS}${coque(E, energie)}
      ${plaque(450, 84, 300, 30, "ANTENNE · SECTEUR B", 14)}
      ${hublot(600, 225, 135, 100, parabole + balise, 2)}
      ${tableau}${questor}${oscillo}
      ${plaque(690, 345, 150, 22, "BALISE RELAIS ↗", 11)}
      ${eclairage(energie)}</svg>`;
  }

  /* ---------- ATELIER PIXELS & ROBOTIQUE (C) ---------- */
  function salleC(E) {
    const ok = ["C1", "C2", "C3", "C4"].filter((i) => R(E, i)).length;
    const energie = .15 + ok * .21;
    const pix = ["1111111100", "1100001110", "1100001111", "1111111111", "1111111111", "1000000001", "1011111101", "1010000101", "1011111101", "1111111111"];
    const ecran = crt(200, 130, 220, 170, R(E, "C1")
      ? pix.map((r, y) => r.split("").map((v, x) => v === "1" ? `<rect x="${250 + x * 12}" y="${150 + y * 12}" width="11" height="11" fill="#7cffb2"/>` : "").join("")).join("")
      : pix.map((r, y) => `<text x="214" y="${154 + y * 14.5}" font-family="DejaVu Sans Mono, monospace" font-size="13" fill="#ffb000" letter-spacing="3">${r}</text>`).join(""), !R(E, "C1"));
    // table lumineuse
    const table = `<g filter="url(#fOmbre)"><polygon points="470,470 760,470 800,540 430,540" fill="url(#pTable)" stroke="#5a6470" stroke-width="4"/>
      <polygon points="470,470 760,470 800,540 430,540" fill="#bff7ff" opacity="${R(E, "C2") ? .35 : .1}"/>
      ${R(E, "C2") ? `<path d="M560 530 L560 510 L585 495 L620 495 L640 510" stroke="#e94f37" stroke-width="4" fill="none"/>` : ""}
      <rect x="430" y="540" width="370" height="14" fill="#5a6470"/><rect x="450" y="554" width="14" height="60" fill="#3d434a"/><rect x="766" y="554" width="14" height="60" fill="#3d434a"/>
      ${plaque(520, 445, 190, 22, "TABLE LUMINEUSE", 11)}</g>`;
    // grille au sol + borne
    const gx = (c, r) => { const t = r / 6, y = 575 + r * 16; const l = 870 - t * 40, w = 260 + t * 80; return [l + c * (w / 6), y]; };
    let grille = "";
    for (let r = 0; r <= 6; r++) { const [x1, y] = gx(0, r), [x2] = gx(6, r); grille += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#45d0ea" stroke-width="2" opacity=".7"/>`; }
    for (let c = 0; c <= 6; c++) { const [x1, y1] = gx(c, 0), [x2, y2] = gx(c, 6); grille += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#45d0ea" stroke-width="2" opacity=".7"/>`; }
    const borne = `<g filter="url(#fOmbre)"><rect x="1040" y="420" width="56" height="140" rx="8" fill="url(#gBeige)" stroke="#7c7056" stroke-width="3"/><text x="1068" y="470" text-anchor="middle" font-size="34" fill="${R(E, "C3") ? "#2bd07a" : "#ffb000"}">⚡</text>${voyant(1068, 505, R(E, "C3"), "#7cffb2", 8)}${plaque(1030, 388, 76, 22, "BORNE", 11)}</g>`;
    const boulon = R(E, "C3") ? boulonSVG(1000, 470, .8, 6, "salut") : R(E, "A1") ? boulonSVG(905, 470, .75, 6, "") : "";
    const absent = R(E, "A1") ? "" : plaque(860, 520, 210, 24, "BOULON : ABSENT", 11, "#6b1f1f");
    const capteur = `<g filter="url(#fOmbre)" transform="translate(660 230)"><rect x="-10" y="40" width="20" height="120" fill="#5f6872"/><g transform="rotate(-30)"><rect x="-20" y="-20" width="140" height="44" rx="10" fill="#e9e2cf" stroke="#3a3326" stroke-width="3"/><rect x="110" y="-26" width="22" height="56" rx="6" fill="#3a3326"/></g>
      ${R(E, "C4") ? `<text x="70" y="-70" font-size="28" fill="#ffd23c" filter="url(#fLueur)">★</text>` : ""}</g>`;
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" class="scene-svg" aria-hidden="true">${DEFS}${coque(E, energie)}
      ${plaque(440, 84, 320, 30, "ATELIER PIXELS & ROBOTIQUE · C", 13)}
      ${ecran}${plaque(225, 330, 170, 22, R(E, "C1") ? "ÉCRAN : RÉPARÉ" : "ÉCRAN : EN PANNE", 11, R(E, "C1") ? "#1f6b45" : "#6b1f1f")}
      ${hublot(840, 210, 120, 90, "", 3)}
      ${capteur}${table}
      <polygon points="${gx(0, 0)} ${gx(6, 0)} ${gx(6, 6)} ${gx(0, 6)}" fill="#0d2a33" opacity=".7"/>${grille}
      ${borne}${boulon}${absent}
      ${eclairage(energie)}</svg>`;
  }

  /* ---------- objets interactifs de chaque lieu (positions en % de la scène) ---------- */
  const OBJETS = {
    hub: [
      { id: "gladys", label: "Console de GLADYS", x: 36, y: 57, w: 28, h: 27, action: { type: "final" } },
      { id: "plan", label: "Plan de la station", x: 15, y: 16, w: 21, h: 31, action: { type: "plan" } },
      { id: "hublot", label: "Hublot : la COMÈTE", x: 33, y: 12, w: 34, h: 35, action: { type: "info", cle: "hublot" } },
      { id: "porteA", label: "Porte du secteur A : Salle des machines", x: 3, y: 26, w: 10, h: 42, action: { type: "lieu", lieu: "A" } },
      { id: "porteB", label: "Porte du secteur B : Antenne", x: 87, y: 26, w: 10, h: 42, action: { type: "lieu", lieu: "B" } },
      { id: "porteC", label: "Porte du secteur C : Atelier", x: 72, y: 17, w: 11, h: 44, action: { type: "lieu", lieu: "C" } },
      { id: "imprimante", label: "Imprimante à papier continu", x: 77, y: 58, w: 14, h: 26, action: { type: "info", cle: "imprimante" } }
    ],
    A: [
      { id: "boulonA", label: "Établi de Boulon (A1)", x: 32, y: 60, w: 40, h: 34, action: { type: "enigme", id: "A1" } },
      { id: "archives", label: "Meuble d'archives (A2)", x: 16, y: 16, w: 18, h: 52, action: { type: "enigme", id: "A2" } },
      { id: "terminal", label: "Terminal des archives (A2)", x: 57, y: 24, w: 20, h: 28, action: { type: "enigme", id: "A2" } },
      { id: "courant", label: "Tableau électrique", x: 77, y: 17, w: 9, h: 37, action: { type: "info", cle: "courant" } },
      { id: "retourA", label: "Retour au poste de pilotage", x: 0, y: 82, w: 14, h: 15, action: { type: "lieu", lieu: "hub" } }
    ],
    B: [
      { id: "tableau", label: "Tableau de branchement (B1)", x: 15, y: 14, w: 23, h: 48, action: { type: "enigme", id: "B1" } },
      { id: "balise", label: "Balise relais, par le hublot (B2)", x: 37, y: 13, w: 26, h: 40, action: { type: "enigme", id: "B2" } },
      { id: "questor", label: "Console QUESTOR (B3)", x: 68, y: 24, w: 17, h: 30, action: { type: "enigme", id: "B3" } },
      { id: "oscillo", label: "Console de diagnostic", x: 38, y: 64, w: 24, h: 18, action: { type: "info", cle: "oscillo" } },
      { id: "retourB", label: "Retour au poste de pilotage", x: 0, y: 82, w: 14, h: 15, action: { type: "lieu", lieu: "hub" } }
    ],
    C: [
      { id: "ecran", label: "Écran en panne (C1)", x: 15, y: 17, w: 21, h: 36, action: { type: "enigme", id: "C1" } },
      { id: "table", label: "Table lumineuse (C2)", x: 35, y: 66, w: 32, h: 26, action: { type: "enigme", id: "C2" } },
      { id: "grille", label: "Grille de déplacement et borne (C3)", x: 71, y: 57, w: 22, h: 40, action: { type: "enigme", id: "C3" } },
      { id: "capteur", label: "Capteur d'étoiles (C4)", x: 53, y: 24, w: 15, h: 34, action: { type: "enigme", id: "C4" } },
      { id: "retourC", label: "Retour au poste de pilotage", x: 0, y: 82, w: 14, h: 15, action: { type: "lieu", lieu: "hub" } }
    ]
  };

  window.SCENES = { hub, A: salleA, B: salleB, C: salleC, OBJETS, boulonSVG, faceGladys, DEFS };
})();
