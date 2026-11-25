/* ==========================================================================
   PANNE À BORD DU NÉON-86 — moteur du jeu
   Application statique : aucune donnée n'est envoyée sur Internet.
   La progression est enregistrée dans le navigateur (localStorage).
   ========================================================================== */
(function () {
  "use strict";
  const D = window.NEON, ART = window.ART;
  const CLE = "neon86-sauvegarde-v1";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- empreintes des réponses ---------- */
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, ""); }
  function H(s) { let h = 0x811c9dc5; const t = norm(s); for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36).padStart(7, "0"); }
  window.NEON_HASH = H;

  /* ---------- état et sauvegarde ---------- */
  function etatNeuf() {
    return { v: 1, equipe: "", debut: null, fin: null, resolu: {}, indices: {}, essais: {}, saisies: {},
      vu: {}, son: false, finalLignes: {}, finalOk: false, signalOk: false, auto: {}, explication: "", c3: [] };
  }
  let S = etatNeuf();
  let stockageOk = true;
  function charger() {
    try { const t = localStorage.getItem(CLE); if (t) { const o = JSON.parse(t); if (o && o.v === 1) return Object.assign(etatNeuf(), o); } }
    catch (e) { stockageOk = false; }
    return null;
  }
  function sauver() { try { localStorage.setItem(CLE, JSON.stringify(S)); } catch (e) { stockageOk = false; } }

  /* ---------- son (facultatif, désactivé par défaut) ---------- */
  let ctx = null;
  function bip(type) {
    if (!S.son) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { ok: [660, 880, 1320], ko: [220, 180], clic: [520], fin: [523, 659, 784, 1046] }[type] || [440];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "square"; o.frequency.value = f; g.gain.value = 0.04;
        o.connect(g); g.connect(ctx.destination);
        const t = ctx.currentTime + i * 0.11; o.start(t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1); o.stop(t + 0.12);
      });
    } catch (e) { /* pas de son : aucun problème */ }
  }

  /* ---------- outils d'état ---------- */
  const E = D.enigmes;
  const idsEnigmes = Object.keys(E);
  const estResolu = (id) => !!S.resolu[id];
  const estOuvert = (id) => (E[id].requiert || []).every(estResolu);
  const cartesGagnees = () => idsEnigmes.filter(estResolu).flatMap((id) => E[id].recompense);
  const nbResolus = () => idsEnigmes.filter(estResolu).length;
  const finalOuvert = () => nbResolus() === idsEnigmes.length;
  function secteurDe(id) { return D.secteurs.find((s) => s.enigmes.includes(id)); }

  /* ---------- rendu général ---------- */
  const app = () => $("#app");
  let ecranCourant = { nom: "titre" };

  function aller(nom, param) {
    ecranCourant = { nom, param };
    $("#toast").hidden = true;
    if (nom === "enigme") { S.vu[param] = true; sauver(); }
    const fn = { titre: ecTitre, intro: ecIntro, hub: ecHub, secteur: ecSecteur, enigme: ecEnigme, final: ecFinal, bilan: ecBilan }[nom];
    app().innerHTML = "";
    fn(param);
    majEntete();
    window.scrollTo(0, 0);
    const h = $("#app h1, #app h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  function majEntete() {
    const ent = $("#entete");
    const enJeu = !["titre", "intro"].includes(ecranCourant.nom);
    ent.hidden = !enJeu;
    $("#compteur").textContent = `${cartesGagnees().length} / 11 cartes`;
    $("#equipe-aff").textContent = S.equipe ? `Équipage : ${S.equipe}` : "";
    $("#btn-son").setAttribute("aria-pressed", S.son ? "true" : "false");
    $("#btn-son").textContent = S.son ? "Son : activé" : "Son : coupé";
  }

  function bulle(l) {
    const noms = { gladys: "GLADYS 3000", boulon: "BOULON", journal: "Journal de bord" };
    const art = l.qui === "gladys" ? ART.gladys(S.finalOk && S.signalOk ? "contente" : "boude") : l.qui === "boulon" ? ART.boulon() : ART.journal();
    return `<div class="bulle bulle-${l.qui}"><div class="avatar">${art}</div><div class="bulle-txt"><span class="qui">${noms[l.qui]}</span><p>${esc(l.txt)}</p></div></div>`;
  }
  const html = (s) => { const d = document.createElement("div"); d.innerHTML = s; return d; };

  /* ---------- écran titre ---------- */
  const CLE_ACCES = "neon86-acces";
  function accesOk() {
    if (!D.codeAcces) return true;
    try { return localStorage.getItem(CLE_ACCES) === D.codeAcces; } catch (e) { return false; }
  }
  function ecAcces() {
    app().append(html(`
      <section class="titre-ecran">
        <div class="titre-crt">
          <p class="sur-titre">eSCIENCES · Formation numérique S1 · Escape game</p>
          <h1 class="logo">PANNE À BORD<br><span>DU NÉON-86</span></h1>
          <div class="titre-persos">${ART.gladys("boude")}</div>
          <p class="accroche">Accès verrouillé. GLADYS n'ouvre la station qu'avec le code donné par ton professeur.</p>
        </div>
        <div class="titre-actions">
          <form id="a-form" class="t-form">
            <label for="a-code">Code d'accès</label>
            <input id="a-code" type="password" autocomplete="off" autocapitalize="characters">
            <button class="btn btn-grand" type="submit">Déverrouiller</button>
          </form>
          <p id="a-msg" class="petit" role="status" aria-live="polite"></p>
        </div>
      </section>`));
    $("#a-code").focus();
    $("#a-form").onsubmit = (ev) => {
      ev.preventDefault();
      if (H($("#a-code").value) === D.codeAcces) {
        try { localStorage.setItem(CLE_ACCES, D.codeAcces); } catch (e) {}
        bip("ok"); aller("titre");
      } else { $("#a-code").value = ""; $("#a-msg").textContent = "Code incorrect. Attends que ton professeur te donne le code."; bip("ko"); }
    };
  }

  function ecTitre() {
    if (!accesOk()) { ecAcces(); return; }
    const sauve = charger();
    app().append(html(`
      <section class="titre-ecran">
        <div class="titre-crt">
          <p class="sur-titre">eSCIENCES · Formation numérique S1 · Escape game</p>
          <h1 class="logo">PANNE À BORD<br><span>DU NÉON-86</span></h1>
          <div class="titre-persos">${ART.gladys("boude")}${ART.boulon()}</div>
          <p class="accroche">L'ordinatrice de bord boude, le robot est en pièces détachées et la cargo-comète arrive aujourd'hui. Il faut réparer la station !</p>
        </div>
        <div class="titre-actions">
          ${sauve && sauve.debut ? `<button class="btn btn-grand" id="t-reprendre">▶ Reprendre la partie${sauve.equipe ? " de " + esc(sauve.equipe) : ""}</button>` : ""}
          <form id="t-form" class="t-form">
            <label for="t-equipe">Prénom(s) de l'équipage</label>
            <input id="t-equipe" maxlength="40" autocomplete="off" placeholder="Ex. : Lina et Noah">
            <button class="btn ${sauve && sauve.debut ? "btn-sec" : "btn-grand"}" type="submit">${sauve && sauve.debut ? "Nouvelle partie" : "▶ Commencer la mission"}</button>
          </form>
          ${!stockageOk ? `<p class="alerte">Ce navigateur bloque l'enregistrement : la progression sera perdue si tu fermes la page.</p>` : ""}
          <p class="petit">Durée : environ 50 minutes · seul(e) ou en binôme · son facultatif</p>
        </div>
      </section>`));
    if ($("#t-reprendre")) $("#t-reprendre").onclick = () => { S = sauve; aller("hub"); };
    $("#t-form").onsubmit = (ev) => {
      ev.preventDefault();
      if (sauve && sauve.debut && !confirm("Commencer une nouvelle partie ? La partie enregistrée sera effacée.")) return;
      S = etatNeuf(); S.equipe = $("#t-equipe").value.trim().slice(0, 40); S.debut = Date.now(); sauver(); aller("intro");
    };
  }

  /* ---------- introduction ---------- */
  function ecIntro() {
    app().append(html(`
      <section class="panneau intro">
        <h1>Message d'alerte</h1>
        <div class="dialogue">${D.intro.map(bulle).join("")}</div>
        <div class="regles"><h2>Comment jouer</h2><ul>${D.regles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>
        <button class="btn btn-grand" id="i-go">Aller au poste de pilotage</button>
      </section>`));
    $("#i-go").onclick = () => aller("hub");
  }

  /* ---------- poste de pilotage (hub) ---------- */
  function ecHub() {
    const etat = (s) => `${s.enigmes.filter(estResolu).length}/${s.enigmes.length}`;
    const pos = { A: "pos-a", B: "pos-b", C: "pos-c" };
    app().append(html(`
      <section>
        <h1 class="h-ecran">Poste de pilotage</h1>
        <p class="sous">Choisis un secteur. Tu peux changer de secteur à tout moment.</p>
        <div class="station">
          ${ART.station({ final: S.finalOk && S.signalOk })}
          ${D.secteurs.map((s) => `<button class="secteur-btn ${pos[s.id]} c-${s.couleur}" data-s="${s.id}">
              <span class="s-nom">${esc(s.nom)}</span><span class="s-etat">${etat(s)} réparé${s.enigmes.filter(estResolu).length > 1 ? "s" : ""}</span></button>`).join("")}
          <button class="secteur-btn pos-g ${finalOuvert() ? "c-vert pulse" : "verrou"}" id="h-final" ${finalOuvert() ? "" : 'aria-disabled="true"'}>
            <span class="s-nom">${finalOuvert() ? "Réveiller GLADYS" : "GLADYS (veille boudeuse)"}</span>
            <span class="s-etat">${finalOuvert() ? "Mission finale ouverte !" : `${nbResolus()}/9 énigmes réparées`}</span></button>
        </div>
        <div class="hub-bas">
          ${D.secteurs.map((s) => `<div class="hub-carte c-${s.couleur}"><h2>${esc(s.nom)}</h2><p>${esc(s.accroche)}</p>
            <ul>${s.enigmes.map((id) => `<li>${puce(id)} ${esc(E[id].titre)}</li>`).join("")}</ul></div>`).join("")}
        </div>
      </section>`));
    app().querySelectorAll("[data-s]").forEach((b) => (b.onclick = () => { bip("clic"); aller("secteur", b.dataset.s); }));
    $("#h-final").onclick = () => {
      if (finalOuvert()) aller(S.finalOk && S.signalOk ? "bilan" : "final");
      else annonce("GLADYS refuse de se réveiller tant que les 9 énigmes ne sont pas réparées. Il en reste " + (9 - nbResolus()) + ".");
    };
  }
  function puce(id) {
    if (estResolu(id)) return '<span class="puce ok" aria-label="réparé">✔</span>';
    if (!estOuvert(id)) return '<span class="puce lock" aria-label="verrouillé">🔒</span>';
    return S.vu[id] ? '<span class="puce cours" aria-label="commencé">●</span>' : '<span class="puce" aria-label="à explorer">○</span>';
  }

  /* ---------- secteur ---------- */
  function ecSecteur(sid) {
    const s = D.secteurs.find((x) => x.id === sid);
    app().append(html(`
      <section>
        <button class="btn btn-sec retour" id="s-ret">← Poste de pilotage</button>
        <h1 class="h-ecran c-${s.couleur}-t">${esc(s.nom)}</h1>
        <p class="sous">${esc(s.accroche)}</p>
        <div class="consoles">
          ${s.enigmes.map((id) => { const e = E[id]; const ouv = estOuvert(id);
            return `<button class="console ${estResolu(id) ? "fait" : ""} ${ouv ? "" : "ferme"} c-${s.couleur}" data-e="${id}">
              <span class="c-ecran">${ouv ? (estResolu(id) ? "RÉPARÉ" : id) : "VERROU"}</span>
              <span class="c-titre">${esc(e.titre)}</span>
              <span class="c-lieu">${icone(e.lieu)} ${esc(e.lieu)} · ~${e.duree} min</span>
              ${!ouv ? `<span class="c-verrou">${esc(e.verrou)}</span>` : ""}
            </button>`; }).join("")}
        </div>
      </section>`));
    $("#s-ret").onclick = () => aller("hub");
    app().querySelectorAll("[data-e]").forEach((b) => (b.onclick = () => {
      const id = b.dataset.e;
      if (!estOuvert(id)) { annonce(E[id].verrou); return; }
      bip("clic"); aller("enigme", id);
    }));
  }
  function icone(lieu) { return lieu.includes("papier") ? "✎" : lieu.includes("navigateur") ? "🌐" : lieu.includes("ordinateur") ? "🗂" : "🕹"; }

  /* ---------- énigme : cadre commun ---------- */
  function ecEnigme(id) {
    const e = E[id], s = secteurDe(id);
    const sec = html(`
      <section class="enigme">
        <button class="btn btn-sec retour" id="e-ret">← ${esc(s.nom)}</button>
        <div class="e-tete c-${s.couleur}">
          <span class="e-id">${id}</span>
          <div><h1>${esc(e.titre)}</h1>
          <p class="e-meta"><span class="tag">${esc(e.statut)}</span><span class="tag">${icone(e.lieu)} ${esc(e.lieu)}</span><span class="tag">${esc(e.notion)}</span></p></div>
        </div>
        <div class="dialogue">${e.recit.map(bulle).join("")}</div>
        ${e.learn ? `<aside class="decouverte"><h2>${esc(e.learn.titre)}</h2><p>${esc(e.learn.txt)}</p></aside>` : ""}
        <div class="e-zone" id="e-zone"></div>
        <div class="retour-zone" id="feedback" role="status" aria-live="polite"></div>
        <div class="indices" id="indices"></div>
      </section>`);
    app().append(sec);
    $("#e-ret").onclick = () => aller("secteur", s.id);
    const zone = $("#e-zone");
    if (estResolu(id)) {
      zone.innerHTML = `<div class="deja"><p><b>Énigme réparée.</b> ${esc(e.succes)}</p>
        <p>Cartes-mémoire obtenues : ${e.recompense.map((c) => `<b>${esc(D.cartes[c].nom)}</b>`).join(", ")}.</p></div>`;
      if (e.mission) zone.append(blocMission(e, id, true));
    } else {
      ({ tri: puzTri, vf: puzVF, champs: puzChamps, recherche: puzRecherche, code: puzCode }[e.type])(e, id, zone);
    }
    blocIndices(e.indices, id, $("#indices"));
  }

  function retour(type, msg) {
    const f = $("#feedback");
    f.className = "retour-zone " + type;
    f.innerHTML = msg;
    if (type === "ko") bip("ko");
  }
  function essai(id) { S.essais[id] = (S.essais[id] || 0) + 1; sauver(); return S.essais[id]; }

  function blocIndices(liste, id, cible) {
    const n = () => S.indices[id] || 0;
    function dessine() {
      cible.innerHTML = `<h2>Indices <span class="petit">(${n()}/3 utilisés)</span></h2>
        <ol>${liste.slice(0, n()).map((t, i) => `<li><b>${["Où regarder", "Comment faire", "Coup de pouce décisif"][i]} :</b> ${esc(t)}</li>`).join("")}</ol>
        ${n() < 3 ? `<button class="btn btn-sec" id="ind-${id}">Afficher l'indice ${n() + 1} : ${["où regarder ?", "comment faire ?", "coup de pouce décisif"][n()]}</button>` : ""}`;
      const b = cible.querySelector("button");
      if (b) b.onclick = () => { S.indices[id] = n() + 1; sauver(); bip("clic"); dessine(); cible.querySelector("li:last-child").focus?.(); };
    }
    dessine();
  }

  function reussite(id) {
    const e = E[id];
    S.resolu[id] = { t: Date.now(), essais: S.essais[id] || 1, indices: S.indices[id] || 0 };
    sauver(); bip("ok"); majEntete();
    const zone = $("#e-zone");
    zone.innerHTML = `<div class="succes-box">
      <div class="succes-icone">${ART.disquette()}</div>
      <div><h2>Réparé !</h2><p>${esc(e.succes)}</p>
      <h3>Carte${e.recompense.length > 1 ? "s" : ""}-mémoire obtenue${e.recompense.length > 1 ? "s" : ""} :</h3>
      <ul class="cartes-gagnees">${e.recompense.map((c) => `<li><b>${esc(D.cartes[c].nom)}</b> — ${esc(D.cartes[c].def)}</li>`).join("")}</ul>
      <div class="actions"><button class="btn" id="r-sec">Retour au secteur</button><button class="btn btn-sec" id="r-hub">Poste de pilotage</button></div></div></div>`;
    $("#feedback").innerHTML = ""; $("#feedback").className = "retour-zone";
    $("#r-sec").onclick = () => aller("secteur", secteurDe(id).id);
    $("#r-hub").onclick = () => aller("hub");
    $("#r-sec").focus();
    if (finalOuvert()) annonce("Les 9 énigmes sont réparées : la mission finale est ouverte au poste de pilotage !");
  }

  /* ---------- bloc « mission hors écran » ---------- */
  function blocMission(e, id, compact) {
    const m = e.mission;
    const d = html(`<div class="mission">
      <h2>✦ ${esc(m.titre)}</h2>
      ${!compact ? `<ol>${m.etapes.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
      <p class="rapporter"><b>À rapporter dans le jeu :</b> ${esc(m.rapporter)}</p>` : `<p>Consigne toujours disponible dans le carnet de mission.</p>`}
      ${e.telechargement ? `<p><a class="btn" href="${esc(e.telechargement.fichier)}" download id="dl-${id}">⬇ ${esc(e.telechargement.label)}</a></p>` : ""}
      ${e.relais ? (S.resolu.B2 ? `<p class="petit">La balise s'est cachée : retrouve-la dans tes favoris ou ton historique.</p>`
        : `<p><a class="btn" href="${esc(e.relais.fichier)}" target="_blank" rel="noopener" id="relais-lien">🌐 ${esc(e.relais.label)}</a></p>`) : ""}
      ${!compact && m.aide ? `<div class="aides">${Object.entries(m.aide).map(([k, v]) => `<details><summary>Aide : ${esc(k)}</summary><p>${esc(v)}</p></details>`).join("")}</div>` : ""}
      ${!compact ? `<p class="petit">Le jeu garde ta progression : tu peux changer d'onglet ou de fenêtre, puis revenir ici.</p>` : ""}
    </div>`);
    return d;
  }

  /* ---------- A1 : tri ---------- */
  function puzTri(e, id, zone) {
    const sv = S.saisies[id] || {};
    zone.append(html(`<p class="consigne">${esc(e.consigne)}</p>
      <div class="tri">${e.elements.map((el, i) => `<fieldset class="tri-el" id="tri-${i}"><legend>${esc(el.nom)}</legend>
        ${e.categories.map((c) => `<label><input type="radio" name="tri${i}" value="${c.id}" ${sv[i] === c.id ? "checked" : ""}> ${esc(c.nom)}</label>`).join("")}
      </fieldset>`).join("")}</div>
      <button class="btn btn-grand" id="tri-ok">Valider le tri</button>`));
    zone.addEventListener("change", (ev) => { const m = ev.target.name.match(/tri(\d+)/); if (m) { sv[m[1]] = ev.target.value; S.saisies[id] = sv; sauver(); } });
    $("#tri-ok").onclick = () => {
      const manque = e.elements.filter((_, i) => !sv[i]).length;
      if (manque) { retour("info", `Il reste ${manque} élément(s) à ranger.`); return; }
      const n = essai(id);
      const faux = e.elements.map((el, i) => ({ el, i, rep: sv[i] })).filter((x) => x.rep !== x.el.cat);
      zone.querySelectorAll(".tri-el").forEach((f) => f.classList.remove("faux"));
      if (!faux.length) return reussite(id);
      const msgs = [];
      if (faux.some((x) => x.el.cat === "mat")) msgs.push("Un élément que l'on peut <b>toucher</b> a été rangé parmi les logiciels.");
      if (faux.some((x) => x.el.cat !== "mat" && x.rep === "mat")) msgs.push("Un <b>logiciel</b> (qu'on ne peut pas toucher) a été rangé dans le matériel.");
      if (faux.some((x) => x.el.cat === "os" && x.rep === "app") || faux.some((x) => x.el.cat === "app" && x.rep === "os")) msgs.push("Attention à la différence entre le <b>système d'exploitation</b> (il démarre l'ordinateur et gère tout) et une <b>application</b> (un programme qu'on lance pour une tâche).");
      if (n >= 2) faux.forEach((x) => $("#tri-" + x.i).classList.add("faux"));
      retour("ko", `<b>${faux.length} élément(s) mal rangé(s).</b> ${msgs.join(" ")} ${n >= 2 ? "Les éléments à revoir sont encadrés." : "Corrige et valide à nouveau."}`);
    };
  }

  /* ---------- B1 : vrai / faux ---------- */
  function puzVF(e, id, zone) {
    const sv = S.saisies[id] || {};
    zone.append(html(`<p class="consigne">${esc(e.consigne)}</p>
      <div class="vf">${e.affirmations.map((a, i) => `<fieldset class="vf-el" id="vf-${i}"><legend>${esc(a.txt)}</legend>
        <label><input type="radio" name="vf${i}" value="v" ${sv[i] === "v" ? "checked" : ""}> Vrai</label>
        <label><input type="radio" name="vf${i}" value="f" ${sv[i] === "f" ? "checked" : ""}> Faux</label>
        <p class="vf-expl" hidden></p></fieldset>`).join("")}</div>
      <button class="btn btn-grand" id="vf-ok">Vérifier</button>`));
    zone.addEventListener("change", (ev) => { const m = ev.target.name.match(/vf(\d+)/); if (m) { sv[m[1]] = ev.target.value; S.saisies[id] = sv; sauver(); } });
    $("#vf-ok").onclick = () => {
      const manque = e.affirmations.filter((_, i) => !sv[i]).length;
      if (manque) { retour("info", `Il reste ${manque} affirmation(s) sans réponse.`); return; }
      const n = essai(id);
      let nf = 0;
      e.affirmations.forEach((a, i) => {
        const ok = (sv[i] === "v") === a.vrai, f = $("#vf-" + i), p = f.querySelector(".vf-expl");
        f.classList.toggle("faux", !ok && n >= 2); if (!ok) nf++;
        p.hidden = !(n >= 2 && !ok); p.textContent = a.expl;
      });
      if (!nf) {
        zone.querySelectorAll(".vf-expl").forEach((p, i) => { p.hidden = false; p.textContent = e.affirmations[i].expl; });
        return reussite(id);
      }
      retour("ko", `<b>${nf} réponse(s) à revoir.</b> ${n >= 2 ? "Les affirmations à revoir sont encadrées, avec une explication." : "Relis chaque affirmation : qui est un logiciel, qui est un site, qui est un réseau ?"}`);
    };
  }

  /* ---------- énigmes à champs (A2, B2, C1, C2, C4) ---------- */
  function puzChamps(e, id, zone) {
    const sv = S.saisies[id] || {};
    if (e.mission) zone.append(blocMission(e, id, false));
    if (e.pixels) zone.append(html(`<div class="codes-pixels"><h2>Ce qu'affiche l'écran en panne</h2>
      <table class="t-pixels"><caption>10 lignes de 10 pixels · 1 = allumé · 0 = éteint</caption>
      ${e.pixels.map((l, i) => `<tr><th scope="row">Ligne ${i + 1}</th><td>${l.split("").join(" ")}</td></tr>`).join("")}</table>
      <p class="petit">Ces codes sont aussi sur la fiche de mission. Colorie la grille sur papier : c'est bien plus facile que de compter dans ta tête !</p></div>`));
    if (e.carte) zone.append(html(`<div class="algo-wrap"><div><h2>Carte de la soute</h2>${carteHTML(e.carte)}</div>
      <div><h2>Programme de Boulon</h2>${progHTML(e.programme)}<p class="petit">Départ : case ★, Boulon regarde vers le HAUT.</p></div></div>`));
    const f = html(`<form class="champs" id="ch-form" novalidate>
      ${e.champs.map((c) => c.type === "choix"
        ? `<fieldset class="champ"><legend>${esc(c.label)}</legend>${c.options.map((o, i) => `<label><input type="radio" name="${c.id}" value="${i}" ${sv[c.id] == i ? "checked" : ""}> ${esc(o)}</label>`).join("")}</fieldset>`
        : `<div class="champ"><label for="ch-${c.id}">${esc(c.label)}</label><input id="ch-${c.id}" name="${c.id}" autocomplete="off" value="${esc(sv[c.id] || "")}"></div>`).join("")}
      <button class="btn btn-grand" type="submit">Valider</button></form>`);
    zone.append(f);
    f.addEventListener("input", (ev) => { sv[ev.target.name] = ev.target.value; S.saisies[id] = sv; sauver(); });
    f.addEventListener("change", (ev) => { sv[ev.target.name] = ev.target.value; S.saisies[id] = sv; sauver(); });
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
        if (!ok) { tout = false; msgs.push(`<li><b>${esc(c.label)}</b> : ${piege ? esc(piege) : "ce n'est pas encore ça. Vérifie ta démarche ou demande un indice."}</li>`); }
      });
      if (tout) return reussite(id);
      retour("ko", `<ul>${msgs.join("")}</ul><p class="petit">Les réponses correctes sont marquées en vert. Majuscules, accents et espaces n'ont pas d'importance.</p>`);
    };
  }
  function carteHTML(c) {
    return `<table class="carte" aria-label="Carte de la soute, 7 colonnes et 7 lignes">${c.map((l) => `<tr>${l.split("").map((x) => `<td class="${x === "*" ? "depart" : ""}">${x === "*" ? "★" : x}</td>`).join("")}</tr>`).join("")}</table>`;
  }
  function progHTML(p, prof = 0) {
    const nom = { avancer: "avancer", gauche: "tourner à gauche ↺", droite: "tourner à droite ↻" };
    return `<ol class="prog">${p.map((b) => b.t === "repeter"
      ? `<li class="b-rep">répéter ${b.n} fois${progHTML(b.corps, prof + 1)}</li>` : `<li class="b-${b.t}">${nom[b.t]}</li>`).join("")}</ol>`;
  }

  /* ---------- B3 : QUESTOR ---------- */
  function puzRecherche(e, id, zone) {
    const Q = D.questor, sv = S.saisies[id] || {};
    const tok = (s) => norm(s.replace(/['’]/g, " ").replace(/-/g, " ")) && s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’\-]/g, " ").split(/[^a-z0-9]+/).filter((t) => t && !Q.motsVides.includes(t));
    const proche = (a, b) => a === b || (a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5)) || (a.length >= 4 && b.length >= 4 && a.slice(0, 4) === b.slice(0, 4) && Math.abs(a.length - b.length) <= 3);
    zone.append(html(`<p class="consigne">${esc(e.consigne)}</p>
      <div class="navig" role="region" aria-label="Navigateur de la station">
        <div class="navig-barre"><span class="navig-pts" aria-hidden="true">● ● ●</span><span class="navig-url" id="q-url">https://questor.neon86.space</span></div>
        <div class="navig-corps" id="q-corps"></div>
      </div>
      <form class="champs" id="ch-form" novalidate>
        <fieldset class="champ" id="q-choix"><legend>${esc(e.choixMultiple.question)}</legend>
          ${e.choixMultiple.options.map((o, i) => `<label><input type="checkbox" name="cm" value="${i}" ${(sv.cm || []).includes(i) ? "checked" : ""}> ${esc(o.txt)}</label>`).join("")}</fieldset>
        ${e.champs.map((c) => `<div class="champ"><label for="ch-${c.id}">${esc(c.label)}</label><input id="ch-${c.id}" name="${c.id}" autocomplete="off" value="${esc(sv[c.id] || "")}"></div>`).join("")}
        <button class="btn btn-grand" type="submit">Valider</button></form>`));
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
      const t = tok(q) || [];
      const r = $("#q-res");
      if (!t.length) { r.innerHTML = `<p class="q-msg">QUESTOR attend des mots-clés. Les petits mots (le, de, à…) ne comptent pas.</p>`; return; }
      const res = Q.pages.map((p, i) => ({ p, i, sc: t.filter((x) => p.mots.some((m) => proche(x, m))).length })).filter((x) => x.sc > 0)
        .sort((a, b) => b.sc - a.sc || a.i - b.i).slice(0, 4);
      let msg = "";
      if (t.length > 6) msg = `<p class="q-msg">Beaucoup de mots ! Quelques mots-clés courts et précis suffisent souvent.</p>`;
      if (!res.length) { r.innerHTML = msg + `<p class="q-msg">Aucun résultat pour « ${esc(q)} ». Essaie d'autres mots-clés.</p>`; return; }
      if (res.length && res[0].sc === 1 && t.length === 1) msg += `<p class="q-msg">Un seul mot-clé : les résultats sont très variés. Ajoute un mot plus précis ?</p>`;
      r.innerHTML = msg + `<p class="q-nb">${res.length} premiers résultats</p><ol class="q-liste">${res.map((x) => `<li>
        <a href="#" data-p="${x.i}" class="q-titre">${esc(x.p.titre)}</a>
        <span class="q-url ${x.p.url.startsWith("https") ? "sur" : "pas-sur"}">${x.p.url.startsWith("https") ? "🔒" : "⚠"} ${esc(x.p.url)}</span>
        <span class="q-res">${esc(x.p.resume)}</span></li>`).join("")}</ol>`;
      r.querySelectorAll("[data-p]").forEach((a) => (a.onclick = (ev) => { ev.preventDefault(); page(+a.dataset.p, q); }));
      if (!silencieux) bip("clic");
    }
    function page(i, q) {
      const p = Q.pages[i];
      const sur = p.url.startsWith("https");
      url.innerHTML = `<span class="${sur ? "sur" : "pas-sur"}">${sur ? "🔒" : "⚠ Non sécurisé"}</span> ${esc(p.url)}`;
      corps.innerHTML = `<div class="q-page"><button class="btn btn-sec" id="q-back">← Retour aux résultats</button><h3>${esc(p.titre)}</h3>${p.contenu}</div>`;
      $("#q-back").onclick = () => accueil(q);
      $("#q-back").focus();
    }
    accueil(sv.derniere || "");
    const f = $("#ch-form");
    f.addEventListener("input", (ev) => { if (ev.target.name !== "cm") { sv[ev.target.name] = ev.target.value; S.saisies[id] = sv; sauver(); } });
    f.addEventListener("change", (ev) => { if (ev.target.name === "cm") { sv.cm = [...f.querySelectorAll("[name=cm]:checked")].map((x) => +x.value); S.saisies[id] = sv; sauver(); } });
    f.onsubmit = (ev) => {
      ev.preventDefault();
      const c = e.champs[0];
      if (!String(sv[c.id] || "").trim()) { retour("info", "Note d'abord l'heure que tu as trouvée."); return; }
      essai(id);
      const coch = sv.cm || [];
      const cmOk = e.choixMultiple.options.every((o, i) => o.ok === coch.includes(i));
      const h = H(sv[c.id]), hOk = c.ok.includes(h);
      const msgs = [];
      f.querySelector("#q-choix").classList.toggle("faux", !cmOk); f.querySelector("#q-choix").classList.toggle("bon", cmOk);
      f.querySelector("#ch-" + c.id).closest(".champ").classList.toggle("faux", !hOk); f.querySelector("#ch-" + c.id).closest(".champ").classList.toggle("bon", hOk);
      if (!hOk) msgs.push(`<li><b>Heure</b> : ${esc((c.pieges && c.pieges[h]) || "ce n'est pas l'heure donnée par une source fiable. Lis bien les pages ouvertes.")}</li>`);
      if (!cmOk) {
        const pieges = e.choixMultiple.options.filter((o, i) => !o.ok && coch.includes(i));
        msgs.push(`<li><b>Indices de fiabilité</b> : ${pieges.length ? "attention, « " + esc(pieges[0].txt) + " » ne prouve rien sur la fiabilité d'un site." : "il manque au moins un indice. Relis la page « COMÈTE GRATUITE » et son adresse."}</li>`);
      }
      if (hOk && cmOk) return reussite(id);
      retour("ko", `<ul>${msgs.join("")}</ul>`);
    };
  }

  /* ---------- C3 : programmer Boulon ---------- */
  function puzCode(e, id, zone) {
    const G = e.grille, max = e.maxBlocs;
    let prog = S.c3 && S.c3.length ? JSON.parse(JSON.stringify(S.c3)) : [];
    let ouvert = prog.length && prog[prog.length - 1].t === "repeter" && prog[prog.length - 1].ouvert ? prog[prog.length - 1] : null;
    zone.append(html(`<p class="consigne">${esc(e.consigne)}</p>
      <div class="code-wrap">
        <div><div class="grille-robot" id="gr" style="--l:${G.l}" aria-label="Soute : Boulon doit rejoindre la borne de recharge"></div>
          <p class="petit legende">🤖 Boulon · ⚡ borne de recharge · ▦ caisse</p></div>
        <div class="editeur">
          <h2>Programme <span id="cpt" class="petit"></span></h2>
          <div id="liste" class="prog-edit" aria-live="polite"></div>
          <div class="palette" role="group" aria-label="Ajouter un bloc">
            <button class="btn bloc" data-b="avancer">+ avancer</button>
            <button class="btn bloc" data-b="gauche">+ tourner à gauche ↺</button>
            <button class="btn bloc" data-b="droite">+ tourner à droite ↻</button>
            <span class="rep-ctrl"><button class="btn bloc b-rep" data-b="repeter">+ répéter</button>
              <label class="sr" for="rep-n">Nombre de répétitions</label><select id="rep-n">${[2, 3, 4, 5].map((n) => `<option ${n === 3 ? "selected" : ""}>${n}</option>`).join("")}</select> fois</span>
            <button class="btn btn-sec" id="fin-rep">Fermer la boucle</button>
          </div>
          <div class="palette">
            <button class="btn btn-sec" id="annul">Effacer le dernier bloc</button>
            <button class="btn btn-sec" id="vider">Tout effacer</button>
            <button class="btn btn-grand" id="exec">▶ Exécuter</button>
          </div>
        </div>
      </div>`));
    const gr = $("#gr");
    const dirs = { N: [0, -1], E: [1, 0], S: [0, 1], O: [-1, 0] }, ordre = ["N", "E", "S", "O"];
    const fleche = { N: "↑", E: "→", S: "↓", O: "←" };
    const estCaisse = (x, y) => G.caisses.some(([a, b]) => a === x && b === y);
    function grille(pos, dir, trace, boum) {
      let h = "";
      for (let y = 0; y < G.h; y++) for (let x = 0; x < G.l; x++) {
        const r = pos && pos[0] === x && pos[1] === y, a = G.arrivee[0] === x && G.arrivee[1] === y;
        const t = trace && trace.some(([p, q]) => p === x && q === y);
        h += `<div class="case ${estCaisse(x, y) ? "caisse" : ""} ${t ? "trace" : ""} ${r && boum ? "boum" : ""}">${r ? `<span class="robot">🤖<span class="dir">${fleche[dir]}</span></span>` : a ? "⚡" : estCaisse(x, y) ? "▦" : ""}</div>`;
      }
      gr.innerHTML = h;
    }
    const compte = (p) => p.reduce((s, b) => s + 1 + (b.t === "repeter" ? compte(b.corps) : 0), 0);
    function dessine() {
      const nom = { avancer: "avancer", gauche: "tourner à gauche ↺", droite: "tourner à droite ↻" };
      const lst = (p) => `<ol class="prog">${p.map((b) => b.t === "repeter" ? `<li class="b-rep">répéter ${b.n} fois ${b.ouvert ? '<span class="ouvert">(boucle ouverte : les blocs s\'ajoutent dedans)</span>' : ""}${b.corps.length ? lst(b.corps) : '<ol class="prog"><li class="vide">(vide)</li></ol>'}</li>` : `<li class="b-${b.t}">${nom[b.t]}</li>`).join("")}</ol>`;
      $("#liste").innerHTML = prog.length ? lst(prog) : `<p class="petit">Aucun bloc. Ajoute des instructions avec les boutons.</p>`;
      const n = compte(prog);
      $("#cpt").textContent = `(${n} / ${max} blocs)`;
      $("#cpt").className = n > max ? "petit rouge" : "petit";
      $("#fin-rep").disabled = !ouvert;
      S.c3 = prog; sauver();
    }
    zone.querySelectorAll("[data-b]").forEach((b) => (b.onclick = () => {
      const t = b.dataset.b;
      if (t === "repeter") {
        if (ouvert) { retour("info", "Une boucle est déjà ouverte. Ferme-la avant d'en créer une autre."); return; }
        const bl = { t: "repeter", n: +$("#rep-n").value, corps: [], ouvert: true }; prog.push(bl); ouvert = bl;
      } else (ouvert ? ouvert.corps : prog).push({ t });
      bip("clic"); dessine();
    }));
    $("#fin-rep").onclick = () => { if (ouvert) { delete ouvert.ouvert; ouvert = null; dessine(); } };
    $("#annul").onclick = () => {
      if (ouvert && ouvert.corps.length) ouvert.corps.pop();
      else if (prog.length) { const b = prog.pop(); if (b === ouvert) ouvert = null; }
      dessine();
    };
    $("#vider").onclick = () => { prog = []; ouvert = null; dessine(); grille(G.depart, G.dir); retour("", ""); };
    let enCours = false;
    $("#exec").onclick = async () => {
      if (enCours) return;
      if (!prog.length) { retour("info", "Le programme est vide."); return; }
      if (ouvert) { delete ouvert.ouvert; ouvert = null; dessine(); }
      const n = compte(prog);
      if (n > max) { retour("ko", `Ton programme utilise ${n} blocs, mais la mémoire de Boulon n'en retient que ${max}. Une boucle « répéter » peut remplacer des blocs qui se répètent.`); return; }
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
          if (np[0] < 0 || np[1] < 0 || np[0] >= G.l || np[1] >= G.h || estCaisse(np[0], np[1])) {
            grille(pos, dir, trace, true); enCours = false;
            retour("ko", `<b>BONK !</b> Boulon a heurté ${estCaisse(np[0], np[1]) ? "une caisse" : "le mur de la soute"} après ${trace.length - 1} déplacement(s). Regarde où il s'est arrêté et corrige ton programme.`);
            return;
          }
          pos = np; trace.push([...pos]);
        }
        grille(pos, dir, trace);
        if (lent) await new Promise((r) => setTimeout(r, 260));
      }
      enCours = false;
      if (pos[0] === G.arrivee[0] && pos[1] === G.arrivee[1]) return reussite(id);
      retour("ko", "Le programme est terminé, mais Boulon n'est pas sur la borne ⚡. Compare le chemin parcouru (cases colorées) avec le chemin libre.");
    };
    dessine(); grille(G.depart, G.dir);
  }

  /* ---------- mission finale ---------- */
  function ecFinal() {
    if (!finalOuvert()) { aller("hub"); return; }
    const F = D.final;
    const cartes = Object.keys(D.cartes);
    app().append(html(`
      <section class="enigme final">
        <button class="btn btn-sec retour" id="f-ret">← Poste de pilotage</button>
        <div class="e-tete c-vert"><span class="e-id">★</span><div><h1>${esc(F.titre)}</h1><p class="e-meta"><span class="tag">Mission finale</span><span class="tag">Synthèse de toutes les énigmes</span></p></div></div>
        <div class="dialogue">${F.recit.map(bulle).join("")}</div>
        <div id="f-etape1" class="e-zone"></div>
        <div class="retour-zone" id="feedback" role="status" aria-live="polite"></div>
        <div class="indices" id="indices"></div>
        <div id="f-etape2"></div>
      </section>`));
    $("#f-ret").onclick = () => aller("hub");
    const z1 = $("#f-etape1");
    if (S.finalOk) z1.innerHTML = `<div class="deja"><p><b>Mémoire de démarrage réécrite.</b></p></div>`;
    else {
      z1.append(html(`<p class="consigne">${esc(F.consigne)} Les définitions des cartes sont dans le carnet de mission.</p>
        <form id="f-form" class="memoire">${F.lignes.map((l, i) => `<p class="m-ligne" id="ml-${i}"><label for="fl-${i}">${esc(l.avant)}</label>
          <select id="fl-${i}" data-i="${i}"><option value="">— carte —</option>${cartes.map((c) => `<option value="${c}" ${S.finalLignes[i] === c ? "selected" : ""}>${esc(D.cartes[c].nom)}</option>`).join("")}</select>
          <span>${esc(l.apres)}</span></p>`).join("")}
          <button class="btn btn-grand" type="submit">Charger la mémoire</button></form>`));
      $("#f-form").addEventListener("change", (ev) => { S.finalLignes[ev.target.dataset.i] = ev.target.value; sauver(); });
      $("#f-form").onsubmit = (ev) => {
        ev.preventDefault();
        if (F.lignes.some((_, i) => !S.finalLignes[i])) { retour("info", "Choisis une carte pour chaque ligne."); return; }
        essai("FINAL");
        const faux = F.lignes.map((l, i) => S.finalLignes[i] === l.carte ? -1 : i).filter((i) => i >= 0);
        F.lignes.forEach((_, i) => { $("#ml-" + i).classList.toggle("faux", faux.includes(i)); $("#ml-" + i).classList.toggle("bon", !faux.includes(i)); });
        if (faux.length) { retour("ko", `GLADYS : « ${faux.length} ligne(s) me donnent mal au processeur. » Les lignes à revoir sont encadrées en orange.`); return; }
        S.finalOk = true; sauver(); bip("ok"); aller("final");
      };
      blocIndices(F.indices, "FINAL", $("#indices"));
    }
    if (S.finalOk) {
      const sg = F.signal;
      $("#f-etape2").append(html(`<div class="mission"><h2>✦ ${esc(sg.titre)}</h2><p>${esc(sg.txt)}</p>
        <form id="sg-form" class="champs" novalidate><div class="champ"><label for="sg-in">${esc(sg.label)}</label><input id="sg-in" autocomplete="off" value="${esc(S.saisies.SIGNAL || "")}"></div>
        <button class="btn btn-grand" type="submit">Envoyer le signal</button></form></div><div class="indices" id="indices2"></div>`));
      $("#sg-in").oninput = (ev) => { S.saisies.SIGNAL = ev.target.value; sauver(); };
      $("#sg-form").onsubmit = (ev) => {
        ev.preventDefault();
        const v = $("#sg-in").value; if (!v.trim()) { retour("info", "Écris le nom de la balise."); return; }
        essai("SIGNAL");
        if (sg.ok.includes(H(v))) { S.signalOk = true; S.fin = Date.now(); sauver(); bip("fin"); fin(); }
        else retour("ko", "Signal refusé. Ce nom ne correspond pas à la balise. Il est écrit sur l'ONGLET de la page de la balise, pas sur la page elle-même.");
      };
      blocIndices(sg.indices, "SIGNAL", $("#indices2"));
    }
  }
  function fin() {
    app().innerHTML = "";
    app().append(html(`<section class="panneau fin-ecran"><h1>GLADYS est réveillée !</h1>
      <div class="dialogue">${D.final.succes.map(bulle).join("")}</div>
      <button class="btn btn-grand" id="fin-b">Faire mon bilan</button></section>`));
    majEntete(); $("#fin-ecran h1, .fin-ecran h1").focus?.();
    $("#fin-b").onclick = () => aller("bilan");
  }

  /* ---------- bilan pédagogique ---------- */
  function ecBilan() {
    const B = D.bilan;
    const tIndices = Object.values(S.indices).reduce((a, b) => a + b, 0);
    const lignes = idsEnigmes.map((id) => { const r = S.resolu[id] || {}; return { id, e: E[id], essais: r.essais || 0, ind: r.indices || 0 }; });
    const duree = S.fin && S.debut ? Math.round((S.fin - S.debut) / 60000) : null;
    const code = `N86-${nbResolus()}${S.finalOk && S.signalOk ? "F" : "x"}-I${tIndices}-${H((S.equipe || "") + tIndices + nbResolus()).slice(0, 3).toUpperCase()}`;
    app().append(html(`
      <section class="panneau bilan">
        <button class="btn btn-sec retour noprint" id="b-ret">← Poste de pilotage</button>
        <h1>Bilan de mission ${S.equipe ? "— " + esc(S.equipe) : ""}</h1>
        <p>${S.finalOk && S.signalOk ? "Mission accomplie : la station NÉON-86 est rallumée." : "Mission en cours."} ${duree ? `Durée : ${duree} min.` : ""} Indices utilisés : ${tIndices}. <b>Code de fin à montrer à ton professeur : <span class="code-fin">${code}</span></b></p>
        <h2>Les notions que tu as utilisées</h2>
        <table class="t-bilan"><thead><tr><th>Énigme</th><th>Notion</th><th>Essais</th><th>Indices</th></tr></thead><tbody>
          ${lignes.map((l) => `<tr><td>${l.id} · ${esc(l.e.titre)}</td><td>${esc(l.e.notion)}</td><td>${l.essais || "—"}</td><td>${l.ind}</td></tr>`).join("")}
        </tbody></table>
        <h2>Tes cartes-mémoire</h2>
        <dl class="def-liste">${cartesGagnees().map((c) => `<dt>${esc(D.cartes[c].nom)}</dt><dd>${esc(D.cartes[c].def)}</dd>`).join("")}</dl>
        <h2>Erreurs fréquentes à éviter</h2>
        <ul class="erreurs">${B.erreurs.map((x) => `<li><b>${esc(x.titre)}</b> — ${esc(x.txt)}</li>`).join("")}</ul>
        <h2>Je fais le point</h2>
        <table class="t-auto"><thead><tr><th>Compétence</th><th>Je sais faire</th><th>À retravailler</th></tr></thead><tbody>
          ${B.autoeval.map((a, i) => `<tr><td>${esc(a)}</td>
            <td><input type="radio" name="au${i}" value="ok" aria-label="Je sais faire : ${esc(a)}" ${S.auto[i] === "ok" ? "checked" : ""}></td>
            <td><input type="radio" name="au${i}" value="re" aria-label="À retravailler : ${esc(a)}" ${S.auto[i] === "re" ? "checked" : ""}></td></tr>`).join("")}
        </tbody></table>
        <h2>J'explique ma démarche</h2>
        <label for="b-expl">${esc(B.question)}</label>
        <textarea id="b-expl" rows="5">${esc(S.explication)}</textarea>
        <div class="actions noprint"><button class="btn" id="b-print">🖨 Imprimer ou enregistrer en PDF</button></div>
      </section>`));
    $("#b-ret").onclick = () => aller("hub");
    app().addEventListener("change", (ev) => { const m = (ev.target.name || "").match(/au(\d+)/); if (m) { S.auto[m[1]] = ev.target.value; sauver(); } });
    $("#b-expl").oninput = (ev) => { S.explication = ev.target.value; sauver(); };
    $("#b-print").onclick = () => window.print();
  }

  /* ---------- carnet de mission ---------- */
  function carnet() {
    const dlg = $("#carnet");
    const missions = idsEnigmes.filter((id) => E[id].mission && S.vu[id]);
    $("#carnet-corps").innerHTML = `
      <h3>Progression</h3>
      <ul class="carnet-prog">${D.secteurs.map((s) => `<li><b>${esc(s.nom)}</b><ul>${s.enigmes.map((id) => `<li>${puce(id)} <button class="lien" data-go="${id}">${esc(E[id].titre)}</button>${!estOuvert(id) ? ` <span class="petit">— ${esc(E[id].verrou)}</span>` : ""}</li>`).join("")}</ul></li>`).join("")}
        <li><b>Mission finale</b> : ${finalOuvert() ? (S.finalOk && S.signalOk ? "terminée ✔" : "ouverte !") : `${nbResolus()}/9 énigmes réparées`}</li></ul>
      <h3>Cartes-mémoire (${cartesGagnees().length}/11)</h3>
      ${cartesGagnees().length ? `<dl class="def-liste">${cartesGagnees().map((c) => `<dt>${esc(D.cartes[c].nom)}</dt><dd>${esc(D.cartes[c].def)}</dd>`).join("")}</dl>` : "<p>Aucune carte pour l'instant. Répare une énigme pour en gagner.</p>"}
      <h3>Missions hors écran</h3>
      ${missions.length ? missions.map((id) => { const m = E[id].mission; return `<div class="mission mini"><h4>${puce(id)} ${id} · ${esc(m.titre)}</h4><ol>${m.etapes.map((t) => `<li>${esc(t)}</li>`).join("")}</ol><p><b>À rapporter :</b> ${esc(m.rapporter)}</p>
        ${E[id].telechargement ? `<p><a href="${esc(E[id].telechargement.fichier)}" download>⬇ ${esc(E[id].telechargement.label)}</a></p>` : ""}</div>`; }).join("") : "<p>Les consignes des missions sur papier, dans les fichiers ou dans le navigateur apparaîtront ici dès que tu ouvriras ces énigmes.</p>"}
      ${S.resolu.B2 ? `<h3>Balise relais</h3><p>La balise s'est cachée. Pour la retrouver : favoris (étoile ☆) ou historique (Ctrl + H, Cmd + Y sur Mac).</p>` : ""}`;
    dlg.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => { fermerCarnet(); const id = b.dataset.go; estOuvert(id) ? aller("enigme", id) : aller("secteur", secteurDe(id).id); }));
    dlg.hidden = false; $("#carnet-fermer").focus();
  }
  function fermerCarnet() { $("#carnet").hidden = true; $("#btn-carnet").focus(); }

  function annonce(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(annonce.t);
    annonce.t = setTimeout(() => (t.hidden = true), 6000);
  }

  /* ---------- démarrage ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    $("#btn-carnet").onclick = carnet;
    $("#carnet-fermer").onclick = fermerCarnet;
    $("#carnet").addEventListener("keydown", (ev) => { if (ev.key === "Escape") fermerCarnet(); });
    $("#btn-hub").onclick = () => aller("hub");
    $("#btn-son").onclick = () => { S.son = !S.son; sauver(); majEntete(); bip("ok"); };
    $("#btn-reset").onclick = () => {
      if (confirm("Effacer toute la progression de cet équipage et recommencer ? Cette action ne peut pas être annulée.")) {
        try { localStorage.removeItem(CLE); } catch (e) {}
        S = etatNeuf(); aller("titre");
      }
    };
    $("#btn-bilan").onclick = () => aller("bilan");
    // Retour sur l'onglet du jeu après une mission hors écran : on réaffiche l'état sauvegardé
    window.addEventListener("storage", (ev) => { if (ev.key === CLE) { const s = charger(); if (s) S = s; } });
    aller("titre");
  });
  window.NEON_DEBUG = { etat: () => S, aller };
})();
