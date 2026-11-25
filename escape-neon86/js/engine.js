/* ==========================================================================
   PANNE À BORD DU NÉON-86 — moteur du jeu (version 2 « immersive »)
   Application statique : aucune donnée n'est envoyée sur Internet.
   Progression enregistrée dans le navigateur (localStorage).
   ========================================================================== */
(function () {
  "use strict";
  const D = window.NEON, ART = window.ART, SC = window.SCENES;
  const CLE = "neon86-sauvegarde-v2", CLE_V1 = "neon86-sauvegarde-v1", CLE_ACCES = "neon86-acces";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const html = (s) => { const d = document.createElement("div"); d.innerHTML = s; return d.children.length === 1 ? d.firstElementChild : d; };

  /* ---------- empreintes des réponses ---------- */
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, ""); }
  function H(s) { let h = 0x811c9dc5; const t = norm(s); for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36).padStart(7, "0"); }

  /* ---------- état ---------- */
  const E = D.enigmes, IDS = Object.keys(E);
  function etatNeuf() {
    return { v: 2, membres: [], debut: null, fin: null, resolu: {}, indices: {}, essais: {}, saisies: {}, vu: {},
      son: false, introVue: false, tuto: false, rotation: {},
      a1: { lots: [], place: {}, essaisLot: {} }, b1: null, c3: [], final: { slots: {} },
      finalOk: false, signalOk: false, auto: {}, explication: "", journal: [], migreDe: null };
  }
  let S = etatNeuf(), stockageOk = true;
  function lire(cle) { try { const t = localStorage.getItem(cle); return t ? JSON.parse(t) : null; } catch (e) { stockageOk = false; return null; } }
  function charger() { const o = lire(CLE); return o && o.v === 2 ? Object.assign(etatNeuf(), o) : null; }
  function sauver() { try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) { stockageOk = false; } }
  function noter(txt) { S.journal.push({ t: Date.now(), txt }); if (S.journal.length > 60) S.journal.shift(); }

  /* ---------- migration d'une partie de la version 1 ---------- */
  function migrerV1(o) {
    const n = etatNeuf();
    ["debut", "fin", "resolu", "indices", "essais", "vu", "son", "finalOk", "signalOk", "explication"].forEach((k) => { if (o[k] !== undefined) n[k] = o[k]; });
    n.saisies = o.saisies || {};
    n.c3 = (o.c3 || []).map(function nettoie(b) { return b.t === "repeter" ? { t: "repeter", n: b.n, corps: (b.corps || []).map(nettoie) } : { t: b.t }; });
    Object.entries(o.finalLignes || {}).forEach(([i, c]) => (n.final.slots[i] = c));
    n.introVue = true; n.tuto = true;
    n.migreDe = { equipe: o.equipe || "", date: Date.now() };
    if (o.resolu && o.resolu.A1) {
      n.a1.lots = [{ id: "L-ancien", membreId: null, nom: "version précédente", items: E.A1.elements.map((_, i) => i), fait: true }];
      E.A1.elements.forEach((el, i) => (n.a1.place[i] = el.cat));
    }
    if (o.resolu && o.resolu.B1) n.b1 = Object.fromEntries(E.B1.descriptions.map((d) => [d.bonne, d.id]));
    return n;
  }
  function decouperEquipe(txt) { return String(txt || "").split(/\s*(?:,|;|\/|&|\bet\b|\+)\s*/i).map((s) => s.trim()).filter(Boolean).slice(0, D.equipage.max); }

  /* ---------- son facultatif ---------- */
  let ctx = null;
  function bip(type) {
    if (!S.son) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { ok: [660, 880, 1320], ko: [220, 180], clic: [520], fin: [523, 659, 784, 1046], pose: [700] }[type] || [440];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "square"; o.frequency.value = f; g.gain.value = 0.04; o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime + i * 0.11; o.start(t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1); o.stop(t + 0.12);
      });
    } catch (e) {}
  }

  /* ---------- outils d'état ---------- */
  const estResolu = (id) => !!S.resolu[id];
  const estOuvert = (id) => (E[id].requiert || []).every(estResolu);
  const nbResolus = () => IDS.filter(estResolu).length;
  const finalOuvert = () => nbResolus() === IDS.length;
  const termine = () => S.finalOk && S.signalOk;
  const cartesGagnees = () => IDS.filter(estResolu).flatMap((id) => E[id].recompense);
  const membre = (id) => S.membres.find((m) => m.id === id);
  const prenoms = () => S.membres.map((m) => m.nom);
  function listeNoms(noms) { return noms.length <= 1 ? (noms[0] || "") : noms.slice(0, -1).join(", ") + " et " + noms[noms.length - 1]; }
  function etatScene() {
    const a1Faits = S.a1.lots.filter((l) => l.fait).reduce((s, l) => s + l.items.length, 0);
    return { resolu: S.resolu, boulon: estResolu("A1") ? 6 : Math.floor(a1Faits / 12 * 6), final: S.finalOk, signal: S.signalOk };
  }
  const COUL = ["#ffb000", "#45d0ea", "#ff5c8a", "#7cffb2", "#b794ff", "#f2e6c2"];
  function badge(m, i, petit) {
    const ini = m.nom.trim().split(/[\s'-]+/).map((p) => p[0]).join("").slice(0, 2).toUpperCase();
    return `<span class="badge ${petit ? "badge-mini" : ""}" style="--bc:${COUL[i % COUL.length]}"><span class="b-ini" aria-hidden="true">${esc(ini)}</span><span class="b-nom">${esc(m.aff || nomAff(m))}</span></span>`;
  }
  const idxMembre = (id) => S.membres.findIndex((m) => m.id === id);
  /* Deux membres peuvent porter le même prénom : on ajoute leur numéro à l'affichage (ils gardent des identifiants distincts). */
  function nomAff(m, liste) {
    const L = liste || S.membres, k = L.indexOf(m);
    const dup = L.filter((x) => norm(x.nom) === norm(m.nom)).length > 1;
    return dup ? `${m.nom} (n° ${k + 1})` : m.nom;
  }
  const nomLot = (l) => { const m = membre(l.membreId); return m ? nomAff(m) : l.nom; };
  function nouvelId() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ---------- navigation ---------- */
  const app = () => $("#app");
  let ecran = { nom: "acces" };
  function aller(nom, param) {
    ecran = { nom, param };
    $("#toast").hidden = true; fermerModale();
    if (nom === "enigme") { S.vu[param] = true; sauver(); }
    if (nom === "lieu") { S.lieu = param; sauver(); }
    app().innerHTML = "";
    ({ acces: ecAcces, migration: ecMigration, inscription: ecInscription, intro: ecIntro, lieu: ecLieu, enigme: ecEnigme, final: ecFinal, fin: ecFin, bilan: ecBilan }[nom])(param);
    majEntete();
    window.scrollTo(0, 0);
    const h = $("#app h1, #app h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  function majEntete() {
    const enJeu = ["lieu", "enigme", "final", "fin", "bilan"].includes(ecran.nom);
    $("#entete").hidden = !enJeu; $("#objectif").hidden = !enJeu;
    if (!enJeu) return;
    $("#equipe-aff").innerHTML = S.membres.map((m, i) => badge(m, i, true)).join("");
    $("#compteur").textContent = `💾 ${cartesGagnees().length}/11 disquettes · ${nbResolus()}/9 systèmes`;
    $("#btn-son").setAttribute("aria-pressed", S.son ? "true" : "false");
    $("#btn-son").textContent = S.son ? "🔊 Son activé" : "🔇 Son coupé";
    let lieu, obj;
    if (ecran.nom === "lieu") { lieu = D.lieux[ecran.param].nom; obj = objectifLieu(ecran.param); }
    else if (ecran.nom === "enigme") { const e = E[ecran.param]; lieu = D.lieux[e.salle].nom + " › " + e.titre; obj = estResolu(ecran.param) ? "Système réparé. Choisis une autre réparation." : e.afaire; }
    else if (ecran.nom === "final") { lieu = "Poste de pilotage › Console de GLADYS"; obj = S.finalOk ? "Envoyer le signal d'amarrage avec le nom de la balise." : "Insérer les 11 disquettes dans les bonnes fentes."; }
    else { lieu = "Poste de pilotage"; obj = termine() ? "Mission accomplie : faites votre bilan." : "Bilan de mission."; }
    $("#obj-lieu").textContent = lieu; $("#obj-txt").textContent = obj;
  }
  function objectifLieu(l) {
    if (l === "hub") {
      if (termine()) return "Mission accomplie ! Le vaisseau COMÈTE est amarré. Ouvrez le bilan.";
      if (finalOuvert()) return "Les 9 systèmes fonctionnent : réveillez GLADYS à sa console.";
      return `${D.lieux.hub.objectif} (${nbResolus()}/9 systèmes réparés)`;
    }
    const ids = D.lieux[l].enigmes, faits = ids.filter(estResolu).length;
    return faits === ids.length ? "Salle entièrement réparée ✔. Retournez au poste de pilotage ou explorez un autre secteur." : `${D.lieux[l].objectif} (${faits}/${ids.length} réparés)`;
  }

  /* ---------- dialogues ---------- */
  function bulle(l) {
    const noms = { gladys: "GLADYS 3000", boulon: "BOULON", journal: "Journal de bord" };
    const art = l.qui === "gladys" ? ART.gladys(termine() ? "contente" : nbResolus() >= 5 ? "neutre" : "boude") : l.qui === "boulon" ? ART.boulon() : ART.journal();
    return `<div class="bulle bulle-${l.qui}"><div class="avatar">${art}</div><div class="bulle-txt"><span class="qui">${noms[l.qui]}</span><p>${esc(l.txt)}</p></div></div>`;
  }

  /* ======================================================================
     1. CODE D'ACCÈS
     ====================================================================== */
  function accesOk() { if (!D.codeAcces) return true; try { return localStorage.getItem(CLE_ACCES) === D.codeAcces; } catch (e) { return false; } }
  function ecAcces() {
    if (accesOk()) { demarrage(); return; }
    app().append(html(`<section class="accueil">
      <div class="accueil-scene">${SC.hub({ resolu: {} })}</div>
      <div class="accueil-panneau">
        <p class="sur-titre">eSCIENCES · Formation numérique S1 · Escape game</p>
        <h1 class="logo">PANNE À BORD<br><span>DU NÉON-86</span></h1>
        <p>Accès verrouillé. GLADYS n'ouvre la station qu'avec le code donné par votre professeur.</p>
        <form id="a-form" class="form-col"><label for="a-code">Code d'accès</label>
          <input id="a-code" type="password" autocomplete="off" autocapitalize="characters" aria-describedby="a-msg">
          <button class="btn btn-grand" type="submit">Déverrouiller</button></form>
        <p id="a-msg" class="msg-erreur" role="status" aria-live="polite"></p>
      </div></section>`));
    $("#a-code").focus();
    $("#a-form").onsubmit = (ev) => {
      ev.preventDefault();
      if (H($("#a-code").value) === D.codeAcces) { try { localStorage.setItem(CLE_ACCES, D.codeAcces); } catch (e) {} bip("ok"); demarrage(); }
      else { $("#a-code").value = ""; $("#a-msg").textContent = "Code incorrect. Attendez que votre professeur vous donne le code."; bip("ko"); }
    };
  }
  function demarrage() {
    // Choix : reprendre, migrer une ancienne partie ou commencer
    const sv = charger(), v1 = lire(CLE_V1);
    app().innerHTML = "";
    let traitee = false; try { traitee = localStorage.getItem("neon86-v1-traitee") === "1"; } catch (e) {}
    if (!sv && v1 && v1.v === 1 && v1.debut && !traitee) { aller("migration", v1); return; }
    app().append(html(`<section class="accueil">
      <div class="accueil-scene">${SC.hub(sv ? { resolu: sv.resolu, final: sv.finalOk, signal: sv.signalOk } : { resolu: {} })}</div>
      <div class="accueil-panneau">
        <p class="sur-titre">eSCIENCES · Formation numérique S1 · Escape game · 2056</p>
        <h1 class="logo">PANNE À BORD<br><span>DU NÉON-86</span></h1>
        <p>GLADYS est en mode de secours, BOULON est en pièces et le vaisseau COMÈTE attend de pouvoir s'amarrer.</p>
        ${sv && sv.membres.length ? `<div class="reprise"><p><b>Partie enregistrée sur cet ordinateur</b></p><p>${sv.membres.map((m, i) => { m.aff = nomAff(m, sv.membres); return badge(m, i, true); }).join(" ")}</p><p>${Object.keys(sv.resolu).length}/9 systèmes réparés</p>
          <button class="btn btn-grand" id="d-reprendre">▶ Reprendre la mission</button></div>` : ""}
        <button class="btn ${sv ? "btn-sec" : "btn-grand"}" id="d-nouveau">${sv ? "Nouvelle partie (nouvel équipage)" : "▶ Inscrire l'équipage"}</button>
        ${!stockageOk ? `<p class="msg-erreur">Ce navigateur bloque l'enregistrement : la progression sera perdue si la page est fermée.</p>` : ""}
        <p class="petit">Environ 50 à 60 minutes · 1 à ${D.equipage.max} élèves par ordinateur · son facultatif</p>
      </div></section>`));
    if ($("#d-reprendre")) $("#d-reprendre").onclick = () => { S = sv; aller("lieu", S.lieu || "hub"); };
    $("#d-nouveau").onclick = () => {
      if (sv && !confirm("Commencer une nouvelle partie ? La partie enregistrée sur cet ordinateur sera effacée.")) return;
      S = etatNeuf(); aller("inscription", { mode: "nouveau" });
    };
    majEntete();
  }

  /* ---------- écran de migration (ancienne version) ---------- */
  function ecMigration(v1) {
    const noms = decouperEquipe(v1.equipe);
    const n = Object.keys(v1.resolu || {}).length;
    app().append(html(`<section class="panneau etroit">
      <h1>Partie de l'ancienne version trouvée</h1>
      <p>Cette partie a été commencée avec la version précédente du jeu${v1.equipe ? `, par l'équipage « <b>${esc(v1.equipe)}</b> »` : ""}. À l'époque, l'équipage était un seul champ de texte.</p>
      <ul><li><b>${n}/9</b> systèmes réparés : ils sont conservés, avec les indices et les réponses déjà saisies.</li>
        <li>Pour continuer, il faut inscrire chaque membre de l'équipage. ${noms.length > 1 ? `Proposition : ${noms.map(esc).join(", ")} (à vérifier).` : ""}</li>
        <li>L'ancienne sauvegarde n'est pas effacée : elle reste sur cet ordinateur.</li></ul>
      <div class="actions"><button class="btn btn-grand" id="mg-ok">Continuer cette partie</button><button class="btn btn-sec" id="mg-non">Commencer une nouvelle partie</button></div>
    </section>`));
    const traiter = () => { try { localStorage.setItem("neon86-v1-traitee", "1"); } catch (e) {} };
    $("#mg-ok").onclick = () => { traiter(); S = migrerV1(v1); aller("inscription", { mode: "migration", noms }); };
    $("#mg-non").onclick = () => { if (confirm("Commencer une nouvelle partie ? L'ancienne partie reste enregistrée mais ne sera pas reprise.")) { traiter(); S = etatNeuf(); aller("inscription", { mode: "nouveau" }); } };
  }

  /* ======================================================================
     2. INSCRIPTION DE L'ÉQUIPAGE (nombre → prénoms → récapitulatif)
     ====================================================================== */
  function ecInscription(p) {
    const mode = p.mode; // nouveau | migration | modifier
    let noms = (p.noms && p.noms.length ? p.noms : S.membres.map((m) => m.nom)).slice();
    let ids = mode === "modifier" ? S.membres.map((m) => m.id) : [];
    let nb = Math.max(D.equipage.min, Math.min(D.equipage.max, noms.length || 1));
    let etape = p.etape || 1;
    const sec = html(`<section class="panneau etroit inscription"></section>`);
    app().append(sec);
    function dessine() {
      if (etape === 1) {
        sec.innerHTML = `<p class="etape-num">Inscription · étape 1 sur 3</p><h1>Combien êtes-vous devant cet ordinateur ?</h1>
          <p>Comptez seulement les élèves qui jouent réellement ensemble sur cet ordinateur.</p>
          <div class="choix-nb" role="radiogroup" aria-label="Nombre de membres">${Array.from({ length: D.equipage.max - D.equipage.min + 1 }, (_, i) => i + D.equipage.min).map((k) =>
            `<button type="button" role="radio" aria-checked="${k === nb}" class="nb-btn ${k === nb ? "actif" : ""}" data-nb="${k}"><span class="nb-gros">${k}</span>${k === 1 ? "élève" : "élèves"}</button>`).join("")}</div>
          <div class="actions">${mode === "modifier" ? `<button class="btn btn-sec" id="i-annuler">Annuler</button>` : ""}<button class="btn btn-grand" id="i-suite">Suivant</button></div>`;
        $$(".nb-btn", sec).forEach((b) => (b.onclick = () => { nb = +b.dataset.nb; dessine(); $(`[data-nb="${nb}"]`, sec).focus(); }));
        sec.addEventListener("keydown", flechesNb);
        $("#i-suite", sec).onclick = () => { etape = 2; dessine(); };
      } else if (etape === 2) {
        sec.innerHTML = `<p class="etape-num">Inscription · étape 2 sur 3</p><h1>Les prénoms de l'équipage</h1>
          <p>Un prénom par membre. Les accents, espaces, apostrophes et traits d'union sont acceptés.</p>
          <form id="i-form" class="form-col" novalidate>${Array.from({ length: nb }, (_, i) => `<div class="champ-nom">
            <label for="nom-${i}">Prénom du membre ${i + 1}</label>
            <input id="nom-${i}" data-i="${i}" maxlength="24" autocomplete="off" value="${esc(noms[i] || "")}" aria-describedby="err-${i}">
            <span class="msg-erreur" id="err-${i}"></span></div>`).join("")}
            <div class="actions"><button type="button" class="btn btn-sec" id="i-retour">← Changer le nombre</button><button class="btn btn-grand" type="submit">Suivant</button></div></form>`;
        $$("input", sec).forEach((inp) => (inp.oninput = () => { noms[+inp.dataset.i] = inp.value; }));
        $("#i-retour", sec).onclick = () => { etape = 1; dessine(); };
        $("#i-form", sec).onsubmit = (ev) => {
          ev.preventDefault(); let premier = null;
          for (let i = 0; i < nb; i++) {
            const v = (noms[i] || "").replace(/\s+/g, " ").trim(), err = $("#err-" + i, sec), inp = $("#nom-" + i, sec);
            const msg = !v ? "Écris un prénom (pas seulement des espaces)." : !/[\p{L}]/u.test(v) ? "Le prénom doit contenir au moins une lettre." : "";
            err.textContent = msg; inp.setAttribute("aria-invalid", msg ? "true" : "false");
            if (msg && !premier) premier = inp; else noms[i] = v;
          }
          if (premier) { premier.focus(); return; }
          etape = 3; dessine();
        };
        $("#nom-0", sec).focus();
      } else {
        const fictifs = noms.slice(0, nb).map((n, i) => ({ id: "x" + i, nom: n })); fictifs.forEach((f) => (f.aff = nomAff(f, fictifs)));
        const doublons = new Set(noms.slice(0, nb).filter((n, i, a) => a.findIndex((x) => norm(x) === norm(n)) !== i).map(norm));
        sec.innerHTML = `<p class="etape-num">Inscription · étape 3 sur 3</p><h1>Votre équipage</h1>
          <div class="recap">${fictifs.map((m, i) => `<div class="recap-carte">${badge(m, i)}<span class="petit">Membre ${i + 1}${doublons.has(norm(m.nom)) ? " · même prénom qu'un autre membre : le numéro permet de vous distinguer" : ""}</span></div>`).join("")}</div>
          ${mode === "modifier" ? noteModification(nb) : ""}
          <p>${nb > 1 ? "Vous partagez un seul ordinateur : chacun prendra la souris à son tour, et les autres aident à réfléchir." : "Tu joues seul(e) : tu réaliseras toutes les manipulations."}</p>
          <div class="actions"><button class="btn btn-sec" id="i-corriger">✎ Corriger</button><button class="btn btn-grand" id="i-ok">${mode === "modifier" ? "Enregistrer l'équipage" : "Démarrer la mission"}</button></div>`;
        $("#i-corriger", sec).onclick = () => { etape = 2; dessine(); };
        $("#i-ok", sec).onclick = () => valider();
      }
    }
    function flechesNb(ev) {
      if (etape !== 1 || !["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(ev.key)) return;
      ev.preventDefault(); nb = Math.max(D.equipage.min, Math.min(D.equipage.max, nb + (ev.key === "ArrowRight" || ev.key === "ArrowDown" ? 1 : -1))); dessine(); $(`[data-nb="${nb}"]`, sec).focus();
    }
    function noteModification(n) {
      const faits = S.a1.lots.filter((l) => l.fait);
      if (estResolu("A1")) return `<p class="note">L'atelier de Boulon (A1) est déjà terminé : il ne change pas. Les autres réparations restent acquises par toute l'équipe.</p>`;
      if (!S.a1.lots.length) return "";
      return `<p class="note">Atelier de Boulon (A1) : ${faits.length ? `les lots déjà vérifiés restent au nom de ${esc(listeNoms(faits.map((l) => l.nom)))}. ` : ""}Les pièces des lots non vérifiés seront redistribuées entre les ${n} membres.</p>`;
    }
    function valider() {
      const anciens = S.membres;
      S.membres = noms.slice(0, nb).map((nom, i) => ({ id: (mode === "modifier" && ids[i]) || nouvelId(), nom }));
      if (mode === "modifier") {
        const avant = listeNoms(anciens.map((m) => m.nom)), apres = listeNoms(prenoms());
        noter(`Équipage modifié : ${avant} → ${apres}`);
        S.membres.forEach((m) => S.a1.lots.forEach((l) => { if (l.membreId === m.id && !l.fait) l.nom = m.nom; }));
        redistribuerA1(); sauver();
        aller(ecran.retour?.nom || "lieu", ecran.retour?.param || S.lieu || "hub");
        annonce("Équipage enregistré : " + apres + ".");
        return;
      }
      if (mode === "migration") { noter("Partie reprise depuis la version précédente (équipage : « " + (S.migreDe.equipe || "") + " »)"); redistribuerA1(); sauver(); aller("lieu", "hub"); annonce("Partie reprise. Vos réparations sont conservées."); return; }
      S.debut = Date.now(); noter("Équipage inscrit : " + listeNoms(prenoms())); creerLotsA1(); sauver(); aller("intro", 0);
    }
    dessine();
  }

  /* ---------- lots de l'atelier A1 ---------- */
  function decoupe(items, n) {
    const res = [], base = Math.floor(items.length / n), reste = items.length % n; let k = 0;
    for (let i = 0; i < n; i++) { const t = base + (i < reste ? 1 : 0); res.push(items.slice(k, k + t)); k += t; }
    return res;
  }
  function creerLotsA1() {
    const parts = decoupe(E.A1.elements.map((_, i) => i), S.membres.length);
    S.a1.lots = S.membres.map((m, i) => ({ id: "L" + (i + 1) + "-" + m.id, membreId: m.id, nom: m.nom, items: parts[i], fait: false }));
  }
  function redistribuerA1() {
    if (estResolu("A1")) return;
    const faits = S.a1.lots.filter((l) => l.fait);
    const reste = E.A1.elements.map((_, i) => i).filter((i) => !faits.some((l) => l.items.includes(i)));
    if (!reste.length) return;
    const parts = decoupe(reste, S.membres.length);
    S.a1.lots = faits.concat(S.membres.map((m, i) => ({ id: "L" + Date.now().toString(36) + i, membreId: m.id, nom: m.nom, items: parts[i], fait: false })).filter((l) => l.items.length));
  }

  /* ======================================================================
     3. INTRODUCTION ET TUTORIEL
     ====================================================================== */
  function ecIntro(i) {
    const et = D.intro[i], dernier = i === D.intro.length - 1;
    app().append(html(`<section class="intro-ecran">
      <div class="intro-scene">${SC[et.lieu](etatScene())}</div>
      <div class="intro-panneau">
        <p class="etape-num">Introduction · ${i + 1} / ${D.intro.length}</p>
        <h1>${esc(et.titre)}</h1>
        ${i === 0 && S.membres.length ? `<p class="equipe-intro">${S.membres.map((m, k) => badge(m, k)).join(" ")}</p>` : ""}
        <div class="dialogue">${et.lignes.map(bulle).join("")}</div>
        ${dernier ? `<ul class="regles">${D.regles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>` : ""}
        <div class="actions">
          ${i > 0 ? `<button class="btn btn-sec" id="in-prec">← Précédent</button>` : ""}
          <button class="btn btn-grand" id="in-suiv">${dernier ? "Entrer dans le poste de pilotage" : "Suivant →"}</button>
          ${S.introVue ? `<button class="btn btn-sec" id="in-passer">Passer</button>` : ""}
        </div>
        <p class="points" aria-hidden="true">${D.intro.map((_, k) => `<span class="${k === i ? "on" : ""}"></span>`).join("")}</p>
      </div></section>`));
    if ($("#in-prec")) $("#in-prec").onclick = () => aller("intro", i - 1);
    if ($("#in-passer")) $("#in-passer").onclick = () => aller("lieu", S.lieu || "hub");
    $("#in-suiv").onclick = () => {
      if (!dernier) return aller("intro", i + 1);
      const premiere = !S.introVue; S.introVue = true; sauver(); aller("lieu", "hub");
      if (premiere && !S.tuto) setTimeout(() => tutoriel(0), 300);
    };
  }
  function tutoriel(k) {
    $$(".tuto-cible").forEach((e) => e.classList.remove("tuto-cible"));
    $("#tuto")?.remove();
    if (k >= D.tutoriel.length) { S.tuto = true; sauver(); return; }
    const t = D.tutoriel[k], cible = $(t.cible);
    if (cible) { cible.classList.add("tuto-cible"); cible.scrollIntoView({ block: "nearest" }); }
    const b = html(`<div id="tuto" class="tuto" role="dialog" aria-label="Tutoriel"><p class="etape-num">Prise en main · ${k + 1}/${D.tutoriel.length}</p><p>${esc(t.txt)}</p>
      <div class="actions"><button class="btn btn-mini" id="tu-passer">Passer le tutoriel</button><button class="btn" id="tu-ok">${k === D.tutoriel.length - 1 ? "C'est parti !" : "Suivant"}</button></div></div>`);
    document.body.append(b);
    if (cible) { const r = cible.getBoundingClientRect(); b.style.top = Math.min(window.innerHeight - 220, r.bottom + 12) + "px"; b.style.left = Math.max(10, Math.min(window.innerWidth - 380, r.left)) + "px"; }
    $("#tu-ok").focus();
    $("#tu-ok").onclick = () => tutoriel(k + 1);
    $("#tu-passer").onclick = () => tutoriel(99);
  }

  /* ======================================================================
     4. LIEUX (scènes avec objets interactifs)
     ====================================================================== */
  function etatObjet(o) {
    const a = o.action;
    if (a.type === "enigme") {
      if (estResolu(a.id)) return { sym: "✔", mot: "réparé", cls: "ok" };
      if (!estOuvert(a.id)) return { sym: "🔒", mot: "verrouillé", cls: "lock", raison: E[a.id].verrou };
      return { sym: "!", mot: S.vu[a.id] ? "en cours" : "à réparer", cls: "todo" };
    }
    if (a.type === "final") return termine() ? { sym: "✔", mot: "réveillée", cls: "ok" } : finalOuvert() ? { sym: "★", mot: "prête à réveiller", cls: "todo" } : { sym: "🔒", mot: "veille", cls: "lock", raison: `GLADYS se réveillera quand les 9 systèmes seront réparés (${nbResolus()}/9).` };
    if (a.type === "lieu") {
      if (a.lieu === "hub") return { sym: "↩", mot: "", cls: "nav" };
      const ids = D.lieux[a.lieu].enigmes, f = ids.filter(estResolu).length;
      return { sym: f === ids.length ? "✔" : "→", mot: `${f}/${ids.length} réparés`, cls: f === ids.length ? "ok" : "nav" };
    }
    return { sym: "i", mot: "", cls: "info" };
  }
  function ecLieu(l) {
    const objets = SC.OBJETS[l];
    const sec = html(`<section class="lieu">
      <div class="scene" id="scene">${SC[l](etatScene())}
        ${objets.map((o) => { const st = etatObjet(o); return `<button class="hotspot hs-${st.cls}" data-o="${o.id}" style="left:${o.x}%;top:${o.y}%;width:${o.w}%;height:${o.h}%"
            aria-label="${esc(o.label)}${st.mot ? " — " + st.mot : ""}"><span class="hs-anneau" aria-hidden="true">${st.sym}</span><span class="hs-label">${esc(o.label)}${st.mot ? ` · <b>${esc(st.mot)}</b>` : ""}</span></button>`; }).join("")}
      </div>
      <div class="sous-scene">
        <h2 class="h-lieu">${esc(D.lieux[l].nom)}</h2>
        <ul class="objets-liste" aria-label="Objets de ce lieu">${objets.map((o) => { const st = etatObjet(o);
          return `<li><button class="obj-btn obj-${st.cls}" data-o="${o.id}"><span class="obj-sym" aria-hidden="true">${st.sym}</span><span><b>${esc(o.label)}</b>${st.mot ? ` — ${esc(st.mot)}` : ""}${st.raison ? `<span class="obj-raison">${esc(st.raison)}</span>` : ""}</span></button></li>`; }).join("")}</ul>
      </div></section>`);
    app().append(sec);
    $$("[data-o]", sec).forEach((b) => (b.onclick = () => actionObjet(objets.find((o) => o.id === b.dataset.o))));
  }
  function actionObjet(o) {
    const a = o.action; bip("clic");
    if (a.type === "lieu") return aller("lieu", a.lieu);
    if (a.type === "info") return annonce(D.infos[a.cle]);
    if (a.type === "plan") return modalePlan();
    if (a.type === "final") {
      if (termine()) return aller("bilan");
      if (!finalOuvert()) return annonce(`GLADYS est en veille : ${nbResolus()}/9 systèmes réparés. Réparez les autres systèmes, dans l'ordre que vous voulez.`);
      return aller("final");
    }
    if (a.type === "enigme") {
      if (!estOuvert(a.id)) return annonce("🔒 " + E[a.id].verrou);
      return aller("enigme", a.id);
    }
  }
  function modalePlan() {
    modale("Plan de la station", `<div class="plan-liste">${["A", "B", "C"].map((l) => { const L = D.lieux[l];
      return `<div class="plan-secteur"><h3>Secteur ${l} · ${esc(L.nom)}</h3><ul>${L.enigmes.map((id) => `<li>${puce(id)} ${esc(E[id].titre)}${!estOuvert(id) ? ` <span class="petit">— ${esc(E[id].verrou)}</span>` : ""}</li>`).join("")}</ul>
        <button class="btn btn-mini" data-aller="${l}">Aller au secteur ${l}</button></div>`; }).join("")}</div>`,
      (m) => $$("[data-aller]", m).forEach((b) => (b.onclick = () => aller("lieu", b.dataset.aller))));
  }
  function puce(id) {
    if (estResolu(id)) return '<span class="puce ok">✔<span class="sr"> réparé</span></span>';
    if (!estOuvert(id)) return '<span class="puce lock">🔒<span class="sr"> verrouillé</span></span>';
    return S.vu[id] ? '<span class="puce cours">●<span class="sr"> commencé</span></span>' : '<span class="puce">○<span class="sr"> à explorer</span></span>';
  }

  /* ======================================================================
     5. ÉNIGMES : cadre commun
     ====================================================================== */
  function pilotes(id) {
    const n = S.membres.length; if (!n) return "";
    const i = (IDS.indexOf(id) + (S.rotation[id] || 0)) % n;
    if (n === 1) return `<p class="pilotes">Aux commandes : ${badge(S.membres[0], 0, true)}</p>`;
    const j = (i + 1) % n;
    return `<p class="pilotes">Suggestion · aux commandes : ${badge(S.membres[i], i, true)} · copilote : ${badge(S.membres[j], j, true)} <button class="btn btn-mini" id="rot">Changer</button></p>`;
  }
  function ecEnigme(id) {
    const e = E[id], L = D.lieux[e.salle];
    const sec = html(`<section class="enigme">
      <div class="e-barre"><button class="btn btn-sec" id="e-ret">← ${esc(L.nom)}</button>${pilotes(id)}</div>
      <div class="e-tete"><span class="e-id">${id}</span><div><h1>${esc(e.titre)}</h1>
        <p class="e-meta"><span class="tag">${esc(e.statut)}</span><span class="tag">${icone(e.lieu)} ${esc(e.lieu)}</span><span class="tag">${esc(e.notion)}</span></p></div></div>
      <div class="trois">
        <div class="t-bloc t-panne"><h2><span aria-hidden="true">⚠</span> Ce qui ne fonctionne pas</h2><p>${esc(e.panne)}</p></div>
        <div class="t-bloc t-faire"><h2><span aria-hidden="true">✋</span> Ce que vous devez faire</h2><p>${esc(e.afaire)}</p></div>
        <div class="t-bloc t-valider"><h2><span aria-hidden="true">✔</span> Ce que vous validez</h2><p>${esc(e.valider)}</p></div>
      </div>
      <div class="dialogue">${e.recit.map(bulle).join("")}</div>
      ${e.learn ? `<aside class="decouverte"><h2>${esc(e.learn.titre)}</h2><p>${esc(e.learn.txt)}</p></aside>` : ""}
      <div id="e-zone"></div>
      <div class="retour-zone" id="feedback" role="status" aria-live="polite"></div>
      <div class="indices" id="indices"></div>
    </section>`);
    app().append(sec);
    $("#e-ret").onclick = () => aller("lieu", e.salle);
    if ($("#rot")) $("#rot").onclick = () => { S.rotation[id] = (S.rotation[id] || 0) + 1; sauver(); aller("enigme", id); };
    const zone = $("#e-zone");
    if (estResolu(id)) {
      zone.append(html(`<div class="deja"><p><b>✔ Système réparé.</b> ${esc(e.changement)}</p>
        <p>Disquette${e.recompense.length > 1 ? "s" : ""} obtenue${e.recompense.length > 1 ? "s" : ""} : ${e.recompense.map((c) => `<b>${esc(D.cartes[c].nom)}</b>`).join(", ")}.</p></div>`));
      if (e.mission) zone.append(blocMission(e, id, true));
      if (id === "A1") zone.append(html(`<div>${resumeLots()}</div>`));
    } else {
      ({ atelier: puzAtelier, branchement: puzBranchement, champs: puzChamps, recherche: puzRecherche, code: puzCode }[e.type])(e, id, zone);
    }
    blocIndices(e.indices, id, $("#indices"));
  }
  function icone(lieu) { return lieu.includes("papier") ? "✎" : lieu.includes("navigateur") ? "🌐" : lieu.includes("ordinateur") ? "🗂" : "🕹"; }
  function retour(type, msg) { const f = $("#feedback"); f.className = "retour-zone " + type; f.innerHTML = msg; if (type === "ko") bip("ko"); }
  function essai(id) { S.essais[id] = (S.essais[id] || 0) + 1; sauver(); return S.essais[id]; }
  function blocIndices(liste, id, cible) {
    const n = () => S.indices[id] || 0;
    function dessine() {
      cible.innerHTML = `<h2>Indices <span class="petit">(${n()}/3 utilisés)</span></h2>
        <ol>${liste.slice(0, n()).map((t, i) => `<li tabindex="-1"><b>${["Où regarder", "Comment faire", "Coup de pouce décisif"][i]} :</b> ${esc(t)}</li>`).join("")}</ol>
        ${n() < 3 ? `<button class="btn btn-sec">Afficher l'indice ${n() + 1} : ${["où regarder ?", "comment faire ?", "coup de pouce décisif"][n()]}</button>` : ""}`;
      const b = cible.querySelector("button");
      if (b) b.onclick = () => { S.indices[id] = n() + 1; sauver(); bip("clic"); dessine(); cible.querySelector("li:last-child").focus(); };
    }
    dessine();
  }
  function blocMission(e, id, compact) {
    const m = e.mission;
    return html(`<div class="mission">
      <h2>✦ ${esc(m.titre)}</h2>
      ${compact ? `<p>Consigne toujours disponible dans le carnet de mission.</p>` : `
      <p class="sortie"><b>① Quittez momentanément cet onglet</b> ${e.lieu.includes("papier") ? "(ou posez la souris) " : ""}pour :</p>
      <ol>${m.etapes.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
      <p class="sortie"><b>② Revenez ici avec</b> ${esc(m.rapporter)}</p>`}
      ${e.telechargement ? `<p><a class="btn" href="${esc(e.telechargement.fichier)}" download id="dl-${id}">⬇ ${esc(e.telechargement.label)}</a></p>` : ""}
      ${e.relais ? (S.resolu.B2 ? `<p class="petit">La balise s'est cachée : retrouvez-la dans vos favoris ou votre historique.</p>`
        : `<p><a class="btn" href="${esc(e.relais.fichier)}" target="_blank" rel="noopener" id="relais-lien">🌐 ${esc(e.relais.label)}</a></p>`) : ""}
      ${!compact && m.aide ? `<div class="aides">${Object.entries(m.aide).map(([k, v]) => `<details><summary>Aide : ${esc(k)}</summary><p>${esc(v)}</p></details>`).join("")}</div>` : ""}
      ${!compact ? `<p class="petit">Le jeu garde votre progression pendant que vous êtes ailleurs.</p>` : ""}
    </div>`);
  }

  /* ---------- réussite ---------- */
  function reussite(id) {
    const e = E[id];
    S.resolu[id] = { t: Date.now(), essais: S.essais[id] || 1, indices: S.indices[id] || 0, equipage: prenoms() };
    noter(`${id} réparé (équipage : ${listeNoms(prenoms())})`);
    sauver(); bip("ok"); majEntete();
    const ouvertes = IDS.filter((i) => !estResolu(i) && estOuvert(i));
    const debloque = IDS.filter((i) => (E[i].requiert || []).includes(id));
    const zone = $("#e-zone");
    zone.innerHTML = "";
    zone.append(html(`<div class="succes-box">
      <div class="succes-icone">${ART.disquette()}</div>
      <div><h2>✔ Système réparé !</h2><p>${esc(e.succes)}</p>
      <p class="changement"><b>Ce qui a changé dans la station :</b> ${esc(e.changement)}</p>
      <h3>L'imprimante sort ${e.recompense.length > 1 ? "deux disquettes" : "une disquette"} :</h3>
      <ul class="cartes-gagnees">${e.recompense.map((c) => `<li>💾 <b>${esc(D.cartes[c].nom)}</b> — ${esc(D.cartes[c].def)}</li>`).join("")}</ul>
      ${debloque.length ? `<p class="note">🔓 Nouveau : ${debloque.map((i) => esc(E[i].titre)).join(", ")} est maintenant accessible.</p>` : ""}
      <h3>Et maintenant ?</h3>
      <div class="actions">
        <button class="btn" data-suite="lieu:${e.salle}">Voir le changement (${esc(D.lieux[e.salle].nom)})</button>
        ${finalOuvert() ? `<button class="btn btn-grand" data-suite="final">★ Réveiller GLADYS</button>` : ""}
        ${ouvertes.filter((i) => i !== id).slice(0, 3).map((i) => `<button class="btn btn-sec" data-suite="enigme:${i}">${i} · ${esc(E[i].titre)}</button>`).join("")}
        <button class="btn btn-sec" data-suite="lieu:hub">Poste de pilotage</button>
      </div></div></div>`));
    $("#feedback").innerHTML = ""; $("#feedback").className = "retour-zone";
    $$("[data-suite]", zone).forEach((b) => (b.onclick = () => { const [n, p] = b.dataset.suite.split(":"); aller(n, p); }));
    zone.querySelector("[data-suite]").focus();
  }

  /* ======================================================================
     A1 — atelier partagé : lots nominatifs, cartes à déposer dans des bacs
     ====================================================================== */
  let selection = null; // { type, val }
  function resumeLots() {
    return `<ul class="lots-resume">${S.a1.lots.map((l) => `<li>${l.fait ? "✔" : "○"} Lot de <b>${esc(nomLot(l))}</b>${l.membreId && !membre(l.membreId) ? " (ancien membre)" : ""} : ${l.items.map((i) => esc(E.A1.elements[i].nom)).join(", ")}</li>`).join("")}</ul>`;
  }
  function puzAtelier(e, id, zone) {
    if (!S.a1.lots.length) { creerLotsA1(); sauver(); }
    const lotDe = (i) => S.a1.lots.find((l) => l.items.includes(i));
    const wrap = html(`<div class="atelier">
      <div class="atelier-haut"><div class="boulon-etat" id="boulon-etat"></div>
        <p class="aide-geste"><b>Deux façons de jouer :</b> glisser une pièce vers un bac, ou cliquer sur une pièce puis sur un bac. Une pièce déjà rangée peut être reprise tant que son lot n'est pas vérifié.</p></div>
      <div class="lots" id="lots"></div>
      <div class="bacs" id="bacs"></div>
    </div>`);
    zone.append(wrap);
    function boulonEtat() {
      const faits = S.a1.lots.filter((l) => l.fait).reduce((s, l) => s + l.items.length, 0), p = Math.floor(faits / 12 * 6);
      $("#boulon-etat").innerHTML = `<svg viewBox="-70 -50 140 160" aria-hidden="true">${SC.DEFS}<g opacity=".18">${SC.boulonSVG(0, 0, 1, 6, "")}</g>${SC.boulonSVG(0, 0, 1, p, p === 6 ? "salut" : "")}</svg>
        <p><b>Boulon : ${Math.round(faits / 12 * 100)} %</b><br><span class="petit">${faits}/12 pièces vérifiées</span></p>`;
    }
    const carte = (i, dansBac) => {
      const el = e.elements[i], lot = lotDe(i), k = idxMembre(lot.membreId), fait = lot.fait;
      const sel = !!(selection && selection.type === "piece" && selection.val === i);
      const faux = !fait && (S.a1.faux || []).includes(i);
      return `<button class="piece ${sel ? "selection" : ""} ${fait ? "verrouille" : ""} ${faux ? "faux" : ""}" data-piece="${i}" ${fait ? 'aria-disabled="true"' : 'draggable="true"'}
        style="--bc:${COUL[(k < 0 ? 5 : k) % COUL.length]}" aria-pressed="${sel}" aria-label="${esc(el.nom)}, lot de ${esc(nomLot(lot))}${dansBac ? "" : ", pas encore rangée"}${fait ? ", vérifiée" : ""}${faux ? ", à revoir" : ""}">
        <span class="p-ico" aria-hidden="true">${el.ico}</span><span class="p-nom">${esc(el.nom)}</span>${dansBac ? `<span class="p-lot">${esc(nomLot(lot))}</span>` : ""}${fait ? '<span class="p-ok" aria-hidden="true">✔</span>' : ""}${faux ? '<span class="p-ko" aria-hidden="true">✖ à revoir</span>' : ""}</button>`;
    };
    function dessine() {
      boulonEtat();
      $("#lots").innerHTML = S.a1.lots.map((l) => {
        const k = idxMembre(l.membreId), m = membre(l.membreId);
        const ranges = l.items.filter((i) => S.a1.place[i]).length, restants = l.items.filter((i) => !S.a1.place[i]);
        return `<div class="lot ${l.fait ? "lot-fait" : ""}" style="--bc:${COUL[(k < 0 ? 5 : k) % COUL.length]}">
          <div class="lot-tete">${m ? badge(m, k) : `<span class="badge" style="--bc:#999"><span class="b-nom">${esc(l.nom)}</span></span>`}
            <span class="lot-prog">${l.fait ? "✔ lot vérifié" : `${ranges}/${l.items.length} rangées`}</span></div>
          <p class="lot-consigne">${l.fait ? `Lot terminé par ${esc(nomLot(l))}${m ? "" : " (ancien membre)"}.` : `<b>${esc(nomLot(l))}</b>, identifie et range les pièces de ton lot.`}</p>
          <div class="lot-pieces" data-retour="1">${restants.map((i) => carte(i, false)).join("") || (l.fait ? "" : `<span class="petit">Toutes tes pièces sont dans les bacs.</span>`)}</div>
          ${l.fait ? "" : `<button class="btn ${ranges === l.items.length ? "" : "btn-sec"}" data-verif="${l.id}">Vérifier le lot de ${esc(nomLot(l))}</button>`}
        </div>`; }).join("");
      const bac = (b) => `<div class="bac" data-bac="${b.id}"><button class="bac-tete" data-bac-btn="${b.id}"><b>${esc(b.nom)}</b><span class="petit">${esc(b.aide)}</span><span class="bac-deposer">${selection ? "⤓ Déposer ici" : ""}</span></button>
        <div class="bac-pieces">${Object.entries(S.a1.place).filter(([, c]) => c === b.id).map(([i]) => carte(+i, true)).join("")}</div></div>`;
      const B = e.bacs;
      $("#bacs").innerHTML = `${bac(B[0])}<div class="famille"><p class="famille-titre">LOGICIELS <span class="petit">(ce qu'on ne peut pas toucher)</span></p><div class="famille-bacs">${bac(B[1])}${bac(B[2])}</div></div>
        ${selection && S.a1.place[selection.val] ? `<button class="btn btn-sec remettre" data-remettre="1">↩ Remettre la pièce sur l'établi</button>` : ""}`;
      brancher();
    }
    function poser(i, cat) {
      const lot = lotDe(i); if (!lot || lot.fait) return;
      if (cat) S.a1.place[i] = cat; else delete S.a1.place[i];
      S.a1.faux = (S.a1.faux || []).filter((x) => x !== i);
      selection = null; sauver(); bip("pose"); dessine();
      const prochain = $(`#lots [data-piece]`) || $(`[data-verif]`); prochain?.focus();
    }
    function brancher() {
      $$("[data-piece]", wrap).forEach((p) => {
        const i = +p.dataset.piece;
        p.onclick = () => { if (lotDe(i).fait) return; selection = selection && selection.val === i ? null : { type: "piece", val: i }; dessine(); $(`[data-piece="${i}"]`, wrap)?.focus(); };
        p.ondragstart = (ev) => { ev.dataTransfer.setData("text/plain", "piece:" + i); ev.dataTransfer.effectAllowed = "move"; p.classList.add("glisse"); };
        p.ondragend = () => p.classList.remove("glisse");
      });
      $$("[data-bac]", wrap).forEach((b) => {
        b.ondragover = (ev) => { ev.preventDefault(); b.classList.add("survol"); };
        b.ondragleave = () => b.classList.remove("survol");
        b.ondrop = (ev) => { ev.preventDefault(); b.classList.remove("survol"); const d = ev.dataTransfer.getData("text/plain"); if (d.startsWith("piece:")) setTimeout(() => poser(+d.slice(6), b.dataset.bac), 0); };
      });
      $$("[data-bac-btn]", wrap).forEach((b) => (b.onclick = () => { if (selection) poser(selection.val, b.dataset.bacBtn); else retour("info", "Choisis d'abord une pièce (clique dessus), puis clique sur ce bac."); }));
      $$("[data-retour]", wrap).forEach((z) => { z.ondragover = (ev) => ev.preventDefault(); z.ondrop = (ev) => { ev.preventDefault(); const d = ev.dataTransfer.getData("text/plain"); if (d.startsWith("piece:")) poser(+d.slice(6), null); }; });
      $("[data-remettre]", wrap)?.addEventListener("click", () => poser(selection.val, null));
      $$("[data-verif]", wrap).forEach((b) => (b.onclick = () => verifier(S.a1.lots.find((l) => l.id === b.dataset.verif))));
    }
    function verifier(lot) {
      const manque = lot.items.filter((i) => !S.a1.place[i]);
      if (manque.length) { retour("info", `<b>${esc(nomLot(lot))}</b> : il reste ${manque.length} pièce(s) à ranger dans ton lot.`); return; }
      S.a1.essaisLot[lot.id] = (S.a1.essaisLot[lot.id] || 0) + 1; essai("A1");
      const faux = lot.items.filter((i) => S.a1.place[i] !== e.elements[i].cat);
      if (!faux.length) {
        lot.fait = true; lot.nom = nomLot(lot); noter(`A1 : lot de ${lot.nom} vérifié`); sauver(); bip("ok");
        if (S.a1.lots.every((l) => l.fait)) { dessine(); return reussite("A1"); }
        retour("ok", `✔ Lot de <b>${esc(lot.nom)}</b> correct ! Boulon récupère des pièces. ${S.a1.lots.filter((l) => !l.fait).map((l) => esc(nomLot(l))).join(", ")} : à vous !`);
        dessine(); return;
      }
      const msgs = [];
      if (faux.some((i) => e.elements[i].cat === "mat")) msgs.push("Une pièce que l'on peut <b>toucher</b> a été rangée parmi les logiciels.");
      if (faux.some((i) => e.elements[i].cat !== "mat" && S.a1.place[i] === "mat")) msgs.push("Un <b>logiciel</b> (qu'on ne peut pas toucher) a été rangé dans le matériel.");
      if (faux.some((i) => e.elements[i].cat !== "mat" && S.a1.place[i] !== "mat")) msgs.push("Attention à la différence entre <b>système d'exploitation</b> (il démarre l'ordinateur et gère tout) et <b>application</b> (un programme qu'on lance pour une tâche).");
      const deuxieme = S.a1.essaisLot[lot.id] >= 2;
      S.a1.faux = deuxieme ? faux : []; sauver(); dessine();
      retour("ko", `<b>${esc(nomLot(lot))}</b> : ${faux.length} pièce(s) mal rangée(s). ${msgs.join(" ")} ${deuxieme ? "Les pièces à revoir sont marquées « ✖ à revoir »." : "Reprends une pièce pour la déplacer, puis vérifie à nouveau."}`);
    }
    dessine();
    if (S.a1.lots.length && S.a1.lots.every((l) => l.fait)) reussite("A1");
  }

  /* ======================================================================
     B1 — tableau de branchement (associer chaque mot à sa description)
     ====================================================================== */
  function puzBranchement(e, id, zone) {
    if (!S.b1) { S.b1 = Object.assign({}, e.depart); sauver(); }
    let choisi = null;
    const couleurs = ["#e94f37", "#3d7bbf", "#f2b705", "#3f9a5b", "#c45ab3", "#8f8468"];
    const wrap = html(`<div class="branchement">
      <p class="aide-geste"><b>Pour brancher :</b> clique sur un mot (à gauche), puis sur sa description (à droite). Tu peux aussi glisser un mot vers une description. Une description ne peut recevoir qu'un câble.</p>
      <div class="tableau-b" id="tb">
        <svg class="cables" id="cables" aria-hidden="true"></svg>
        <div class="col-g">${e.prises.map((p, i) => `<button class="prise" data-prise="${p.id}" draggable="true" style="--pc:${couleurs[i]}"><span class="fiche" aria-hidden="true"></span><span class="p-mot">${esc(p.mot)}</span><span class="p-etat" id="etat-${p.id}"></span></button>`).join("")}</div>
        <div class="col-d">${e.descriptions.map((d) => `<button class="desc" data-desc="${d.id}"><span class="fiche" aria-hidden="true"></span><span>${esc(d.txt)}</span></button>`).join("")}</div>
      </div>
      <div class="actions"><button class="btn btn-grand" id="b1-test">⚡ Tester le tableau</button><button class="btn btn-sec" id="b1-debr" disabled>Débrancher le mot choisi</button></div>
      <div id="b1-expl"></div></div>`);
    zone.append(wrap);
    const tb = $("#tb", wrap);
    function maj() {
      $$(".prise", wrap).forEach((b) => {
        const pid = b.dataset.prise, d = S.b1[pid];
        b.classList.toggle("choisie", choisi === pid); b.setAttribute("aria-pressed", choisi === pid);
        const desc = d ? e.descriptions.find((x) => x.id === d) : null;
        b.setAttribute("aria-label", `${e.prises.find((p) => p.id === pid).mot} — ${desc ? "branché sur : " + desc.txt : "débranché"}`);
        $("#etat-" + pid, wrap).textContent = d ? "● branché" : "○ débranché";
      });
      $$(".desc", wrap).forEach((b) => {
        const lie = Object.keys(S.b1).find((k) => S.b1[k] === b.dataset.desc);
        b.classList.toggle("libre", !lie);
        b.setAttribute("aria-label", b.textContent.trim() + (lie ? " — reliée à : " + e.prises.find((p) => p.id === lie).mot : " — libre") + (choisi ? ". Appuie pour brancher ici." : ""));
      });
      $("#b1-debr", wrap).disabled = !(choisi && S.b1[choisi]);
      dessineCables();
    }
    function dessineCables() {
      const svg = $("#cables", wrap), r0 = tb.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${r0.width} ${r0.height}`);
      svg.innerHTML = e.prises.map((p, i) => {
        const d = S.b1[p.id]; if (!d) return "";
        const a = $(`[data-prise="${p.id}"] .fiche`, wrap).getBoundingClientRect(), b = $(`[data-desc="${d}"] .fiche`, wrap).getBoundingClientRect();
        const x1 = a.left + a.width / 2 - r0.left, y1 = a.top + a.height / 2 - r0.top, x2 = b.left + b.width / 2 - r0.left, y2 = b.top + b.height / 2 - r0.top;
        const mx = (x1 + x2) / 2;
        return `<path d="M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" stroke="#1d1a14" stroke-width="9" fill="none" opacity=".35"/><path d="M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" stroke="${couleurs[i]}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      }).join("");
    }
    function brancher(pid, did) {
      Object.keys(S.b1).forEach((k) => { if (S.b1[k] === did) S.b1[k] = null; });
      S.b1[pid] = did; choisi = null; sauver(); bip("pose"); maj();
      $(`[data-prise="${pid}"]`, wrap).focus();
    }
    $$(".prise", wrap).forEach((b) => {
      b.onclick = () => { choisi = choisi === b.dataset.prise ? null : b.dataset.prise; maj(); };
      b.ondragstart = (ev) => { ev.dataTransfer.setData("text/plain", "prise:" + b.dataset.prise); choisi = b.dataset.prise; };
    });
    $$(".desc", wrap).forEach((b) => {
      b.onclick = () => { if (!choisi) { retour("info", "Choisis d'abord un mot à gauche, puis clique sur sa description."); return; } brancher(choisi, b.dataset.desc); };
      b.ondragover = (ev) => ev.preventDefault();
      b.ondrop = (ev) => { ev.preventDefault(); const d = ev.dataTransfer.getData("text/plain"); if (d.startsWith("prise:")) brancher(d.slice(6), b.dataset.desc); };
    });
    $("#b1-debr", wrap).onclick = () => { if (choisi) { S.b1[choisi] = null; sauver(); maj(); } };
    $("#b1-test", wrap).onclick = () => {
      const vides = e.prises.filter((p) => !S.b1[p.id]);
      if (vides.length) { retour("info", `Il reste ${vides.length} câble(s) débranché(s) : ${vides.map((p) => esc(p.mot)).join(", ")}.`); return; }
      const n = essai(id);
      const faux = e.prises.filter((p) => e.descriptions.find((d) => d.id === S.b1[p.id]).bonne !== p.id);
      $$(".prise", wrap).forEach((b) => b.classList.toggle("faux", n >= 2 && faux.some((p) => p.id === b.dataset.prise)));
      if (!faux.length) { $("#b1-expl", wrap).innerHTML = ""; return reussite(id); }
      $("#b1-expl", wrap).innerHTML = n >= 2 ? `<ul class="expl">${faux.map((p) => `<li>✖ <b>${esc(p.mot)}</b> : ${esc(e.explications[p.id])}</li>`).join("")}</ul>` : "";
      retour("ko", `<b>Test du tableau : ${faux.length} câble(s) mal branché(s).</b> ${n >= 2 ? "Les mots concernés sont marqués ✖, avec une explication." : "Pour chaque mot, demande-toi : est-ce un réseau, des pages, un logiciel, un site ou un service ?"}`);
    };
    window.addEventListener("resize", dessineCables);
    maj(); requestAnimationFrame(dessineCables);
  }

  /* ======================================================================
     Énigmes à champs (A2, B2, C1, C2, C4)
     ====================================================================== */
  function puzChamps(e, id, zone) {
    const sv = S.saisies[id] || {};
    if (e.mission) zone.append(blocMission(e, id, false));
    if (e.pixels) zone.append(html(`<div class="codes-pixels"><h2>Ce qu'affiche l'écran en panne</h2>
      <table class="t-pixels"><caption>10 lignes de 10 pixels · 1 = allumé · 0 = éteint</caption>
      ${e.pixels.map((l, i) => `<tr><th scope="row">Ligne ${i + 1}</th><td>${l.split("").join(" ")}</td></tr>`).join("")}</table>
      <p class="petit">Ces codes sont aussi sur la fiche de mission (grille C1). Colorier la grille sur papier est bien plus facile que de compter de tête !</p></div>`));
    if (e.carte) zone.append(html(`<div class="algo-wrap"><div><h2>Carte de la soute</h2>${carteHTML(e.carte)}</div>
      <div><h2>Programme de Boulon</h2>${progHTML(e.programme)}<p class="petit">Départ : case ★, Boulon regarde vers le HAUT. Carte et programme identiques sur la fiche (C2).</p></div></div>`));
    const f = html(`<form class="champs" novalidate>
      ${e.champs.map((c) => c.type === "choix"
        ? `<fieldset class="champ"><legend>${esc(c.label)}</legend>${c.options.map((o, i) => `<label><input type="radio" name="${c.id}" value="${i}" ${sv[c.id] == i ? "checked" : ""}> ${esc(o)}</label>`).join("")}</fieldset>`
        : `<div class="champ"><label for="ch-${c.id}">${esc(c.label)}</label><input id="ch-${c.id}" name="${c.id}" autocomplete="off" value="${esc(sv[c.id] || "")}"></div>`).join("")}
      <button class="btn btn-grand" type="submit">Valider</button></form>`);
    zone.append(f);
    const garde = (ev) => { sv[ev.target.name] = ev.target.value; S.saisies[id] = sv; sauver(); };
    f.addEventListener("input", garde); f.addEventListener("change", garde);
    f.onsubmit = (ev) => {
      ev.preventDefault();
      const vides = e.champs.filter((c) => !String(sv[c.id] ?? "").trim());
      if (vides.length) { retour("info", "Complète d'abord : " + vides.map((c) => esc(c.label)).join(", ") + "."); return; }
      essai(id);
      const msgs = []; let tout = true;
      e.champs.forEach((c) => {
        let ok, piege;
        if (c.type === "choix") ok = Number(sv[c.id]) === c.bonne;
        else { const h = H(sv[c.id]); ok = c.ok.includes(h); piege = c.pieges && c.pieges[h]; }
        const el = f.querySelector(`[name="${c.id}"]`).closest(".champ");
        el.classList.toggle("faux", !ok); el.classList.toggle("bon", ok);
        if (!ok) { tout = false; msgs.push(`<li><b>${esc(c.label)}</b> : ${piege ? esc(piege) : "ce n'est pas encore ça. Vérifiez votre démarche ou demandez un indice."}</li>`); }
      });
      if (tout) return reussite(id);
      retour("ko", `<ul>${msgs.join("")}</ul><p class="petit">Les réponses correctes sont marquées « ✔ correct ». Majuscules, accents et espaces n'ont pas d'importance.</p>`);
    };
  }
  function carteHTML(c) {
    return `<table class="carte" aria-label="Carte de la soute, 7 colonnes et 7 lignes">${c.map((l) => `<tr>${l.split("").map((x) => `<td class="${x === "*" ? "depart" : ""}">${x === "*" ? "★" : x}</td>`).join("")}</tr>`).join("")}</table>`;
  }
  const NOMB = { avancer: "avancer", gauche: "tourner à gauche ↺", droite: "tourner à droite ↻" };
  function progHTML(p) {
    return `<ol class="prog">${p.map((b) => b.t === "repeter" ? `<li class="b-rep">répéter ${b.n} fois${progHTML(b.corps)}</li>` : `<li class="b-${b.t}">${NOMB[b.t]}</li>`).join("")}</ol>`;
  }

  /* ======================================================================
     B3 — QUESTOR
     ====================================================================== */
  function puzRecherche(e, id, zone) {
    const Q = D.questor, sv = S.saisies[id] || {};
    const tok = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’\-]/g, " ").split(/[^a-z0-9]+/).filter((t) => t && !Q.motsVides.includes(t));
    const proche = (a, b) => a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5)) || (a.length >= 4 && b.length >= 4 && a.slice(0, 4) === b.slice(0, 4) && Math.abs(a.length - b.length) <= 3);
    zone.append(html(`<div><div class="navig" role="region" aria-label="Navigateur de la station">
        <div class="navig-barre"><span class="navig-pts" aria-hidden="true">● ● ●</span><span class="navig-url" id="q-url">https://questor.neon86.space</span></div>
        <div class="navig-corps" id="q-corps"></div></div>
      <form class="champs" id="ch-form" novalidate>
        <fieldset class="champ" id="q-choix"><legend>${esc(e.choixMultiple.question)}</legend>
          ${e.choixMultiple.options.map((o, i) => `<label><input type="checkbox" name="cm" value="${i}" ${(sv.cm || []).includes(i) ? "checked" : ""}> ${esc(o.txt)}</label>`).join("")}</fieldset>
        ${e.champs.map((c) => `<div class="champ"><label for="ch-${c.id}">${esc(c.label)}</label><input id="ch-${c.id}" name="${c.id}" autocomplete="off" value="${esc(sv[c.id] || "")}"></div>`).join("")}
        <button class="btn btn-grand" type="submit">Valider</button></form></div>`));
    const corps = $("#q-corps"), url = $("#q-url");
    function accueil(q) {
      url.textContent = "https://questor.neon86.space" + (q ? "/recherche?q=" + encodeURIComponent(q).replace(/%20/g, "+") : "");
      corps.innerHTML = `<div class="questor"><p class="q-logo">QUESTOR<span>moteur de recherche de la station</span></p>
        <form id="q-f" class="q-f" role="search"><label for="q-in" class="sr">Mots-clés</label><input id="q-in" placeholder="Tape tes mots-clés…" value="${esc(q || "")}" autocomplete="off"><button class="btn" type="submit">Rechercher</button></form>
        <div id="q-res"></div></div>`;
      $("#q-f").onsubmit = (ev) => { ev.preventDefault(); cherche($("#q-in").value); };
      if (q) cherche(q, true);
    }
    function cherche(q, silencieux) {
      sv.derniere = q; S.saisies[id] = sv; sauver();
      url.textContent = "https://questor.neon86.space/recherche?q=" + encodeURIComponent(q).replace(/%20/g, "+");
      const t = tok(q), r = $("#q-res");
      if (!t.length) { r.innerHTML = `<p class="q-msg">QUESTOR attend des mots-clés. Les petits mots (le, de, à…) ne comptent pas.</p>`; return; }
      const res = Q.pages.map((p, i) => ({ p, i, sc: t.filter((x) => p.mots.some((m) => proche(x, m))).length })).filter((x) => x.sc > 0).sort((a, b) => b.sc - a.sc || a.i - b.i).slice(0, 4);
      let msg = t.length > 6 ? `<p class="q-msg">Beaucoup de mots ! Quelques mots-clés courts et précis suffisent souvent.</p>` : "";
      if (!res.length) { r.innerHTML = msg + `<p class="q-msg">Aucun résultat pour « ${esc(q)} ». Essaie d'autres mots-clés.</p>`; return; }
      if (res[0].sc === 1 && t.length === 1) msg += `<p class="q-msg">Un seul mot-clé : les résultats sont très variés. Ajoute un mot plus précis ?</p>`;
      r.innerHTML = msg + `<p class="q-nb">${res.length} premiers résultats</p><ol class="q-liste">${res.map((x) => `<li>
        <a href="#" data-p="${x.i}" class="q-titre">${esc(x.p.titre)}</a>
        <span class="q-url ${x.p.url.startsWith("https") ? "sur" : "pas-sur"}">${x.p.url.startsWith("https") ? "🔒" : "⚠"} ${esc(x.p.url)}</span>
        <span class="q-res">${esc(x.p.resume)}</span></li>`).join("")}</ol>`;
      $$("[data-p]", r).forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); page(+a.dataset.p, q); }));
      if (!silencieux) bip("clic");
    }
    function page(i, q) {
      const p = Q.pages[i], sur = p.url.startsWith("https");
      url.innerHTML = `<span class="${sur ? "sur" : "pas-sur"}">${sur ? "🔒" : "⚠ Non sécurisé"}</span> ${esc(p.url)}`;
      corps.innerHTML = `<div class="q-page"><button class="btn btn-sec" id="q-back">← Retour aux résultats</button><h3>${esc(p.titre)}</h3>${p.contenu}</div>`;
      $("#q-back").onclick = () => accueil(q); $("#q-back").focus();
    }
    accueil(sv.derniere || "");
    const f = $("#ch-form");
    f.addEventListener("input", (ev) => { if (ev.target.name !== "cm") { sv[ev.target.name] = ev.target.value; S.saisies[id] = sv; sauver(); } });
    f.addEventListener("change", (ev) => { if (ev.target.name === "cm") { sv.cm = $$("[name=cm]:checked", f).map((x) => +x.value); S.saisies[id] = sv; sauver(); } });
    f.onsubmit = (ev) => {
      ev.preventDefault();
      const c = e.champs[0];
      if (!String(sv[c.id] || "").trim()) { retour("info", "Notez d'abord l'heure trouvée."); return; }
      essai(id);
      const coch = sv.cm || [], cmOk = e.choixMultiple.options.every((o, i) => o.ok === coch.includes(i));
      const h = H(sv[c.id]), hOk = c.ok.includes(h), msgs = [];
      $("#q-choix", f).classList.toggle("faux", !cmOk); $("#q-choix", f).classList.toggle("bon", cmOk);
      $("#ch-" + c.id, f).closest(".champ").classList.toggle("faux", !hOk); $("#ch-" + c.id, f).closest(".champ").classList.toggle("bon", hOk);
      if (!hOk) msgs.push(`<li><b>Heure</b> : ${esc((c.pieges && c.pieges[h]) || "ce n'est pas l'heure donnée par une source fiable. Lisez bien les pages ouvertes.")}</li>`);
      if (!cmOk) { const pg = e.choixMultiple.options.filter((o, i) => !o.ok && coch.includes(i)); msgs.push(`<li><b>Indices de fiabilité</b> : ${pg.length ? "attention, « " + esc(pg[0].txt) + " » ne prouve rien sur la fiabilité d'un site." : "il manque au moins un indice. Relisez la page « COMÈTE GRATUITE » et son adresse."}</li>`); }
      if (hOk && cmOk) return reussite(id);
      retour("ko", `<ul>${msgs.join("")}</ul>`);
    };
  }

  /* ======================================================================
     C3 — piste de programmation (insérer, déplacer, supprimer)
     ====================================================================== */
  function puzCode(e, id, zone) {
    const G = e.grille, max = e.maxBlocs;
    let prog = JSON.parse(JSON.stringify(S.c3 || []));
    let sel = null; // { src: "palette", t } ou { src: "piste", chemin: [i] | [i, j] }
    const wrap = html(`<div class="code-wrap">
      <div><div class="grille-robot" id="gr" style="--l:${G.l}" aria-label="Soute : Boulon doit rejoindre la borne de recharge"></div>
        <p class="petit legende">🤖 Boulon (flèche = où il regarde) · ⚡ borne · ▦ caisse</p></div>
      <div class="editeur">
        <h2>Blocs disponibles</h2>
        <div class="palette" id="palette">
          ${[["avancer", "avancer"], ["gauche", "tourner à gauche ↺"], ["droite", "tourner à droite ↻"], ["repeter", "répéter … fois"]].map(([t, n]) => `<button class="bloc b-${t}" data-pal="${t}" draggable="true">${n}</button>`).join("")}
        </div>
        <p class="aide-geste"><b>Glisse</b> un bloc dans la piste, ou <b>clique</b> sur un bloc puis sur « ＋ insérer ici ». Un bloc de la piste peut être déplacé de la même façon.</p>
        <h2>Piste du programme <span id="cpt" class="petit"></span></h2>
        <div id="piste" class="piste" aria-live="polite"></div>
        <div class="actions"><button class="btn btn-sec" id="vider">Tout effacer</button><button class="btn btn-grand" id="exec">▶ Exécuter</button></div>
      </div></div>`);
    zone.append(wrap);
    const gr = $("#gr", wrap);
    const dirs = { N: [0, -1], E: [1, 0], S: [0, 1], O: [-1, 0] }, ordre = ["N", "E", "S", "O"], fl = { N: "↑", E: "→", S: "↓", O: "←" };
    const caisse = (x, y) => G.caisses.some(([a, b]) => a === x && b === y);
    function grille(pos, dir, trace, boum) {
      let h = "";
      for (let y = 0; y < G.h; y++) for (let x = 0; x < G.l; x++) {
        const r = pos && pos[0] === x && pos[1] === y, a = G.arrivee[0] === x && G.arrivee[1] === y, t = trace && trace.some(([p, q]) => p === x && q === y);
        h += `<div class="case ${caisse(x, y) ? "caisse" : ""} ${t ? "trace" : ""} ${r && boum ? "boum" : ""}">${r ? `<span class="robot">🤖<span class="dir">${fl[dir]}</span></span>` : a ? "⚡" : caisse(x, y) ? "▦" : ""}</div>`;
      }
      gr.innerHTML = h;
    }
    const compte = (p) => p.reduce((s, b) => s + 1 + (b.t === "repeter" ? compte(b.corps) : 0), 0);
    const liste = (ch) => ch.length ? prog[ch[0]].corps : prog; // chemin de liste : [] ou [i]
    function retire(chemin) { const l = chemin.length === 1 ? prog : prog[chemin[0]].corps; return l.splice(chemin[chemin.length - 1], 1)[0]; }
    function insere(bloc, listeCh, idx) {
      if (bloc.t === "repeter" && listeCh.length) { retour("info", "Une boucle « répéter » ne peut pas être placée dans une autre boucle ici."); return false; }
      liste(listeCh).splice(idx, 0, bloc); return true;
    }
    function deposer(listeCh, idx) {
      if (!sel) return;
      if (sel.src === "palette") {
        const b = sel.t === "repeter" ? { t: "repeter", n: 3, corps: [] } : { t: sel.t };
        if (!insere(b, listeCh, idx)) return;
      } else {
        const src = sel.chemin;
        const srcListe = src.length === 1 ? [] : [src[0]];
        if (src.length === 1 && listeCh.length && listeCh[0] === src[0]) { retour("info", "On ne peut pas placer une boucle à l'intérieur d'elle-même."); return; }
        let i = idx, lc = listeCh.slice();
        if (JSON.stringify(srcListe) === JSON.stringify(lc) && src[src.length - 1] < idx) i--;
        if (src.length === 1 && lc.length && src[0] < lc[0]) lc = [lc[0] - 1];
        const b = retire(src);
        if (!insere(b, lc, i)) { insere(b, srcListe, src[src.length - 1]); }
      }
      sel = null; bip("pose"); dessine();
    }
    function slot(listeCh, idx) { return `<button class="slot ${sel ? "actif" : ""}" data-slot="${listeCh.join(",")}|${idx}" aria-label="Insérer ici${listeCh.length ? " dans la boucle" : ""}, position ${idx + 1}">＋ insérer ici</button>`; }
    function blocHTML(b, chemin) {
      const c = chemin.join(","), s = sel && sel.src === "piste" && sel.chemin.join(",") === c;
      const outils = `<span class="b-outils"><button class="mini" data-haut="${c}" aria-label="Monter ce bloc">↑</button><button class="mini" data-bas="${c}" aria-label="Descendre ce bloc">↓</button><button class="mini" data-suppr="${c}" aria-label="Supprimer ce bloc">✕</button></span>`;
      if (b.t === "repeter") return `<li class="pb b-rep ${s ? "selection" : ""}"><div class="pb-ligne"><button class="pb-nom" data-sel="${c}" draggable="true" aria-pressed="${s}">répéter</button>
          <label class="sr" for="n-${c}">Nombre de répétitions</label><select id="n-${c}" data-n="${c}">${[2, 3, 4, 5].map((n) => `<option ${n === b.n ? "selected" : ""}>${n}</option>`).join("")}</select> fois ${outils}</div>
          <ol class="corps">${b.corps.map((x, j) => slot([chemin[0]], j) + blocHTML(x, [chemin[0], j])).join("")}${slot([chemin[0]], b.corps.length)}</ol></li>`;
      return `<li class="pb b-${b.t} ${s ? "selection" : ""}"><div class="pb-ligne"><button class="pb-nom" data-sel="${c}" draggable="true" aria-pressed="${s}">${NOMB[b.t]}</button>${outils}</div></li>`;
    }
    function dessine() {
      $("#piste", wrap).innerHTML = `<ol class="piste-liste">${prog.map((b, i) => slot([], i) + blocHTML(b, [i])).join("")}${slot([], prog.length)}</ol>${prog.length ? "" : `<p class="petit">Piste vide : ajoute un premier bloc.</p>`}`;
      const n = compte(prog);
      $("#cpt", wrap).textContent = `(${n} / ${max} blocs)`; $("#cpt", wrap).className = n > max ? "petit rouge" : "petit";
      $$("[data-pal]", wrap).forEach((b) => b.classList.toggle("selection", !!(sel && sel.src === "palette" && sel.t === b.dataset.pal)));
      S.c3 = prog; sauver(); lier();
    }
    const parse = (c) => c.split(",").filter((x) => x !== "").map(Number);
    function lier() {
      $$("[data-pal]", wrap).forEach((b) => {
        b.onclick = () => { sel = sel && sel.src === "palette" && sel.t === b.dataset.pal ? null : { src: "palette", t: b.dataset.pal }; dessine(); $(".slot", wrap)?.focus(); };
        b.ondragstart = (ev) => { ev.dataTransfer.setData("text/plain", "x"); sel = { src: "palette", t: b.dataset.pal }; $$(".slot", wrap).forEach((s) => s.classList.add("actif")); };
      });
      $$("[data-sel]", wrap).forEach((b) => {
        b.onclick = () => { const c = parse(b.dataset.sel); sel = sel && sel.src === "piste" && sel.chemin.join(",") === c.join(",") ? null : { src: "piste", chemin: c }; dessine(); };
        b.ondragstart = (ev) => { ev.dataTransfer.setData("text/plain", "x"); sel = { src: "piste", chemin: parse(b.dataset.sel) }; $$(".slot", wrap).forEach((s) => s.classList.add("actif")); };
      });
      $$("[data-slot]", wrap).forEach((s) => {
        const [lc, i] = s.dataset.slot.split("|");
        s.onclick = () => deposer(parse(lc), +i);
        s.ondragover = (ev) => { ev.preventDefault(); s.classList.add("survol"); };
        s.ondragleave = () => s.classList.remove("survol");
        s.ondrop = (ev) => { ev.preventDefault(); setTimeout(() => deposer(parse(lc), +i), 0); };
      });
      $$("[data-suppr]", wrap).forEach((b) => (b.onclick = () => { retire(parse(b.dataset.suppr)); sel = null; dessine(); }));
      $$("[data-haut],[data-bas]", wrap).forEach((b) => (b.onclick = () => {
        const c = parse(b.dataset.haut ?? b.dataset.bas), l = c.length === 1 ? prog : prog[c[0]].corps, i = c[c.length - 1], j = i + (b.dataset.haut !== undefined ? -1 : 1);
        if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; dessine();
      }));
      $$("[data-n]", wrap).forEach((s) => (s.onchange = () => { prog[+s.dataset.n].n = +s.value; dessine(); }));
    }
    $("#vider", wrap).onclick = () => { if (prog.length && !confirm("Effacer tout le programme ?")) return; prog = []; sel = null; dessine(); grille(G.depart, G.dir); retour("", ""); };
    let enCours = false;
    $("#exec", wrap).onclick = async () => {
      if (enCours) return;
      if (!prog.length) { retour("info", "La piste est vide."); return; }
      const n = compte(prog);
      if (n > max) { retour("ko", `Le programme utilise ${n} blocs, mais la mémoire de Boulon n'en retient que ${max}. Une boucle « répéter » peut remplacer des blocs qui se répètent.`); return; }
      if (prog.some((b) => b.t === "repeter" && !b.corps.length)) { retour("info", "Une boucle « répéter » est vide : place des blocs à l'intérieur."); return; }
      essai(id); enCours = true;
      const plat = []; const deplie = (p) => p.forEach((b) => b.t === "repeter" ? Array.from({ length: b.n }, () => deplie(b.corps)) : plat.push(b.t)); deplie(prog);
      let pos = [...G.depart], dir = G.dir; const trace = [[...pos]];
      const lent = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      grille(pos, dir, trace);
      for (const t of plat) {
        if (t === "gauche") dir = ordre[(ordre.indexOf(dir) + 3) % 4];
        else if (t === "droite") dir = ordre[(ordre.indexOf(dir) + 1) % 4];
        else {
          const np = [pos[0] + dirs[dir][0], pos[1] + dirs[dir][1]];
          if (np[0] < 0 || np[1] < 0 || np[0] >= G.l || np[1] >= G.h || caisse(np[0], np[1])) {
            grille(pos, dir, trace, true); enCours = false;
            retour("ko", `<b>BONK !</b> Boulon a heurté ${caisse(np[0], np[1]) ? "une caisse" : "le mur de la soute"} après ${trace.length - 1} déplacement(s). Regarde où il s'est arrêté (case rouge) et corrige la piste.`); return;
          }
          pos = np; trace.push([...pos]);
        }
        grille(pos, dir, trace);
        if (lent) await new Promise((r) => setTimeout(r, 240));
      }
      enCours = false;
      if (pos[0] === G.arrivee[0] && pos[1] === G.arrivee[1]) return reussite(id);
      retour("ko", "Programme terminé, mais Boulon n'est pas sur la borne ⚡. Compare le chemin parcouru (cases colorées) avec le passage libre.");
    };
    dessine(); grille(G.depart, G.dir);
  }

  /* ======================================================================
     FINALE — disquettes à insérer dans la console de GLADYS
     ====================================================================== */
  function ecFinal() {
    if (!finalOuvert()) { aller("lieu", "hub"); return; }
    const F = D.final, cartes = Object.keys(D.cartes);
    let sel = null;
    app().append(html(`<section class="enigme final">
      <div class="e-barre"><button class="btn btn-sec" id="f-ret">← Poste de pilotage</button>
        <p class="pilotes">Toute l'équipe : ${S.membres.map((m, i) => badge(m, i, true)).join(" ")}</p></div>
      <div class="e-tete"><span class="e-id">★</span><div><h1>${esc(F.titre)}</h1><p class="e-meta"><span class="tag">Mission finale</span><span class="tag">Synthèse des 9 réparations</span></p></div></div>
      <div class="trois">
        <div class="t-bloc t-panne"><h2>⚠ Ce qui ne fonctionne pas</h2><p>${esc(F.panne)}</p></div>
        <div class="t-bloc t-faire"><h2>✋ Ce que vous devez faire</h2><p>${esc(F.afaire)}</p></div>
        <div class="t-bloc t-valider"><h2>✔ Ce que vous validez</h2><p>${esc(F.valider)}</p></div></div>
      <div class="dialogue">${F.recit.map(bulle).join("")}</div>
      <div id="f-zone"></div>
      <div class="retour-zone" id="feedback" role="status" aria-live="polite"></div>
      <div class="indices" id="indices"></div>
      <div id="f-signal"></div></section>`));
    $("#f-ret").onclick = () => aller("lieu", "hub");
    const z = $("#f-zone");
    if (S.finalOk) z.innerHTML = `<div class="deja"><p><b>✔ Mémoire de démarrage reconstruite.</b> GLADYS est réveillée. Il reste le signal d'amarrage.</p></div>`;
    else {
      const dessine = () => {
        const places = Object.values(S.final.slots);
        z.innerHTML = `<div class="console-g">
          <div class="disquettes" data-zone-retour="1"><h2>Vos disquettes <span class="petit">(${cartes.filter((c) => !places.includes(c)).length} à insérer)</span></h2>
            ${cartes.filter((c) => !places.includes(c)).map((c) => `<button class="disq ${sel === c ? "selection" : ""}" data-disq="${c}" draggable="true" aria-pressed="${sel === c}"><span aria-hidden="true">💾</span> ${esc(D.cartes[c].nom)}</button>`).join("") || `<p class="petit">Toutes les disquettes sont insérées.</p>`}
          </div>
          <ol class="fentes">${F.lignes.map((l, i) => { const c = S.final.slots[i];
            return `<li class="fente-ligne" id="ml-${i}"><span>${esc(l.avant)}</span>
              <button class="fente ${c ? "pleine" : ""}" data-fente="${i}" aria-label="Fente ${i + 1}${c ? " : " + esc(D.cartes[c].nom) + ". Appuie pour la retirer ou la remplacer" : " vide"}">${c ? `💾 ${esc(D.cartes[c].nom)}` : sel ? "⤓ insérer ici" : "fente vide"}</button>
              <span>${esc(l.apres)}</span></li>`; }).join("")}</ol>
          <button class="btn btn-grand" id="f-go">Lancer le démarrage</button></div>`;
        $$("[data-disq]", z).forEach((b) => {
          b.onclick = () => { sel = sel === b.dataset.disq ? null : b.dataset.disq; dessine(); $(".fente:not(.pleine)", z)?.focus(); };
          b.ondragstart = (ev) => { ev.dataTransfer.setData("text/plain", "disq:" + b.dataset.disq); };
        });
        $$("[data-fente]", z).forEach((f) => {
          const i = f.dataset.fente;
          f.onclick = () => {
            if (sel) { const ancien = S.final.slots[i]; S.final.slots[i] = sel; sel = ancien || null; bip("pose"); if (ancien) retour("info", `La disquette « ${esc(D.cartes[ancien].nom)} » est revenue dans ta main : clique sur une autre fente pour l'insérer.`); }
            else if (S.final.slots[i]) { sel = S.final.slots[i]; delete S.final.slots[i]; }
            else { retour("info", "Choisis d'abord une disquette, puis clique sur une fente."); return; }
            sauver(); dessine(); $(`[data-fente="${i}"]`, z).focus();
          };
          f.ondragover = (ev) => ev.preventDefault();
          f.ondrop = (ev) => { ev.preventDefault(); const d = ev.dataTransfer.getData("text/plain"); if (d.startsWith("disq:")) { S.final.slots[i] = d.slice(5); sauver(); bip("pose"); dessine(); } };
        });
        $("#f-go", z).onclick = () => {
          if (F.lignes.some((_, i) => !S.final.slots[i])) { retour("info", "Insérez une disquette dans chacune des 11 fentes."); return; }
          essai("FINAL");
          const faux = F.lignes.map((l, i) => S.final.slots[i] === l.carte ? -1 : i).filter((i) => i >= 0);
          F.lignes.forEach((_, i) => { $("#ml-" + i).classList.toggle("faux", faux.includes(i)); $("#ml-" + i).classList.toggle("bon", !faux.includes(i)); });
          if (faux.length) { retour("ko", `GLADYS : « ${faux.length} phrase(s) me donnent mal au processeur. » Les phrases à revoir sont marquées « ✖ à revoir ». Cliquez sur une fente pour reprendre sa disquette.`); return; }
          S.finalOk = true; noter("Mémoire de démarrage reconstruite"); sauver(); bip("ok"); aller("final");
        };
      };
      dessine();
      blocIndices(F.indices, "FINAL", $("#indices"));
    }
    if (S.finalOk) {
      const sg = F.signal;
      $("#f-signal").append(html(`<div><div class="mission"><h2>✦ ${esc(sg.titre)}</h2>
        <p class="sortie"><b>① Quittez momentanément cet onglet</b> : ouvrez la balise relais depuis vos favoris (ou l'historique) et lisez le titre de son onglet.</p>
        <p>${esc(sg.txt)}</p><p class="sortie"><b>② Revenez ici avec</b> le nom de la balise.</p>
        <form id="sg-form" class="champs" novalidate><div class="champ"><label for="sg-in">${esc(sg.label)}</label><input id="sg-in" autocomplete="off" value="${esc(S.saisies.SIGNAL || "")}"></div>
        <button class="btn btn-grand" type="submit">Envoyer le signal</button></form></div><div class="indices" id="indices2"></div></div>`));
      $("#sg-in").oninput = (ev) => { S.saisies.SIGNAL = ev.target.value; sauver(); };
      $("#sg-form").onsubmit = (ev) => {
        ev.preventDefault();
        const v = $("#sg-in").value; if (!v.trim()) { retour("info", "Écrivez le nom de la balise."); return; }
        essai("SIGNAL");
        if (sg.ok.includes(H(v))) { S.signalOk = true; S.fin = Date.now(); noter("Signal d'amarrage envoyé"); sauver(); bip("fin"); aller("fin"); }
        else retour("ko", "Signal refusé. Ce nom ne correspond pas à la balise. Il est écrit sur l'ONGLET de la page de la balise, pas sur la page elle-même.");
      };
      blocIndices(sg.indices, "SIGNAL", $("#indices2"));
    }
  }

  /* ---------- conclusion visuelle ---------- */
  function ecFin() {
    app().append(html(`<section class="fin-ecran">
      <div class="scene fin-scene">${SC.hub(etatScene())}<div class="fin-bandeau">AMARRAGE RÉUSSI · 16 h 45 (heure de bord)</div></div>
      <div class="panneau">
        <h1>NÉON-86 est remise en service !</h1>
        <div class="dialogue">${D.final.succes.map(bulle).join("")}</div>
        <p class="merci">L'Agence orbitale remercie l'équipe de maintenance : ${S.membres.map((m, i) => badge(m, i)).join(" ")}</p>
        <div class="actions"><button class="btn btn-grand" id="fin-b">Faire notre bilan</button><button class="btn btn-sec" id="fin-v">Revoir la station</button></div>
      </div></section>`));
    $("#fin-b").onclick = () => aller("bilan");
    $("#fin-v").onclick = () => aller("lieu", "hub");
  }

  /* ---------- bilan ---------- */
  function ecBilan() {
    const B = D.bilan;
    const tInd = Object.values(S.indices).reduce((a, b) => a + b, 0);
    const duree = S.fin && S.debut ? Math.round((S.fin - S.debut) / 60000) : null;
    const code = `N86-${nbResolus()}${termine() ? "F" : "x"}-J${S.membres.length}-I${tInd}-${H(prenoms().join("|") + tInd + nbResolus()).slice(0, 3).toUpperCase()}`;
    app().append(html(`<section class="panneau bilan">
      <button class="btn btn-sec noprint" id="b-ret">← Poste de pilotage</button>
      <h1>Bilan de mission</h1>
      <p class="equipe-intro">${S.membres.map((m, i) => badge(m, i)).join(" ")}</p>
      <p>${termine() ? "Mission accomplie : NÉON-86 est rallumée et le vaisseau COMÈTE est amarré." : `Mission en cours : ${nbResolus()}/9 systèmes réparés.`} ${duree ? `Temps de jeu réel : ${duree} min.` : ""} Indices utilisés : ${tInd}.</p>
      <p><b>Code de fin à montrer au professeur : <span class="code-fin">${code}</span></b></p>
      <h2>Les notions utilisées</h2>
      <table class="t-bilan"><thead><tr><th>Système</th><th>Notion</th><th>Essais</th><th>Indices</th></tr></thead><tbody>
        ${IDS.map((id) => { const r = S.resolu[id] || {}; return `<tr><td>${estResolu(id) ? "✔" : "○"} ${id} · ${esc(E[id].titre)}</td><td>${esc(E[id].notion)}</td><td>${r.essais || "—"}</td><td>${S.indices[id] || 0}</td></tr>`; }).join("")}
      </tbody></table>
      ${S.a1.lots.length ? `<h3>Atelier de Boulon : lots vérifiés</h3>${resumeLots()}<p class="petit">Le jeu enregistre quel lot a été vérifié, pas qui tenait la souris.</p>` : ""}
      <h2>Vos disquettes</h2>
      <dl class="def-liste">${cartesGagnees().map((c) => `<dt>💾 ${esc(D.cartes[c].nom)}</dt><dd>${esc(D.cartes[c].def)}</dd>`).join("")}</dl>
      <h2>Erreurs fréquentes à éviter</h2>
      <ul class="erreurs">${B.erreurs.map((x) => `<li><b>${esc(x.titre)}</b> — ${esc(x.txt)}</li>`).join("")}</ul>
      <h2>Chacun fait le point</h2>
      <p class="petit">Pour chaque compétence, chaque membre choisit : ✔ je sais faire · ↻ à retravailler.</p>
      <div class="t-auto-wrap"><table class="t-auto"><thead><tr><th>Compétence</th>${S.membres.map((m, i) => `<th>${badge(m, i, true)}</th>`).join("")}</tr></thead><tbody>
        ${B.autoeval.map((a, k) => `<tr><td>${esc(a)}</td>${S.membres.map((m) => { const v = (S.auto[m.id] || {})[k] || "";
          return `<td><label class="sr" for="au-${m.id}-${k}">${esc(m.nom)} : ${esc(a)}</label><select id="au-${m.id}-${k}" data-m="${m.id}" data-k="${k}"><option value="">—</option><option value="ok" ${v === "ok" ? "selected" : ""}>✔ je sais</option><option value="re" ${v === "re" ? "selected" : ""}>↻ à retravailler</option></select></td>`; }).join("")}</tr>`).join("")}
      </tbody></table></div>
      <h2>Expliquez votre démarche</h2>
      <label for="b-expl">${esc(B.question)}</label>
      <textarea id="b-expl" rows="5">${esc(S.explication)}</textarea>
      <div class="actions noprint"><button class="btn" id="b-print">🖨 Imprimer ou enregistrer en PDF</button></div>
    </section>`));
    $("#b-ret").onclick = () => aller("lieu", "hub");
    $$("[data-m]").forEach((s) => (s.onchange = () => { (S.auto[s.dataset.m] = S.auto[s.dataset.m] || {})[s.dataset.k] = s.value; sauver(); }));
    $("#b-expl").oninput = (ev) => { S.explication = ev.target.value; sauver(); };
    $("#b-print").onclick = () => window.print();
  }

  /* ======================================================================
     CARNET, « JE SUIS PERDU », MODALES
     ====================================================================== */
  function modale(titre, corps, apres) {
    fermerModale();
    const m = html(`<div class="modale" role="dialog" aria-modal="true" aria-labelledby="mod-t"><div class="modale-boite">
      <div class="modale-tete"><h2 id="mod-t">${esc(titre)}</h2><button class="btn btn-mini" id="mod-x">Fermer ✕</button></div><div class="modale-corps">${corps}</div></div></div>`);
    document.body.append(m);
    $("#mod-x").onclick = fermerModale;
    m.addEventListener("keydown", (ev) => { if (ev.key === "Escape") fermerModale(); });
    m.addEventListener("click", (ev) => { if (ev.target === m) fermerModale(); });
    if (apres) apres(m);
    $("#mod-x").focus();
  }
  function fermerModale() { const m = $(".modale"); if (m) { m.remove(); } }

  function carnet() {
    const missions = IDS.filter((id) => E[id].mission && S.vu[id]);
    modale("📒 Carnet de mission", `
      <h3>Équipage</h3><p>${S.membres.map((m, i) => badge(m, i)).join(" ")}</p>
      <div class="actions"><button class="btn btn-mini" id="c-equipe">✎ Modifier l'équipage</button><button class="btn btn-mini" id="c-intro">↺ Revoir l'introduction</button><button class="btn btn-mini" id="c-tuto">? Revoir la prise en main</button></div>
      <h3>Systèmes</h3>
      <ul class="carnet-prog">${["A", "B", "C"].map((l) => `<li><b>${esc(D.lieux[l].nom)}</b><ul>${D.lieux[l].enigmes.map((id) => `<li>${puce(id)} <button class="lien" data-go="${id}">${esc(E[id].titre)}</button>${!estOuvert(id) ? ` <span class="petit">— ${esc(E[id].verrou)}</span>` : ""}</li>`).join("")}</ul></li>`).join("")}
        <li><b>Mission finale</b> : ${termine() ? "terminée ✔" : finalOuvert() ? "ouverte ★" : `🔒 ${nbResolus()}/9 systèmes réparés`}</li></ul>
      <h3>Disquettes (${cartesGagnees().length}/11)</h3>
      ${cartesGagnees().length ? `<dl class="def-liste">${cartesGagnees().map((c) => `<dt>💾 ${esc(D.cartes[c].nom)}</dt><dd>${esc(D.cartes[c].def)}</dd>`).join("")}</dl>` : "<p>Aucune disquette pour l'instant. Réparez un système pour en obtenir.</p>"}
      <h3>Missions hors du jeu</h3>
      ${missions.length ? missions.map((id) => { const m = E[id].mission; return `<div class="mission mini"><h4>${puce(id)} ${id} · ${esc(m.titre)}</h4><ol>${m.etapes.map((t) => `<li>${esc(t)}</li>`).join("")}</ol><p><b>Revenir avec :</b> ${esc(m.rapporter)}</p>
        ${E[id].telechargement ? `<p><a href="${esc(E[id].telechargement.fichier)}" download>⬇ ${esc(E[id].telechargement.label)}</a></p>` : ""}</div>`; }).join("") : "<p>Les consignes des missions sur papier, dans les fichiers ou dans le navigateur apparaîtront ici dès que vous ouvrirez ces énigmes.</p>"}
      ${S.resolu.B2 ? `<h3>Balise relais</h3><p>La balise s'est cachée. Pour la retrouver : favoris (étoile ☆) ou historique (Ctrl + H, Cmd + Y sur Mac).</p>` : ""}
      ${S.journal.length ? `<details><summary>Journal de bord (${S.journal.length})</summary><ul class="petit">${S.journal.slice().reverse().map((j) => `<li>${new Date(j.t).toLocaleTimeString("fr-BE", { hour: "2-digit", minute: "2-digit" })} · ${esc(j.txt)}</li>`).join("")}</ul></details>` : ""}
      <h3>Partie</h3><button class="btn btn-mini btn-danger" id="c-reset">Recommencer une nouvelle partie</button>`,
      (m) => {
        $$("[data-go]", m).forEach((b) => (b.onclick = () => { const id = b.dataset.go; estOuvert(id) ? aller("enigme", id) : aller("lieu", E[id].salle); }));
        $("#c-equipe", m).onclick = () => { const r = { nom: ecran.nom, param: ecran.param }; aller("inscription", { mode: "modifier" }); ecran.retour = r; };
        $("#c-intro", m).onclick = () => aller("intro", 0);
        $("#c-tuto", m).onclick = () => { fermerModale(); if (ecran.nom !== "lieu") aller("lieu", "hub"); setTimeout(() => tutoriel(0), 200); };
        $("#c-reset", m).onclick = () => {
          if (confirm("Effacer toute la progression de cet équipage et recommencer ? Le code d'accès reste mémorisé. Cette action ne peut pas être annulée.")) {
            try { localStorage.removeItem(CLE); } catch (e) {}
            S = etatNeuf(); aller("acces");
          }
        };
      });
  }

  function perdu() {
    const ouvertes = IDS.filter((i) => !estResolu(i) && estOuvert(i));
    const verrous = IDS.filter((i) => !estResolu(i) && !estOuvert(i));
    let txt = "";
    if (termine()) txt = `<p>La mission est terminée ! Vous pouvez ouvrir le bilan.</p><button class="btn" data-va="bilan">Ouvrir le bilan</button>`;
    else if (finalOuvert()) txt = `<p>Les 9 systèmes fonctionnent. Prochaine action : <b>réveiller GLADYS</b> à sa console, dans le poste de pilotage.</p><button class="btn" data-va="final">Aller à la console de GLADYS</button>`;
    else {
      if (ecran.nom === "enigme" && !estResolu(ecran.param)) {
        const id = ecran.param, n = S.indices[id] || 0;
        txt += `<h3>Dans cette énigme</h3><ol><li>Relisez le bloc « Ce que vous devez faire ».</li>${E[id].mission ? "<li>La mission se fait hors du jeu : suivez les étapes du cadre « Mission », puis revenez noter vos réponses.</li>" : ""}
          <li>${n < 3 ? `L'indice ${n + 1} est disponible en bas de la page.` : "Les 3 indices sont affichés en bas de la page."}</li><li>Vous pouvez aussi laisser cette énigme de côté et y revenir plus tard.</li></ol>`;
      }
      const suggestion = ouvertes.filter((i) => i !== ecran.param).sort((a, b) => (S.vu[a] ? 1 : 0) - (S.vu[b] ? 1 : 0))[0];
      txt += `<h3>Systèmes disponibles maintenant</h3>${suggestion ? `<p>Suggestion de GLADYS (ce n'est pas obligatoire) : <b>${esc(E[suggestion].titre)}</b>, dans ${esc(D.lieux[E[suggestion].salle].nom)}.</p>` : ""}
        <ul class="perdu-liste">${ouvertes.map((i) => `<li><button class="btn btn-mini" data-va="enigme:${i}">${i} · ${esc(E[i].titre)}</button> <span class="petit">${esc(D.lieux[E[i].salle].nom)} · ${esc(E[i].lieu)}</span></li>`).join("")}</ul>
        ${verrous.length ? `<h3>Encore verrouillés</h3><ul>${verrous.map((i) => `<li>🔒 ${esc(E[i].titre)} — ${esc(E[i].verrou)}</li>`).join("")}</ul>` : ""}`;
    }
    modale("Je suis perdu", txt, (m) => $$("[data-va]", m).forEach((b) => (b.onclick = () => { const [n, p] = b.dataset.va.split(":"); aller(n, p); })));
  }

  function annonce(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(annonce.t);
    annonce.t = setTimeout(() => (t.hidden = true), 7000);
  }

  /* ---------- démarrage ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $("#btn-carnet").onclick = carnet;
    $("#btn-hub").onclick = () => aller("lieu", "hub");
    $("#btn-perdu").onclick = perdu;
    $("#btn-son").onclick = () => { S.son = !S.son; sauver(); majEntete(); bip("ok"); };
    $("#toast").onclick = () => ($("#toast").hidden = true);
    window.addEventListener("storage", (ev) => { if (ev.key === CLE) { const s = charger(); if (s) S = s; } });
    aller("acces");
  });
  window.NEON_DEBUG = { etat: () => S, aller, H };
})();
