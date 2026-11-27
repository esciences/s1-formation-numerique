/* OCTET · Mes cours bien rangés
   Parcours en écrans. Progression gardée dans le navigateur (localStorage), aucune donnée envoyée.
   L’application ne peut PAS voir le vrai OneDrive : les étapes « Sur ton ordinateur » reposent sur une auto-vérification. */
(function () {
  'use strict';

  var CLE = 'octet-cours-ranges-v1';
  var ECOLE = 'OneDrive - Ton école';

  /* ---------- État ---------- */
  var etat = { pos: 'accueil', reprise: null, fait: {}, vu: {}, coches: {}, radios: {}, reglages: {}, arbo: false, arboOuverts: null };
  try { var lu = JSON.parse(localStorage.getItem(CLE) || 'null'); if (lu && typeof lu === 'object') { for (var k in etat) if (lu[k] !== undefined) etat[k] = lu[k]; } } catch (e) {}
  function sauver() { try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) {} }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var a in attrs) { if (a === 'class') e.className = attrs[a]; else e.setAttribute(a, attrs[a]); } if (html !== undefined) e.innerHTML = html; return e; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Icônes (dessins originaux) ---------- */
  var FICH = { pdf: ['#D93025', 'PDF'], jpg: ['#15803D', 'JPG'], docx: ['#1D6FD8', 'DOC'], mp3: ['#7C3AED', 'MP3'], txt: ['#5E5670', 'TXT'] };
  function ico(t) {
    var s = '<svg class="ico" viewBox="0 0 40 40" aria-hidden="true">';
    if (t === 'dossier') return s + '<path d="M3 9a2 2 0 0 1 2-2h11l4 4h15a2 2 0 0 1 2 2v3H3z" fill="var(--dossier-fonce)"/><path d="M3 14h34v18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="var(--dossier)"/></svg>';
    if (FICH[t]) return s + '<path d="M9 3h16l8 8v24a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#fff" stroke="#8A8199" stroke-width="1.6"/><path d="M25 3v8h8" fill="#E9E5F1" stroke="#8A8199" stroke-width="1.6" stroke-linejoin="round"/><rect x="4" y="20" width="24" height="11" rx="2" fill="' + FICH[t][0] + '"/><text x="16" y="28.6" text-anchor="middle" font-size="8" font-weight="700" font-family="Arial" fill="#fff">' + FICH[t][1] + '</text></svg>';
    if (t === 'nuage') return s + '<path d="M11 31a8 8 0 0 1-1-16 11 11 0 0 1 21 2 7 7 0 0 1 0 14z" fill="var(--bleu)"/></svg>';
    if (t === 'nuage-gris') return s + '<path d="M11 31a8 8 0 0 1-1-16 11 11 0 0 1 21 2 7 7 0 0 1 0 14z" fill="#8A8199"/></svg>';
    if (t === 'maison') return s + '<path d="M6 19L20 7l14 12v14H24v-9h-8v9H6z" fill="none" stroke="var(--encre)" stroke-width="2.6" stroke-linejoin="round"/></svg>';
    if (t === 'bureau' || t === 'pc') return s + '<rect x="5" y="7" width="30" height="20" rx="2" fill="' + (t === 'pc' ? 'var(--violet-clair)' : 'var(--bleu-clair)') + '" stroke="var(--encre)" stroke-width="2.4"/><path d="M14 33h12M20 27v6" stroke="var(--encre)" stroke-width="2.4"/></svg>';
    if (t === 'telech') return s + '<path d="M20 5v18M12 16l8 8 8-8" fill="none" stroke="var(--bon)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 26v6h26v-6" fill="none" stroke="var(--bon)" stroke-width="3.2" stroke-linecap="round"/></svg>';
    if (t === 'docs') return s + '<path d="M10 4h14l7 7v24H10z" fill="var(--surface)" stroke="var(--encre)" stroke-width="2.4" stroke-linejoin="round"/><path d="M14 18h12M14 23h12M14 28h8" stroke="var(--encre)" stroke-width="2"/></svg>';
    if (t === 'cible') return s + '<circle cx="20" cy="17" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 37s-12-10-12-20a12 12 0 0 1 24 0c0 10-12 20-12 20z" fill="none" stroke="currentColor" stroke-width="3"/></svg>';
    if (t === 'od-nuage') return s + '<path d="M11 30a8 8 0 0 1-1-16 11 11 0 0 1 21 2 7 7 0 0 1 0 14z" fill="none" stroke="var(--bleu)" stroke-width="3"/></svg>';
    if (t === 'od-coche') return s + '<circle cx="20" cy="20" r="15" fill="var(--surface)" stroke="#15803D" stroke-width="3"/><path d="M13 20l5 5 9-10" fill="none" stroke="#15803D" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (t === 'od-plein') return s + '<circle cx="20" cy="20" r="16" fill="#15803D"/><path d="M13 20l5 5 9-10" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (t === 'od-synchro') return s + '<path d="M31 15a12 12 0 0 0-21-3M9 25a12 12 0 0 0 21 3" fill="none" stroke="var(--bleu)" stroke-width="3.2" stroke-linecap="round"/><path d="M10 5v7h7M30 35v-7h-7" fill="none" stroke="var(--bleu)" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (t === 'od-erreur') return s + '<circle cx="20" cy="20" r="16" fill="#B3261E"/><path d="M14 14l12 12M26 14L14 26" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></svg>';
    return s + '</svg>';
  }
  function icoNom(nom, type) { if (type === 'dossier') return ico('dossier'); var x = (nom.split('.').pop() || '').toLowerCase(); return ico(FICH[x] ? x : 'txt'); }
  var LIEUX = {
    appli: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M10 9l4 2.5-4 2.5z" fill="currentColor"/></svg>Dans l’application : entraîne-toi',
    reel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7 8h5"/></svg>Sur ton ordinateur : à toi de jouer'
  };

  /* ---------- Modèle de l’arborescence ---------- */
  var MATIERES = ['Français', 'Math', 'FHGES', 'Langues', 'FMTT', 'Numérique', 'Religion', 'ECA'];
  var SOUS = ['Chimie', 'Biologie', 'Physique'];
  var ORDRE = ['Sciences'].concat(MATIERES);
  function modele() {
    return { n: ECOLE, t: 'nuage', e: [{ n: 'COURS S1', e: ORDRE.map(function (m) {
      return m === 'Sciences' ? { n: 'Sciences', e: SOUS.map(function (s) { return s === 'Physique' ? { n: s, e: [{ n: 'Les_etats_de_la_matiere.pdf', f: 1 }] } : { n: s }; }) } : { n: m };
    }) }] };
  }

  /* Petits arbres d’illustration */
  function arbreHTML(noeud, opt) {
    opt = opt || {};
    function li(n) {
      var cls = 'n' + (opt.cible && opt.cible.indexOf(n.n) >= 0 ? ' cible' : '') + (opt.ici === n.n ? ' ici' : '');
      var i = n.f ? icoNom(n.n) : (n.t === 'nuage' ? ico('nuage') : ico('dossier'));
      var tag = opt.ici === n.n ? ' <span class="tag">tu es ici</span>' : '';
      var h = '<li><span class="' + cls + '">' + i + esc(n.n) + tag + '</span>';
      if (n.e && n.e.length) h += '<ul>' + n.e.map(li).join('') + '</ul>';
      return h + '</li>';
    }
    return '<ul class="arbre">' + li(noeud) + '</ul>';
  }
  var ARBRES = {
    exemple: function () { return arbreHTML({ n: 'COURS S1', e: [{ n: 'Sciences', e: [{ n: 'Physique', e: [{ n: 'Les_etats_de_la_matiere.pdf', f: 1 }] }] }, { n: 'Math' }] }); },
    cours: function () { return arbreHTML({ n: ECOLE, t: 'nuage', e: [{ n: 'COURS S1' }] }, { cible: ['COURS S1'], ici: ECOLE }); },
    sciences: function () { return arbreHTML({ n: ECOLE, t: 'nuage', e: [{ n: 'COURS S1', e: [{ n: 'Sciences' }] }] }, { cible: ['Sciences'], ici: 'COURS S1' }); },
    'niveau-meme': function () { return arbreHTML({ n: 'COURS S1', e: [{ n: 'Sciences' }, { n: 'Math' }, { n: 'Français' }] }, { cible: ['Math', 'Français'] }); },
    'niveau-dans': function () { return arbreHTML({ n: 'COURS S1', e: [{ n: 'Sciences', e: [{ n: 'Math' }] }] }); },
    sous: function () { return arbreHTML({ n: 'COURS S1', e: [{ n: 'Sciences', e: SOUS.map(function (s) { return { n: s }; }) }, { n: 'Français' }, { n: '…' }] }, { cible: SOUS, ici: 'Sciences' }); },
    complet: function () { var m = modele(); m.e[0].e[0].e[2].e = []; return arbreHTML(m); }
  };

  /* ---------- Données des QCM ---------- */
  var QCM = {
    sous1: { q: 'Physique, c’est…', c: [['un fichier', 0, 'Pas d’extension, une icône de dossier : ce n’est pas un fichier.'], ['un sous-dossier de Sciences', 1, 'Oui : Physique est rangé dans Sciences.'], ['un dossier au même niveau que Sciences', 0, 'Regarde le décalage : Physique est en dessous de Sciences, donc dedans.']] },
    sous2: { q: 'Le dossier parent de Physique, c’est…', c: [['COURS S1', 0, 'COURS S1 contient Sciences. Le parent de Physique est juste au-dessus de lui.'], ['Sciences', 1, 'Oui : c’est Sciences qui contient Physique.'], ['Math', 0, 'Math est à côté de Sciences. Il ne contient pas Physique.']] },
    sous3: { q: 'Math et Sciences sont…', c: [['au même niveau, tous les deux dans COURS S1', 1, 'Oui : ils sont côte à côte, dans le même dossier parent.'], ['Math est rangé dans Sciences', 0, 'Non : Math est aligné avec Sciences, pas en dessous.'], ['Sciences est rangé dans Math', 0, 'Non : les deux sont directement dans COURS S1.']] },
    local: { q: 'Ta fiche est dans Téléchargements. Elle est…', c: [['seulement sur cet ordinateur', 1, 'Oui : Téléchargements est un emplacement local.'], ['sur cet ordinateur et en ligne', 0, 'Non : seul le dossier OneDrive est relié à ton espace en ligne.'], ['seulement en ligne', 0, 'Non : Téléchargements est sur l’ordinateur.']] },
    cas1: { q: '1. Ta fiche est dans Téléchargements. Ton ordinateur part en réparation. Tu en empruntes un autre.', c: [['Je la retrouve dans Téléchargements de l’autre ordinateur', 0, 'Non : chaque ordinateur a son propre dossier Téléchargements.'], ['Elle est restée sur l’ordinateur en réparation', 1, 'Oui. Dans OneDrive, tu l’aurais retrouvée avec ton compte de l’école.'], ['Elle est passée toute seule dans OneDrive', 0, 'Non : un fichier ne va dans OneDrive que si tu l’y ranges.']] },
    cas2: { q: '2. Ta fiche OneDrive montre un petit nuage. Tu n’as pas Internet.', c: [['Je l’ouvre sans problème', 0, 'Le nuage veut dire « seulement en ligne ». Sans Internet, impossible de la télécharger.'], ['Je ne peux sans doute pas l’ouvrir', 1, 'Oui : elle n’est pas encore sur l’ordinateur.'], ['Elle est supprimée', 0, 'Non : elle est bien là, mais seulement en ligne.']] },
    cas3: { q: '3. Des flèches bleues tournent sur ton fichier OneDrive. Tu éteins tout de suite ?', c: [['Oui, il est dans OneDrive, donc il est en sécurité', 0, 'Pas encore : être dans le dossier ne veut pas dire que l’envoi est fini.'], ['Non, j’attends la coche verte', 1, 'Oui : la synchronisation n’est pas terminée.']] },
    cas4: { q: '4. Tu supprimes un fichier de ton dossier OneDrive sur l’ordinateur.', c: [['Il reste en ligne, aucun souci', 0, 'Non : OneDrive synchronise aussi les suppressions.'], ['Il disparaît aussi de ton espace en ligne', 1, 'Oui. Il va dans la corbeille de OneDrive : demande vite de l’aide si c’est une erreur.']] },
    cas5: { q: '5. Tout ce que tu vois dans l’explorateur est rangé sur ton ordinateur ?', c: [['Oui, toujours', 0, 'Non : le dossier OneDrive peut montrer des fichiers qui sont seulement en ligne.'], ['Pas forcément', 1, 'Oui : un fichier avec un nuage est visible, mais il est en ligne.']] },
    parent: { q: 'Tu es dans Sciences. Tu cliques sur ↑. Où arrives-tu ?', c: [['Dans COURS S1', 1, 'Oui : ↑ remonte au dossier parent.'], ['Dans Physique', 0, 'Non : ↑ remonte. Physique est en dessous de Sciences.'], ['La fenêtre se ferme', 0, 'Non : c’est le ✕ qui ferme la fenêtre.']] },
    q1: { q: 'Tu es dans COURS S1 et tu crées un dossier. Où apparaît-il ?', c: [['Dans COURS S1, à côté des matières', 1, 'Oui : un nouveau dossier se crée là où tu es.'], ['Dans Sciences', 0, 'Seulement si tu es dans Sciences. Regarde ta barre d’adresse.'], ['Sur le Bureau', 0, 'Non : il se crée dans le dossier ouvert.']] },
    q2: { q: 'Pour déplacer un fichier, j’utilise…', c: [['Copier puis Coller', 0, 'Copier fait un double : le fichier reste aussi à l’ancien endroit.'], ['Couper puis Coller', 1, 'Oui : Couper fait partir le fichier de son ancien dossier.']] },
    q3: { q: 'Le chemin est OneDrive › COURS S1 › Math. Dans quel dossier es-tu ?', c: [['OneDrive', 0, 'C’est le début du chemin. Le dossier ouvert est le dernier.'], ['COURS S1', 0, 'C’est le parent. Le dossier ouvert est le dernier.'], ['Math', 1, 'Oui : le dernier nom du chemin est le dossier ouvert.']] },
    q4: { q: '« Drive », c’est…', c: [['un autre nom de l’explorateur', 0, 'Non : l’explorateur est l’outil de Windows qui montre tes fichiers.'], ['un service de stockage en ligne', 1, 'Oui : comme OneDrive ou Google Drive.'], ['le disque dur de l’ordinateur', 0, 'Non : un drive en ligne garde tes fichiers sur Internet.']] },
    q5: { q: 'Tu cliques sur « Télécharger ». Ta fiche est-elle rangée ?', c: [['Oui, c’est automatique', 0, 'Non : elle attend dans Téléchargements (ou là où tu l’as enregistrée).'], ['Pas encore : je dois la déplacer au bon endroit', 1, 'Oui : télécharger, ce n’est pas ranger.']] }
  };

  /* ---------- Écrans ---------- */
  var ECRANS = $$('section.ecran');
  var IDS = ECRANS.map(function (s) { return s.dataset.id; });
  var MISSIONS = [null, 'Fichier ou dossier ?', 'Où sont mes documents ?', 'Ouvre ton véritable explorateur', 'Construis ton espace de cours', 'Un fichier à ranger', 'Retrouve-le sans le guide', 'Bonus'];
  function ecran(id) { return ECRANS[IDS.indexOf(id)]; }
  function requis(s) { var r = s.dataset.requis; return r ? r.split(',') : []; }
  function etapeFaite(s) { var r = requis(s); if (!r.length) return !!etat.vu[s.dataset.id]; return r.every(function (k) { return etat.fait[k]; }); }
  function etapesDe(m) { return ECRANS.filter(function (s) { return +s.dataset.m === m && s.dataset.id !== 'm6-bilan'; }); }
  function missionFaite(m) { var e = etapesDe(m); return e.length > 0 && e.every(etapeFaite); }

  function marquer(cle, oui) {
    if (oui === false) delete etat.fait[cle]; else etat.fait[cle] = 1;
    sauver(); majProgression();
    if (cle.indexOf('v:') === 0 || cle.indexOf('m') === 0) majArbo();
  }

  /* ---------- Navigation ---------- */
  function aller(id, focus) {
    if (IDS.indexOf(id) < 0) id = 'accueil';
    ECRANS.forEach(function (s) { s.hidden = s.dataset.id !== id; });
    etat.pos = id; etat.vu[id] = 1; sauver();
    var s = ecran(id), i = IDS.indexOf(id), m = +s.dataset.m;
    $('#prec').disabled = i === 0;
    var suiv = $('#suiv');
    if (i === IDS.length - 1) { suiv.hidden = true; } else {
      suiv.hidden = false;
      var nx = ecran(IDS[i + 1]);
      suiv.textContent = id === 'accueil' ? 'Commencer →' : (+nx.dataset.m !== m ? (+nx.dataset.m === 7 ? 'Bonus ★ →' : 'Mission ' + nx.dataset.m + ' →') : 'Suivant →');
    }
    if (m === 0) $('#num').innerHTML = 'Accueil';
    else if (m === 7) $('#num').innerHTML = '<b>Bonus ★</b>';
    else { var et = ECRANS.filter(function (x) { return +x.dataset.m === m; }); $('#num').innerHTML = '<b>Mission ' + m + '</b> · étape ' + (et.indexOf(s) + 1) + '/' + et.length; }
    if (id === 'm6-bilan') rendreBilan();
    if (id === 'accueil') rendrePlanMini();
    majProgression();
    window.scrollTo(0, 0);
    if (focus !== false) { var h = s.querySelector('h1, h2'); if (h) h.focus({ preventScroll: true }); }
  }
  $('#prec').addEventListener('click', function () { var i = IDS.indexOf(etat.pos); if (i > 0) aller(IDS[i - 1]); });
  $('#suiv').addEventListener('click', function () { var i = IDS.indexOf(etat.pos); if (i < IDS.length - 1) aller(IDS[i + 1]); });
  $$('[data-aller]').forEach(function (b) { b.addEventListener('click', function () { aller(b.dataset.aller); }); });

  /* Octet de progression : 6 missions + bonus */
  function majProgression() {
    var nav = $('#progression'); nav.innerHTML = '';
    var cur = +ecran(etat.pos).dataset.m;
    for (var m = 1; m <= 7; m++) {
      var b = el('button', { type: 'button', class: (m === 7 ? 'bonus ' : '') + (missionFaite(m) ? 'on ' : '') + (cur === m ? 'ici' : '') });
      b.textContent = m === 7 ? '★' : m;
      b.setAttribute('aria-label', (m === 7 ? 'Bonus' : 'Mission ' + m) + ' : ' + MISSIONS[m] + (missionFaite(m) ? ' (terminée)' : ''));
      b.title = (m === 7 ? 'Bonus' : 'Mission ' + m) + ' · ' + MISSIONS[m];
      if (cur === m) b.setAttribute('aria-current', 'step');
      (function (mm) { b.addEventListener('click', function () { aller(ECRANS.filter(function (s) { return +s.dataset.m === mm; })[0].dataset.id); }); })(m);
      nav.appendChild(b);
    }
  }
  function rendrePlanMini() {
    var ul = $('#plan-mini'); ul.innerHTML = '';
    for (var m = 1; m <= 7; m++) ul.appendChild(el('li', null, '<i class="' + (missionFaite(m) ? 'on' : '') + (m === 7 ? ' b' : '') + '">' + (m === 7 ? '★' : m) + '</i>' + esc(MISSIONS[m]) + (m === 7 ? ' <span class="discret">(facultatif)</span>' : '')));
    var b = $('#btn-commencer');
    var debut = !!etat.reprise && etat.reprise !== 'accueil';
    b.textContent = debut ? 'Reprendre là où j’étais →' : 'Commencer la mission 1 →';
  }
  $('#btn-commencer').addEventListener('click', function () {
    var cible = etat.reprise && etat.reprise !== 'accueil' ? etat.reprise : 'm1-tri'; aller(cible);
  });
  /* mémorise l’écran où l’élève s’est arrêté (pour « Reprendre ») */
  var allerBrut = aller;
  aller = function (id, f) { if (id !== 'accueil') etat.reprise = id; allerBrut(id, f); };

  /* Plan */
  var dlgPlan = $('#dlg-plan');
  function rendrePlan() {
    var ul = $('#plan'); ul.innerHTML = '';
    for (var m = 0; m <= 7; m++) {
      var et = ECRANS.filter(function (s) { return +s.dataset.m === m; });
      var li = el('li', null, '<b>' + (m === 0 ? 'Départ' : (m === 7 ? '★ Bonus' : 'Mission ' + m + ' · ' + esc(MISSIONS[m]))) + '</b>');
      var ol = el('ol');
      et.forEach(function (s) {
        var b = el('button', { type: 'button', class: s.dataset.id === etat.pos ? 'ici' : '' }, '<i class="' + (etapeFaite(s) ? 'on' : '') + '" aria-hidden="true"></i>' + esc(s.dataset.titre) + (etapeFaite(s) ? '<span class="sr"> (fait)</span>' : ''));
        if (s.dataset.id === etat.pos) b.setAttribute('aria-current', 'step');
        b.addEventListener('click', function () { dlgPlan.close(); aller(s.dataset.id); });
        var l = el('li'); l.appendChild(b); ol.appendChild(l);
      });
      li.appendChild(ol); ul.appendChild(li);
    }
  }
  $('#btn-plan').addEventListener('click', function () { rendrePlan(); dlgPlan.showModal(); });
  $$('dialog [data-fermer]').forEach(function (b) { b.addEventListener('click', function () { b.closest('dialog').close(); }); });

  /* ---------- Remplissages simples ---------- */
  $$('[data-ico]').forEach(function (s) { s.outerHTML = ico(s.dataset.ico); });
  $$('[data-lieu]').forEach(function (s) { s.innerHTML = LIEUX[s.dataset.lieu]; });
  $$('[data-arbre]').forEach(function (d) { d.innerHTML = ARBRES[d.dataset.arbre](); });
  $$('[data-adresse]').forEach(function (d) {
    var seg = d.dataset.adresse.split('|');
    d.innerHTML = ico('nuage') + seg.map(function (x) { return '<span class="seg">' + esc(x) + '</span>'; }).join('<span class="sep" aria-hidden="true">›</span>');
    d.setAttribute('aria-label', 'Barre d’adresse : ' + seg.join(', puis '));
  });
  var tpl = $('#tpl-oups');
  $$('[data-oups]').forEach(function (d) { d.appendChild(tpl.content.cloneNode(true)); });

  /* Listes de matières à cocher */
  $$('[data-groupe]').forEach(function (ul) {
    var noms = ul.dataset.groupe === 'matieres' ? MATIERES : SOUS;
    noms.forEach(function (n) {
      var li = el('li'); li.innerHTML = '<label><input type="checkbox" class="req" data-save="dos-' + n + '">' + ico('dossier') + esc(n) + '</label>';
      ul.appendChild(li);
    });
  });

  /* ---------- Cases à cocher sauvegardées + auto-vérifications ---------- */
  $$('input[type=checkbox][data-save]').forEach(function (c) {
    c.checked = !!etat.coches[c.dataset.save];
    c.addEventListener('change', function () { etat.coches[c.dataset.save] = c.checked ? 1 : 0; sauver(); majVerifs(c.closest('section')); majArbo(); });
  });
  function majVerifs(section) {
    $$('.verif[data-cle]', section).forEach(function (v) {
      var b = v.querySelector('.valider');
      var toutes = $$('input.req', section).every(function (c) { return c.checked; });
      var cle = 'v:' + v.dataset.cle;
      if (!toutes && etat.fait[cle]) marquer(cle, false);
      b.disabled = !toutes;
      b.classList.toggle('fait', !!etat.fait[cle]);
      b.textContent = etat.fait[cle] ? '✓ C’est noté' : b.dataset.txt;
    });
  }
  $$('.verif[data-cle] .valider').forEach(function (b) {
    b.dataset.txt = b.textContent;
    b.addEventListener('click', function () {
      var v = b.closest('.verif'); marquer('v:' + v.dataset.cle);
      majVerifs(b.closest('section'));
      var s = b.closest('section'), i = IDS.indexOf(s.dataset.id);
      if (etapeFaite(s) && i < IDS.length - 1) { $('#suiv').focus(); }
    });
  });
  ECRANS.forEach(majVerifs);

  /* ---------- QCM ---------- */
  $$('.qcm[data-qcm]').forEach(function (box) {
    var d = QCM[box.dataset.qcm], cle = 'qcm:' + box.dataset.qcm;
    box.innerHTML = '<p class="q" id="q-' + box.dataset.qcm + '">' + esc(d.q) + '</p><div class="choix" role="group" aria-labelledby="q-' + box.dataset.qcm + '"></div><div class="retour" aria-live="polite"></div>';
    var choix = box.querySelector('.choix'), ret = box.querySelector('.retour');
    d.c.forEach(function (c, i) {
      var b = el('button', { type: 'button' }, '<span class="l" aria-hidden="true">' + 'ABCD'[i] + '</span><span>' + esc(c[0]) + '</span>');
      b.addEventListener('click', function () {
        if (box.classList.contains('resolu')) return;
        $$('button', choix).forEach(function (x) { x.classList.remove('faux'); });
        if (c[1]) { b.classList.add('bon'); box.classList.add('resolu'); ret.className = 'retour ok'; ret.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(c[2]) + '</span>'; marquer(cle); }
        else { b.classList.add('faux'); ret.className = 'retour ko'; ret.innerHTML = 'Pas tout à fait.<span class="pourquoi">' + esc(c[2]) + ' Réessaie !</span>'; }
      });
      choix.appendChild(b);
    });
    if (etat.fait[cle]) { var i = d.c.findIndex(function (c) { return c[1]; }); choix.children[i].classList.add('bon'); box.classList.add('resolu'); ret.className = 'retour ok'; ret.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(d.c[i][2]) + '</span>'; }
  });

  /* ---------- Mission 1 : tri fichier / dossier ---------- */
  (function () {
    var ITEMS = [
      ['Les_etats_de_la_matiere.pdf', 'fichier', 'pdf', 'L’extension .pdf montre que c’est un document : un fichier.'],
      ['Sciences', 'dossier', 'dossier', 'Pas d’extension, une icône de chemise jaune : c’est un dossier.'],
      ['photo_volcan.jpg', 'fichier', 'jpg', '.jpg, c’est une photo : un fichier.'],
      ['Chapitre 2', 'dossier', 'dossier', 'Même si le nom ressemble à un document, l’icône jaune montre un dossier.'],
      ['chapitre_2.docx', 'fichier', 'docx', '.docx, c’est un texte Word : un fichier.'],
      ['Math', 'dossier', 'dossier', 'Icône jaune, pas d’extension : c’est un dossier.'],
      ['dictee_audio.mp3', 'fichier', 'mp3', '.mp3, c’est un son : un fichier.']
    ];
    var pioche = $('#tri-pioche'), ret = $('#tri-retour'), choisi = null;
    var place = (etat.coches.tri || '').split('|').filter(Boolean);
    var cartes = ITEMS.map(function (it, i) {
      var c = el('button', { type: 'button', class: 'carte', draggable: 'true', 'aria-pressed': 'false', 'data-i': i }, ico(it[2]) + '<span>' + esc(it[0]) + '</span>');
      c.setAttribute('aria-label', it[0] + (it[1] === 'dossier' ? ', icône jaune' : ''));
      c.addEventListener('click', function () { if (c.classList.contains('place')) return; choisir(choisi === c ? null : c); });
      c.addEventListener('dragstart', function (e) { if (c.classList.contains('place')) { e.preventDefault(); return; } choisir(c); e.dataTransfer.setData('text/plain', i); e.dataTransfer.effectAllowed = 'move'; });
      return c;
    });
    function choisir(c) { cartes.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); }); choisi = c; if (c) { ret.className = 'retour info'; ret.textContent = '« ' + ITEMS[+c.dataset.i][0] + ' » : fichier ou dossier ?'; } }
    function poser(bac) {
      if (!choisi) { ret.className = 'retour info'; ret.textContent = 'Choisis d’abord un élément dans « À ranger ».'; return; }
      var it = ITEMS[+choisi.dataset.i], c = choisi;
      if (it[1] === bac) {
        c.classList.add('place'); c.setAttribute('aria-pressed', 'false'); c.draggable = false; c.setAttribute('aria-disabled', 'true');
        $('.bac[data-bac="' + bac + '"] .cartes').appendChild(c);
        place.push(c.dataset.i); etat.coches.tri = place.join('|'); sauver();
        ret.className = 'retour ok'; ret.innerHTML = 'Bien rangé !<span class="pourquoi">' + esc(it[3]) + '</span>';
        choisi = null;
        if (place.length === ITEMS.length) { ret.innerHTML = 'Tout est rangé, bravo !<span class="pourquoi">Un fichier contient quelque chose. Un dossier range des fichiers… et d’autres dossiers.</span>'; marquer('tri'); }
        else { var suivant = cartes.filter(function (x) { return !x.classList.contains('place'); })[0]; if (suivant) suivant.focus(); }
      } else {
        c.classList.remove('secoue'); void c.offsetWidth; c.classList.add('secoue');
        ret.className = 'retour ko'; ret.innerHTML = 'Pas dans cette boîte.<span class="pourquoi">' + esc(it[3]) + ' Réessaie !</span>';
      }
    }
    cartes.forEach(function (c) { if (place.indexOf(c.dataset.i) >= 0) { c.classList.add('place'); c.draggable = false; c.setAttribute('aria-disabled', 'true'); $('.bac[data-bac="' + ITEMS[+c.dataset.i][1] + '"] .cartes').appendChild(c); } else pioche.appendChild(c); });
    if (place.length === ITEMS.length) { ret.className = 'retour ok'; ret.textContent = 'Tout est rangé, bravo !'; }
    $$('.bac').forEach(function (bac) {
      var nom = bac.dataset.bac;
      bac.querySelector('button.cible').addEventListener('click', function () { poser(nom); });
      bac.addEventListener('dragover', function (e) { e.preventDefault(); bac.classList.add('survol'); });
      bac.addEventListener('dragleave', function () { bac.classList.remove('survol'); });
      bac.addEventListener('drop', function (e) { e.preventDefault(); bac.classList.remove('survol'); poser(nom); });
    });
  })();

  /* ---------- Mission 2 : parties de l’explorateur ---------- */
  (function () {
    var CIBLES = [
      ['adresse', 'la barre d’adresse : elle montre le chemin du dossier ouvert.'],
      ['parent', 'le bouton qui remonte au dossier parent.'],
      ['nav', 'le volet de navigation : tes grands emplacements.'],
      ['contenu', 'ce qu’il y a dans le dossier ouvert.'],
      ['recherche', 'l’endroit pour chercher un fichier par son nom.']
    ];
    var NOMS = { adresse: 'la barre d’adresse (le chemin)', parent: 'la flèche ↑ (dossier parent)', nav: 'le volet de navigation', contenu: 'le contenu du dossier', recherche: 'la zone de recherche' };
    var n = +(etat.coches.zones || 0), q = $('#zone-question'), ret = $('#zone-retour');
    function maj() {
      $$('#fenetre-explo .zone-clic').forEach(function (z) { var k = CIBLES.findIndex(function (c) { return c[0] === z.dataset.zone; }); z.classList.toggle('trouve', k >= 0 && k < n); z.classList.remove('rate'); });
      if (n >= CIBLES.length) { q.innerHTML = '✓ Tu connais les parties de l’explorateur.'; marquer('zones'); }
      else q.innerHTML = '<span class="qcm-num">' + (n + 1) + '/' + CIBLES.length + '</span> Clique sur ' + CIBLES[n][1];
    }
    $$('#fenetre-explo .zone-clic').forEach(function (z) {
      z.addEventListener('click', function () {
        if (n >= CIBLES.length) { ret.className = 'retour info'; ret.textContent = 'Ça, c’est ' + NOMS[z.dataset.zone] + '.'; return; }
        if (z.dataset.zone === CIBLES[n][0]) { ret.className = 'retour ok'; ret.textContent = 'Oui ! C’est ' + NOMS[z.dataset.zone] + '.'; n++; etat.coches.zones = n; sauver(); maj(); }
        else { z.classList.add('rate'); ret.className = 'retour ko'; ret.innerHTML = 'Non, ça, c’est ' + NOMS[z.dataset.zone] + '.<span class="pourquoi">Cherche encore.</span>'; setTimeout(function () { z.classList.remove('rate'); }, 900); }
      });
    });
    maj();
  })();

  /* ---------- Explorateur simulé ---------- */
  function Sim(hote, cfg) {
    this.hote = hote; this.cfg = cfg; this.reset();
  }
  Sim.prototype.reset = function () {
    this.racine = { nom: 'Ce PC', type: 'dossier', e: JSON.parse(JSON.stringify(this.cfg.fs)) };
    this.cur = this.cfg.depart.slice(); this.presse = null; this.choisi = null; this.edition = null;
    this.rendre();
  };
  Sim.prototype.noeud = function (chemin) { var n = this.racine; for (var i = 0; i < chemin.length; i++) { n = (n.e || []).filter(function (x) { return x.nom === chemin[i]; })[0]; if (!n) return null; } return n; };
  Sim.prototype.signal = function (ev) { if (this.cfg.surEvenement) this.cfg.surEvenement(ev, this); };
  Sim.prototype.toast = function (t) {
    var h = this.hote, ancien = h.querySelector('.sim-toast'); if (ancien) ancien.remove();
    var d = el('div', { class: 'sim-toast', role: 'status' }); d.textContent = t; h.querySelector('.sim').appendChild(d);
    clearTimeout(this._tt); this._tt = setTimeout(function () { d.remove(); }, 3200);
  };
  Sim.prototype.naviguer = function (chemin, comment) {
    var avant = this.cur.slice(); this.cur = chemin.slice(); this.choisi = null; this.fermerMenu(); this.rendre();
    this.signal({ type: 'naviguer', de: avant, vers: this.cur.slice(), comment: comment });
    var c = this.hote.querySelector('.sim-item') || this.hote.querySelector('.sim-contenu'); if (c) c.focus();
  };
  Sim.prototype.rendre = function () {
    var self = this, h = this.hote;
    h.innerHTML = '';
    var sim = el('div', { class: 'sim' });
    sim.appendChild(el('div', { class: 'sim-etiquette' }, '<span>ENTRAÎNEMENT · explorateur simplifié</span><span>Rien ne change sur ton ordinateur</span>'));
    /* barre */
    var barre = el('div', { class: 'sim-barre' });
    var up = el('button', { type: 'button', class: 'parent', title: 'Dossier parent', 'aria-label': 'Remonter au dossier parent' }, '↑');
    up.disabled = this.cur.length <= 1;
    up.addEventListener('click', function () { self.naviguer(self.cur.slice(0, -1), 'parent'); });
    barre.appendChild(up);
    var adr = el('div', { class: 'sim-adr', role: 'navigation', 'aria-label': 'Barre d’adresse' });
    this.cur.forEach(function (nom, i) {
      if (i) adr.appendChild(el('span', { class: 'sep', 'aria-hidden': 'true' }, '›'));
      var b = el('button', { type: 'button' }); b.textContent = nom;
      if (i === self.cur.length - 1) b.setAttribute('aria-current', 'location');
      b.addEventListener('click', function () { if (i < self.cur.length - 1) self.naviguer(self.cur.slice(0, i + 1), 'adresse'); });
      adr.appendChild(b);
    });
    barre.appendChild(adr); sim.appendChild(barre);
    /* corps */
    var corps = el('div', { class: 'sim-corps' });
    var nav = el('div', { class: 'sim-nav', role: 'group', 'aria-label': 'Emplacements' });
    this.racine.e.forEach(function (r) {
      var b = el('button', { type: 'button', class: self.cur[0] === r.nom ? 'actif' : '' }, (r.icone ? ico(r.icone) : ico('dossier')) + '<span>' + esc(r.nom) + '</span>');
      b.addEventListener('click', function () { self.naviguer([r.nom], 'volet'); });
      nav.appendChild(b);
    });
    corps.appendChild(nav);
    var cont = el('div', { class: 'sim-contenu', tabindex: '0', role: 'group', 'aria-label': 'Contenu de ' + this.cur[this.cur.length - 1] + '. Clic droit ou Maj+F10 pour le menu.' });
    var dossier = this.noeud(this.cur), items = (dossier.e || []).slice();
    items.sort(function (a, b) { return (a.type === b.type ? 0 : (a.type === 'dossier' ? -1 : 1)) || a.nom.localeCompare(b.nom, 'fr'); });
    if (!items.length) cont.appendChild(el('p', { class: 'sim-vide' }, 'Ce dossier est vide.'));
    items.forEach(function (it) {
      var b = el('button', { type: 'button', class: 'sim-item' + (self.choisi === it.nom ? ' choisi' : '') + (self.presse && self.presse.op === 'couper' && self.presse.de.join('/') === self.cur.join('/') && self.presse.nom === it.nom ? ' coupe' : '') });
      b.innerHTML = icoNom(it.nom, it.type) + '<span class="nm">' + esc(it.nom) + '</span>';
      b.setAttribute('aria-label', it.nom + (it.type === 'dossier' ? ', dossier' : ', fichier'));
      b.addEventListener('click', function (e) { e.stopPropagation(); self.choisir(it.nom); });
      b.addEventListener('dblclick', function (e) { e.stopPropagation(); self.ouvrir(it); });
      b.addEventListener('keydown', function (e) {
        if (self.edition) return;
        if (e.key === 'Enter') { e.preventDefault(); self.ouvrir(it); }
        else if (e.key === 'F2') { e.preventDefault(); self.renommer(it.nom); }
        else if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) { e.preventDefault(); e.stopPropagation(); self.choisir(it.nom, true); self.menuItem(it, b); }
        else if (e.ctrlKey && (e.key === 'x' || e.key === 'X')) { e.preventDefault(); self.couper(it, 'couper'); }
        else if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) { e.preventDefault(); self.couper(it, 'copier'); }
        else if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) { e.preventDefault(); self.coller(); }
      });
      b.addEventListener('focus', function () { if (!self.edition) { self.choisi = it.nom; $$('.sim-item', h).forEach(function (x) { x.classList.toggle('choisi', x === b); }); } });
      b.addEventListener('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); self.choisir(it.nom, true); self.menuItem(it, b, e); });
      b.dataset.nom = it.nom;
      cont.appendChild(b);
    });
    cont.addEventListener('click', function () { self.choisi = null; $$('.sim-item', h).forEach(function (x) { x.classList.remove('choisi'); }); self.fermerMenu(); });
    cont.addEventListener('contextmenu', function (e) { e.preventDefault(); self.menuFond(cont, e); });
    cont.addEventListener('keydown', function (e) {
      if (e.target !== cont) return;
      if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) { e.preventDefault(); self.menuFond(cont); }
      if (e.ctrlKey && e.shiftKey && (e.key === 'N' || e.key === 'n')) { e.preventDefault(); self.nouveau(); }
      if (e.ctrlKey && (e.key === 'v' || e.key === 'V')) { e.preventDefault(); self.coller(); }
    });
    corps.appendChild(cont); sim.appendChild(corps);
    var pied = el('div', { class: 'sim-pied' }, '<span>' + items.length + ' élément' + (items.length > 1 ? 's' : '') + '</span>');
    var rz = el('button', { type: 'button', class: 'cle-prof', style: 'opacity:.8;font-size:.8rem' }, '↺ Recommencer l’entraînement');
    rz.addEventListener('click', function () { self.reset(); self.signal({ type: 'reset' }); });
    pied.appendChild(rz);
    sim.appendChild(pied);
    h.appendChild(sim);
  };
  Sim.prototype.choisir = function (nom, garde) { this.choisi = nom; $$('.sim-item', this.hote).forEach(function (x) { x.classList.toggle('choisi', x.dataset.nom === nom); }); if (!garde) this.fermerMenu(); };
  Sim.prototype.ouvrir = function (it) {
    this.fermerMenu();
    if (it.type === 'dossier') this.naviguer(this.cur.concat(it.nom), 'ouvrir');
    else { this.toast('« ' + it.nom + ' » s’ouvre. (Sur ton ordinateur, ton lecteur PDF s’ouvrirait.)'); this.signal({ type: 'ouvrir-fichier', nom: it.nom, chemin: this.cur.slice() }); }
  };
  Sim.prototype.fermerMenu = function () { var m = this.hote.querySelector('.sim-menu'); if (m) m.remove(); };
  Sim.prototype.menu = function (entrees, ancre, ev) {
    var self = this; this.fermerMenu();
    var simEl = this.hote.querySelector('.sim'), r = simEl.getBoundingClientRect();
    var m = el('div', { class: 'sim-menu', role: 'menu' });
    entrees.forEach(function (en) {
      if (en === '-') { m.appendChild(el('hr')); return; }
      var b = el('button', { type: 'button', role: 'menuitem', class: en.sous ? 'sous' : '' }, (en.ic || '') + '<span>' + esc(en.t) + '</span>' + (en.k ? '<span class="k">' + esc(en.k) + '</span>' : ''));
      if (en.off) { b.disabled = true; b.style.opacity = .45; }
      b.addEventListener('click', function (e) { e.stopPropagation(); en.f(); });
      m.appendChild(b);
    });
    m.addEventListener('keydown', function (e) {
      var bs = $$('button:not(:disabled)', m), i = bs.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); bs[(i + 1) % bs.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); bs[(i - 1 + bs.length) % bs.length].focus(); }
      else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); self.fermerMenu(); (ancre || simEl).focus(); }
    });
    simEl.appendChild(m);
    var x, y;
    if (ev && ev.clientX) { x = ev.clientX - r.left; y = ev.clientY - r.top; }
    else { var a = (ancre || simEl).getBoundingClientRect(); x = a.left - r.left + 20; y = a.top - r.top + 30; }
    x = Math.max(4, Math.min(x, r.width - m.offsetWidth - 4)); y = Math.max(4, Math.min(y, r.height - m.offsetHeight - 4));
    m.style.left = x + 'px'; m.style.top = y + 'px';
    var p = m.querySelector('button:not(:disabled)'); if (p) p.focus();
    setTimeout(function () {
      document.addEventListener('mousedown', function f(e) { if (!m.isConnected) { document.removeEventListener('mousedown', f); return; } if (!m.contains(e.target)) { m.remove(); document.removeEventListener('mousedown', f); } });
    }, 0);
  };
  Sim.prototype.menuItem = function (it, ancre, ev) {
    var self = this;
    this.menu([
      { t: 'Ouvrir', f: function () { self.ouvrir(it); } }, '-',
      { t: 'Couper', ic: '✂', k: 'Ctrl+X', f: function () { self.fermerMenu(); self.couper(it, 'couper'); } },
      { t: 'Copier', ic: '⧉', k: 'Ctrl+C', f: function () { self.fermerMenu(); self.couper(it, 'copier'); } }, '-',
      { t: 'Renommer', k: 'F2', f: function () { self.fermerMenu(); self.renommer(it.nom); } }
    ], ancre, ev);
  };
  Sim.prototype.menuFond = function (ancre, ev) {
    var self = this;
    var base = [
      { t: 'Nouveau', k: '›', f: function () {
        self.menu([{ t: 'Dossier', ic: ico('dossier').replace('class="ico"', 'class="ico" style="width:1.2rem;height:1.2rem"'), f: function () { self.fermerMenu(); self.nouveau(); } },
          { t: 'Document texte', off: true, f: function () {} }], ancre, ev);
      } },
      '-',
      { t: 'Coller', ic: '📋', k: 'Ctrl+V', off: !this.presse, f: function () { self.fermerMenu(); self.coller(); } }
    ];
    this.menu(base, ancre, ev);
  };
  Sim.prototype.nomLibre = function (dossier, base) { var n = base, i = 2, noms = (dossier.e || []).map(function (x) { return x.nom; }); while (noms.indexOf(n) >= 0) { n = base + ' (' + i + ')'; i++; } return n; };
  Sim.prototype.nouveau = function () {
    var d = this.noeud(this.cur); d.e = d.e || [];
    var nom = this.nomLibre(d, 'Nouveau dossier');
    d.e.push({ nom: nom, type: 'dossier', e: [] });
    this.signal({ type: 'creer', nom: nom, chemin: this.cur.slice() });
    this.rendre(); this.renommer(nom, true);
  };
  Sim.prototype.renommer = function (nom, nouveau) {
    var self = this, d = this.noeud(this.cur), it = d.e.filter(function (x) { return x.nom === nom; })[0];
    var b = $$('.sim-item', this.hote).filter(function (x) { return x.dataset.nom === nom; })[0]; if (!b || !it) return;
    this.edition = nom;
    var span = b.querySelector('.nm'), inp = el('input', { type: 'text', 'aria-label': 'Nom du dossier' }); inp.value = nom;
    span.replaceWith(inp); inp.focus();
    var base = it.type === 'fichier' ? nom.lastIndexOf('.') : nom.length; inp.setSelectionRange(0, base > 0 ? base : nom.length);
    var fini = false;
    function valider(garder) {
      if (fini) return;
      var v = inp.value.trim();
      if (!garder && v && v !== nom) {
        if (/[\\\/:*?"<>|]/.test(v)) { self.toast('Un nom ne peut pas contenir \\ / : * ? " < > |'); inp.focus(); return; }
        if (d.e.some(function (x) { return x !== it && x.nom.toLowerCase() === v.toLowerCase(); })) { self.toast('« ' + v + ' » existe déjà ici. Ouvre-le plutôt que d’en créer un deuxième.'); inp.focus(); inp.select(); return; }
        it.nom = v;
      }
      fini = true; self.edition = null;
      self.signal({ type: 'renommer', ancien: nom, nom: it.nom, chemin: self.cur.slice(), nouveau: !!nouveau });
      self.choisi = it.nom; self.rendre();
      var nb = $$('.sim-item', self.hote).filter(function (x) { return x.dataset.nom === it.nom; })[0]; if (nb) nb.focus();
    }
    inp.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); valider(false); } if (e.key === 'Escape') { e.preventDefault(); valider(true); } });
    inp.addEventListener('blur', function () { setTimeout(function () { if (!fini && document.activeElement !== inp) valider(false); }, 0); });
    inp.addEventListener('click', function (e) { e.stopPropagation(); });
    inp.addEventListener('dblclick', function (e) { e.stopPropagation(); });
  };
  Sim.prototype.couper = function (it, op) {
    this.presse = { op: op, de: this.cur.slice(), nom: it.nom };
    this.rendre();
    var b = $$('.sim-item', this.hote).filter(function (x) { return x.dataset.nom === it.nom; })[0]; if (b) b.focus();
    this.toast(op === 'couper' ? '✂ « ' + it.nom + ' » est coupé. Va dans le bon dossier, puis Coller.' : '⧉ « ' + it.nom + ' » est copié.');
    this.signal({ type: op, nom: it.nom, chemin: this.cur.slice() });
  };
  Sim.prototype.coller = function () {
    var p = this.presse; if (!p) { this.toast('Rien à coller : coupe d’abord un élément.'); return; }
    var src = this.noeud(p.de), it = src && (src.e || []).filter(function (x) { return x.nom === p.nom; })[0];
    if (!it) { this.toast('Cet élément n’existe plus.'); this.presse = null; return; }
    var dest = this.noeud(this.cur); dest.e = dest.e || [];
    if (p.op === 'couper' && p.de.join('/') === this.cur.join('/')) { this.toast('Tu es dans le même dossier : rien ne bouge.'); return; }
    if (it.type === 'dossier' && this.cur.join('/').indexOf(p.de.concat(p.nom).join('/')) === 0) { this.toast('Impossible : un dossier ne peut pas aller dans lui-même.'); return; }
    var nom = it.nom;
    if (dest.e.some(function (x) { return x.nom === nom; })) {
      if (p.op === 'couper') { this.toast('« ' + nom + ' » existe déjà ici.'); return; }
      var pt = nom.lastIndexOf('.'); nom = pt > 0 ? nom.slice(0, pt) + ' - Copie' + nom.slice(pt) : nom + ' - Copie';
    }
    var copie = JSON.parse(JSON.stringify(it)); copie.nom = nom; dest.e.push(copie);
    if (p.op === 'couper') { src.e = src.e.filter(function (x) { return x !== it; }); this.presse = null; }
    this.choisi = nom; this.rendre();
    this.signal({ type: 'coller', op: p.op, nom: nom, de: p.de, vers: this.cur.slice() });
  };

  /* Système de fichiers fictif */
  function fsBase(avecCours, telech) {
    var od = { nom: ECOLE, type: 'dossier', icone: 'nuage', e: [] };
    if (avecCours) od.e.push({ nom: 'COURS S1', type: 'dossier', e: ORDRE.map(function (m) { return { nom: m, type: 'dossier', e: m === 'Sciences' ? SOUS.map(function (s) { return { nom: s, type: 'dossier', e: [] }; }) : [] }; }) });
    else od.e.push({ nom: 'Documents', type: 'dossier', e: [] }, { nom: 'Images', type: 'dossier', e: [{ nom: 'photo_volcan.jpg', type: 'fichier' }] });
    return [od, { nom: 'Téléchargements', type: 'dossier', icone: 'telech', e: telech || [] }, { nom: 'Bureau', type: 'dossier', icone: 'bureau', e: [] }];
  }

  function Taches(ul, liste, cleFini) {
    this.ul = ul; this.liste = liste; this.ok = liste.map(function () { return false; }); this.cle = cleFini;
    if (etat.fait[cleFini]) this.ok = liste.map(function () { return true; });
    this.rendre();
  }
  Taches.prototype.rendre = function () {
    var self = this; this.ul.innerHTML = '';
    this.liste.forEach(function (t, i) { var li = el('li', { class: self.ok[i] ? 'fait' : '' }, '<span>' + t + '</span>' + (self.ok[i] ? '<span class="etat-t">fait</span>' : '')); self.ul.appendChild(li); });
  };
  Taches.prototype.valider = function (i) { this.ok[i] = true; this.rendre(); if (this.ok.every(Boolean)) marquer(this.cle); };
  Taches.prototype.raz = function () { this.ok = this.liste.map(function () { return false; }); this.rendre(); };

  /* Entraînement 1 : créer, ouvrir, remonter */
  (function () {
    var ret = $('#sim-creer-retour');
    var t = new Taches($('#taches-creer'), ['Crée un dossier <code>Essai</code> ici.', 'Ouvre <code>Essai</code> (double-clic).', 'Remonte au dossier parent avec <kbd>↑</kbd>.'], 'sim:creer');
    function dire(cls, txt) { ret.className = 'retour ' + cls; ret.innerHTML = txt; }
    new Sim($('#sim-creer'), {
      fs: fsBase(false), depart: [ECOLE],
      surEvenement: function (ev, sim) {
        if (ev.type === 'reset') { t.raz(); dire('info', 'C’est reparti !'); return; }
        if (ev.type === 'renommer') {
          if (ev.nom === 'Essai') { if (ev.chemin.join('/') === ECOLE) { t.valider(0); dire('ok', 'Dossier créé ! Maintenant, ouvre-le.'); } else dire('ko', 'Tu l’as créé dans ' + esc(ev.chemin[ev.chemin.length - 1]) + '. Il devait être dans ' + esc(ECOLE) + '.'); }
          else if (ev.nom.toLowerCase() === 'essai') dire('ko', 'Presque ! Écris <code>Essai</code> avec un E majuscule (clic droit → Renommer).');
          else if (ev.nom.indexOf('Nouveau dossier') === 0) dire('ko', 'Ton dossier s’appelle encore « ' + esc(ev.nom) + ' ». Clic droit dessus → Renommer, puis tape <code>Essai</code>.');
          else dire('ko', 'Ton dossier s’appelle « ' + esc(ev.nom) + ' ». Renomme-le en <code>Essai</code> (clic droit → Renommer).');
        }
        if (ev.type === 'naviguer') {
          if (t.ok[0] && ev.vers[ev.vers.length - 1] === 'Essai') { t.valider(1); dire('ok', 'Tu es dans Essai : regarde la barre d’adresse. Remonte maintenant avec ↑.'); }
          else if (t.ok[1] && ev.de[ev.de.length - 1] === 'Essai' && ev.vers.join('/') === ECOLE) {
            if (ev.comment === 'parent') { t.valider(2); dire('ok', 'Parfait ! Tu sais créer, ouvrir et remonter. Passe à la suite.'); }
            else dire('info', 'Ça marche aussi ! Mais essaie avec la flèche ↑ : retourne dans Essai et clique sur ↑.');
          }
        }
      }
    });
    if (etat.fait['sim:creer']) dire('ok', 'Entraînement réussi. Tu peux le refaire si tu veux.');
  })();

  /* Entraînement 2 : déplacer la fiche */
  (function () {
    var ret = $('#sim-deplacer-retour'), FICHE = 'Les_etats_de_la_matiere.pdf', PHY = [ECOLE, 'COURS S1', 'Sciences', 'Physique'];
    var t = new Taches($('#taches-deplacer'), ['Coupe la fiche dans Téléchargements.', 'Va dans OneDrive › COURS S1 › Sciences › Physique.', 'Colle-la.'], 'sim:deplacer');
    function dire(cls, txt) { ret.className = 'retour ' + cls; ret.innerHTML = txt; }
    new Sim($('#sim-deplacer'), {
      fs: fsBase(true, [{ nom: FICHE, type: 'fichier' }, { nom: 'photo_vacances.jpg', type: 'fichier' }]), depart: ['Téléchargements'],
      surEvenement: function (ev, sim) {
        if (ev.type === 'reset') { t.raz(); dire('info', 'C’est reparti !'); return; }
        if (ev.type === 'couper' && ev.nom === FICHE) { t.ok[0] = false; t.valider(0); dire('ok', 'Coupée ! Va maintenant dans Physique.'); }
        if (ev.type === 'copier' && ev.nom === FICHE) dire('ko', 'Tu as <b>copié</b> : la fiche resterait aussi dans Téléchargements. Utilise plutôt <b>Couper</b>.');
        if (ev.type === 'naviguer' && t.ok[0] && ev.vers.join('/') === PHY.join('/')) { t.valider(1); dire('ok', 'Tu es dans Physique. Clic droit dans une zone vide → Coller.'); }
        if (ev.type === 'coller' && ev.nom.indexOf('Les_etats') === 0) {
          if (ev.vers.join('/') === PHY.join('/')) {
            if (ev.op === 'couper') { t.valider(1); t.valider(2); dire('ok', 'La fiche est dans Physique et n’est plus dans Téléchargements. Bravo !'); }
            else dire('ko', 'Elle est dans Physique… mais aussi encore dans Téléchargements. Deux fiches ! Recommence avec <b>Couper</b>.');
          } else dire('ko', 'La fiche est maintenant dans « ' + esc(ev.vers[ev.vers.length - 1]) + ' ». Ce n’est pas Physique : coupe-la à nouveau.');
        }
      }
    });
    if (etat.fait['sim:deplacer']) dire('ok', 'Entraînement réussi. Tu peux le refaire si tu veux.');
  })();

  /* ---------- Saisies vérifiées ---------- */
  function normal(t) { return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, ''); }
  var SAISIES = {
    compte: function (v) { var n = parseInt(v, 10); if (n === 9) return [1, 'Oui : 9 matières. Sciences compte pour une, même avec ses 3 sous-dossiers.'];
      if (n === 12) return [0, 'Tu as compté Chimie, Biologie et Physique ? Ils sont dans Sciences : ne compte que ce que tu vois dans COURS S1.'];
      if (isNaN(n)) return [0, 'Écris un nombre.'];
      return [0, 'Il devrait y en avoir 9. Compare avec le modèle : il manque un dossier, ou il y en a un en trop ?']; },
    fusion: function (v) { var n = normal(v); if (n === 'fusion' || n === 'lafusion') return [1, 'Exact : la fusion. Tu as bien retrouvé et lu ta fiche.'];
      if (n === 'solidification' || n === 'vaporisation' || n === 'liquefaction') return [0, 'C’est un autre changement d’état. Regarde la flèche de « solide » vers « liquide » dans ta fiche.'];
      return [0, 'Ouvre ta fiche (dans Physique) et cherche le schéma des changements d’état.']; }
  };
  $$('[data-saisie]').forEach(function (inp) {
    var k = inp.dataset.saisie, ret = $('#saisie-' + k + '-retour'), btn = $('[data-saisie-btn="' + k + '"]');
    if (etat.coches['saisie-' + k]) inp.value = etat.coches['saisie-' + k];
    function verifier() {
      var r = SAISIES[k](inp.value);
      etat.coches['saisie-' + k] = inp.value; sauver();
      inp.classList.toggle('bon', !!r[0]); inp.classList.toggle('faux', !r[0]);
      ret.className = 'retour ' + (r[0] ? 'ok' : 'ko'); ret.innerHTML = (r[0] ? 'Bien vu !' : 'Pas encore.') + '<span class="pourquoi">' + esc(r[1]) + '</span>';
      if (r[0]) marquer('saisie:' + k); else if (etat.fait['saisie:' + k]) marquer('saisie:' + k, false);
    }
    btn.addEventListener('click', verifier);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') verifier(); });
    if (etat.fait['saisie:' + k]) { inp.classList.add('bon'); ret.className = 'retour ok'; ret.textContent = 'Bien vu !'; }
  });

  /* ---------- Chemins à reconstruire ---------- */
  var CHEMINS = {
    fiche: { bon: [ECOLE, 'COURS S1', 'Sciences', 'Physique'], choix: ['Téléchargements', 'Sciences', ECOLE, 'Chimie', 'Physique', 'Bureau', 'COURS S1'],
      ok: 'Exact ! Le dernier dossier du chemin, Physique, est celui qui contient ta fiche.' },
    bonus: { bon: [ECOLE, 'COURS S1', 'Math'], choix: ['Sciences', 'Math', 'Téléchargements', ECOLE, 'FMTT', 'COURS S1', 'Physique'],
      ok: 'Exact ! Une fiche sur les angles va dans Math. Et sans créer de nouveau dossier.' }
  };
  $$('[data-chemin]').forEach(function (box) {
    var k = box.dataset.chemin, d = CHEMINS[k], pris = [];
    var cible = box.querySelector('.chemin-cible'), past = box.querySelector('.pastilles'), ret = box.querySelector('.retour');
    function iconeDe(n) { return n === ECOLE ? ico('nuage') : (n === 'Téléchargements' ? ico('telech') : (n === 'Bureau' ? ico('bureau') : ico('dossier'))); }
    function rendre() {
      cible.innerHTML = pris.length ? '' : '<span class="vide">Clique sur les dossiers ci-dessous, du plus grand au plus petit.</span>';
      pris.forEach(function (n, i) {
        if (i) cible.appendChild(el('span', { class: 'sep', 'aria-hidden': 'true' }, '›'));
        var b = el('button', { type: 'button', class: 'pastille', 'aria-label': 'Retirer ' + n }, iconeDe(n) + esc(n));
        b.addEventListener('click', function () { pris = pris.slice(0, i); rendre(); });
        cible.appendChild(b);
      });
      past.innerHTML = '';
      d.choix.forEach(function (n) {
        var b = el('button', { type: 'button', class: 'pastille' }, iconeDe(n) + esc(n)); b.disabled = pris.indexOf(n) >= 0;
        b.addEventListener('click', function () { pris.push(n); rendre(); ret.className = 'retour'; ret.innerHTML = ''; var p = past.querySelector('.pastille:not(:disabled)'); if (p) p.focus(); });
        past.appendChild(b);
      });
    }
    box.querySelector('[data-act="effacer"]').addEventListener('click', function () { pris = []; rendre(); ret.className = 'retour'; ret.innerHTML = ''; });
    box.querySelector('[data-act="verifier"]').addEventListener('click', function () {
      if (pris.join('/') === d.bon.join('/')) { ret.className = 'retour ok'; ret.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(d.ok) + '</span>'; marquer('chemin:' + k); return; }
      var msg;
      if (!pris.length) msg = 'Clique d’abord sur des dossiers.';
      else if (pris[0] !== ECOLE) msg = 'Un chemin commence par le plus grand emplacement : ton OneDrive.';
      else if (pris.indexOf('Téléchargements') >= 0 || pris.indexOf('Bureau') >= 0) msg = 'Téléchargements et Bureau ne sont pas dans OneDrive.';
      else if (pris.length < d.bon.length) msg = 'Il manque un ou plusieurs dossiers.';
      else msg = 'Un dossier n’est pas le bon, ou pas à sa place. Pense à ' + (k === 'fiche' ? 'Mon arbo.' : 'la matière de la fiche.');
      ret.className = 'retour ko'; ret.innerHTML = 'Pas encore.<span class="pourquoi">' + esc(msg) + '</span>';
    });
    if (etat.fait['chemin:' + k]) { pris = d.bon.slice(); ret.className = 'retour ok'; ret.innerHTML = 'Bien vu !<span class="pourquoi">' + esc(d.ok) + '</span>'; }
    rendre();
  });

  /* ---------- Téléchargement : réponses selon le cas ---------- */
  $$('[data-cas]').forEach(function (g) {
    var k = g.dataset.cas;
    $$('input[type=radio]', g).forEach(function (r) {
      if (etat.radios[k] === r.value) r.checked = true;
      r.addEventListener('change', function () { etat.radios[k] = r.value; sauver(); montrer(); });
    });
    function montrer() { $$('[data-pour^="' + k + '-"]').forEach(function (d) { d.hidden = d.dataset.pour !== k + '-' + etat.radios[k]; }); }
    montrer();
  });
  $$('[data-dl]').forEach(function (a) { a.addEventListener('click', function () { etat.coches['dl-' + a.dataset.dl] = 1; sauver(); }); });

  /* ---------- Indices progressifs (mission 6) ---------- */
  (function () {
    var IND = ['Commence par ton OneDrive scolaire, dans le volet de gauche.', 'La fiche parle de sciences.', 'Les états de la matière, c’est de la physique.'];
    var n = +(etat.coches.indices || 0), box = $('#indices'), b = $('#btn-indice');
    function rendre() { box.innerHTML = IND.slice(0, n).map(function (t, i) { return '<p><b>Indice ' + (i + 1) + ' :</b> ' + esc(t) + '</p>'; }).join(''); b.disabled = n >= IND.length; b.textContent = n >= IND.length ? 'Plus d’indice : regarde Mon arbo' : (n ? 'Encore un indice' : 'Je suis bloqué : un indice'); }
    b.addEventListener('click', function () { n = Math.min(IND.length, n + 1); etat.coches.indices = n; sauver(); rendre(); });
    rendre();
  })();

  /* ---------- Bilan ---------- */
  function rendreBilan() {
    var L = [
      ['Je distingue un fichier, un dossier et un sous-dossier.', ['tri', 'qcm:sous1', 'qcm:sous2', 'qcm:sous3'], 'v'],
      ['Je reconnais les parties de l’explorateur et je lis un chemin.', ['zones', 'qcm:q3', 'chemin:fiche'], 'v'],
      ['Je sais ce qui est local, ce qui est en ligne, et à quoi sert la synchronisation.', ['qcm:local', 'qcm:cas1', 'qcm:cas2', 'qcm:cas3', 'qcm:cas4', 'qcm:cas5', 'qcm:q4'], 'v'],
      ['J’ouvre mon explorateur et je trouve mon OneDrive scolaire.', ['v:ouvrir', 'v:onedrive'], 'd'],
      ['Je crée et je nomme des dossiers au bon niveau.', ['v:cours', 'v:sciences', 'v:matieres', 'v:sous', 'v:arbo'], 'd'],
      ['Je remonte au dossier parent sans fermer la fenêtre.', ['sim:creer', 'qcm:parent'], 'v'],
      ['Je télécharge un fichier et je le range avec Couper / Coller.', ['sim:deplacer', 'v:dl', 'v:deplacer', 'v:ouvrirfiche'], 'd'],
      ['Je retrouve mon fichier sans guide et je l’ouvre.', ['saisie:fusion', 'v:sansguide'], 'v']
    ];
    var ul = $('#bilan'); ul.innerHTML = ''; var tout = true;
    L.forEach(function (l) {
      var ok = l[1].every(function (k) { return etat.fait[k]; }); if (!ok) tout = false;
      var p = ok ? (l[2] === 'v' ? '<span class="pastille-etat verifie">Vérifié</span>' : '<span class="pastille-etat declare">Fait sur l’ordi</span>') : '<span class="pastille-etat afaire">À terminer</span>';
      ul.appendChild(el('li', null, p + '<span class="txt">' + esc(l[0]) + '</span>'));
    });
    $('#badge-fin').innerHTML = tout ? '<span class="badge-fin">✓ Mes cours sont bien rangés !</span>' : '<p class="discret">Certaines lignes sont « À terminer » : ouvre le <b>Plan</b> pour y retourner.</p>';
  }

  /* ---------- Mon arbo (panneau) ---------- */
  var arboOuverts = { 'COURS S1': 1, 'Sciences': 1, 'Physique': 1 }, arboChoisi = null;
  try { if (etat.arboOuverts) arboOuverts = etat.arboOuverts; } catch (e) {}
  function cree(n) {
    if (n === ECOLE) return etat.fait['v:onedrive'];
    if (n === 'COURS S1') return etat.fait['v:cours'];
    if (n === 'Sciences') return etat.fait['v:sciences'];
    if (n === 'Les_etats_de_la_matiere.pdf') return etat.fait['v:deplacer'];
    return etat.coches['dos-' + n];
  }
  function majArbo() {
    var ul = $('#arbo-arbre'); if (!ul) return; ul.innerHTML = '';
    function ajoute(n, parent, chemin) {
      var li = el('li'), ligne = el('div', { class: 'ligne' });
      var a = n.e && n.e.length;
      var pli = el('button', { type: 'button', class: 'pli' + (a ? '' : ' vide'), 'aria-label': (arboOuverts[n.n] ? 'Replier ' : 'Déplier ') + n.n });
      if (a) { pli.textContent = arboOuverts[n.n] ? '▾' : '▸'; pli.setAttribute('aria-expanded', arboOuverts[n.n] ? 'true' : 'false'); pli.addEventListener('click', function () { arboOuverts[n.n] = !arboOuverts[n.n]; etat.arboOuverts = arboOuverts; sauver(); majArbo(); }); }
      else pli.setAttribute('tabindex', '-1');
      var nom = el('button', { type: 'button', class: 'nom' + (arboChoisi === n.n ? ' choisi' : '') }, (n.f ? icoNom(n.n) : (n.t === 'nuage' ? ico('nuage') : ico('dossier'))) + '<span>' + esc(n.n) + '</span>' + (cree(n.n) ? ' <span class="ok" aria-label="créé">✓</span>' : ''));
      nom.addEventListener('click', function () {
        arboChoisi = n.n; majArbo();
        var c = chemin.concat(n.n), info = $('#arbo-info');
        var txt = '<div>Chemin : <b>' + c.map(esc).join(' › ') + '</b></div>';
        if (chemin.length) txt += '<div>Dossier parent : <b>' + esc(chemin[chemin.length - 1]) + '</b></div>';
        if (n.f) txt += '<div>C’est un <b>fichier</b>.</div>';
        else if (n.e && n.e.length) txt += '<div>Contient : ' + n.e.length + ' élément' + (n.e.length > 1 ? 's' : '') + '.</div>';
        else txt += '<div>Dossier vide pour l’instant.</div>';
        info.innerHTML = txt;
      });
      ligne.appendChild(pli); ligne.appendChild(nom); li.appendChild(ligne);
      if (a && arboOuverts[n.n]) { var sub = el('ul'); n.e.forEach(function (x) { ajoute(x, sub, chemin.concat(n.n)); }); li.appendChild(sub); }
      parent.appendChild(li);
    }
    var m = modele(); arboOuverts[ECOLE] = arboOuverts[ECOLE] === undefined ? 1 : arboOuverts[ECOLE];
    ajoute(m, ul, []);
  }
  var arbo = $('#arbo'), btnArbo = $('#btn-arbo');
  function ouvrirArbo(o) { etat.arbo = o; sauver(); arbo.hidden = !o; btnArbo.setAttribute('aria-expanded', o ? 'true' : 'false'); $('#zone').classList.toggle('avec-arbo', o); if (o) majArbo(); }
  btnArbo.addEventListener('click', function () { ouvrirArbo(arbo.hidden); if (!arbo.hidden) $('#arbo-fermer').focus(); });
  $('#arbo-fermer').addEventListener('click', function () { ouvrirArbo(false); btnArbo.focus(); });
  arbo.addEventListener('keydown', function (e) { if (e.key === 'Escape') { ouvrirArbo(false); btnArbo.focus(); } });

  /* ---------- Réglages ---------- */
  var dlgReg = $('#dlg-reglages'), R = etat.reglages;
  function appliquer() {
    var d = document.documentElement;
    if (R.texte && R.texte !== 'normal') d.dataset.texte = R.texte; else delete d.dataset.texte;
    if (R.theme && R.theme !== 'auto') d.dataset.theme = R.theme; else delete d.dataset.theme;
    if (R.anim === 'non') d.dataset.anim = 'non'; else delete d.dataset.anim;
  }
  [['texte', 'normal'], ['theme', 'auto'], ['anim', 'oui']].forEach(function (p) {
    $$('input[name="' + p[0] + '"]', dlgReg).forEach(function (r) {
      r.checked = (R[p[0]] || p[1]) === r.value;
      r.addEventListener('change', function () { R[p[0]] = r.value; etat.reglages = R; sauver(); appliquer(); });
    });
  });
  $('#btn-reglages').addEventListener('click', function () { dlgReg.showModal(); });
  $('#btn-raz').addEventListener('click', function () { dlgReg.close(); $('#dlg-raz').showModal(); });
  $('#raz-oui').addEventListener('click', function () {
    try { localStorage.setItem(CLE, JSON.stringify({ reglages: etat.reglages })); } catch (e) {}
    location.reload();
  });
  appliquer();

  /* ---------- Démarrage ---------- */
  majArbo();
  ouvrirArbo(!!etat.arbo);
  aller(etat.pos || 'accueil', false);
})();
