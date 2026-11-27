/* OCTET · Comment mes fichiers sont rangés (J’apprends)
   Je manipule → j’observe → je comprends → je vérifie.
   Toutes les vues sont des simulations : aucun accès aux vrais fichiers. Progression gardée dans le navigateur. */
(function () {
  'use strict';
  var CLE = 'octet-comprendre-v1', ECOLE = 'OneDrive - Ton école';
  var etat = { pos: 'accueil', niv: {}, fait: {}, d: {}, reglages: {} };
  try { var lu = JSON.parse(localStorage.getItem(CLE) || 'null'); if (lu) for (var k in etat) if (lu[k] !== undefined) etat[k] = lu[k]; } catch (e) {}
  function sauver() { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {} }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var a in attrs) { if (a === 'class') e.className = attrs[a]; else e.setAttribute(a, attrs[a]); } if (html !== undefined) e.innerHTML = html; return e; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var reduit = function () { return document.documentElement.dataset.anim === 'non' || window.matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* ---------- Icônes (dessins originaux, mêmes que le parcours pratique) ---------- */
  var FICH = { pdf: ['#D93025', 'PDF'], jpg: ['#15803D', 'JPG'], docx: ['#1D6FD8', 'DOC'], mp3: ['#7C3AED', 'MP3'], pptx: ['#C2410C', 'PPT'] };
  function ico(t) {
    var s = '<svg class="ico" viewBox="0 0 40 40" aria-hidden="true">';
    var dos = '<path d="M3 9a2 2 0 0 1 2-2h11l4 4h15a2 2 0 0 1 2 2v3H3z" fill="var(--dossier-fonce)"/><path d="M3 14h34v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="var(--dossier)"/>';
    if (t === 'dossier') return s + dos + '</svg>';
    if (t === 'zip') return s + dos + '<rect x="17" y="14" width="6" height="20" fill="#5E5670"/><path d="M17 16h3M20 19h3M17 22h3M20 25h3M17 28h3" stroke="#fff" stroke-width="1.6"/></svg>';
    if (t === 'dossier-photo') return s + '<path d="M3 9a2 2 0 0 1 2-2h11l4 4h15a2 2 0 0 1 2 2v3H3z" fill="var(--dossier-fonce)"/><rect x="9" y="10" width="20" height="14" rx="1" fill="#fff" stroke="#8A8199"/><path d="M10 22l6-6 4 4 3-3 5 5z" fill="#15803D"/><path d="M3 18h34v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="var(--dossier)"/></svg>';
    if (t === 'page') return s + '<path d="M9 3h16l8 8v24a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#fff" stroke="#8A8199" stroke-width="1.6"/><path d="M25 3v8h8" fill="#E9E5F1" stroke="#8A8199" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    if (t === 'docx-sans') return s + '<path d="M9 3h16l8 8v24a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#fff" stroke="#8A8199" stroke-width="1.6"/><rect x="4" y="18" width="16" height="14" rx="2" fill="#1D6FD8"/><text x="12" y="29" text-anchor="middle" font-size="11" font-weight="700" font-family="Arial" fill="#fff">W</text></svg>';
    if (FICH[t]) return s + '<path d="M9 3h16l8 8v24a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#fff" stroke="#8A8199" stroke-width="1.6"/><path d="M25 3v8h8" fill="#E9E5F1" stroke="#8A8199" stroke-width="1.6" stroke-linejoin="round"/><rect x="4" y="20" width="24" height="11" rx="2" fill="' + FICH[t][0] + '"/><text x="16" y="28.6" text-anchor="middle" font-size="8" font-weight="700" font-family="Arial" fill="#fff">' + FICH[t][1] + '</text></svg>';
    if (t === 'nuage') return s + '<path d="M11 31a8 8 0 0 1-1-16 11 11 0 0 1 21 2 7 7 0 0 1 0 14z" fill="var(--bleu)"/></svg>';
    if (t === 'bureau' || t === 'ordi') return s + '<rect x="5" y="7" width="30" height="20" rx="2" fill="var(--bleu-clair)" stroke="var(--encre)" stroke-width="2.4"/><path d="M14 33h12M20 27v6" stroke="var(--encre)" stroke-width="2.4"/></svg>';
    if (t === 'telech') return s + '<path d="M20 5v18M12 16l8 8 8-8" fill="none" stroke="var(--bon)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 26v6h26v-6" fill="none" stroke="var(--bon)" stroke-width="3.2" stroke-linecap="round"/></svg>';
    if (t === 'serveur') return s + '<rect x="7" y="4" width="26" height="9" rx="2" fill="var(--violet-clair)" stroke="var(--encre)" stroke-width="2.2"/><rect x="7" y="15.5" width="26" height="9" rx="2" fill="var(--violet-clair)" stroke="var(--encre)" stroke-width="2.2"/><rect x="7" y="27" width="26" height="9" rx="2" fill="var(--violet-clair)" stroke="var(--encre)" stroke-width="2.2"/><circle cx="12" cy="8.5" r="1.6" fill="#15803D"/><circle cx="12" cy="20" r="1.6" fill="#15803D"/><circle cx="12" cy="31.5" r="1.6" fill="#15803D"/><path d="M18 8.5h11M18 20h11M18 31.5h11" stroke="var(--encre)" stroke-width="1.6"/></svg>';
    if (t === 'od-nuage') return s + '<path d="M11 30a8 8 0 0 1-1-16 11 11 0 0 1 21 2 7 7 0 0 1 0 14z" fill="none" stroke="var(--bleu)" stroke-width="3"/></svg>';
    if (t === 'od-coche') return s + '<circle cx="20" cy="20" r="15" fill="var(--surface)" stroke="#15803D" stroke-width="3"/><path d="M13 20l5 5 9-10" fill="none" stroke="#15803D" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (t === 'od-plein') return s + '<circle cx="20" cy="20" r="16" fill="#15803D"/><path d="M13 20l5 5 9-10" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (t === 'od-synchro') return s + '<path d="M31 15a12 12 0 0 0-21-3M9 25a12 12 0 0 0 21 3" fill="none" stroke="var(--bleu)" stroke-width="3.2" stroke-linecap="round"/><path d="M10 5v7h7M30 35v-7h-7" fill="none" stroke="var(--bleu)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (t === 'od-suppr') return s + '<path d="M10 12h20l-2 22H12z" fill="none" stroke="var(--faux)" stroke-width="2.8" stroke-linejoin="round"/><path d="M7 12h26M16 12V7h8v5" fill="none" stroke="var(--faux)" stroke-width="2.8" stroke-linecap="round"/></svg>';
    return s + '</svg>';
  }
  function icoNom(nom) { var x = (nom.split('.').pop() || '').toLowerCase(); return ico(FICH[x] ? x : 'page'); }
  function icoNoeud(n) { return n.f ? icoNom(n.n) : ico(n.t || 'dossier'); }

  /* ---------- Système de fichiers fictif ---------- */
  function fsBase() {
    return [
      { n: ECOLE, t: 'nuage', e: [{ n: 'COURS S1', e: [
        { n: 'Sciences', e: [{ n: 'Chimie', e: [] }, { n: 'Biologie', e: [{ n: 'La_cellule.pdf', f: 1 }] }, { n: 'Physique', e: [{ n: 'Les_etats_de_la_matiere.pdf', f: 1 }] }] },
        { n: 'Français', e: [{ n: 'Conjugaison.pdf', f: 1 }] },
        { n: 'Math', e: [{ n: 'Les_fractions.pdf', f: 1 }] }] }] },
      { n: 'Téléchargements', t: 'telech', e: [{ n: 'photo_labo.jpg', f: 1 }, { n: 'horaire_S1.pdf', f: 1 }] },
      { n: 'Bureau', t: 'bureau', e: [] }
    ];
  }
  function trouver(racines, chemin) { var liste = racines, n = null; for (var i = 0; i < chemin.length; i++) { n = (liste || []).filter(function (x) { return x.n === chemin[i]; })[0]; if (!n) return null; liste = n.e; } return n; }

  /* ---------- Modules et navigation ---------- */
  var ECRANS = $$('section.ecran'), IDS = ECRANS.map(function (s) { return s.dataset.id; });
  var MODULES = ECRANS.filter(function (s) { return s.dataset.lettre && s.dataset.id !== 'bilan'; });
  function ecran(id) { return ECRANS[IDS.indexOf(id)]; }
  function moduleFait(id) { return id === 'defis' ? (DEFIS ? nbDefis() === DEFIS.length : false) : (etat.niv[id] || 0) >= 4; }

  var DEM = ['Je manipule', 'J’observe', 'Je comprends', 'Je vérifie'];
  function niveau(mod, n) {
    var avant = etat.niv[mod] || 0;
    if (n > avant) { etat.niv[mod] = n; sauver(); }
    majDemarche(mod);
    if ((etat.niv[mod] || 0) >= 3) {
      var idee = $('[data-idee="' + mod + '"]'); if (idee && idee.hidden) { idee.hidden = false; }
      var v = $('#' + ({ fichier: 'a-piege-bloc', 'sous-dossier': 'b-verif-bloc', arborescence: 'c-verif-bloc', chemin: 'd-verif-bloc', explorateur: 'e-verif-bloc', local: 'f-verif-bloc', synchro: 'g-verif-bloc', copier: 'h-verif-bloc' })[mod]);
      if (v) v.hidden = false;
    }
    majProgression();
  }
  function majDemarche(mod) {
    var ol = $('[data-demarche="' + mod + '"]'); if (!ol) return;
    var n = etat.niv[mod] || 0;
    ol.innerHTML = DEM.map(function (t, i) { return '<li class="' + (i < n ? 'on' : '') + '"><b><span>' + (i + 1) + '</span></b>' + t + (i < n ? '<span class="sr"> (fait)</span>' : '') + '</li>'; }).join('');
    ol.setAttribute('aria-label', 'Démarche du module');
  }

  function aller(id, focus) {
    if (IDS.indexOf(id) < 0) id = 'accueil';
    ECRANS.forEach(function (s) { s.hidden = s.dataset.id !== id; });
    etat.pos = id; sauver();
    try { history.replaceState(null, '', id === 'accueil' ? location.pathname : '#' + id); } catch (e) {}
    var s = ecran(id), i = IDS.indexOf(id);
    $('#prec').disabled = i === 0;
    var suiv = $('#suiv'); suiv.hidden = i === IDS.length - 1;
    if (!suiv.hidden) { var nx = ecran(IDS[i + 1]); suiv.textContent = id === 'accueil' ? 'Commencer →' : (nx.dataset.lettre && /[A-H]/.test(nx.dataset.lettre) ? 'Module ' + nx.dataset.lettre + ' →' : nx.dataset.titre + ' →'); }
    $('#num').innerHTML = id === 'accueil' ? 'Accueil' : (s.dataset.lettre && /[A-H]/.test(s.dataset.lettre) ? '<b>Module ' + s.dataset.lettre + '</b> · ' + esc(s.dataset.titre) : '<b>' + esc(s.dataset.titre) + '</b>');
    if (id === 'bilan') rendreBilan();
    if (id === 'accueil') rendreListe();
    majProgression();
    window.scrollTo(0, 0);
    if (focus !== false) { var h = s.querySelector('h1, h2'); if (h) h.focus({ preventScroll: true }); }
  }
  $('#prec').addEventListener('click', function () { var i = IDS.indexOf(etat.pos); if (i > 0) aller(IDS[i - 1]); });
  $('#suiv').addEventListener('click', function () { var i = IDS.indexOf(etat.pos); if (i < IDS.length - 1) aller(IDS[i + 1]); });
  $$('[data-aller]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); aller(a.dataset.aller); }); });
  $('#btn-commencer').addEventListener('click', function () { if (MODULES.every(function (m) { return moduleFait(m.dataset.id); })) { aller('bilan'); return; } var prochain = MODULES.filter(function (m) { return !moduleFait(m.dataset.id); })[0]; aller(prochain ? prochain.dataset.id : 'fichier'); });
  window.addEventListener('hashchange', function () { var h = location.hash.slice(1); if (h && h !== etat.pos && IDS.indexOf(h) >= 0) aller(h); });

  function majProgression() {
    var nav = $('#progression'); nav.innerHTML = '';
    MODULES.forEach(function (m) {
      var id = m.dataset.id, b = el('button', { type: 'button', class: 'lettre ' + (moduleFait(id) ? 'on ' : '') + (etat.pos === id ? 'ici' : '') });
      b.textContent = m.dataset.lettre; b.title = m.dataset.titre;
      b.setAttribute('aria-label', (id === 'defis' ? 'Défis' : 'Module ' + m.dataset.lettre) + ' : ' + m.dataset.titre + (moduleFait(id) ? ' (terminé)' : ''));
      if (etat.pos === id) b.setAttribute('aria-current', 'step');
      b.addEventListener('click', function () { aller(id); });
      nav.appendChild(b);
    });
  }
  function rendreListe() {
    var ul = $('#liste-modules'); ul.innerHTML = '';
    MODULES.forEach(function (m) {
      var b = el('button', { type: 'button' }, '<i class="' + (moduleFait(m.dataset.id) ? 'on' : '') + '">' + esc(m.dataset.lettre) + '</i>' + esc(m.dataset.titre) + (moduleFait(m.dataset.id) ? '<span class="sr"> (terminé)</span>' : ''));
      b.addEventListener('click', function () { aller(m.dataset.id); });
      var li = el('li'); li.appendChild(b); ul.appendChild(li);
    });
    var tous = MODULES.every(function (m) { return moduleFait(m.dataset.id); }), un = MODULES.some(function (m) { return (etat.niv[m.dataset.id] || 0) > 0; });
    $('#btn-commencer').textContent = tous ? 'Revoir le bilan →' : (un ? 'Continuer →' : 'Commencer par le module A →');
  }

  /* ---------- QCM réutilisable (avec « Revoir la notion ») ---------- */
  function revoirBtn(mod) { var m = ecran(mod); var b = el('button', { type: 'button', class: 'revoir' }, '↩ Revoir : ' + esc(m.dataset.titre)); b.addEventListener('click', function () { aller(mod); }); return b; }
  function qcm(box, d, cle, onOk) {
    box.innerHTML = '<p class="q">' + esc(d.q) + '</p><div class="choix" role="group"></div><div class="retour" aria-live="polite"></div>';
    var choix = box.querySelector('.choix'), ret = box.querySelector('.retour');
    choix.setAttribute('aria-label', d.q);
    function bon(i) { choix.children[i].classList.add('bon'); box.classList.add('resolu'); ret.className = 'retour ok'; ret.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(d.c[i][2]) + '</span>'; }
    d.c.forEach(function (c, i) {
      var b = el('button', { type: 'button' }, '<span class="l" aria-hidden="true">' + 'ABCD'[i] + '</span><span>' + esc(c[0]) + '</span>');
      b.addEventListener('click', function () {
        if (box.classList.contains('resolu')) return;
        $$('button', choix).forEach(function (x) { x.classList.remove('faux'); });
        if (c[1]) { bon(i); etat.fait[cle] = 1; sauver(); if (onOk) onOk(); }
        else { b.classList.add('faux'); ret.className = 'retour ko'; ret.innerHTML = 'Pas tout à fait.<span class="pourquoi">' + esc(c[2]) + ' Réessaie !</span>'; if (d.r) { var p = el('p', { style: 'margin:.4rem 0 0' }); p.appendChild(revoirBtn(d.r)); ret.appendChild(p); } }
      });
      choix.appendChild(b);
    });
    if (etat.fait[cle]) bon(d.c.findIndex(function (c) { return c[1]; }));
  }
  /* Choix multiples */
  function multi(box, d, cle, onOk) {
    box.innerHTML = '<p class="q" style="font-weight:700">' + esc(d.q) + '</p><div class="multi"></div><button type="button" class="bouton">Vérifier ma réponse</button><div class="retour" aria-live="polite"></div>';
    var m = box.querySelector('.multi'), ret = box.querySelector('.retour');
    d.c.forEach(function (c, i) { m.appendChild(el('label', null, '<input type="checkbox" value="' + i + '">' + (c[3] || '') + '<span>' + esc(c[0]) + '</span>')); });
    function reussi() { $$('label', m).forEach(function (l, i) { l.querySelector('input').checked = !!d.c[i][1]; l.classList.toggle('bon', !!d.c[i][1]); }); ret.className = 'retour ok'; ret.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(d.ok) + '</span>'; }
    box.querySelector('.bouton').addEventListener('click', function () {
      var erreurs = [];
      $$('label', m).forEach(function (l, i) { var coche = l.querySelector('input').checked; l.classList.remove('bon', 'faux'); if (coche !== !!d.c[i][1]) { erreurs.push(d.c[i][2]); l.classList.add('faux'); } });
      if (!erreurs.length) { reussi(); etat.fait[cle] = 1; sauver(); if (onOk) onOk(); return; }
      ret.className = 'retour ko'; ret.innerHTML = 'Pas encore.<span class="pourquoi">' + esc(erreurs[0]) + ' Réessaie !</span>';
      if (d.r) { var p = el('p', { style: 'margin:.4rem 0 0' }); p.appendChild(revoirBtn(d.r)); ret.appendChild(p); }
    });
    if (etat.fait[cle]) reussi();
  }
  /* Chemin à reconstruire */
  function cheminJeu(box, d, cle, onOk) {
    var pris = [], cible = box.querySelector('.chemin-cible'), past = box.querySelector('.pastilles'), ret = box.querySelector('.retour');
    function icone(n) { return n === ECOLE ? ico('nuage') : (n === 'Téléchargements' ? ico('telech') : (/\.[a-z]+$/.test(n) ? icoNom(n) : ico('dossier'))); }
    function rendre() {
      cible.innerHTML = pris.length ? '' : '<span class="vide">Clique sur les éléments ci-dessous, du plus grand au plus petit.</span>';
      pris.forEach(function (n, i) { if (i) cible.appendChild(el('span', { class: 'sep', 'aria-hidden': 'true' }, '›')); var b = el('button', { type: 'button', class: 'pastille', 'aria-label': 'Retirer ' + n }, icone(n) + esc(n)); b.addEventListener('click', function () { pris = pris.slice(0, i); rendre(); }); cible.appendChild(b); });
      past.innerHTML = '';
      d.choix.forEach(function (n) { var b = el('button', { type: 'button', class: 'pastille' }, icone(n) + esc(n)); b.disabled = pris.indexOf(n) >= 0; b.addEventListener('click', function () { pris.push(n); rendre(); ret.className = 'retour'; ret.innerHTML = ''; var p = past.querySelector('.pastille:not(:disabled)'); if (p) p.focus(); }); past.appendChild(b); });
    }
    box.querySelector('[data-act="effacer"]').addEventListener('click', function () { pris = []; rendre(); ret.className = 'retour'; ret.innerHTML = ''; });
    box.querySelector('[data-act="verifier"]').addEventListener('click', function () {
      if (pris.join('/') === d.bon.join('/')) { ret.className = 'retour ok'; ret.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(d.ok) + '</span>'; etat.fait[cle] = 1; sauver(); if (onOk) onOk(); return; }
      var msg = !pris.length ? 'Clique d’abord sur des éléments.' : (pris[0] !== d.bon[0] ? 'Un chemin commence par le plus grand emplacement : ton OneDrive.' : (pris.length < d.bon.length ? 'Il manque un élément. Le chemin se termine par le fichier.' : 'Un élément n’est pas le bon, ou pas à sa place.'));
      ret.className = 'retour ko'; ret.innerHTML = 'Pas encore.<span class="pourquoi">' + esc(msg) + '</span>';
    });
    if (etat.fait[cle]) { pris = d.bon.slice(); ret.className = 'retour ok'; ret.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(d.ok) + '</span>'; }
    rendre();
  }

  /* ================= A · Fichier ou dossier ================= */
  (function () {
    var EL = [
      { id: 'photo', nom: 'photo_volcan.jpg', i: 'jpg', t: 'Une image', x: 'Ce fichier contient une photo : des milliers de pixels de couleur.' },
      { id: 'pdf', nom: 'Les_etats_de_la_matiere.pdf', i: 'pdf', t: 'Un document', x: 'Ce fichier contient un texte et un schéma à lire.' },
      { id: 'son', nom: 'dictee_audio.mp3', i: 'mp3', t: 'Un son', x: 'Ce fichier contient un enregistrement. (Ici, aucun son n’est joué.)' },
      { id: 'dos', nom: 'Sciences', i: 'dossier', t: 'Un dossier', x: 'Pas de texte, pas d’image : il range 3 éléments.' }
    ];
    var vus = etat.d.aVus || [], zone = $('#a-elements'), ap = $('#a-apercu');
    function visuel(e) {
      if (e.id === 'photo') return '<svg class="visuel" viewBox="0 0 240 150" role="img" aria-label="Photo d’un volcan"><rect width="240" height="150" fill="#9BD1F5"/><circle cx="196" cy="34" r="16" fill="#FFD23F"/><path d="M20 150L104 50h32l84 100z" fill="#7A4E2D"/><path d="M104 50h32l-8 14h-16z" fill="#E4572E"/><path d="M110 46c-6-14 8-20 4-34M126 44c8-10-2-22 6-32" stroke="#ADA6BD" stroke-width="7" fill="none" stroke-linecap="round"/><rect y="132" width="240" height="18" fill="#4D9A3A"/></svg>';
      if (e.id === 'pdf') return '<div class="page" aria-label="Page de document"><b>Les états de la matière</b><i></i><i style="width:80%"></i><i></i><i style="width:60%"></i><i style="height:2rem;background:#EAE1FA"></i><i></i><i style="width:70%"></i></div>';
      if (e.id === 'son') { var h = [18, 34, 52, 30, 60, 44, 22, 58, 36, 64, 28, 48, 20, 40, 56, 26, 38, 18]; return '<div class="onde" aria-label="Forme d’onde d’un son">' + h.map(function (v) { return '<i style="height:' + v + 'px"></i>'; }).join('') + '</div>'; }
      return '<div class="dedans-dossier"><span>' + ico('pdf') + 'Les_etats_de_la_matiere.pdf</span><span>' + ico('jpg') + 'photo_labo.jpg</span><span>' + ico('dossier') + 'Chimie</span></div>';
    }
    function ouvrir(e, b) {
      $$('.element', zone).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      ap.innerHTML = '<div>' + visuel(e) + '<p class="titre-ap">' + (e.i === 'dossier' ? '📁 ' : '📄 ') + esc(e.t) + ' : ' + (e.i === 'dossier' ? 'c’est un dossier' : 'c’est un fichier') + '</p><p style="margin:0 auto">' + esc(e.x) + '</p></div>';
      if (vus.indexOf(e.id) < 0) { vus.push(e.id); etat.d.aVus = vus; sauver(); b.querySelector('.vu').textContent = '✓ ouvert'; }
      niveau('fichier', 1);
      if (vus.length >= EL.length) niveau('fichier', 3); else if (vus.length >= 2) niveau('fichier', 2);
    }
    EL.forEach(function (e) {
      var b = el('button', { type: 'button', class: 'element', 'aria-pressed': 'false' }, ico(e.i) + '<span>' + esc(e.nom) + '</span><span class="vu">' + (vus.indexOf(e.id) >= 0 ? '✓ ouvert' : 'Ouvrir') + '</span>');
      b.addEventListener('click', function () { ouvrir(e, b); });
      zone.appendChild(b);
    });
    /* Le piège : l’icône ne suffit pas */
    var PIEGE = [
      { nom: 'Archives', i: 'zip', t: 'fichier', ouvre: 'Type : « Dossier compressé (.zip) ». C’est un seul fichier qui emballe d’autres fichiers.', ok: 'Malgré l’icône jaune, c’est un fichier .zip : un « paquet » à décompresser.' },
      { nom: 'Chapitre 2', i: 'docx-sans', t: 'fichier', ouvre: 'Il s’ouvre dans Word : c’est Chapitre 2.docx, l’extension est cachée.', ok: 'C’est un texte Word. Windows a caché « .docx ».' },
      { nom: 'Photos', i: 'dossier-photo', t: 'dossier', ouvre: 'Il contient 12 photos. Windows montre un aperçu sur l’icône.', ok: 'L’image sur l’icône est un aperçu : c’est bien un dossier qui range des photos.' },
      { nom: 'devoir', i: 'page', t: 'fichier', ouvre: 'Windows demande avec quelle application l’ouvrir : c’est un fichier d’un type inconnu.', ok: 'Une icône blanche, pas d’extension visible : c’est quand même un fichier.' }
    ];
    var res = etat.d.aPiege || {}, box = $('#a-piege');
    PIEGE.forEach(function (p, i) {
      var l = el('div', { class: 'piege-ligne' + (res[i] ? ' ok' : '') });
      l.innerHTML = '<span class="nom">' + ico(p.i) + esc(p.nom) + '</span>';
      var fb = el('div', { class: 'retour fb', 'aria-live': 'polite' });
      [['Fichier', 'fichier'], ['Dossier', 'dossier']].forEach(function (c) {
        var b = el('button', { type: 'button', class: 'bouton second' }, c[0]); b.setAttribute('aria-label', esc(p.nom) + ' : ' + c[0]);
        b.addEventListener('click', function () {
          if (c[1] === p.t) { res[i] = 1; etat.d.aPiege = res; sauver(); l.classList.add('ok'); fb.className = 'retour ok fb'; fb.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(p.ok) + '</span>'; if (Object.keys(res).length === PIEGE.length) { niveau('fichier', 4); } }
          else { fb.className = 'retour ko fb'; fb.innerHTML = 'Pas tout à fait.<span class="pourquoi">L’icône t’a trompé. Clique sur « Ouvrir pour voir ».</span>'; }
        });
        l.appendChild(b);
      });
      var o = el('button', { type: 'button', class: 'bouton' }, 'Ouvrir pour voir'); o.setAttribute('aria-label', 'Ouvrir ' + p.nom + ' pour voir');
      o.addEventListener('click', function () { fb.className = 'retour info fb'; fb.textContent = p.ouvre; });
      l.appendChild(o); l.appendChild(fb);
      if (res[i]) { fb.className = 'retour ok fb'; fb.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(p.ok) + '</span>'; }
      box.appendChild(l);
    });
  })();

  /* ================= B · Sous-dossier ================= */
  (function () {
    var ARB = { n: 'COURS S1', e: [{ n: 'Sciences', e: [{ n: 'Chimie' }, { n: 'Biologie' }, { n: 'Physique' }] }, { n: 'Français' }, { n: 'Math' }] };
    var ouv = etat.d.bOuv || {}, choisi = null;
    function parentDe(nom, n, p) { n = n || ARB; if (n.n === nom) return p || null; var r = null; (n.e || []).forEach(function (x) { var t = parentDe(nom, x, n); if (t !== null && r === null) r = t; }); return r; }
    function noeud(nom, n) { n = n || ARB; if (n.n === nom) return n; var r = null; (n.e || []).forEach(function (x) { r = r || noeud(nom, x); }); return r; }
    function boite(n) {
      var d = el('div', { class: 'boite-d' }), t = el('div', { class: 'tete' });
      var nb = el('button', { type: 'button', class: 'nom' + (choisi === n.n ? ' choisi' : '') }, ico('dossier') + esc(n.n));
      nb.setAttribute('aria-label', 'Rôle de ' + n.n);
      nb.addEventListener('click', function () { choisi = n.n; montrerRole(); rendre(); });
      t.appendChild(nb);
      if (n.e) {
        var o = el('button', { type: 'button', class: 'ouvre', 'aria-expanded': ouv[n.n] ? 'true' : 'false' }, ouv[n.n] ? 'Fermer' : 'Ouvrir');
        o.setAttribute('aria-label', (ouv[n.n] ? 'Fermer ' : 'Ouvrir ') + n.n);
        o.addEventListener('click', function () { ouv[n.n] = !ouv[n.n]; etat.d.bOuv = ouv; sauver(); niveau('sous-dossier', 1); rendre(); avancer(); var nb2 = $$('#b-boites .ouvre').filter(function (x) { return x.getAttribute('aria-label').indexOf(n.n) > 0; })[0]; if (nb2) nb2.focus(); });
        t.appendChild(o);
      }
      d.appendChild(t);
      if (n.e && ouv[n.n]) { var i = el('div', { class: 'interieur' }); n.e.forEach(function (x) { i.appendChild(boite(x)); }); d.appendChild(i); }
      else if (!n.e) d.appendChild(el('p', { class: 'vide-b' }, 'vide pour l’instant'));
      return d;
    }
    function liste(n) {
      var h = '<li><span class="n' + (choisi === n.n ? ' cible' : '') + '">' + ico('dossier') + esc(n.n) + '</span>';
      if (n.e && ouv[n.n]) h += '<ul>' + n.e.map(liste).join('') + '</ul>';
      return h + '</li>';
    }
    function rendre() { var b = $('#b-boites'); b.innerHTML = ''; b.appendChild(boite(ARB)); $('#b-liste').innerHTML = '<ul class="arbre">' + liste(ARB) + '</ul>'; }
    function montrerRole() {
      var n = noeud(choisi), p = parentDe(choisi), r = [];
      if (p) r.push('<b>' + esc(n.n) + '</b> est un <b>sous-dossier</b> de <b>' + esc(p.n) + '</b>.');
      else r.push('<b>' + esc(n.n) + '</b> n’a pas de parent dans cet exemple.');
      if (n.e) r.push('Il est le <b>dossier parent</b> de ' + n.e.map(function (x) { return '<b>' + esc(x.n) + '</b>'; }).join(', ') + '.');
      else r.push('Il ne contient rien : il n’est le parent de personne… pour l’instant.');
      if (p) { var fr = p.e.filter(function (x) { return x !== n; }); if (fr.length) r.push('Il est <b>au même niveau</b> que ' + fr.map(function (x) { return '<b>' + esc(x.n) + '</b>'; }).join(', ') + '.'); }
      $('#b-role').innerHTML = r.join(' ');
      if (p && n.e) niveau('sous-dossier', 3);
    }
    function avancer() {
      if (ouv['COURS S1'] && ouv['Sciences']) { niveau('sous-dossier', 2); if ((etat.niv['sous-dossier'] || 0) < 3) $('#b-role').innerHTML = 'Les boîtes s’emboîtent. Clique maintenant sur le <b>nom</b> « Sciences » pour voir son rôle.'; }
    }
    rendre(); avancer();
    multi($('#b-verif'), { q: 'Sciences est… (coche tout ce qui est vrai)', ok: 'Sciences est à la fois sous-dossier de COURS S1, parent de ses 3 dossiers, et au même niveau que Français et Math.', r: 'sous-dossier',
      c: [['un sous-dossier de COURS S1', 1, 'Sciences est bien rangé dans COURS S1 : c’est un sous-dossier.'],
          ['le dossier parent de Physique', 1, 'Sciences contient Physique : il en est le parent.'],
          ['un sous-dossier de Chimie', 0, 'Chimie est dans Sciences, pas l’inverse.'],
          ['au même niveau que Français', 1, 'Sciences et Français ont le même parent : COURS S1.']] }, 'b-verif', function () { niveau('sous-dossier', 4); });
  })();

  /* ================= C · Arborescence ================= */
  (function () {
    var DOCS = [['La_cellule.pdf', 'Biologie', 'La cellule, c’est de la biologie.'], ['Conjugaison.pdf', 'Français', 'La conjugaison, c’est du français.'], ['Les_fractions.pdf', 'Math', 'Les fractions, ce sont des maths.']];
    var cur = ['COURS S1'], doc = null, D = etat.d.c || (etat.d.c = { places: {}, t: {} });
    function arbre() {
      var r = { n: 'COURS S1', e: [{ n: 'Sciences', e: [{ n: 'Biologie', e: [] }, { n: 'Physique', e: [{ n: 'Les_etats_de_la_matiere.pdf', f: 1 }] }] }, { n: 'Français', e: [] }, { n: 'Math', e: [] }] };
      DOCS.forEach(function (d) { var dest = D.places[d[0]]; if (dest) { var n = trouver([r], dest); if (n) n.e.push({ n: d[0], f: 1 }); } });
      return r;
    }
    function rendre() {
      var R = arbre(), courant = trouver([R], cur), parent = cur.length > 1 ? cur[cur.length - 2] : null;
      var freres = cur.length > 1 ? trouver([R], cur.slice(0, -1)).e.filter(function (x) { return !x.f && x.n !== courant.n; }).map(function (x) { return x.n; }) : [];
      var enfants = courant.e.map(function (x) { return x.n; });
      function li(n, ch) {
        var c = ch.concat(n.n), tags = '';
        if (n.f) { return '<li><span class="fich">' + icoNom(n.n) + esc(n.n) + (enfants.indexOf(n.n) >= 0 && ch.join('/') === cur.join('/') ? '<span class="tg contenu">contenu</span>' : '') + '</span></li>'; }
        if (c.join('/') === cur.join('/')) tags += '<span class="tg ici">tu es ici</span>';
        else if (n.n === parent && c.join('/') === cur.slice(0, -1).join('/')) tags += '<span class="tg parent">parent</span>';
        else if (freres.indexOf(n.n) >= 0 && ch.join('/') === cur.slice(0, -1).join('/')) tags += '<span class="tg frere">même niveau</span>';
        else if (ch.join('/') === cur.join('/')) tags += '<span class="tg contenu">contenu</span>';
        var h = '<li><button type="button" class="nd' + (c.join('/') === cur.join('/') ? ' ici' : '') + '" data-ch="' + esc(c.join('/')) + '">' + ico('dossier') + esc(n.n) + '</button>' + tags;
        if (n.e && n.e.length) h += '<ul>' + n.e.map(function (x) { return li(x, c); }).join('') + '</ul>';
        return h + '</li>';
      }
      $('#c-arbre').innerHTML = li(R, []);
      $$('#c-arbre button.nd').forEach(function (b) { b.addEventListener('click', function () { ouvrir(b.dataset.ch.split('/'), 'arbre'); }); });
      $('#c-chemin').textContent = cur.join(' › ');
      $('#c-titre-contenu').textContent = 'Contenu de : ' + cur[cur.length - 1];
      var g = $('#c-contenu'); g.innerHTML = '';
      if (!courant.e.length) g.appendChild(el('p', { class: 'discret' }, 'Ce dossier est vide.'));
      courant.e.forEach(function (x) {
        if (x.f) { g.appendChild(el('span', { class: 'it fichier' }, icoNom(x.n) + esc(x.n))); return; }
        var b = el('button', { type: 'button', class: 'it' }, ico('dossier') + esc(x.n)); b.setAttribute('aria-label', 'Ouvrir ' + x.n);
        b.addEventListener('click', function () { ouvrir(cur.concat(x.n), 'contenu'); }); g.appendChild(b);
      });
      $('#c-parent').disabled = cur.length <= 1;
      $('#c-ranger').disabled = !doc;
      var plat = $('#c-plateau'); plat.innerHTML = '';
      DOCS.forEach(function (d) {
        var p = D.places[d[0]], b = el('button', { type: 'button', class: 'doc' + (p ? ' range' : ''), 'aria-pressed': doc === d[0] ? 'true' : 'false' }, icoNom(d[0]) + esc(d[0]) + (p ? ' <small>✓ ' + esc(p.split('/').pop()) + '</small>' : ''));
        if (p) b.setAttribute('aria-disabled', 'true');
        b.addEventListener('click', function () { if (p) return; doc = doc === d[0] ? null : d[0]; rendre(); var nb = $$('#c-plateau .doc').filter(function (x) { return x.textContent.indexOf(d[0]) >= 0; })[0]; if (nb) nb.focus(); });
        plat.appendChild(b);
      });
      majTaches();
    }
    function ouvrir(ch, depuis) {
      var avant = cur.slice(); cur = ch; niveau('arborescence', 1);
      if (cur[cur.length - 1] === 'Biologie') { D.t.bio = 1; }
      if (D.t.bio && cur.length === avant.length - 1) { D.t.parent = 1; }
      sauver(); rendre();
    }
    $('#c-parent').addEventListener('click', function () { if (cur.length > 1) ouvrir(cur.slice(0, -1), 'parent'); });
    function majTaches() {
      var ul = $('#c-taches'); ul.innerHTML = '';
      [['bio', 'Ouvre <b>Biologie</b>, dans l’arborescence ou dans le contenu. Observe les deux vues.'], ['parent', 'Remonte au <b>dossier parent</b> avec ↑.']].forEach(function (t) {
        ul.appendChild(el('li', { class: D.t[t[0]] ? 'fait' : '' }, '<span>' + t[1] + '</span>' + (D.t[t[0]] ? '<span class="etat-t">fait</span>' : '')));
      });
      if (D.t.bio && D.t.parent) { $('#c-ranger-bloc').hidden = false; niveau('arborescence', 2); }
    }
    $('#c-ranger').addEventListener('click', function () {
      if (!doc) return;
      var d = DOCS.filter(function (x) { return x[0] === doc; })[0], ici = cur[cur.length - 1], ret = $('#c-retour');
      if (ici === d[1]) {
        D.places[doc] = cur.join('/'); sauver(); ret.className = 'retour ok'; ret.innerHTML = 'Rangée !<span class="pourquoi">' + esc(doc) + ' apparaît maintenant sous ' + esc(ici) + ' dans l’arborescence.</span>'; doc = null; rendre();
        var nouv = $$('#c-arbre .fich').filter(function (x) { return x.textContent.indexOf(d[0]) >= 0; })[0]; if (nouv && !reduit()) nouv.classList.add('flash');
        if (Object.keys(D.places).length === DOCS.length) niveau('arborescence', 3);
      } else {
        ret.className = 'retour ko'; ret.innerHTML = 'Pas ici.<span class="pourquoi">Tu es dans ' + esc(ici) + '. ' + esc(d[2]) + ' Ouvre le bon dossier, puis « Ranger ici ».</span>';
      }
    });
    $('#c-reprendre').addEventListener('click', function () { D.places = {}; doc = null; sauver(); $('#c-retour').className = 'retour'; $('#c-retour').innerHTML = ''; rendre(); });
    rendre();
    qcm($('[data-qcm="c1"]'), { q: 'Dans COURS S1, Français et Sciences sont…', r: 'arborescence', c: [['au même niveau : ils ont le même parent', 1, 'Oui : tous les deux sont directement dans COURS S1.'], ['Français est le parent de Sciences', 0, 'Non : Sciences n’est pas rangé dans Français.'], ['Sciences est dans Français', 0, 'Non : regarde l’arborescence, ils sont côte à côte.']] }, 'c1', function () { niveau('arborescence', 4); });
  })();

  /* ================= D · Chemin ================= */
  (function () {
    var FS = fsBase(), CH = [ECOLE, 'COURS S1', 'Sciences', 'Physique', 'Les_etats_de_la_matiere.pdf'];
    var vus = etat.d.dVus || [], mode = (etat.niv.chemin || 0) >= 3 ? 'fini' : (vus.length >= CH.length ? 'question' : 'explorer'), actif = -1;
    var fil = $('#d-fil'), niv = $('#d-niveau'), ret = $('#d-retour');
    function rendreFil() {
      fil.innerHTML = '';
      CH.forEach(function (n, i) {
        if (i) fil.appendChild(el('span', { class: 'chev', 'aria-hidden': 'true' }, '›'));
        var fichier = i === CH.length - 1;
        var b = el('button', { type: 'button', class: 'seg' + (i === actif ? ' actif' : '') + (fichier ? ' arrivee' : '') }, (i === 0 ? ico('nuage') : (fichier ? icoNom(n) : ico('dossier'))) + esc(n) + '<span class="gl">' + (fichier ? 'arrivée · fichier' : (i === 0 ? 'emplacement' : 'dossier')) + '</span>');
        b.setAttribute('aria-label', n + (fichier ? ', fichier d’arrivée' : ', dossier, niveau ' + (i + 1)));
        if (i === actif) b.setAttribute('aria-current', 'location');
        b.addEventListener('click', function () { clic(i); });
        fil.appendChild(b);
      });
    }
    function montrer(i) {
      if (i === CH.length - 1) { niv.innerHTML = '<p class="illus">Arrivée</p><div class="rangee">' + ico('pdf') + '<p style="margin:0"><b>Les_etats_de_la_matiere.pdf</b> est un <b>fichier</b>. Il est rangé dans <b>Physique</b>, le dernier dossier du chemin.</p></div>'; return; }
      var n = trouver(FS, CH.slice(0, i + 1)), suivant = CH[i + 1];
      var h = '<p class="illus">Niveau ' + (i + 1) + ' · contenu de ' + esc(n.n) + '</p><div class="grille-items">';
      n.e.forEach(function (x) { h += '<span class="it' + (x.n === suivant ? ' suivant' : '') + (x.f ? ' fichier' : '') + '">' + icoNoeud(x) + esc(x.n) + (x.n === suivant ? '<b style="font:700 .65rem var(--f-titre)">→ le chemin passe ici</b>' : '') + '</span>'; });
      niv.innerHTML = h + '</div>';
    }
    function clic(i) {
      actif = i; rendreFil(); montrer(i); niveau('chemin', 1);
      if (mode === 'explorer') {
        if (vus.indexOf(i) < 0) { vus.push(i); etat.d.dVus = vus; sauver(); }
        if (vus.length >= CH.length) { mode = 'question'; niveau('chemin', 2); ret.className = 'retour info'; ret.innerHTML = '<b>Défi :</b> clique dans le chemin sur le dossier qui contient <b>directement</b> la fiche.'; }
        else { ret.className = 'retour info'; ret.textContent = 'Encore ' + (CH.length - vus.length) + ' étape(s) à ouvrir dans le chemin.'; }
      } else if (mode === 'question') {
        if (i === 3) { mode = 'fini'; ret.className = 'retour ok'; ret.innerHTML = 'Exact !<span class="pourquoi">Physique est le dernier dossier avant le fichier : c’est lui qui le contient.</span>'; niveau('chemin', 3); }
        else if (i === 4) { ret.className = 'retour ko'; ret.innerHTML = 'C’est la fiche elle-même.<span class="pourquoi">Cherche le dossier juste avant elle.</span>'; }
        else { ret.className = 'retour ko'; ret.innerHTML = 'Pas directement.<span class="pourquoi">' + esc(CH[i]) + ' contient la fiche, mais à travers d’autres dossiers. Cherche le dernier dossier.</span>'; }
      }
    }
    rendreFil();
    niv.innerHTML = '<p class="discret" style="margin:0">Clique sur une étape du chemin.</p>';
    if (mode === 'question') { ret.className = 'retour info'; ret.innerHTML = '<b>Défi :</b> clique dans le chemin sur le dossier qui contient <b>directement</b> la fiche.'; }
    else if (mode === 'explorer') ret.textContent = 'Commence par « OneDrive - Ton école ».';
    else ret.textContent = 'Tu peux encore cliquer sur le chemin pour l’explorer.';
    cheminJeu($('[data-chemin="conjugaison"]'), { bon: [ECOLE, 'COURS S1', 'Français', 'Conjugaison.pdf'], choix: ['Sciences', 'Conjugaison.pdf', ECOLE, 'Français', 'Téléchargements', 'COURS S1', 'Physique'], ok: 'Trois dossiers traversés, puis le fichier à l’arrivée.' }, 'd-chemin', function () { niveau('chemin', 4); });
  })();

  /* ================= Mini-explorateur (E et défi 1) ================= */
  function MiniExplo(hote, cfg) { this.h = hote; this.cfg = cfg; this.fs = fsBase(); this.cur = cfg.depart.slice(); this.recherche = ''; this.vise = null; this.rendre(); }
  MiniExplo.prototype.signal = function (ev) { if (this.cfg.surEvenement) this.cfg.surEvenement(ev, this); };
  MiniExplo.prototype.aller = function (ch, comment) { var avant = this.cur.slice(); this.cur = ch.slice(); this.recherche = ''; this.rendre(); this.signal({ type: 'naviguer', de: avant, vers: this.cur.slice(), comment: comment }); var p = this.h.querySelector('.it, .mx-contenu'); if (p && comment !== 'adresse') p.focus(); };
  MiniExplo.prototype.rendre = function () {
    var self = this, h = this.h; h.innerHTML = '';
    var mx = el('div', { class: 'mx' });
    mx.appendChild(el('div', { class: 'sim-etiquette' }, '<span>SIMULATION · explorateur simplifié</span><span>Ce ne sont pas tes vrais fichiers</span>'));
    var barre = el('div', { class: 'mx-barre' });
    var up = el('button', { type: 'button', class: 'parent', title: 'Dossier parent', 'aria-label': 'Remonter au dossier parent' }, '↑'); up.disabled = this.cur.length <= 1;
    up.addEventListener('click', function () { self.aller(self.cur.slice(0, -1), 'parent'); });
    barre.appendChild(up);
    var adr = el('div', { class: 'mx-adr', role: 'navigation', 'aria-label': 'Chemin (barre d’adresse)' });
    this.cur.forEach(function (n, i) {
      if (i) adr.appendChild(el('span', { class: 'chev', 'aria-hidden': 'true' }, '›'));
      var b = el('button', { type: 'button' }); b.textContent = n; if (i === self.cur.length - 1) b.setAttribute('aria-current', 'location');
      b.addEventListener('click', function () { if (i < self.cur.length - 1) self.aller(self.cur.slice(0, i + 1), 'adresse'); });
      adr.appendChild(b);
    });
    barre.appendChild(adr);
    if (this.cfg.recherche) {
      var rz = el('label', { class: 'mx-rech' }); var inp = el('input', { type: 'search', placeholder: '🔍 Rechercher dans ' + this.cur[this.cur.length - 1], 'aria-label': 'Rechercher dans ' + this.cur[this.cur.length - 1] });
      inp.value = this.recherche;
      inp.addEventListener('input', function () { self.recherche = inp.value; self.rendreContenu(); });
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var p = self.h.querySelector('.mx-resultats button'); if (p) p.focus(); } });
      rz.appendChild(inp); barre.appendChild(rz);
    }
    mx.appendChild(barre);
    var corps = el('div', { class: 'mx-corps' }), nav = el('div', { class: 'mx-nav', role: 'group', 'aria-label': 'Emplacements' });
    this.fs.forEach(function (r) { var b = el('button', { type: 'button', class: self.cur[0] === r.n ? 'actif' : '' }, ico(r.t) + '<span>' + esc(r.n) + '</span>'); b.addEventListener('click', function () { self.aller([r.n], 'volet'); }); nav.appendChild(b); });
    corps.appendChild(nav);
    this.zc = el('div', { class: 'mx-contenu' }); corps.appendChild(this.zc);
    mx.appendChild(corps);
    this.pied = el('div', { class: 'mx-pied' }, '<span></span><span>Ouvrir : double-clic ou Entrée</span>'); mx.appendChild(this.pied);
    h.appendChild(mx);
    this.rendreContenu();
  };
  MiniExplo.prototype.rendreContenu = function () {
    var self = this, z = this.zc; z.innerHTML = '';
    var q = this.recherche.trim().toLowerCase();
    if (q) {
      var res = [];
      (function parcours(n, ch) { (n.e || []).forEach(function (x) { var c = ch.concat(x.n); if (x.n.toLowerCase().indexOf(q) >= 0) res.push({ n: x, ch: c }); if (x.e) parcours(x, c); }); })(trouver(this.fs, this.cur), this.cur);
      var box = el('div', { class: 'mx-resultats', role: 'list', 'aria-label': 'Résultats de recherche' });
      if (!res.length) box.appendChild(el('p', { class: 'discret' }, 'Aucun résultat dans « ' + esc(this.cur[this.cur.length - 1]) + ' » et ses sous-dossiers.'));
      res.forEach(function (r) {
        var b = el('button', { type: 'button', role: 'listitem' }, icoNoeud(r.n) + '<span>' + esc(r.n.n) + '<small>Dans : ' + esc(r.ch.slice(0, -1).join(' › ')) + '</small></span>');
        b.addEventListener('click', function () { self.vise = r.n.n; self.signal({ type: 'resultat', nom: r.n.n }); self.aller(r.ch.slice(0, -1), 'recherche'); });
        box.appendChild(b);
      });
      z.appendChild(box); this.pied.firstChild.textContent = res.length + ' résultat(s)';
      this.signal({ type: 'recherche', q: q, n: res.length });
      return;
    }
    var n = trouver(this.fs, this.cur), items = n.e || [];
    var g = el('div', { class: 'grille-items', role: 'group', 'aria-label': 'Contenu de ' + n.n });
    if (!items.length) g.appendChild(el('p', { class: 'discret' }, 'Ce dossier est vide.'));
    items.forEach(function (x) {
      var b = el('button', { type: 'button', class: 'it' + (x.f ? ' fichier' : '') }, icoNoeud(x) + esc(x.n)); b.setAttribute('aria-label', x.n + (x.f ? ', fichier' : ', dossier'));
      function ouvrir() { if (x.f) { self.pied.firstChild.textContent = '« ' + x.n + ' » s’ouvre (simulation).'; self.signal({ type: 'ouvrir-fichier', nom: x.n, chemin: self.cur.slice() }); } else self.aller(self.cur.concat(x.n), 'ouvrir'); }
      b.addEventListener('dblclick', ouvrir);
      b.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); ouvrir(); } });
      b.addEventListener('click', function (e) { if (e.detail === 0) return; $$('.it', g).forEach(function (o) { o.style.borderColor = ''; }); b.style.borderColor = 'var(--violet-texte)'; self.pied.firstChild.textContent = '« ' + x.n + ' » sélectionné. Double-clic pour ouvrir.'; });
      if (self.vise === x.n) { b.classList.add('suivant'); if (!reduit()) b.classList.add('flash'); }
      g.appendChild(b);
    });
    z.appendChild(g);
    this.pied.firstChild.textContent = items.length + ' élément(s)';
    this.vise = null;
  };

  /* ================= E · Explorateur ================= */
  (function () {
    var T = etat.d.e || (etat.d.e = {}), ret = $('#e-retour');
    var TACHES = [
      ['volet', 'Clique sur <b>Téléchargements</b> dans les emplacements, à gauche.', 'Les emplacements mènent aux grands endroits de l’ordinateur. Le contenu change.'],
      ['ouvrir', 'Retourne dans <b>OneDrive</b> et ouvre <b>COURS S1</b> (double-clic ou Entrée).', 'Le chemin s’allonge : tu es entré dans un dossier.'],
      ['parent', 'Ouvre <b>Sciences</b>, puis remonte avec <b>↑</b>.', '↑ remonte d’un seul niveau : vers le dossier parent.'],
      ['adresse', 'Va dans <b>Physique</b>, puis clique sur <b>COURS S1</b> dans le chemin.', 'Un clic dans le chemin fait remonter de plusieurs niveaux d’un coup.'],
      ['recherche', 'Depuis OneDrive, tape <b>fractions</b> dans la recherche et ouvre le résultat.', 'La recherche fouille le dossier ouvert et tous ses sous-dossiers, et indique où se trouve le résultat.']
    ];
    function maj() {
      var ul = $('#e-taches'); ul.innerHTML = '';
      TACHES.forEach(function (t) { ul.appendChild(el('li', { class: T[t[0]] ? 'fait' : '' }, '<span>' + t[1] + '</span>' + (T[t[0]] ? '<span class="etat-t">fait</span>' : ''))); });
      var n = TACHES.filter(function (t) { return T[t[0]]; }).length;
      if (n) niveau('explorateur', n >= 3 ? 2 : 1);
      if (n === TACHES.length) niveau('explorateur', 3);
    }
    function ok(k) { if (T[k]) return; T[k] = 1; sauver(); var t = TACHES.filter(function (x) { return x[0] === k; })[0]; ret.className = 'retour ok'; ret.innerHTML = 'Observé !<span class="pourquoi">' + esc(t[2]) + '</span>'; maj(); }
    new MiniExplo($('#e-explo'), { depart: [ECOLE], recherche: true, surEvenement: function (ev) {
      if (ev.type === 'naviguer') {
        if (ev.comment === 'volet' && ev.vers[0] === 'Téléchargements') ok('volet');
        if (ev.comment === 'ouvrir' && ev.vers.join('/') === ECOLE + '/COURS S1') ok('ouvrir');
        if (ev.comment === 'parent' && ev.de[ev.de.length - 1] === 'Sciences') ok('parent');
        if (ev.comment === 'adresse' && ev.vers[ev.vers.length - 1] === 'COURS S1' && ev.de.length - ev.vers.length >= 1 && ev.de.indexOf('Physique') >= 0) ok('adresse');
        if (ev.comment === 'adresse' && T.adresse === undefined && ev.de.indexOf('Physique') < 0) { ret.className = 'retour info'; ret.textContent = 'Bien ! Essaie maintenant depuis Physique, plusieurs niveaux plus bas.'; }
      }
      if (ev.type === 'resultat' && /fractions/i.test(ev.nom)) ok('recherche');
      if (ev.type === 'recherche' && ev.n === 0 && /fraction/.test(ev.q)) { ret.className = 'retour info'; ret.textContent = 'Aucun résultat ? La recherche ne regarde que le dossier ouvert et ses sous-dossiers. Va d’abord dans OneDrive.'; }
    } });
    maj();
    qcm($('[data-qcm="e1"]'), { q: 'Tu es dans Physique. Pour aller dans Sciences, tu…', r: 'explorateur', c: [['cliques sur ↑', 1, '↑ remonte au dossier parent de Physique : Sciences.'], ['fermes la fenêtre avec ✕', 0, 'Le ✕ ferme l’explorateur : tu devrais tout recommencer.'], ['cliques sur Téléchargements', 0, 'Téléchargements est un autre emplacement, pas le parent de Physique.']] }, 'e1', function () { niveau('explorateur', 4); });
  })();

  /* ================= F · Local ou en ligne ================= */
  (function () {
    var EX = [
      { nom: 'photo_vacances.jpg', lieu: 'Bureau', pc: 1, srv: 0, st: 'local', txt: 'Rangée sur le Bureau : un emplacement local, pas relié à OneDrive.' },
      { nom: 'Exposé_volcans.pptx', lieu: ECOLE, pc: 0, srv: 1, st: 'nuage', txt: 'Rangé dans OneDrive, mais son contenu est resté sur le serveur.' },
      { nom: 'Les_etats_de_la_matiere.pdf', lieu: ECOLE, pc: 1, srv: 1, st: 'coche', txt: 'Rangée dans OneDrive et synchronisée : le contenu est des deux côtés.' }
    ];
    var vus = etat.d.fVus || [], sel = -1;
    var ST = { local: ['', 'Sur cet ordinateur seulement'], nuage: ['od-nuage', 'Disponible en ligne'], coche: ['od-coche', 'Disponible sur cet appareil'] };
    function rendre() {
      var ex = $('#f-exemples'); ex.innerHTML = '';
      EX.forEach(function (e, i) {
        var b = el('button', { type: 'button', 'aria-pressed': sel === i ? 'true' : 'false' }, icoNom(e.nom) + '<span>' + esc(e.nom) + '<small>dans ' + esc(e.lieu) + (vus.indexOf(i) >= 0 ? ' · ✓ observé' : '') + '</small></span>');
        b.addEventListener('click', function () { sel = i; if (vus.indexOf(i) < 0) { vus.push(i); etat.d.fVus = vus; sauver(); } niveau('local', 1); if (vus.length === 2) niveau('local', 2); if (vus.length === EX.length) niveau('local', 3); rendre(); $$('#f-exemples button')[i].focus(); });
        ex.appendChild(b);
      });
      function puces(cote) { return EX.filter(function (e) { return e[cote]; }).map(function (e) { return '<span class="contenu-f' + (sel >= 0 && EX[sel] === e ? ' vise' : '') + '">' + icoNom(e.nom) + esc(e.nom) + '</span>'; }).join(''); }
      $('#f-reseau').innerHTML =
        '<div class="poste"><h4>' + ico('ordi').replace('class="ico"', '') + 'Cet ordinateur</h4><p class="sous-t">Son disque, dans le boîtier</p><div class="disque"><span class="lbl">Contenu enregistré ici</span>' + puces('pc') + '</div></div>' +
        '<div class="lien"><span class="cable" aria-hidden="true"></span><span>Internet</span></div>' +
        '<div class="poste"><h4>' + ico('serveur').replace('class="ico"', '') + 'Serveur OneDrive</h4><p class="sous-t">Un ordinateur distant de Microsoft, dans un centre de données</p><div class="disque"><span class="lbl">Contenu enregistré ici</span>' + puces('srv') + '</div></div>';
      var c = $('#f-constat');
      if (sel < 0) { c.innerHTML = '<div>Choisis un fichier ci-dessus.</div>'; }
      else {
        var e = EX[sel];
        c.innerHTML = '<div>' + esc(e.txt) + '</div>' +
          '<div>Contenu sur cet ordinateur : <span class="' + (e.pc ? 'oui' : 'non') + '">' + (e.pc ? 'OUI' : 'NON') + '</span></div>' +
          '<div>Contenu sur le serveur : <span class="' + (e.srv ? 'oui' : 'non') + '">' + (e.srv ? 'OUI' : 'NON') + '</span></div>' +
          '<div>Je peux l’ouvrir sans Internet : <span class="' + (e.pc ? 'oui' : 'non') + '">' + (e.pc ? 'OUI' : 'NON') + '</span></div>' +
          '<div>Je le retrouve depuis un autre appareil, avec mon compte : <span class="' + (e.srv ? 'oui' : 'non') + '">' + (e.srv ? 'OUI' : 'NON') + '</span></div>';
      }
      $('#f-explo tbody').innerHTML = EX.map(function (e, i) { var s = ST[e.st]; return '<tr' + (sel === i ? ' style="outline:3px solid var(--neon)"' : '') + '><td>' + icoNom(e.nom) + esc(e.nom) + '</td><td>' + esc(e.lieu) + '</td><td><span class="statut">' + (s[0] ? ico(s[0]).replace('class="ico"', '') : '— ') + esc(s[1]) + '</span></td></tr>'; }).join('');
    }
    rendre();
    qcm($('[data-qcm="f1"]'), { q: 'Dans l’explorateur, tu vois Exposé_volcans.pptx avec un petit nuage. Son contenu est…', r: 'local', c: [['seulement sur le serveur', 1, 'Le nuage signifie « disponible en ligne » : l’explorateur montre le nom, mais le contenu est resté sur le serveur.'], ['sur le disque de l’ordinateur', 0, 'Non : un fichier avec un nuage n’est pas encore sur le disque.'], ['dans le ciel, quelque part sur Internet', 0, 'Le « cloud » n’est pas dans le ciel : ce sont des serveurs, de vrais ordinateurs.']] }, 'f1', function () { niveau('local', 4); });
  })();

  /* ================= G · Synchronisation ================= */
  (function () {
    var OBJ = [['ajout', 'Ajoute un fichier et attends qu’il arrive sur le serveur.'], ['modif', 'Modifie un fichier : la nouvelle version arrive sur le serveur.'], ['attente', 'Coupe Internet, puis modifie un fichier : observe l’attente.'], ['retour', 'Rétablis Internet : observe l’envoi.'], ['horsligne', 'Sans Internet, essaie d’ouvrir un fichier « seulement en ligne ».'], ['suppr', 'Supprime un fichier : regarde le serveur.']];
    var O = etat.d.gObj || (etat.d.gObj = {});
    var S, sel, minuterie = null, journal = [];
    function init() { S = { online: true, f: [{ nom: 'Les_etats_de_la_matiere.pdf', local: 1, srv: 1, vL: 1, vS: 1, att: null, garde: 0 }, { nom: 'Horaire_S1.pdf', local: 0, srv: 1, vL: 0, vS: 1, att: null }], corbeille: [], ajoute: 0 }; sel = 0; journal = []; log('Départ : une fiche synchronisée, un horaire seulement en ligne.'); }
    function log(t) { journal.unshift(t); var j = $('#g-journal'); if (j) j.innerHTML = journal.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join(''); }
    function obj(k) { if (!O[k]) { O[k] = 1; sauver(); } majObj(); }
    function majObj() {
      var ul = $('#g-objectifs'); ul.innerHTML = '';
      OBJ.forEach(function (o) { ul.appendChild(el('li', { class: O[o[0]] ? 'fait' : '' }, esc(o[1]) + (O[o[0]] ? '<span class="sr"> (fait)</span>' : ''))); });
      var n = OBJ.filter(function (o) { return O[o[0]]; }).length;
      if (n) niveau('synchro', n >= 3 ? 2 : 1);
      if (n === OBJ.length) niveau('synchro', 3);
    }
    function statut(f) {
      if (f.att === 'suppr') return '<span class="statut attente">' + ico('od-suppr').replace('class="ico"', '') + 'Suppression en attente' + (S.online ? '…' : ' (pas d’Internet)') + '</span>';
      if (f.att) return '<span class="statut attente">' + ico('od-synchro').replace('class="ico"', S.online && !reduit() ? 'class="tourne"' : '') + (S.online ? 'Envoi en cours…' : 'En attente d’envoi (pas d’Internet)') + '</span>';
      if (!f.local) return '<span class="statut">' + ico('od-nuage').replace('class="ico"', '') + 'Seulement en ligne</span>';
      return '<span class="statut">' + ico(f.garde ? 'od-plein' : 'od-coche').replace('class="ico"', '') + 'Sur l’ordinateur et en ligne</span>';
    }
    function rendre() {
      var pc = S.f.map(function (f, i) {
        return '<button type="button" class="ligne-f' + (f.att === 'suppr' ? ' supprime' : '') + '" data-i="' + i + '" aria-pressed="' + (sel === i ? 'true' : 'false') + '"><span class="n">' + icoNom(f.nom) + esc(f.nom) + '</span>' + (f.local ? '<span class="pastille-v">v' + f.vL + ' ici</span>' : '<span class="pastille-v" style="opacity:.6">pas ici</span>') + '<span class="st">' + statut(f) + '</span></button>';
      }).join('') || '<p class="discret">Dossier vide.</p>';
      var srv = S.f.filter(function (f) { return f.srv; }).map(function (f) { return '<div class="ligne-f" style="cursor:default"><span class="n">' + icoNom(f.nom) + esc(f.nom) + '</span><span class="pastille-v">v' + f.vS + '</span></div>'; }).join('') || '<p class="discret">Rien sur le serveur.</p>';
      var corb = S.corbeille.length ? '<p class="discret" style="margin:.5rem 0 0">Corbeille en ligne : ' + S.corbeille.map(esc).join(', ') + '</p>' : '';
      $('#g-sync').innerHTML =
        '<div class="poste"><h4>' + ico('ordi').replace('class="ico"', '') + 'Dossier OneDrive</h4><p class="sous-t">sur cet ordinateur · ce que montre l’explorateur</p><div class="lignes-f" role="group" aria-label="Fichiers du dossier OneDrive">' + pc + '</div></div>' +
        '<div class="lien' + (S.online ? '' : ' coupe') + '"><span class="cable" aria-hidden="true"></span><span><b>Internet</b><br>' + (S.online ? 'connecté' : '✕ coupé') + '</span></div>' +
        '<div class="poste"><h4>' + ico('serveur').replace('class="ico"', '') + 'Serveur OneDrive</h4><p class="sous-t">ton espace en ligne</p><div class="lignes-f">' + srv + '</div>' + corb + '</div>';
      $$('#g-sync .ligne-f[data-i]').forEach(function (b) { b.addEventListener('click', function () { sel = +b.dataset.i; rendre(); $('#g-sync .ligne-f[data-i="' + sel + '"]').focus(); }); });
      var f = S.f[sel], A = $('#g-actions'); A.innerHTML = '';
      function bt(txt, fn, off, cls) { var b = el('button', { type: 'button', class: 'bouton ' + (cls || 'second') }, txt); b.disabled = !!off; b.addEventListener('click', fn); A.appendChild(b); }
      bt(S.online ? '✕ Couper Internet' : '↺ Rétablir Internet', basculer, false, S.online ? 'second' : 'neon');
      bt('＋ Ajouter Exposé_volcans.docx', ajouter, S.ajoute);
      bt('✏ Modifier le fichier choisi', modifier, !f || f.att === 'suppr');
      bt('📂 Ouvrir le fichier choisi', ouvrir, !f || f.att === 'suppr');
      bt('☁ Libérer de l’espace', liberer, !f || !f.local || !f.srv || !!f.att);
      bt('🗑 Supprimer le fichier choisi', supprimer, !f || f.att === 'suppr');
      bt('↺ Recommencer l’expérience', function () { clearTimeout(minuterie); minuterie = null; init(); $('#g-test').innerHTML = ''; rendre(); });
      planifier();
    }
    function nomSel() { return S.f[sel] ? S.f[sel].nom : ''; }
    function basculer() {
      S.online = !S.online; log(S.online ? 'Internet rétabli.' : 'Internet coupé.');
      if (S.online && S.f.some(function (f) { return f.att; })) S.retourAttente = 1;
      rendre();
    }
    function ajouter() { S.f.push({ nom: 'Exposé_volcans.docx', local: 1, srv: 0, vL: 1, vS: 0, att: 'ajout' }); S.ajoute = 1; sel = S.f.length - 1; log('Exposé_volcans.docx ajouté dans le dossier OneDrive de l’ordinateur.'); rendre(); }
    function modifier() {
      var f = S.f[sel]; if (!f) return;
      if (!f.local) { if (!S.online) { test('<b>Impossible de le modifier :</b> son contenu est seulement sur le serveur et Internet est coupé.'); return; } f.local = 1; f.vL = f.vS; log(f.nom + ' téléchargé depuis le serveur pour être modifié.'); }
      f.vL++; f.att = f.att === 'ajout' ? 'ajout' : 'modif'; log(f.nom + ' modifié sur l’ordinateur : version ' + f.vL + '.');
      if (!S.online) { obj('attente'); test('La version ' + f.vL + ' est sur l’ordinateur. Le serveur a encore la version ' + (f.vS || '—') + ' : le changement <b>attend</b> Internet.'); }
      rendre();
    }
    function ouvrir() {
      var f = S.f[sel]; if (!f) return;
      if (f.local) { test('<b>Oui, il s’ouvre</b>' + (S.online ? '' : ', même sans Internet') + ' : son contenu (v' + f.vL + ') est sur l’ordinateur.'); }
      else if (S.online) { f.local = 1; f.vL = f.vS; log(f.nom + ' téléchargé à l’ouverture.'); test('<b>Il s’ouvre</b>, après un téléchargement depuis le serveur. Maintenant, il est aussi sur l’ordinateur.'); rendre(); }
      else { obj('horsligne'); test('<b>Impossible de l’ouvrir :</b> l’explorateur montre son nom, mais son contenu est seulement sur le serveur. Sans Internet, rien à faire.'); }
    }
    function liberer() { var f = S.f[sel]; f.local = 0; f.garde = 0; log(f.nom + ' : contenu retiré de l’ordinateur. Il reste sur le serveur.'); test('Place libérée : le fichier reste visible et en ligne, mais il faudra Internet pour l’ouvrir.'); rendre(); }
    function supprimer() {
      var f = S.f[sel];
      if (!f.srv) { S.f.splice(sel, 1); sel = 0; log(f.nom + ' supprimé avant d’avoir été envoyé.'); rendre(); return; }
      f.att = 'suppr'; f.local = 0; log(f.nom + ' supprimé sur l’ordinateur.'); rendre();
    }
    function planifier() {
      if (!S.online || minuterie || !S.f.some(function (f) { return f.att; })) return;
      minuterie = setTimeout(function () {
        minuterie = null; if (!S.online) return;
        var envoye = false;
        S.f.slice().forEach(function (f) {
          if (f.att === 'ajout') { f.srv = 1; f.vS = f.vL; log(f.nom + ' envoyé sur le serveur (v' + f.vS + ').'); obj('ajout'); envoye = true; }
          else if (f.att === 'modif') { f.vS = f.vL; log(f.nom + ' : version ' + f.vS + ' envoyée sur le serveur.'); obj('modif'); envoye = true; }
          else if (f.att === 'suppr') { S.corbeille.push(f.nom); S.f.splice(S.f.indexOf(f), 1); log(f.nom + ' supprimé aussi sur le serveur (corbeille en ligne).'); obj('suppr'); envoye = true; }
          f.att = null;
        });
        if (envoye && S.retourAttente) { obj('retour'); S.retourAttente = 0; }
        if (sel >= S.f.length) sel = 0;
        rendre();
      }, reduit() ? 500 : 1600);
    }
    function test(h) { $('#g-test').innerHTML = h; }
    init(); majObj(); rendre();
    qcm($('[data-qcm="g1"]'), { q: 'Tu modifies ta fiche dans OneDrive sans Internet. Que se passe-t-il ?', r: 'synchro', c: [['La modification attend sur l’ordinateur, puis part quand Internet revient', 1, 'Oui : les changements restent en attente, puis la synchronisation les envoie.'], ['La modification est perdue', 0, 'Non : elle est bien enregistrée sur l’ordinateur. Elle attend seulement d’être envoyée.'], ['Le serveur a déjà la nouvelle version', 0, 'Non : sans Internet, rien ne peut partir vers le serveur.']] }, 'g1', function () { niveau('synchro', 4); });
  })();

  /* ================= H · Copier / déplacer ================= */
  (function () {
    var O = etat.d.hObj || (etat.d.hObj = {}), F, sel, uid;
    var OBJ = [['copie', 'Copie un fichier : compte les exemplaires.'], ['deplace', 'Déplace un fichier : regarde le dossier de départ.'], ['independant', 'Écris dans une des deux copies : l’autre change-t-elle ?']];
    var DOS = ['Téléchargements', 'Physique'];
    function init() { uid = 0; F = [{ id: uid++, nom: 'Les_etats_de_la_matiere.pdf', d: 'Téléchargements', v: 1 }, { id: uid++, nom: 'photo_labo.jpg', d: 'Téléchargements', v: 1 }]; sel = null; }
    function obj(k) { if (!O[k]) { O[k] = 1; sauver(); } majObj(); }
    function majObj() {
      var ul = $('#h-objectifs'); ul.innerHTML = '';
      OBJ.forEach(function (o) { ul.appendChild(el('li', { class: O[o[0]] ? 'fait' : '' }, esc(o[1]))); });
      var n = OBJ.filter(function (o) { return O[o[0]]; }).length; if (n) niveau('copier', n >= 2 ? 2 : 1); if (n === OBJ.length) niveau('copier', 3);
    }
    function base(n) { return n.replace(' - Copie', ''); }
    function dire(c, t) { var r = $('#h-retour'); r.className = 'retour ' + c; r.innerHTML = t; }
    function rendre(nouveau) {
      var z = $('#h-dossiers'); z.innerHTML = '';
      DOS.forEach(function (d) {
        var box = el('div', { class: 'dossier-cd', 'data-d': d }, '<h4>' + (d === 'Téléchargements' ? ico('telech') : ico('dossier')) + esc(d) + '</h4>');
        var ici = F.filter(function (f) { return f.d === d; });
        if (!ici.length) box.appendChild(el('p', { class: 'vide-cd' }, 'Dossier vide.'));
        ici.forEach(function (f) {
          var b = el('button', { type: 'button', class: 'fcd' + (f.id === nouveau ? ' nouveau' : ''), draggable: 'true', 'aria-pressed': sel === f.id ? 'true' : 'false' }, icoNom(f.nom) + '<span>' + esc(f.nom) + '</span><span class="pastille-v" style="margin-left:auto">v' + f.v + '</span>');
          b.setAttribute('aria-label', f.nom + ', version ' + f.v + ', dans ' + d);
          b.addEventListener('click', function () { sel = f.id; rendre(); focusSel(); dire('info', '« ' + esc(f.nom) + ' » choisi. Copier ou déplacer ?'); });
          b.addEventListener('dragstart', function (e) { sel = f.id; e.dataTransfer.setData('text/plain', f.id); });
          box.appendChild(b);
        });
        box.addEventListener('dragover', function (e) { e.preventDefault(); box.classList.add('survol'); });
        box.addEventListener('dragleave', function () { box.classList.remove('survol'); });
        box.addEventListener('drop', function (e) { e.preventDefault(); box.classList.remove('survol'); var f = F.filter(function (x) { return x.id === sel; })[0]; if (f && f.d !== d) action('deplacer'); });
        z.appendChild(box);
      });
      var f = F.filter(function (x) { return x.id === sel; })[0], A = $('#h-actions'); A.innerHTML = '';
      var autre = f ? DOS[1 - DOS.indexOf(f.d)] : 'l’autre dossier';
      function bt(t, fn, off, cls) { var b = el('button', { type: 'button', class: 'bouton ' + (cls || '') }, t); b.disabled = off; b.addEventListener('click', fn); A.appendChild(b); }
      bt('⧉ Copier vers ' + autre, function () { action('copier'); }, !f);
      bt('➜ Déplacer vers ' + autre, function () { action('deplacer'); }, !f);
      bt('✏ Écrire dans cet exemplaire', function () { action('ecrire'); }, !f, 'second');
      bt('↺ Recommencer', function () { init(); rendre(); dire('info', 'C’est reparti. Choisis un fichier.'); }, false, 'second');
      var noms = {}; F.forEach(function (x) { var b0 = base(x.nom); noms[b0] = (noms[b0] || 0) + 1; });
      $('#h-compteur').innerHTML = Object.keys(noms).map(function (n) { return '<span>' + esc(n) + ' : ' + noms[n] + ' exemplaire' + (noms[n] > 1 ? 's' : '') + '</span>'; }).join('');
    }
    function focusSel() { var b = $('#h-dossiers .fcd[aria-pressed="true"]'); if (b) b.focus(); }
    function action(t) {
      var f = F.filter(function (x) { return x.id === sel; })[0]; if (!f) return;
      var dest = DOS[1 - DOS.indexOf(f.d)], deja = F.filter(function (x) { return x.d === dest && x.nom === f.nom; })[0];
      if (t === 'copier') {
        var c = { id: uid++, nom: deja ? f.nom.replace(/(\.[a-z]+)$/, ' - Copie$1') : f.nom, d: dest, v: f.v }; F.push(c);
        dire('ok', 'Copié !<span class="pourquoi">Il y a maintenant un exemplaire dans ' + esc(f.d) + ' <b>et</b> un dans ' + esc(dest) + '.</span>'); obj('copie'); sel = c.id; rendre(c.id);
      } else if (t === 'deplacer') {
        if (deja) { dire('ko', 'Un fichier « ' + esc(f.nom) + ' » existe déjà dans ' + esc(dest) + '.<span class="pourquoi">Windows te demanderait de choisir lequel garder.</span>'); return; }
        var de = f.d; f.d = dest; dire('ok', 'Déplacé !<span class="pourquoi">Le fichier a quitté ' + esc(de) + ' : il n’existe plus que dans ' + esc(dest) + '.</span>'); obj('deplace'); rendre(f.id);
      } else {
        f.v++; var autres = F.filter(function (x) { return x !== f && base(x.nom) === base(f.nom); });
        if (autres.length) { dire('ok', 'Écrit dans l’exemplaire de ' + esc(f.d) + ' (v' + f.v + ').<span class="pourquoi">L’exemplaire de ' + esc(autres[0].d) + ' est resté en v' + autres[0].v + ' : les copies sont indépendantes.</span>'); obj('independant'); }
        else dire('info', 'Écrit (v' + f.v + '). Fais d’abord une copie pour comparer deux exemplaires.');
        rendre();
      }
      focusSel();
    }
    init(); majObj(); rendre();
    qcm($('[data-qcm="h1"]'), { q: 'Ta fiche est dans Téléchargements. Tu veux qu’elle soit dans Physique, sans laisser de double. Tu…', r: 'copier', c: [['la déplaces', 1, 'Déplacer : le fichier quitte Téléchargements et arrive dans Physique.'], ['la copies', 0, 'Copier laisserait un exemplaire dans Téléchargements : tu aurais deux fiches.']] }, 'h1', function () { niveau('copier', 4); });
  })();

  /* ================= Défis ================= */
  var DEFIS = [
    { t: 'Retrouve un fichier grâce à son chemin', r: 'chemin', rend: function (box, gagne) {
      box.insertAdjacentHTML('beforeend', '<p>Ouvre ce fichier dans l’explorateur simulé :</p><p class="adresse" style="display:inline-flex">' + ico('nuage') + [ECOLE, 'COURS S1', 'Math'].map(function (s) { return '<span class="seg">' + esc(s) + '</span>'; }).join('<span class="sep">›</span>') + '<span class="sep">›</span><span class="seg">Les_fractions.pdf</span></p><div class="explo-d"></div><div class="retour" aria-live="polite"></div>');
      var ret = box.querySelector('.retour');
      new MiniExplo(box.querySelector('.explo-d'), { depart: ['Téléchargements'], recherche: false, surEvenement: function (ev) {
        if (ev.type !== 'ouvrir-fichier') return;
        if (ev.nom === 'Les_fractions.pdf') gagne('Tu as suivi le chemin dossier par dossier jusqu’au fichier.');
        else { ret.className = 'retour ko'; ret.innerHTML = 'Ce n’est pas celui-là.<span class="pourquoi">Tu as ouvert « ' + esc(ev.nom) + ' ». Suis le chemin depuis le début : OneDrive, puis COURS S1, puis Math.</span>'; ret.appendChild(revoirBtn('chemin')); }
      } });
    } },
    { t: 'Même niveau ou sous-dossier ?', r: 'arborescence', rend: function (box, gagne) {
      function mini(arbre) { var h = function (n) { return '<li><span class="n">' + ico('dossier') + esc(n.n) + '</span>' + (n.e ? '<ul>' + n.e.map(h).join('') + '</ul>' : '') + '</li>'; }; return '<ul class="arbre">' + h(arbre) + '</ul>'; }
      box.insertAdjacentHTML('beforeend', '<p>Dans quel schéma <b>Biologie</b> est-il un <b>sous-dossier</b> de <b>Chimie</b> ?</p><div class="arbres-ab"><button type="button" data-v="a"><b class="lt">Schéma A</b>' + mini({ n: 'Sciences', e: [{ n: 'Chimie' }, { n: 'Biologie' }] }) + '</button><button type="button" data-v="b"><b class="lt">Schéma B</b>' + mini({ n: 'Sciences', e: [{ n: 'Chimie', e: [{ n: 'Biologie' }] }] }) + '</button></div><div class="retour" aria-live="polite"></div>');
      var ret = box.querySelector('.retour');
      $$('.arbres-ab button', box).forEach(function (b) { b.addEventListener('click', function () {
        if (b.dataset.v === 'b') { b.classList.add('bon'); gagne('Dans B, Biologie est décalé sous Chimie : il est dedans. Dans A, ils sont au même niveau, avec le même parent.'); }
        else { b.classList.add('faux'); ret.className = 'retour ko'; ret.innerHTML = 'Non.<span class="pourquoi">Dans A, Chimie et Biologie sont alignés : ils sont au même niveau, tous les deux dans Sciences.</span>'; ret.appendChild(revoirBtn('arborescence')); }
      }); });
    } },
    { t: 'Copier ou déplacer ?', r: 'copier', rend: function (box, gagne) {
      box.insertAdjacentHTML('beforeend', '<div class="qcm" data-x="1"></div><div class="qcm" data-x="2"></div>');
      var ok = {};
      function test() { if (ok[1] && ok[2]) gagne('Copier quand on veut garder l’original ET un double ; déplacer quand on veut changer d’endroit.'); }
      qcm(box.querySelector('[data-x="1"]'), { q: 'Tu veux donner ton exposé à un ami sur une clé USB, et garder le tien.', r: 'copier', c: [['Je le copie', 1, 'Copier : tu gardes ton exemplaire, ton ami reçoit le sien.'], ['Je le déplace', 0, 'Déplacer : le fichier quitterait ton ordinateur pour la clé.']] }, 'dx1', function () { ok[1] = 1; test(); });
      qcm(box.querySelector('[data-x="2"]'), { q: 'Ta fiche traîne dans Téléchargements. Tu veux la ranger dans Physique.', r: 'copier', c: [['Je la copie', 0, 'Tu aurais deux fiches : une rangée, une qui traîne encore.'], ['Je la déplace', 1, 'Déplacer : elle quitte Téléchargements et arrive dans Physique.']] }, 'dx2', function () { ok[2] = 1; test(); });
    } },
    { t: 'Sans Internet, qu’est-ce qui s’ouvre ?', r: 'synchro', rend: function (box, gagne) {
      var d = box.appendChild(el('div'));
      multi(d, { q: 'Internet est coupé. Coche les fichiers que tu peux ouvrir.', ok: 'Seul le fichier avec le nuage est uniquement sur le serveur. Les autres ont leur contenu sur l’ordinateur.', r: 'synchro',
        c: [['Horaire_S1.pdf · nuage', 0, 'Le nuage : le contenu est seulement sur le serveur. Sans Internet, il ne s’ouvre pas.', ico('od-nuage')],
            ['Les_etats_de_la_matiere.pdf · coche verte', 1, 'La coche verte : le contenu est aussi sur l’ordinateur. Il s’ouvre.', ico('od-coche')],
            ['Exposé_volcans.docx · pastille verte pleine', 1, 'La pastille pleine : toujours gardé sur l’ordinateur. Il s’ouvre.', ico('od-plein')],
            ['photo_vacances.jpg · sur le Bureau', 1, 'Le Bureau est local : le contenu est sur l’ordinateur.', ico('bureau')]] }, 'dx4', function () { gagne('Ce qui compte, c’est où se trouve le contenu, pas ce que montre l’explorateur.'); });
    } },
    { t: 'Où est passée ma fiche ?', r: 'arborescence', rend: function (box, gagne) {
      box.insertAdjacentHTML('beforeend', '<p>Tu as rangé <code>Conjugaison.pdf</code> dans <b>Français</b>. Tu ouvres <b>Sciences</b> : elle n’y est pas.</p><div class="panneau" style="margin-bottom:.6rem"><p class="illus">Contenu de : Sciences</p><div class="grille-items"><span class="it">' + ico('dossier') + 'Chimie</span><span class="it">' + ico('dossier') + 'Biologie</span><span class="it">' + ico('dossier') + 'Physique</span></div></div><div class="qcm"></div>');
      qcm(box.querySelector('.qcm'), { q: 'Pourquoi ?', r: 'arborescence', c: [['Un dossier montre seulement ce qu’il contient : elle est dans Français, pas dans Sciences', 1, 'Chaque dossier a son propre contenu. Pour la voir, il faut ouvrir Français.'], ['Elle a été supprimée', 0, 'Rien ne dit qu’elle a disparu : elle est simplement rangée ailleurs.'], ['Sciences cache les fichiers de français', 0, 'Un dossier ne cache rien : il ne montre que ce qui est rangé dedans.']] }, 'dx5', function () { gagne('Pour retrouver un fichier, il faut ouvrir le dossier où il est rangé, ou utiliser la recherche.'); });
    } },
    { t: 'Supprimer pour faire de la place ?', r: 'synchro', rend: function (box, gagne) {
      box.insertAdjacentHTML('beforeend', '<div class="qcm"></div>');
      qcm(box.querySelector('.qcm'), { q: 'Ton exposé est dans OneDrive. Tu le supprimes sur ton ordinateur pour faire de la place. Le soir, tu ouvres OneDrive en ligne chez toi.', r: 'synchro', c: [['Il est toujours là, en ligne', 0, 'Non : la suppression aussi est synchronisée.'], ['Il a disparu aussi en ligne', 1, 'Oui : la suppression est envoyée au serveur. Il va dans la corbeille en ligne.'], ['Il est revenu sur l’ordinateur', 0, 'Non : supprimer n’est pas ranger ailleurs.']] }, 'dx6', function () { gagne('Pour gagner de la place sans perdre le fichier, on utilise « Libérer de l’espace ».'); });
    } }
  ];
  function nbDefis() { if (!DEFIS) return 0; return DEFIS.filter(function (d, i) { return etat.fait['defi' + i]; }).length; }
  (function () {
    var z = $('#defis');
    DEFIS.forEach(function (d, i) {
      var c = el('div', { class: 'defi-carte' + (etat.fait['defi' + i] ? ' reussi' : '') }, '<h3><span class="n">' + (i + 1) + '</span>' + esc(d.t) + '</h3>');
      var fin = el('div', { class: 'retour', 'aria-live': 'polite' });
      function gagne(t) { etat.fait['defi' + i] = 1; sauver(); c.classList.add('reussi'); var r = c.querySelector('.retour.ko'); if (r) { r.className = 'retour'; r.innerHTML = ''; } fin.className = 'retour ok'; fin.innerHTML = '✓ Défi réussi !<span class="pourquoi">' + esc(t) + '</span>'; majProgression(); }
      d.rend(c, gagne);
      c.appendChild(fin);
      if (etat.fait['defi' + i]) { fin.className = 'retour ok'; fin.textContent = '✓ Défi réussi !'; }
      z.appendChild(c);
    });
  })();

  /* ================= Bilan ================= */
  function rendreBilan() {
    var L = [['ce qu’est un fichier et un dossier', 'fichier'], ['ce qu’est un sous-dossier, un dossier parent', 'sous-dossier'], ['comment fonctionne une arborescence', 'arborescence'], ['ce qu’indique le chemin d’un fichier', 'chemin'], ['à quoi sert l’explorateur', 'explorateur'], ['la différence entre local et en ligne', 'local'], ['le rôle de OneDrive et de la synchronisation', 'synchro'], ['la différence entre copier et déplacer', 'copier']];
    var ul = $('#bilan'); ul.innerHTML = '';
    L.forEach(function (l) {
      var ok = moduleFait(l[1]), li = el('li', null, (ok ? '<span class="pastille-etat verifie">Compris</span>' : '<span class="pastille-etat afaire">À revoir</span>') + '<span class="txt">' + esc(l[0]) + '</span>');
      li.appendChild(revoirBtn(l[1])); ul.appendChild(li);
    });
    var nd = nbDefis();
    ul.appendChild(el('li', null, '<span class="pastille-etat ' + (nd === DEFIS.length ? 'verifie' : 'afaire') + '">' + nd + '/' + DEFIS.length + '</span><span class="txt">défis réussis</span>'));
    var tout = L.every(function (l) { return moduleFait(l[1]); }) && nd === DEFIS.length;
    $('#badge-fin').innerHTML = tout ? '<span class="badge-fin">✓ Je sais comment mes fichiers sont rangés !</span><p>Tu es prêt : dans ton vrai explorateur, tu sais où tu es, où tu ranges et pourquoi.</p>' : '<p class="discret">Les lignes « À revoir » ne sont pas terminées. Tu peux y retourner ou passer quand même à la pratique.</p>';
  }

  /* ================= Réglages ================= */
  var dlg = $('#dlg-reglages'), R = etat.reglages;
  function appliquer() { var d = document.documentElement; if (R.texte && R.texte !== 'normal') d.dataset.texte = R.texte; else delete d.dataset.texte; if (R.theme && R.theme !== 'auto') d.dataset.theme = R.theme; else delete d.dataset.theme; if (R.anim === 'non') d.dataset.anim = 'non'; else delete d.dataset.anim; }
  [['texte', 'normal'], ['theme', 'auto'], ['anim', 'oui']].forEach(function (p) { $$('input[name="' + p[0] + '"]', dlg).forEach(function (r) { r.checked = (R[p[0]] || p[1]) === r.value; r.addEventListener('change', function () { R[p[0]] = r.value; etat.reglages = R; sauver(); appliquer(); }); }); });
  $('#btn-reglages').addEventListener('click', function () { dlg.showModal(); });
  $$('dialog [data-fermer]').forEach(function (b) { b.addEventListener('click', function () { b.closest('dialog').close(); }); });
  $('#btn-raz').addEventListener('click', function () { dlg.close(); $('#dlg-raz').showModal(); });
  $('#raz-oui').addEventListener('click', function () { try { localStorage.setItem(CLE, JSON.stringify({ reglages: etat.reglages })); } catch (e) {} location.href = location.pathname; });
  appliquer();

  /* ================= Démarrage ================= */
  MODULES.forEach(function (m) { if (m.dataset.id !== 'defis') niveau(m.dataset.id, etat.niv[m.dataset.id] || 0); });
  var h = location.hash.slice(1);
  aller(h && IDS.indexOf(h) >= 0 ? h : (etat.pos || 'accueil'), !!h);
})();
