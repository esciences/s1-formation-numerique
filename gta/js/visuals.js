/* =====================================================================
   GTA · Gère. Traque. Agis. · Visuels originaux (SVG + HTML)
   Aucune image, aucun logo ni personnage officiel : tout est dessiné ici.
   ===================================================================== */
window.VC = window.VC || {};
(function () {
  const V = {};
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Formes réutilisables ---------- */
  const PALM = `<path d="M44 180 C46 140 48 112 55 84 L60 85 C54 114 52 142 52 180 Z"/>
    <path d="M57 84 C42 70 22 70 6 82 C26 76 42 80 56 92 Z"/>
    <path d="M57 84 C48 62 30 54 14 56 C34 64 46 74 56 92 Z"/>
    <path d="M57 84 C68 62 88 58 100 66 C82 66 68 76 58 92 Z"/>
    <path d="M57 84 C76 80 92 90 98 104 C84 94 70 92 58 94 Z"/>
    <path d="M57 84 C55 64 62 46 74 38 C66 52 61 68 60 92 Z"/>
    <path d="M57 84 C40 82 24 92 18 108 C30 96 44 92 56 94 Z"/>`;
  const palm = (x, y, w, h, fill = "#12051F", flip = false) =>
    `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 100 180" overflow="visible"><g fill="${fill}" ${flip ? 'transform="translate(100,0) scale(-1,1)"' : ""}>${PALM}</g></svg>`;
  const SKY = `<path d="M0 60 V40 h18 V30 h10 v-8 h6 v8 h10 V44 h14 V18 l8 -8 l8 8 V60 Z"/><path d="M78 60 V26 h22 V14 h4 V6 h4 v8 h4 V26 h22 V60 Z"/><path d="M140 60 V36 h12 V28 h20 V36 h12 V60 Z"/><path d="M190 60 V22 c10 -14 30 -14 40 0 V60 Z"/><path d="M238 60 V34 h16 V16 h6 V8 h4 v8 h6 V34 h16 V60 Z"/><path d="M292 60 V40 h12 V24 h28 V40 h12 V60 Z"/><path d="M350 60 V30 h10 V20 h20 V30 h10 V44 h10 V60 Z"/>`;
  const skyline = (x, y, w, h, fill) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 400 60" preserveAspectRatio="none"><g fill="${fill}">${SKY}</g></svg>`;
  V.palm = palm;

  /* ---------- Petits composants HTML utilisés dans les données ---------- */
  V.spec = (title, rows) =>
    `<div class="spec"><div class="spec-h">💻 ${esc(title)}</div>${rows.map(([k, v]) => `<div class="spec-r"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>`;

  V.post = ({ name, handle, verified, date, text, color }) =>
    `<div class="post"><div class="post-h"><span class="post-av" style="background:${color}">${esc(name[0])}</span>
      <span class="post-id"><b>${esc(name)}${verified ? ' <span class="vbadge" title="Badge vérifié">✔</span>' : ""}</b><span class="post-handle">${esc(handle)} · ${esc(date)}</span></span></div>
      <p class="post-t">${esc(text)}</p></div>`;

  V.pegiMini = (age, pictos) =>
    `<div class="pegi-mini" role="img" aria-label="Signalétique : âge ${age}, ${pictos.join(", ")}"><div class="pegi-box"><b>${age}</b><span>ÂGE</span></div>${pictos
      .map((p) => `<div class="pegi-pic">${esc(p)}</div>`).join("")}<small>Illustration simplifiée</small></div>`;

  V.notif = (from, text) =>
    `<div class="notif-mock"><div class="nm-h"><span class="nm-av">?</span><b>${esc(from)}</b><small>maintenant</small></div><p>${esc(text)}</p></div>`;

  /* =====================================================================
     SCÈNE D'OUVERTURE (écran titre)
     ===================================================================== */
  V.titleScene = () => {
    let stars = "";
    for (let i = 0; i < 70; i++) {
      const x = (i * 197) % 1600, y = (i * 83) % 330, r = (i % 3) * 0.5 + 0.6;
      stars += `<circle cx="${x}" cy="${y}" r="${r}" opacity="${0.35 + (i % 5) * 0.12}"/>`;
    }
    let grid = "";
    [612, 630, 656, 692, 742, 810, 900].forEach((y) => (grid += `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`));
    for (let i = -10; i <= 10; i++) grid += `<line x1="${800 + i * 30}" y1="600" x2="${800 + i * 260}" y2="900"/>`;
    return `<svg class="title-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E0420"/><stop offset=".35" stop-color="#3B0F6B"/><stop offset=".62" stop-color="#B0168D"/><stop offset=".82" stop-color="#FF3D7F"/><stop offset="1" stop-color="#FF9A4C"/></linearGradient>
        <linearGradient id="tsun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE96B"/><stop offset=".45" stop-color="#FF9A3D"/><stop offset=".8" stop-color="#FF2E7E"/><stop offset="1" stop-color="#C21C8B"/></linearGradient>
        <linearGradient id="tsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A1460"/><stop offset="1" stop-color="#08021A"/></linearGradient>
        <radialGradient id="thalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFB36B" stop-opacity=".55"/><stop offset="1" stop-color="#FF2A85" stop-opacity="0"/></radialGradient>
        <mask id="tsunmask"><rect width="1600" height="900" fill="#fff"/>${[470, 498, 522, 544, 563, 580].map((y, i) => `<rect y="${y}" width="1600" height="${4 + i * 2.2}" fill="#000"/>`).join("")}</mask>
        <filter id="tglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="1600" height="600" fill="url(#tsky)"/>
      <g fill="#fff">${stars}</g>
      <circle cx="800" cy="470" r="330" fill="url(#thalo)"/>
      <circle class="ts-sun" cx="800" cy="470" r="200" fill="url(#tsun)" mask="url(#tsunmask)"/>
      ${skyline(-40, 520, 760, 82, "#2A0B4A")}${skyline(880, 515, 760, 88, "#2A0B4A")}
      ${skyline(300, 548, 1000, 54, "#1A0634")}
      <g fill="#FFD23F" opacity=".75">${Array.from({ length: 34 }, (_, i) => `<rect x="${(i * 47) % 1600}" y="${560 + (i * 13) % 34}" width="3" height="3"/>`).join("")}</g>
      <g fill="#2EE6E6" opacity=".7">${Array.from({ length: 28 }, (_, i) => `<rect x="${(i * 61 + 20) % 1600}" y="${552 + (i * 17) % 40}" width="3" height="3"/>`).join("")}</g>
      <rect y="600" width="1600" height="300" fill="url(#tsea)"/>
      <g stroke="#2EE6E6" stroke-width="1.2" opacity=".35" fill="none">${grid}</g>
      <g fill="#FF7FB0" opacity=".8">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${800 - (150 - i * 20)}" y="${610 + i * 14}" width="${300 - i * 40}" height="${3.5 - i * 0.3}" rx="2"/>`).join("")}</g>
      ${palm(-60, 300, 330, 620)}${palm(150, 480, 170, 320)}
      ${palm(1330, 320, 320, 600, "#12051F", true)}${palm(1240, 520, 150, 280, "#12051F", true)}
      <rect y="860" width="1600" height="40" fill="#08021A"/>
    </svg>`;
  };

  /* =====================================================================
     CARTE DE LEONIDA (fictive, dessin original)
     ===================================================================== */
  V.mapSVG = (pins, next) => {
    const land = "M0 0 H800 V58 C744 70 704 112 694 160 C684 212 704 252 692 304 C680 364 640 404 602 432 C574 452 548 470 522 482 C500 470 494 440 470 420 C432 392 384 380 344 362 C304 344 272 302 232 282 C192 264 150 250 110 230 C70 210 32 190 0 180 Z";
    const roads = `<path d="M40 120 C200 150 360 160 520 140 C600 130 650 120 690 110"/><path d="M372 30 C380 120 400 220 450 300 C490 360 530 400 556 440"/><path d="M180 200 C260 230 330 270 420 300 C480 320 540 320 610 300 C650 290 670 270 690 250"/><path d="M520 140 C530 210 548 260 556 330"/>`;
    const keys = [[560, 478, 14, 6], [592, 462, 26, 12], [628, 476, 16, 7], [662, 488, 20, 8], [700, 494, 14, 6], [732, 500, 10, 5]];
    const nextPin = pins.find((p) => p.id === next);
    const hq = pins.find((p) => p.id === "m0");
    const route = nextPin && hq && nextPin.id !== "m0"
      ? `<path class="gps-route" d="M${hq.x} ${hq.y} Q ${(hq.x + nextPin.x) / 2 + 40} ${(hq.y + nextPin.y) / 2 - 60} ${nextPin.x} ${nextPin.y}"/>` : "";
    return `<svg class="map-svg" viewBox="0 0 800 520" role="img" aria-label="Carte fictive de l'État de Leonida avec les missions">
      <defs>
        <linearGradient id="msea" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0A2E4D"/><stop offset="1" stop-color="#0B1838"/></linearGradient>
        <linearGradient id="mland" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2B1450"/><stop offset="1" stop-color="#3D1660"/></linearGradient>
        <radialGradient id="mcity" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FF3D8B" stop-opacity=".55"/><stop offset="1" stop-color="#FF3D8B" stop-opacity="0"/></radialGradient>
        <filter id="mglow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <pattern id="mwave" width="40" height="18" patternUnits="userSpaceOnUse"><path d="M0 9 Q10 3 20 9 T40 9" stroke="#2EE6E6" stroke-opacity=".12" fill="none"/></pattern>
      </defs>
      <rect width="800" height="520" fill="url(#msea)"/><rect width="800" height="520" fill="url(#mwave)"/>
      <path d="${land}" fill="url(#mland)" stroke="#FF3D8B" stroke-width="2.4" filter="url(#mglow)"/>
      <ellipse cx="560" cy="350" rx="120" ry="90" fill="url(#mcity)"/>
      <g fill="#3A1B5E" opacity=".9"><ellipse cx="250" cy="110" rx="70" ry="30"/><ellipse cx="560" cy="200" rx="50" ry="26"/></g>
      <g fill="none" stroke="#FFC83D" stroke-opacity=".35" stroke-width="2.2">${roads}</g>
      ${keys.map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#3D1660" stroke="#FF3D8B" stroke-width="1.4"/>`).join("")}
      <g fill="#FFD23F" opacity=".8">${Array.from({ length: 40 }, (_, i) => `<rect x="${520 + (i * 37) % 120}" y="${300 + (i * 23) % 110}" width="2.4" height="2.4"/>`).join("")}</g>
      <text x="40" y="44" class="map-state">ÉTAT DE LEONIDA</text>
      <text x="575" y="345" class="map-city">VICE CITY</text>
      <text x="676" y="440" class="map-small">GOLFE</text>
      <text x="90" y="300" class="map-small">OCÉAN</text>
      ${palm(640, 150, 24, 44, "#12051F")}${palm(250, 150, 20, 36, "#12051F")}${palm(470, 250, 18, 34, "#12051F")}
      ${route}
      ${pins.map((p) => `<g class="pin pin-${p.status}${p.id === next ? " pin-next" : ""}" transform="translate(${p.x} ${p.y})">
          ${p.id === next ? '<circle r="24" class="pin-pulse"/>' : ""}
          <circle r="16" class="pin-c"/><text class="pin-i" y="5.5">${p.status === "locked" ? "🔒" : p.status === "done" ? "✔" : p.icon}</text>
          <text class="pin-l" y="32">${esc(p.label)}</text></g>`).join("")}
    </svg>`;
  };

  /* =====================================================================
     SCHÉMAS DES NOTIONS
     ===================================================================== */
  const vis = {};

  vis.pegiLabel = () => `<div class="vis-pegi">
      <div class="vp-label"><div class="vp-age"><b>18</b><span>ÂGE CONSEILLÉ</span></div></div>
      <div class="vp-pics">${[["👊", "Violence", 1], ["🗯️", "Langage grossier", 1], ["💉", "Drogues", 1], ["⚥", "Sexe", 1], ["💳", "Achats intégrés", 1], ["😱", "Peur"], ["🎲", "Jeux de hasard"], ["⚖️", "Discrimination"]]
        .map(([i, t, on]) => `<div class="vp-pic${on ? " on" : " off"}"><span aria-hidden="true">${i}</span>${t}</div>`).join("")}</div>
      <small>Signalétique PEGI de GTA VI : 18 ans + violence, langage grossier, drogues, sexe et achats intégrés. Les pictogrammes grisés ne concernent pas ce jeu. Âges possibles : 3 · 7 · 12 · 16 · 18.</small></div>`;

  vis.hudGuide = () => `<div class="vis-hud">
      <div class="vh-bar"><span class="vh-clock">🕖 19:00</span><span class="vh-money">$ 1 500</span><span class="vh-stars"><i class="on">★</i><i class="on">★</i><i>★</i><i>★</i><i>★</i></span></div>
      <div class="vh-legend"><div><b>🕖</b> l'heure avance</div><div><b>$</b> tes gains fictifs</div><div><b>★</b> erreurs : ça monte, un indice ou une correction : ça baisse. 5 ★ = piratage !</div></div>
      <div class="vh-note">Erreur = information, pas punition.</div></div>`;

  vis.bitsToA = () => `<div class="vis-bits"><div class="vb-row">${"01000001".split("").map((b, i) => `<span class="vb-bit" style="--i:${i}">${b}</span>`).join("")}</div>
      <div class="vb-arrow">8 bits = 1 octet ➜</div><div class="vb-letter">A</div></div>`;

  vis.unitLadder = () => {
    const st = [["octet", "1 lettre", "o"], ["ko", "un SMS", "×1 000"], ["Mo", "une photo", "×1 000"], ["Go", "un film HD", "×1 000"], ["To", "un gros disque", "×1 000"]];
    return `<div class="vis-ladder">${st.map(([u, ex, m], i) => `<div class="vl-step" style="--i:${i}"><span class="vl-mul">${i ? m : ""}</span><b>${u}</b><small>${ex}</small></div>`).join("")}</div>`;
  };

  vis.unitCompare = () => `<div class="vis-compare">
      <div class="vc-row"><span>Mise à jour</span><div class="vc-bar" style="--w:47.5%">950 Mo</div></div>
      <div class="vc-row"><span>Vidéo 4K</span><div class="vc-bar hot" style="--w:60%">1,2 Go = 1 200 Mo</div></div>
      <div class="vc-row"><span>1 Go</span><div class="vc-bar ref" style="--w:50%">1 000 Mo</div></div></div>`;

  vis.ramVsStorage = () => `<svg class="vis-svg" viewBox="0 0 460 260" role="img" aria-label="Schéma : armoires = stockage, plan de travail = mémoire vive">
      <rect x="10" y="20" width="170" height="210" rx="10" fill="#2B1450" stroke="#2EE6E6" stroke-width="2"/>
      <line x1="95" y1="20" x2="95" y2="230" stroke="#2EE6E6" stroke-width="1.5"/>
      ${[50, 105, 160].map((y) => `<line x1="10" y1="${y + 30}" x2="180" y2="${y + 30}" stroke="#2EE6E6" stroke-opacity=".5"/>`).join("")}
      <g font-size="20" text-anchor="middle"><text x="52" y="70">🎮</text><text x="137" y="70">📸</text><text x="52" y="125">🎵</text><text x="137" y="125">📄</text><text x="52" y="180">🎬</text><text x="137" y="180">🗺️</text></g>
      <text x="95" y="252" text-anchor="middle" class="vs-t">STOCKAGE · les armoires</text>
      <path d="M190 125 C 230 100, 250 100, 280 118" stroke="#FF3D8B" stroke-width="3" fill="none" marker-end="url(#arr)"/>
      <text x="236" y="92" text-anchor="middle" class="vs-s">lancer le jeu</text>
      <defs><marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#FF3D8B"/></marker></defs>
      <rect x="290" y="120" width="160" height="22" rx="6" fill="#FFC83D"/>
      <rect x="300" y="142" width="10" height="70" fill="#8A6A1F"/><rect x="430" y="142" width="10" height="70" fill="#8A6A1F"/>
      <g font-size="22" text-anchor="middle"><text x="340" y="114" class="vs-on">🎮</text><text x="395" y="114" class="vs-on">🗺️</text></g>
      <text x="370" y="240" text-anchor="middle" class="vs-t">RAM · le plan de travail</text>
      <text x="370" y="60" text-anchor="middle" class="vs-s">⏻ éteint = plan vidé</text></svg>`;

  vis.storageTypes = () => `<div class="vis-tiles">
      <div class="vt"><span class="vt-i">🎮</span><b>Interne</b><small>SSD dans la console (stockage rapide, sans pièce qui bouge)</small></div>
      <div class="vt"><span class="vt-i">💽</span><b>Externe</b><small>disque dur externe ou clé USB</small></div>
      <div class="vt"><span class="vt-i">☁️</span><b>En ligne</b><small>cloud, avec Internet (ex. Google Drive)</small></div></div>`;

  vis.urlAnatomy = () => `<div class="vis-url"><div class="vu-line">
      <span class="vu p">https://</span><span class="vu s">store.</span><span class="vu d">rockstargames.com</span><span class="vu c">/fr/VI</span></div>
      <div class="vu-legend"><span class="p">protocole</span><span class="s">sous-domaine</span><span class="d">nom de domaine = propriétaire</span><span class="c">chemin (la page)</span></div></div>`;

  vis.urlTrap = () => `<div class="vis-url trap"><div class="vu-line">
      <span class="vu p">http://</span><span class="vu fake">rockstargames.com.</span><span class="vu d">gta6-free.xyz</span><span class="vu c">/download</span></div>
      <div class="vu-legend"><span class="fake">déguisement (inventé)</span><span class="d">vrai propriétaire</span></div>
      <div class="vu-tip">👉 Trouve la première « / » après <code>://</code>, puis lis vers la gauche jusqu'au point précédent.</div></div>`;

  vis.httpEnvelope = () => `<div class="vis-env">
      <div class="ve card"><div class="ve-h">HTTP</div><div class="ve-post">📮 « mon mot de passe : Palmier… »</div><small>carte postale : lisible sur le trajet</small></div>
      <div class="ve card ok"><div class="ve-h">🔒 HTTPS</div><div class="ve-env">✉️ ●●●●●●●●</div><small>enveloppe fermée : chiffré</small></div>
      <div class="ve-warn">⚠️ Le cadenas ne dit rien sur l'honnêteté du destinataire.</div></div>`;

  vis.signalsGrid = () => `<div class="vis-signals">${[
      ["⏰", "Urgence", "« plus que 5 minutes ! »"], ["🎁", "Trop beau", "gratuit, en avance, exclusif"], ["🔗", "Adresse bizarre", "domaine inconnu, lettres changées"],
      ["🔑", "Données demandées", "mot de passe, carte, adresse"], ["📦", "Fichier suspect", ".exe, taille impossible"], ["✍️", "Fautes, faux avis", "avis identiques, orthographe"],
    ].map(([i, t, s]) => `<div class="vsg"><span>${i}</span><b>${t}</b><small>${s}</small></div>`).join("")}</div>`;

  vis.stopReflex = () => `<div class="vis-stop">${[["S", "Je m'arrête"], ["T", "Je teste l'adresse"], ["O", "J'observe les indices"], ["P", "Je préviens un adulte"]]
      .map(([l, t], i) => `<div class="vst" style="--i:${i}"><b>${l}</b><span>${t}</span></div>`).join("")}</div>`;

  vis.threeQuestions = () => `<div class="vis-q">${[["Qui ?", "officiel, média, inconnu"], ["Quand ?", "date de publication"], ["Comment ?", "preuve, lien, source"]]
      .map(([q, s], i) => `<div class="vq" style="--i:${i}"><b>${q}</b><small>${s}</small></div>`).join("")}
      <div class="vq-plus">＋ recouper avec 2 sources fiables</div></div>`;

  vis.officialAccount = () => `<div class="vis-acc">
      <div class="va ok"><b>@RockstarGames</b><span>✔ identifiant exact</span></div>
      <div class="va ko"><b>@R<u>0</u>ckstarGames</b><span>✘ un zéro à la place du o</span></div>
      <div class="va ko"><b>@Rockstar_Games<u>_Officiel</u></b><span>✘ un mot ajouté</span></div></div>`;

  vis.tracesVisual = () => `<div class="vis-traces"><div class="vtr-screen"><div class="vtr-top">💻 Ordinateur partagé</div>
      <div class="vtr-chips">${["🕘 Historique", "🍪 Cookies", "🟢 Compte connecté", "🔑 Mot de passe enregistré", "⬇️ Téléchargements"].map((c, i) => `<span style="--i:${i}">${c}</span>`).join("")}</div></div>
      <div class="vtr-fix">🧹 Se déconnecter · effacer les données · navigation privée</div></div>`;

  vis.lockVisual = () => `<div class="vis-lock"><div class="vlk-pass"><small>Phrase de passe</small><code>Palmier-Néon-Tortue-Saxo!7</code><div class="vlk-meter"><i></i></div></div>
      <div class="vlk-phone"><small>Double authentification</small><div class="vlk-code">482 913</div><span>code reçu sur ton smartphone</span></div></div>`;

  vis.hoursVisual = () => `<div class="vis-debit"><div class="vd-pipe"><span>2,25 h</span></div><div class="vd-op">➜</div><div class="vd-pipe out"><span>2 h 15 min</span></div></div>`;

  vis.debitVisual = () => `<div class="vis-debit"><div class="vd-pipe"><span>100 Mbit/s</span></div><div class="vd-op">÷ 8</div><div class="vd-pipe out"><span>12,5 Mo/s</span></div></div>`;

  V.visual = (key) => (vis[key] ? vis[key]() : "");

  /* =====================================================================
     ILLUSTRATIONS DE MISSION (carte du téléphone) · 560 × 230
     ===================================================================== */
  const sceneBg = (id, top, mid, bot) => `<defs>
      <linearGradient id="sb-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".6" stop-color="${mid}"/><stop offset="1" stop-color="${bot}"/></linearGradient>
      <linearGradient id="ss-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE96B"/><stop offset=".5" stop-color="#FF9A3D"/><stop offset="1" stop-color="#FF2E7E"/></linearGradient>
      <filter id="sg-${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <rect width="560" height="230" fill="url(#sb-${id})"/>`;
  const gridFloor = (y = 196, c = "#2EE6E6") => `<g stroke="${c}" stroke-opacity=".35" fill="none">${[0, 8, 18, 32].map((d) => `<line x1="0" y1="${y + d}" x2="560" y2="${y + d}"/>`).join("")}${[-6, -4, -2, 0, 2, 4, 6].map((i) => `<line x1="${280 + i * 14}" y1="${y}" x2="${280 + i * 90}" y2="230"/>`).join("")}</g>`;
  const arts = {
    m0: () => `${sceneBg("m0", "#1B0A3A", "#7A1580", "#FF5A7A")}
      <circle cx="280" cy="170" r="70" fill="url(#ss-m0)"/>
      ${skyline(0, 128, 560, 70, "#2A0B4A")}
      <rect x="250" y="40" width="60" height="158" fill="#1A0634"/><rect x="262" y="24" width="36" height="20" fill="#1A0634"/><rect x="278" y="6" width="4" height="20" fill="#FF3D8B" filter="url(#sg-m0)"/>
      <g fill="#2EE6E6">${[60, 80, 100, 120, 140, 160].map((y) => `<rect x="258" y="${y}" width="10" height="6"/><rect x="275" y="${y}" width="10" height="6" opacity=".6"/><rect x="292" y="${y}" width="10" height="6"/>`).join("")}</g>
      <text x="280" y="34" text-anchor="middle" font-family="Inter Display, Arial Black" font-weight="900" font-size="9" fill="#FFC83D" letter-spacing="2">BRIGADE</text>
      ${gridFloor()}${palm(10, 60, 90, 170)}${palm(470, 70, 84, 160, "#12051F", true)}`,
    m1: () => `${sceneBg("m1", "#2A0B4E", "#A3168F", "#FF7A45")}${gridFloor(200)}
      <g transform="rotate(-6 280 110)" filter="url(#sg-m1)"><rect x="150" y="56" width="260" height="104" rx="16" fill="#1B0B2E" stroke="#2EE6E6" stroke-width="3"/>
        <text x="174" y="92" font-family="Inter, Arial" font-weight="700" font-size="20" fill="#fff">💾 Console de Sam</text>
        <rect x="174" y="106" width="212" height="22" rx="11" fill="#120526"/><rect x="174" y="106" width="196" height="22" rx="11" fill="#FF3D8B"/>
        <text x="174" y="150" font-family="Inter, Arial" font-weight="700" font-size="14" fill="#FFC83D">ESPACE INSUFFISANT</text></g>
      <g transform="translate(420 30) rotate(10)"><path d="M30 0 L60 52 L0 52 Z" fill="#FFC83D" stroke="#3E1466" stroke-width="4" stroke-linejoin="round"/><rect x="27" y="16" width="6" height="20" rx="3" fill="#3E1466"/><circle cx="30" cy="43" r="3.6" fill="#3E1466"/></g>
      <g font-family="Inter, monospace" font-weight="700" fill="#7CF7FF" opacity=".8"><text x="40" y="50" font-size="16">Go</text><text x="80" y="160" font-size="13">Mo</text><text x="500" y="160" font-size="14">To</text><text x="60" y="96" font-size="11">01101001</text></g>
      ${palm(8, 90, 60, 120)}`,
    m2: () => `${sceneBg("m2", "#14062A", "#3E1466", "#00A8B5")}
      <circle cx="430" cy="78" r="44" fill="url(#ss-m2)"/>
      <rect y="150" width="560" height="80" fill="#0B3A5B"/><g stroke="#7CF7FF" stroke-opacity=".3">${[160, 175, 195, 220].map((y) => `<line x1="0" y1="${y}" x2="560" y2="${y}"/>`).join("")}</g>
      <path d="M300 152 C320 110 352 92 380 84 C368 110 366 132 372 152 Z" fill="#1A0634" stroke="#FF3D8B" stroke-width="2"/>
      <path d="M150 0 V96" stroke="#CDBDE2" stroke-width="2"/><path d="M150 96 C150 122 176 122 176 104" stroke="#CDBDE2" stroke-width="4" fill="none" stroke-linecap="round"/>
      <g transform="rotate(-8 150 90)" filter="url(#sg-m2)"><rect x="96" y="56" width="108" height="36" rx="8" fill="#FF1F4B"/><text x="150" y="80" text-anchor="middle" font-family="Inter Display, Arial Black" font-weight="900" font-size="17" fill="#fff">GRATUIT !</text></g>
      <text x="300" y="206" font-family="Inter, Arial" font-weight="700" font-size="13" fill="#7CF7FF" opacity=".85">les Requins du Net mordent à l'hameçon… ou c'est toi ?</text>
      ${palm(470, 70, 70, 140)}`,
    m3: () => `${sceneBg("m3", "#1B0A3A", "#5A1A96", "#E0207F")}${gridFloor(204)}
      <g filter="url(#sg-m3)"><rect x="240" y="40" width="44" height="80" rx="22" fill="#1B0B2E" stroke="#2EE6E6" stroke-width="3"/><path d="M226 98 C226 140 298 140 298 98" stroke="#2EE6E6" stroke-width="4" fill="none"/><rect x="259" y="132" width="6" height="34" fill="#2EE6E6"/><rect x="236" y="164" width="52" height="8" rx="4" fill="#2EE6E6"/></g>
      <g font-size="12" font-family="Inter, Arial" font-weight="700">${[[60, 52, "✅", "info vérifiée", "#3BE38A"], [56, 108, "❓", "rumeur", "#FFC83D"], [70, 162, "🦈", "arnaque", "#FF6B7A"], [356, 60, "✅", "source officielle", "#3BE38A"], [372, 118, "❓", "« source sûre »", "#FFC83D"], [350, 170, "🦈", "bêta secrète", "#FF6B7A"]]
        .map(([x, y, i, t, c]) => `<g transform="translate(${x} ${y})"><rect width="${t.length * 7 + 48}" height="30" rx="10" fill="#1B0B2E" stroke="${c}" stroke-width="2"/><text x="12" y="20">${i}</text><text x="34" y="20" fill="#fff">${t}</text></g>`).join("")}</g>
      <text x="262" y="30" text-anchor="middle" font-family="Inter Display, Arial Black" font-weight="900" font-size="13" fill="#FFC83D" letter-spacing="3">VICE FM · ON AIR</text>`,
    m4: () => `${sceneBg("m4", "#0C0420", "#3E1466", "#FF3D8B")}
      <g filter="url(#sg-m4)"><rect x="170" y="40" width="220" height="130" rx="12" fill="#1B0B2E" stroke="#A78BFA" stroke-width="3"/><rect x="250" y="170" width="60" height="20" fill="#2B1450"/><rect x="220" y="188" width="120" height="8" rx="4" fill="#2B1450"/></g>
      <text x="280" y="66" text-anchor="middle" font-family="Inter, Arial" font-weight="700" font-size="12" fill="#CDBDE2">Little Byte · poste n° 4</text>
      <g transform="translate(250 82)"><rect x="0" y="26" width="60" height="46" rx="8" fill="#FF6B7A"/><path d="M12 26 V14 a18 18 0 0 1 36 0" stroke="#FF6B7A" stroke-width="8" fill="none" transform="rotate(-25 48 14)"/><circle cx="30" cy="46" r="6" fill="#1B0B2E"/><rect x="27" y="46" width="6" height="14" fill="#1B0B2E"/></g>
      <g font-family="Inter, Arial" font-weight="700" font-size="11" fill="#FF6B7A">${[[30, 60, "🍪 cookies"], [24, 110, "🟢 session ouverte"], [416, 70, "🔑 mot de passe enregistré"], [430, 130, "🕘 historique"]].map(([x, y, t]) => `<text x="${x}" y="${y}">${t}</text>`).join("")}</g>
      ${gridFloor(206, "#A78BFA")}${palm(480, 110, 50, 100)}`,
    mF: () => `${sceneBg("mF", "#0E0420", "#5A1A96", "#FF3D7F")}
      <circle cx="280" cy="210" r="96" fill="url(#ss-mF)"/>${skyline(0, 150, 560, 60, "#2A0B4A")}
      <g filter="url(#sg-mF)">${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${120 + i * 70} 50)"><rect y="18" width="44" height="36" rx="7" fill="${i < 2 ? "#3BE38A" : "#FFC83D"}"/><path d="M8 18 V10 a14 14 0 0 1 28 0 V18" stroke="${i < 2 ? "#3BE38A" : "#FFC83D"}" stroke-width="6" fill="none" ${i < 2 ? 'transform="rotate(-20 36 10)"' : ""}/><circle cx="22" cy="34" r="4.5" fill="#1B0B2E"/></g>`).join("")}</g>
      <text x="280" y="140" text-anchor="middle" font-family="Inter Display, Arial Black" font-weight="900" font-size="26" fill="#fff" letter-spacing="4">23:50</text>
      ${palm(10, 80, 70, 140)}${palm(480, 90, 66, 130, "#12051F", true)}`,
    mB: () => `${sceneBg("mB", "#14062A", "#3E1466", "#00B8C2")}${gridFloor(200)}
      <g stroke="#2EE6E6" stroke-width="5" fill="none" filter="url(#sg-mB)"><path d="M280 60 L250 196 M280 60 L310 196 M262 140 H298 M256 168 H304"/></g><circle cx="280" cy="58" r="8" fill="#FF3D8B"/>
      <g stroke="#FFC83D" stroke-width="3" fill="none" opacity=".9">${[26, 46, 66].map((r) => `<path d="M${280 - r} ${58 - r * .6} A ${r} ${r} 0 0 1 ${280 + r} ${58 - r * .6}"/>`).join("")}</g>
      <g font-family="Inter, monospace" font-weight="700" fill="#7CF7FF"><text x="60" y="80" font-size="22">100 Mbit/s</text><text x="390" y="80" font-size="22" fill="#FFC83D">12,5 Mo/s</text><text x="248" y="120" font-size="0"></text></g>
      <text x="196" y="80" font-family="Inter Display, Arial Black" font-weight="900" font-size="26" fill="#FF3D8B">÷8</text>
      ${palm(470, 90, 60, 120)}`,
  };
  V.missionArt = (id) => `<svg viewBox="0 0 560 230" role="img" aria-label="Illustration de la mission">${(arts[id] || arts.m0)()}</svg>`;

  /* =====================================================================
     FAUX SITE (simulateur sécurisé — aucun lien réel)
     ===================================================================== */
  const hot = (id, inner, cls = "", tag = "div") => `<${tag} class="hot ${cls}" data-hot="${id}" role="button" tabindex="0" aria-label="Examiner cet élément">${inner}</${tag}>`;
  V.mock = (key) => {
    if (key !== "fakeSite") return "";
    return `<div class="mock-browser" aria-label="Simulation d'un faux site web">
      <div class="mb-bar"><span class="mb-dots"><i></i><i></i><i></i></span>
        ${hot("url", `<span class="mb-warn">⚠ Non sécurisé</span><span class="mb-addr">http://rockstargames.com.gta6-free.xyz/download</span>`, "mb-url")}
        <span class="mb-sim">SIMULATION</span></div>
      <div class="mb-page">
        ${hot("nav", `<b>VI·FREE</b><span>Accueil</span><span>Jeux</span><span>Contact</span>`, "mb-nav")}
        <div class="mb-hero">
          ${hot("image", `<svg viewBox="0 0 200 110" aria-hidden="true"><defs><linearGradient id="fsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B1A8C"/><stop offset=".7" stop-color="#FF3D7F"/><stop offset="1" stop-color="#FF9A4C"/></linearGradient></defs><rect width="200" height="110" fill="url(#fsg)"/><circle cx="100" cy="82" r="30" fill="#FFD23F"/><rect y="84" width="200" height="26" fill="#2A0B4A"/>${palm(10, 30, 40, 80)}${palm(150, 26, 44, 84, "#12051F", true)}</svg>`, "mb-img")}
          <div class="mb-hero-t">
            <div class="mb-title">LE JEU <span>GRATUIT</span> !</div>
            ${hot("promise", `Version <b>PC &amp; Android</b> disponible MAINTENANT, avant tout le monde !`, "mb-promise")}
            ${hot("timer", `⏳ Offre limitée : expire dans <b class="mb-count">04:59</b>`, "mb-timer")}
            ${hot("file", `⬇ Télécharger <b>GTA6_Setup.exe</b> · 12 Mo`, "mb-dl")}
          </div>
        </div>
        <div class="mb-row">
          ${hot("form", `<div class="mb-form-t">Vérifie ton âge pour débloquer le téléchargement</div>
            <div class="mb-field"><span>Pseudo</span><i></i></div>
            <div class="mb-field"><span>Mot de passe PlayStation</span><i></i></div>
            <div class="mb-field"><span>N° de carte bancaire</span><i></i></div>`, "mb-form")}
          ${hot("reviews", `<div class="mb-rv-t">Avis des joueurs</div>${["Kev_99", "Lola.vc", "xXdarkXx"].map((n) => `<div class="mb-rv"><b>★★★★★</b> « Trop bien ça marche !!! » <small>${n} · 18/11</small></div>`).join("")}`, "mb-reviews")}
        </div>
        ${hot("typos", `Téléchargez maintenent, 100% securiser et sans virus garantit.`, "mb-typos")}
        <div class="mb-foot"><span>© 2026 VI·FREE</span>${hot("pegi", `<b>PEGI 18</b>`, "mb-pegi")}</div>
      </div></div>`;
  };

  VC.V = V;
})();
