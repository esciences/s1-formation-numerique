/* Illustrations SVG rétro-futuristes (dessinées en code, aucune image externe). */
window.ART = {
  gladys(humeur) {
    // humeur : "boude" | "neutre" | "contente"
    const yeux = humeur === "boude"
      ? '<path d="M38 50 h16 M66 50 h16" stroke="#ffb000" stroke-width="5" stroke-linecap="round"/>'
      : '<rect x="40" y="42" width="12" height="14" fill="#7cffb2"/><rect x="68" y="42" width="12" height="14" fill="#7cffb2"/>';
    const bouche = humeur === "contente"
      ? '<path d="M44 70 q16 14 32 0" stroke="#7cffb2" stroke-width="5" fill="none" stroke-linecap="round"/>'
      : humeur === "boude"
        ? '<path d="M46 76 q14 -10 28 0" stroke="#ffb000" stroke-width="5" fill="none" stroke-linecap="round"/>'
        : '<path d="M46 72 h28" stroke="#7cffb2" stroke-width="5" stroke-linecap="round"/>';
    const zzz = humeur === "boude" ? '<text x="88" y="30" fill="#ffb000" font-family="monospace" font-size="14" font-weight="bold">z z</text>' : "";
    return `<svg viewBox="0 0 120 120" role="img" aria-label="GLADYS 3000, l'ordinatrice de bord">
      <rect x="6" y="10" width="108" height="86" rx="14" fill="#c9bfa4" stroke="#3a3326" stroke-width="3"/>
      <rect x="16" y="20" width="88" height="64" rx="10" fill="#0d1a17" stroke="#3a3326" stroke-width="3"/>
      <g opacity=".9">${yeux}${bouche}</g>${zzz}
      <rect x="40" y="96" width="40" height="10" fill="#a89c80" stroke="#3a3326" stroke-width="3"/>
      <rect x="24" y="106" width="72" height="8" rx="3" fill="#8c816a" stroke="#3a3326" stroke-width="3"/>
      <circle cx="98" cy="90" r="3" fill="${humeur === "boude" ? "#ffb000" : "#7cffb2"}"/>
    </svg>`;
  },
  boulon() {
    return `<svg viewBox="0 0 120 120" role="img" aria-label="BOULON, le robot de maintenance">
      <line x1="60" y1="6" x2="60" y2="22" stroke="#3a3326" stroke-width="3"/><circle cx="60" cy="6" r="5" fill="#ff5c8a" stroke="#3a3326" stroke-width="2"/>
      <rect x="28" y="22" width="64" height="42" rx="8" fill="#9fb4c7" stroke="#3a3326" stroke-width="3"/>
      <circle cx="46" cy="42" r="8" fill="#fff" stroke="#3a3326" stroke-width="2"/><circle cx="48" cy="42" r="3.5" fill="#1b1b2f"/>
      <circle cx="74" cy="42" r="8" fill="#fff" stroke="#3a3326" stroke-width="2"/><circle cx="76" cy="42" r="3.5" fill="#1b1b2f"/>
      <path d="M48 56 h24" stroke="#3a3326" stroke-width="3" stroke-linecap="round"/>
      <rect x="34" y="66" width="52" height="34" rx="6" fill="#7f97ad" stroke="#3a3326" stroke-width="3"/>
      <rect x="44" y="74" width="10" height="10" fill="#ffb000"/><rect x="58" y="74" width="10" height="10" fill="#7cffb2"/><rect x="72" y="74" width="6" height="10" fill="#ff5c8a"/>
      <rect x="18" y="70" width="12" height="24" rx="5" fill="#9fb4c7" stroke="#3a3326" stroke-width="3"/>
      <rect x="90" y="70" width="12" height="24" rx="5" fill="#9fb4c7" stroke="#3a3326" stroke-width="3"/>
      <circle cx="46" cy="108" r="8" fill="#3a3326"/><circle cx="74" cy="108" r="8" fill="#3a3326"/>
    </svg>`;
  },
  journal() {
    return `<svg viewBox="0 0 120 120" role="img" aria-label="Journal de bord">
      <rect x="14" y="20" width="92" height="76" rx="6" fill="#1d2440" stroke="#ffb000" stroke-width="3"/>
      <rect x="22" y="12" width="76" height="12" fill="#ffb000"/>
      <rect x="40" y="12" width="30" height="12" fill="#c9bfa4"/>
      <path d="M28 44 h64 M28 58 h64 M28 72 h40" stroke="#7cffb2" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  },
  disquette() {
    return `<svg viewBox="0 0 60 60" aria-hidden="true"><rect x="4" y="4" width="52" height="52" rx="4" fill="#ffb000" stroke="#3a3326" stroke-width="3"/>
      <rect x="16" y="4" width="26" height="16" fill="#c9bfa4" stroke="#3a3326" stroke-width="3"/><rect x="32" y="7" width="6" height="10" fill="#3a3326"/>
      <rect x="12" y="30" width="36" height="22" rx="2" fill="#f6f1e3" stroke="#3a3326" stroke-width="2"/></svg>`;
  },
  station(etat) {
    // etat : { A: "x/y", B: ..., C: ..., final: bool }
    return `<svg viewBox="0 0 800 420" class="station-svg" aria-hidden="true">
      <defs><radialGradient id="g1" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="#1b2550"/><stop offset="1" stop-color="#0a0d1f"/></radialGradient></defs>
      <rect width="800" height="420" fill="url(#g1)"/>
      ${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 137) % 800}" cy="${(i * 71) % 420}" r="${i % 3 ? 1 : 1.8}" fill="#f6f1e3" opacity="${0.3 + (i % 5) / 8}"/>`).join("")}
      <path d="M400 210 L170 110 M400 210 L630 110 M400 210 L400 360" stroke="#c9bfa4" stroke-width="10" opacity=".55"/>
      <path d="M400 210 L170 110 M400 210 L630 110 M400 210 L400 360" stroke="#3a3326" stroke-width="2" stroke-dasharray="6 8"/>
      <circle cx="400" cy="210" r="62" fill="#c9bfa4" stroke="#3a3326" stroke-width="4"/>
      <circle cx="400" cy="210" r="44" fill="#0d1a17" stroke="#3a3326" stroke-width="3"/>
      <text x="400" y="206" text-anchor="middle" fill="${etat.final ? "#7cffb2" : "#ffb000"}" font-family="monospace" font-size="15" font-weight="bold">GLADYS</text>
      <text x="400" y="226" text-anchor="middle" fill="${etat.final ? "#7cffb2" : "#ffb000"}" font-family="monospace" font-size="12">${etat.final ? "PRÊTE" : "ZZZ…"}</text>
      ${[[40, 300], [600, 300]].map(([x, y]) => `<g><rect x="${x}" y="${y}" width="160" height="56" fill="#1f3b7a" stroke="#c9bfa4" stroke-width="3"/>
        ${[1, 2, 3].map((k) => `<line x1="${x + k * 40}" y1="${y}" x2="${x + k * 40}" y2="${y + 56}" stroke="#c9bfa4" stroke-width="1.5"/>`).join("")}
        <line x1="${x}" y1="${y + 28}" x2="${x + 160}" y2="${y + 28}" stroke="#c9bfa4" stroke-width="1.5"/></g>`).join("")}
      <path d="M200 328 L330 250 M600 328 L470 250" stroke="#c9bfa4" stroke-width="4" opacity=".7"/>
      <g transform="translate(700 40)"><path d="M0 40 Q30 -10 60 40 Z" fill="#c9bfa4" stroke="#3a3326" stroke-width="3"/><line x1="30" y1="28" x2="30" y2="4" stroke="#3a3326" stroke-width="3"/><circle cx="30" cy="4" r="4" fill="${etat.final ? "#7cffb2" : "#ff5c8a"}"/></g>
      <g transform="translate(60 30)" opacity=".9"><circle r="16" cx="20" cy="20" fill="none" stroke="#ffb000" stroke-width="6" stroke-dasharray="6 5"/><circle r="6" cx="20" cy="20" fill="#ffb000"/></g>
    </svg>`;
  }
};
