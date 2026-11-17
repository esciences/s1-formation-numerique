/* =====================================================================
   GTA · Gère. Traque. Agis. · Moteur de l'application
   - Aucune donnée envoyée sur Internet. Progression = localStorage.
   - Les contenus sont dans data.js ; les visuels dans visuals.js.
   ===================================================================== */
(function () {
  "use strict";
  const D = VC.DATA, V = VC.V;
  const KEY = D.meta.storageKey;
  const CORE = ["m0", "m1", "m2", "m3", "m4", "mF"];

  /* ---------- utilitaires ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const num = (n, d = 1) => Number(n).toLocaleString("fr-BE", { maximumFractionDigits: d });
  const money = (n) => "$ " + Number(n).toLocaleString("fr-BE");
  const M = (id) => D.missions.find((m) => m.id === id);
  const tpl = (s, o) => s.replace(/\{(\w+)\}/g, (_, k) => (o[k] !== undefined ? o[k] : ""));

  /* ---------- sauvegarde locale ---------- */
  const store = {
    get() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } },
    set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* stockage indisponible : on continue sans */ } },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} },
  };
  function fresh() {
    const missions = {};
    D.missions.forEach((m) => (missions[m.id] = { status: m.id === "m0" ? "open" : "locked", step: 0, errors: 0, hints: 0, reveals: 0, wantedEnd: 0, maxWanted: 0, extra: 0, startedAt: null, doneAt: null, earned: 0 }));
    const skills = {};
    Object.keys(D.skills).forEach((k) => (skills[k] = { tries: 0, errors: 0, ok: 0, reveals: 0 }));
    let reduce = false;
    try { reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
    return { v: 1, created: Date.now(), current: null, missions, skills, wallet: 0, wanted: 0, badges: [], notebook: [], settings: { reduce, big: false }, name: "", finishedAt: null, clock: "18:00" };
  }
  function load() {
    const s = store.get();
    if (!s || s.v !== 1) return fresh();
    const f = fresh();
    for (const k in f.missions) if (!s.missions[k]) s.missions[k] = f.missions[k];
    for (const k in f.skills) if (!s.skills[k]) s.skills[k] = f.skills[k];
    s.settings = Object.assign(f.settings, s.settings || {});
    return s;
  }
  let S = load();
  const save = () => store.set(S);
  const ms = (id) => S.missions[id];
  const hasProgress = () => Object.values(S.missions).some((m) => m.status === "done" || m.step > 0) || S.current;

  /* ---------- squelette ---------- */
  const app = $("#app");
  app.innerHTML = `
    <header id="hud" class="hud" hidden></header>
    <main id="screen" class="screen" tabindex="-1"></main>
    <div id="toasts" class="toasts" aria-live="polite"></div>
    <div id="modal" class="modal" hidden></div>
    <div id="sr" class="sr-only" aria-live="assertive"></div>
    <div id="print-report" class="print-report"></div>`;
  const screen = $("#screen");
  const announce = (t) => { $("#sr").textContent = ""; setTimeout(() => ($("#sr").textContent = t.replace(/<[^>]+>/g, "")), 30); };

  function applySettings() {
    document.body.classList.toggle("reduce", !!S.settings.reduce);
    document.body.classList.toggle("big", !!S.settings.big);
  }
  applySettings();

  /* =====================================================================
     HUD · étoiles · portefeuille · notifications
     ===================================================================== */
  let hudMode = "map"; // map | mission
  let currentMissionId = null;
  function renderHUD() {
    const hud = $("#hud");
    hud.hidden = false;
    const done = CORE.filter((id) => ms(id).status === "done").length;
    const m = currentMissionId ? M(currentMissionId) : null;
    hud.innerHTML = `
      <div class="hud-l">
        <button class="hud-brand" data-act="map" aria-label="GTA, Gère, Traque, Agis : retour à la carte"><span class="hb-v">GTA</span><span class="hb-c">Gère<i>·</i>Traque<i>·</i>Agis</span></button>
        <div class="hud-mission">${m ? `<span class="hm-code">${m.kind === "final" ? "FINALE" : m.kind === "bonus" ? "BONUS" : m.kind === "prologue" ? "PROLOGUE" : "MISSION " + m.code}</span><b>${esc(m.title)}</b>` : `<span class="hm-code">CARTE</span><b>État de Leonida</b>`}</div>
      </div>
      <div class="hud-c" aria-label="Progression : ${done} missions sur ${CORE.length}">
        <div class="hud-prog"><i style="width:${(done / CORE.length) * 100}%"></i></div><small>${done}/${CORE.length} missions</small>
      </div>
      <div class="hud-r">
        <span class="hud-clock" title="Heure dans l'histoire">🕖 ${esc(S.clock)}</span>
        <span class="hud-money" id="hud-money" title="Portefeuille (fictif)">${money(S.wallet)}</span>
        <span class="hud-stars" id="hud-stars" role="img" aria-label="Niveau de recherche : ${S.wanted} étoile${S.wanted > 1 ? "s" : ""} sur 5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= S.wanted ? "on" : ""}">★</i>`).join("")}</span>
        <button class="hud-btn" data-act="notebook" aria-label="Carnet des notions">📖<span>Carnet</span></button>
        <button class="hud-btn" data-act="settings" aria-label="Paramètres">⚙️</button>
      </div>`;
  }
  function refreshStars(flash) {
    const st = $("#hud-stars");
    if (!st) return;
    st.innerHTML = [1, 2, 3, 4, 5].map((i) => `<i class="${i <= S.wanted ? "on" : ""}">★</i>`).join("");
    st.setAttribute("aria-label", `Niveau de recherche : ${S.wanted} étoile${S.wanted > 1 ? "s" : ""} sur 5`);
    if (flash) { st.classList.remove("flash-" + flash); void st.offsetWidth; st.classList.add("flash-" + flash); }
  }
  function refreshMoney(from) {
    const mEl = $("#hud-money");
    if (!mEl) return;
    if (from === undefined || S.settings.reduce) { mEl.textContent = money(S.wallet); return; }
    const to = S.wallet, t0 = performance.now(), dur = 900;
    const step = (t) => { const k = Math.min(1, (t - t0) / dur); mEl.textContent = money(Math.round(from + (to - from) * k)); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function toast(title, text, kind = "info", icon = "📱") {
    const box = $("#toasts");
    const t = el(`<div class="toast tk-${kind}"><span class="toast-i" aria-hidden="true">${icon}</span><div><b>${title}</b>${text ? `<p>${text}</p>` : ""}</div></div>`);
    box.appendChild(t);
    while (box.children.length > 2) box.firstElementChild.remove();
    setTimeout(() => t.classList.add("out"), 2800);
    setTimeout(() => t.remove(), 3300);
  }
  function wantedUp() {
    S.wanted = Math.min(5, S.wanted + 1);
    if (currentMissionId) ms(currentMissionId).maxWanted = Math.max(ms(currentMissionId).maxWanted, S.wanted);
    refreshStars("up");
    const msg = S.wanted >= 4 ? "Alerte maximale… mais rien n'est perdu : lis l'explication ou demande un indice." : "Pas de panique : lis l'explication, puis réessaie.";
    toast(`Niveau de recherche ${"★".repeat(S.wanted)}`, msg, "warn", "🚨");
    save();
  }
  function wantedDown(reason) {
    if (S.wanted <= 0) return;
    S.wanted -= 1;
    refreshStars("down");
    toast("Tu sèmes les Requins · −1 ★", reason, "good", "🌴");
    save();
  }

  /* délégation des boutons du HUD et des éléments role=button */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]");
    if (!b) return;
    const a = b.dataset.act;
    if (a === "map") goMap();
    if (a === "notebook") openNotebook();
    if (a === "settings") openSettings();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("#modal").hidden) closeModal();
    const t = e.target;
    if ((e.key === "Enter" || e.key === " ") && t.getAttribute && t.getAttribute("role") === "button" && t.tagName !== "BUTTON") { e.preventDefault(); t.click(); }
  });

  /* ---------- modale ---------- */
  let lastFocus = null;
  function openModal(title, html, cls = "") {
    lastFocus = document.activeElement;
    const mo = $("#modal");
    mo.innerHTML = `<div class="modal-back" data-close></div><div class="modal-card ${cls}" role="dialog" aria-modal="true" aria-labelledby="mtitle">
      <div class="modal-h"><h2 id="mtitle">${title}</h2><button class="btn ghost sm" data-close aria-label="Fermer">✕</button></div><div class="modal-b">${html}</div></div>`;
    mo.hidden = false;
    $$("[data-close]", mo).forEach((b) => b.addEventListener("click", closeModal));
    setTimeout(() => { const f = $(".modal-card button, .modal-card input", mo); if (f) f.focus(); }, 20);
    return mo;
  }
  function closeModal() { $("#modal").hidden = true; $("#modal").innerHTML = ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  function confirmBox(title, text, yes, onYes) {
    const mo = openModal(title, `<p>${text}</p><div class="row-end"><button class="btn ghost" data-close>Annuler</button><button class="btn danger" id="cf-yes">${yes}</button></div>`, "small");
    $("#cf-yes", mo).addEventListener("click", () => { closeModal(); onYes(); });
  }

  /* =====================================================================
     ÉCRAN TITRE
     ===================================================================== */
  function goTitle() {
    currentMissionId = null;
    $("#toasts").innerHTML = "";
    $("#hud").hidden = true;
    document.body.dataset.screen = "title";
    const prog = hasProgress();
    const cur = S.current ? M(S.current.mid) : null;
    screen.innerHTML = `
      <section class="title-screen">
        ${V.titleScene()}
        <div class="title-inner">
          <div class="t-kicker"><span></span>${esc(D.meta.course)}<span></span></div>
          <h1 class="t-logo" aria-label="GTA : Gère. Traque. Agis."><span class="tl-vice">GTA</span><span class="tl-check">${D.meta.verbs.map((v) => `<b>${esc(v.word)}.</b>`).join("")}</span></h1>
          <p class="t-pitch">${esc(D.meta.pitch)}</p>
          <ul class="t-verbs">${D.meta.verbs.map((v) => `<li><span class="tv-l" aria-hidden="true">${v.id}</span><span><b>${esc(v.word)}</b> ${esc(v.text)}</span></li>`).join("")}</ul>
          <div class="t-btns">
            ${prog ? `<button class="btn primary xl" id="t-continue">▶ ${cur ? "Reprendre · " + esc(cur.title) : "Continuer l'aventure"}</button>
                      <button class="btn ghost" id="t-new">Nouvelle partie</button>`
                   : `<button class="btn primary xl" id="t-start">▶ Commencer l'opération</button>`}
          </div>
          <div class="t-meta"><span>⏱ ${esc(D.meta.duration)}</span><span>👥 seul·e ou à 2-3</span><span>💾 progression gardée sur cet ordinateur</span></div>
          <div class="t-links"><button class="link" id="t-teacher">Espace enseignant</button><button class="link" id="t-settings">Accessibilité</button></div>
        </div>
        <p class="t-legal">Parcours pédagogique non officiel, sans lien avec Rockstar Games. Aucune image du jeu : illustrations originales. Le jeu est classé PEGI 18 : on ne joue pas, on enquête.</p>
      </section>`;
    const st = $("#t-start"), ct = $("#t-continue"), nw = $("#t-new");
    if (st) st.addEventListener("click", () => startMission("m0"));
    if (ct) ct.addEventListener("click", () => { if (S.current && ms(S.current.mid).status !== "done") openStep(S.current.mid, S.current.step); else goMap(); });
    if (nw) nw.addEventListener("click", () => confirmBox("Nouvelle partie ?", "Toute ta progression sur cet ordinateur sera effacée.", "Tout recommencer", resetAll));
    $("#t-teacher").addEventListener("click", goTeacher);
    $("#t-settings").addEventListener("click", openSettings);
    (st || ct).focus();
  }
  function resetAll() { const settings = S.settings; store.clear(); S = fresh(); S.settings = settings; save(); goTitle(); }

  /* =====================================================================
     CARTE
     ===================================================================== */
  function nextMission() { return CORE.find((id) => ms(id).status !== "done" && ms(id).status !== "locked") || null; }
  function goMap() {
    currentMissionId = null;
    S.current = null; S.wanted = 0; save();
    document.body.dataset.screen = "map";
    renderHUD();
    const nxt = nextMission();
    const allDone = CORE.every((id) => ms(id).status === "done");
    const pins = D.order.map((id) => { const m = M(id); return { id, x: m.map.x, y: m.map.y, icon: m.map.icon, label: m.kind === "final" ? "FINALE" : m.kind === "bonus" ? "BONUS" : m.code, status: ms(id).status }; });
    screen.innerHTML = `
      <section class="map-screen">
        <div class="map-wrap">${V.mapSVG(pins, nxt)}
          <div class="gps"><span class="gps-i">🧭</span><div><small>GPS · prochain objectif</small><b>${nxt ? esc(M(nxt).title) + " · " + esc(M(nxt).place) : allDone ? "Leonida est sauvée ! Consulte ton bilan." : "Termine la mission en cours."}</b></div></div>
        </div>
        <aside class="mission-list" aria-label="Liste des missions">
          <h2 class="ml-title">Feuille de route</h2>
          ${allDone ? `<button class="btn primary block" id="go-dash">🏆 Voir mon bilan d'agent</button>` : ""}
          <ol>${D.order.map((id) => missionCard(id, id === nxt)).join("")}</ol>
        </aside>
      </section>`;
    $$(".mc-go", screen).forEach((b) => b.addEventListener("click", () => startMission(b.dataset.id)));
    $$(".pin", screen).forEach((p, i) => {
      const id = D.order[i];
      if (ms(id).status !== "locked") { p.style.cursor = "pointer"; p.addEventListener("click", () => startMission(id)); }
    });
    const gd = $("#go-dash"); if (gd) gd.addEventListener("click", goDashboard);
    const first = $(".mc.next .mc-go", screen) || $("#go-dash") || $(".mc-go", screen);
    if (first) first.focus();
  }
  function missionCard(id, isNext) {
    const m = M(id), st = ms(id), steps = m.steps.length;
    const label = { locked: "🔒 Verrouillée", open: st.step > 0 ? `⏸ En cours · étape ${st.step + 1}/${steps}` : "▶ Disponible", done: "✔ Réussie" }[st.status];
    const kind = m.kind === "final" ? "Finale" : m.kind === "bonus" ? "Bonus · facultatif" : m.kind === "prologue" ? "Prologue" : "Mission " + m.code;
    return `<li class="mc mc-${st.status}${isNext ? " next" : ""}${m.kind ? " mc-" + m.kind : ""}">
      <div class="mc-icon" aria-hidden="true">${st.status === "locked" ? "🔒" : m.map.icon}</div>
      <div class="mc-body"><small>${verbChip(m)}${kind} · ${esc(m.time !== "—" ? m.time + " · " : "")}≈ ${m.minutes} min</small><b>${esc(m.title)}</b><span class="mc-st">${label}${st.status === "done" && m.badge ? ` · ${m.badge.icon}` : ""}</span></div>
      ${st.status !== "locked" ? `<button class="btn ${isNext ? "primary" : "ghost"} sm mc-go" data-id="${id}" aria-label="${st.status === "done" ? "Rejouer" : "Lancer"} : ${esc(m.title)}">${st.status === "done" ? "Rejouer" : st.step > 0 ? "Reprendre" : "Go"}</button>` : ""}
    </li>`;
  }

  function verbChip(m, where) {
    if (!m.verb) return "";
    const letters = m.verb.split("").map((l) => D.meta.verbs.find((v) => v.id === l)).filter(Boolean);
    if (where === "intro") return `<div class="intro-verb">${letters.map((v) => `<span class="vb vb-${v.id}">${v.icon} ${esc(v.word)}</span>`).join("")}</div>`;
    return letters.map((v) => `<span class="vb-mini vb-${v.id}" title="${esc(v.word)}">${v.id}</span>`).join("") + " ";
  }

  /* =====================================================================
     INTRO DE MISSION (cinématique)
     ===================================================================== */
  function startMission(id) {
    const m = M(id), st = ms(id);
    if (st.status === "locked") return;
    currentMissionId = id;
    S.wanted = 0;
    if (m.time && m.time !== "—") S.clock = m.time;
    save();
    document.body.dataset.screen = "intro";
    renderHUD();
    const resume = st.status !== "done" && st.step > 0;
    screen.innerHTML = `
      <section class="intro-screen ${m.kind || ""}">
        <div class="letterbox top"></div><div class="letterbox bottom"></div>
        <div class="intro-inner">
          <div class="intro-place">📍 ${esc(m.place)}${m.time !== "—" ? " · " + esc(m.time) : ""}</div>
          ${verbChip(m, "intro")}
          <div class="intro-code">${m.kind === "final" ? "MISSION FINALE" : m.kind === "bonus" ? "MISSION BONUS" : m.kind === "prologue" ? "PROLOGUE" : "MISSION " + m.code}</div>
          <h1 class="intro-title" tabindex="-1">${esc(m.title)}</h1>
          <p class="intro-obj"><span>Objectif</span>${esc(m.objective)}</p>
          <div class="intro-skills">${m.skills.map((k) => `<span class="chip">${esc(D.skills[k].label)}</span>`).join("")}</div>
          <div class="intro-meta"><span>⏱ ≈ ${m.minutes} min</span><span>💰 ${money(m.reward)}</span>${m.badge ? `<span>${m.badge.icon} badge « ${esc(m.badge.name)} »</span>` : ""}</div>
          <div class="intro-btns">
            <button class="btn primary xl" id="in-go">${resume ? `▶ Reprendre à l'étape ${st.step + 1}` : st.status === "done" ? "▶ Rejouer" : "▶ Commencer"}</button>
            ${resume ? `<button class="btn ghost" id="in-restart">Recommencer la mission</button>` : ""}
            <button class="btn ghost" data-act="map">Retour à la carte</button>
          </div>
        </div>
      </section>`;
    $("#in-go").addEventListener("click", () => { if (!st.startedAt || st.status === "done") st.startedAt = Date.now(); openStep(id, st.status === "done" ? 0 : st.step); });
    const rs = $("#in-restart"); if (rs) rs.addEventListener("click", () => { st.step = 0; st.startedAt = Date.now(); openStep(id, 0); });
    $(".intro-title").focus();
  }

  /* =====================================================================
     ÉTAPES
     ===================================================================== */
  function openStep(id, idx) {
    const m = M(id), st = ms(id);
    currentMissionId = id;
    if (st.status !== "done") st.step = idx;
    S.current = { mid: id, step: idx };
    if (!st.startedAt) st.startedAt = Date.now();
    if (m.time && m.time !== "—") S.clock = m.time;
    save();
    document.body.dataset.screen = "step";
    renderHUD();
    const step = m.steps[idx];
    const dots = m.steps.map((s, i) => `<i class="${i < idx ? "done" : i === idx ? "cur" : ""}" title="Étape ${i + 1}"></i>`).join("");
    screen.innerHTML = `
      <section class="step-screen">
        <div class="step-bar">
          <div class="sb-obj"><span class="gps-i" aria-hidden="true">🧭</span><span><small>Objectif</small>${esc(m.objective)}</span></div>
          <div class="sb-dots" aria-label="Étape ${idx + 1} sur ${m.steps.length}">${dots}<span>Étape ${idx + 1}/${m.steps.length}</span></div>
        </div>
        <div class="step-body" id="step-body"></div>
      </section>`;
    const body = $("#step-body");
    const next = () => { if (idx + 1 < m.steps.length) openStep(id, idx + 1); else missionPassed(id); };
    const R = RENDER[step.type];
    if (!R) { body.textContent = "Type d'étape inconnu : " + step.type; return; }
    window.scrollTo(0, 0);
    screen.focus({ preventScroll: true }); // les rendus déplacent ensuite le focus vers leur bouton principal
    R(body, step, next, m);
  }

  /* ---------- cadre commun des exercices ---------- */
  function exFrame(body, step, opts) {
    const m = M(currentMissionId);
    const lockBar = step.lock ? lockHeader(step.lock) : "";
    const root = el(`<div class="ex">
      ${lockBar}
      <div class="ex-head"><span class="ex-kind">${opts.kind || "À toi de jouer"}</span>${step.prompt ? `<h2 class="ex-prompt">${step.prompt}</h2>` : ""}${step.tip ? `<p class="ex-tip">💬 ${step.tip}</p>` : ""}</div>
      <div class="ex-body"></div>
      <div class="ex-hint" hidden></div>
      <div class="ex-fb" hidden></div>
      <div class="ex-tools">
        ${step.hints && step.hints.length ? `<button class="btn ghost sm" data-x="hint">💡 Indice <span class="hint-c">(0/${step.hints.length})</span></button>` : ""}
        ${step.notion ? `<button class="btn ghost sm" data-x="notion">📖 Revoir la notion</button>` : ""}
        <button class="btn ghost sm" data-x="reveal" hidden>🆘 Voir la solution expliquée</button>
        <span class="grow"></span>
        ${opts.noCheck ? "" : `<button class="btn primary" data-x="check">${opts.checkLabel || "Vérifier"}</button>`}
      </div></div>`);
    body.appendChild(root);
    const ctx = {
      root, body: $(".ex-body", root), tries: 0, hintIdx: 0, solved: false, step,
      fbBox: $(".ex-fb", root),
      feedback(kind, html, buttons = "") {
        const icon = { right: "✔", wrong: "✘", info: "ℹ", reveal: "🆘" }[kind];
        const title = { right: "Bien joué !", wrong: "Pas encore…", info: "À noter", reveal: "La solution expliquée" }[kind];
        ctx.fbBox.className = "ex-fb fb-" + kind;
        ctx.fbBox.hidden = false;
        ctx.fbBox.innerHTML = `<div class="fb-h"><span class="fb-i" aria-hidden="true">${icon}</span><b>${title}</b></div><div class="fb-t">${html}</div>${buttons ? `<div class="fb-btns">${buttons}</div>` : ""}`;
        announce(title + ". " + html);
        const go = $(".fb-next", ctx.fbBox);
        if (go) { go.addEventListener("click", opts.next); setTimeout(() => go.focus(), 30); }
        const nt = $(".fb-notion", ctx.fbBox); if (nt) nt.addEventListener("click", () => showNotion(step.notion));
        if (!go) ctx.fbBox.scrollIntoView({ block: "nearest", behavior: S.settings.reduce ? "auto" : "smooth" });
      },
      success(html) {
        if (ctx.solved) return;
        ctx.solved = true;
        const sk = S.skills[step.skill]; if (sk) sk.ok += 1;
        if (ctx.tries > 0) wantedDown("Tu as corrigé ton raisonnement.");
        root.classList.add("is-solved");
        const chk = $('[data-x="check"]', root); if (chk) chk.disabled = true;
        if (step.lock) openLock(step.lock);
        ctx.feedback("right", `${html ? html + " " : ""}${step.success ? `<span class="fb-why">${step.success}</span>` : ""}`, `<button class="btn primary fb-next">Continuer ➜</button>`);
        save();
      },
      fail(html, opts2 = {}) {
        if (ctx.solved) return;
        ctx.tries += 1;
        const st = ms(currentMissionId); st.errors += 1;
        const sk = S.skills[step.skill]; if (sk) sk.errors += 1;
        wantedUp();
        const rv = $('[data-x="reveal"]', root);
        if (ctx.tries >= 3 && rv && opts.reveal) rv.hidden = false;
        ctx.feedback("wrong", `${html}<p class="fb-retry">${opts2.retry || "Corrige, puis vérifie à nouveau."}${ctx.tries >= 3 && opts.reveal ? " Tu peux aussi afficher la solution expliquée." : ""}</p>`,
          step.notion ? `<button class="btn ghost sm fb-notion">📖 Revoir la notion</button>` : "");
        save();
      },
      info(html) { ctx.feedback("info", html); },
    };
    const sk = S.skills[step.skill];
    const hintBtn = $('[data-x="hint"]', root);
    if (hintBtn) hintBtn.addEventListener("click", () => {
      if (ctx.hintIdx >= step.hints.length) return;
      const hb = $(".ex-hint", root);
      hb.hidden = false;
      hb.insertAdjacentHTML("beforeend", `<p><b>Indice ${ctx.hintIdx + 1}</b> · ${step.hints[ctx.hintIdx]}</p>`);
      ctx.hintIdx += 1;
      $(".hint-c", hintBtn).textContent = `(${ctx.hintIdx}/${step.hints.length})`;
      if (ctx.hintIdx >= step.hints.length) hintBtn.disabled = true;
      ms(currentMissionId).hints += 1;
      wantedDown("Indice consulté : bonne idée !");
      if (opts.onHint) opts.onHint(ctx.hintIdx);
      announce(step.hints[ctx.hintIdx - 1]);
      save();
    });
    const nb = $('[data-x="notion"]', root); if (nb) nb.addEventListener("click", () => showNotion(step.notion));
    const rv = $('[data-x="reveal"]', root);
    if (rv) rv.addEventListener("click", () => {
      if (ctx.solved) return;
      ctx.solved = true;
      ms(currentMissionId).reveals += 1;
      if (sk) sk.reveals += 1;
      const txt = opts.reveal ? opts.reveal() : "";
      root.classList.add("is-revealed");
      const chk = $('[data-x="check"]', root); if (chk) chk.disabled = true;
      if (step.lock) openLock(step.lock);
      ctx.feedback("reveal", `${txt || ""}${step.success ? ` <span class="fb-why">${step.success}</span>` : ""}<p class="small">Cette notion apparaîtra dans « À retravailler » de ton bilan : c'est normal, c'est fait pour ça.</p>`, `<button class="btn primary fb-next">Continuer ➜</button>`);
      save();
    });
    const chk = $('[data-x="check"]', root);
    if (chk) chk.addEventListener("click", () => { if (ctx.solved) return; if (sk) sk.tries += 1; opts.check(ctx); });
    return ctx;
  }
  function lockHeader(n) {
    const doneLocks = n - 1;
    return `<div class="locks" aria-label="Cadenas ${n} sur 5">${[1, 2, 3, 4, 5].map((i) => `<span class="lk ${i <= doneLocks ? "open" : i === n ? "cur" : ""}" data-lk="${i}">${i <= doneLocks ? "🔓" : "🔒"}</span>`).join("")}<b>Cadenas ${n}/5</b></div>`;
  }
  function openLock(n) { const l = $(`.lk[data-lk="${n}"]`); if (l) { l.textContent = "🔓"; l.classList.add("open", "pop"); } }

  /* =====================================================================
     RENDUS PAR TYPE D'ÉTAPE
     ===================================================================== */
  const RENDER = {};

  /* ---------- STORY : téléphone ---------- */
  RENDER.story = async (body, step, next) => {
    const note = step.note ? `<div class="data-note"><div><span class="tag t-off">OFFICIEL</span>${esc(step.note.official)}</div><div><span class="tag t-fic">FICTIF</span>${esc(step.note.fictional)}</div></div>` : "";
    body.innerHTML = `<div class="story">
      <div class="phone" role="log" aria-label="Messages reçus">
        <div class="ph-top"><span>📶 Leonida Mobile</span><span>${esc(S.clock)}</span><span>🔋 87%</span></div>
        <div class="ph-head"><b>Brigade · messages</b><small>chiffrés de bout en bout</small></div>
        <div class="ph-msgs" id="ph-msgs"></div>
        <div class="ph-foot"><button class="btn ghost sm" id="ph-skip">Tout afficher</button></div>
      </div>
      <div class="story-side">${storyCard()}${note}<button class="btn primary xl" id="ph-cta" hidden>${esc(step.cta || "Continuer")} ➜</button></div></div>`;
    const box = $("#ph-msgs", body);
    let skip = false;
    $("#ph-skip", body).addEventListener("click", () => { skip = true; });
    const cta = $("#ph-cta", body);
    cta.addEventListener("click", next);
    for (const msg of step.messages) {
      const c = D.contacts[msg.from] || D.contacts.unknown;
      if (!skip && !S.settings.reduce) {
        const typing = el(`<div class="msg typing ${msg.from === "dee" ? "" : "them"}"><span class="av" style="background:${c.color}">${c.initials}</span><div class="bubble"><i></i><i></i><i></i></div></div>`);
        box.appendChild(typing); box.scrollTop = box.scrollHeight;
        await new Promise((r) => setTimeout(r, Math.min(1400, 450 + msg.text.length * 12)));
        typing.remove();
      }
      const bubble = msg.style === "link"
        ? `<div class="bubble link"><span class="lk-ic">🔗</span><span><b>${esc(msg.text.replace("🔗 ", ""))}</b><small>Lien désactivé par la Brigade · simulation</small></span></div>`
        : `<div class="bubble">${esc(msg.text)}</div>`;
      box.appendChild(el(`<div class="msg ${msg.from === "dee" ? "" : "them"}"><span class="av" style="background:${c.color}" aria-hidden="true">${c.initials}</span><div><small class="who">${esc(c.name)}${c.role ? " · " + esc(c.role) : ""}</small>${bubble}</div></div>`));
      box.scrollTop = box.scrollHeight;
    }
    $("#ph-skip", body).hidden = true;
    cta.hidden = false; cta.focus();
  };

  function storyCard() {
    const m = M(currentMissionId);
    return `<div class="story-card">${V.missionArt(m.id)}<div class="sc-t"><span>${m.kind === "final" ? "MISSION FINALE" : m.kind === "bonus" ? "MISSION BONUS" : m.kind === "prologue" ? "PROLOGUE" : "MISSION " + m.code}</span><b>${esc(m.title)}</b><small>📍 ${esc(m.place)}${m.time !== "—" ? " · 🕖 " + esc(m.time) : ""}</small></div></div>`;
  }

  /* ---------- LEARN : fiche notion en diapositives ---------- */
  function learnView(step, onDone, inModal) {
    let i = 0;
    const wrap = el(`<div class="learn ${inModal ? "in-modal" : ""}">
      ${inModal ? "" : `<div class="learn-head"><span class="ex-kind">${esc(step.kicker || "Découverte")}</span><h2>${esc(step.title)}</h2></div>`}
      <div class="learn-slide" aria-live="polite"></div>
      <div class="learn-nav"><button class="btn ghost sm" data-l="prev">◀ Précédent</button><div class="learn-dots"></div><button class="btn primary" data-l="next"></button></div></div>`);
    const slideEl = $(".learn-slide", wrap), prev = $('[data-l="prev"]', wrap), nextB = $('[data-l="next"]', wrap), dots = $(".learn-dots", wrap);
    function show() {
      const sl = step.slides[i];
      slideEl.innerHTML = `<div class="ls-visual">${V.visual(sl.visual)}</div><div class="ls-text">${sl.html}</div>`;
      slideEl.classList.remove("enter"); void slideEl.offsetWidth; slideEl.classList.add("enter");
      prev.disabled = i === 0;
      const last = i === step.slides.length - 1;
      nextB.textContent = last ? (inModal ? "Fermer" : "J'ai compris ➜") : "Suivant ▶";
      dots.innerHTML = step.slides.length > 1 ? step.slides.map((_, k) => `<i class="${k === i ? "cur" : ""}"></i>`).join("") + `<span>${i + 1}/${step.slides.length}</span>` : "";
    }
    prev.addEventListener("click", () => { if (i > 0) { i--; show(); } });
    nextB.addEventListener("click", () => { if (i < step.slides.length - 1) { i++; show(); nextB.focus(); } else onDone(); });
    show();
    return wrap;
  }
  RENDER.learn = (body, step, next) => {
    if (!S.notebook.includes(step.id)) { S.notebook.push(step.id); save(); toast("Carnet mis à jour", `Nouvelle notion : ${step.title}`, "info", "📖"); }
    body.appendChild(learnView(step, next, false));
    $('[data-l="next"]', body).focus();
  };
  function findNotion(id) { for (const m of D.missions) for (const s of m.steps) if (s.type === "learn" && s.id === id) return s; return null; }
  function showNotion(id) {
    const n = findNotion(id); if (!n) return;
    const mo = openModal(`📖 ${esc(n.title)}`, "", "wide");
    $(".modal-b", mo).appendChild(learnView(n, closeModal, true));
  }
  function openNotebook() {
    const items = S.notebook.map((id) => findNotion(id)).filter(Boolean);
    const mo = openModal("📖 Carnet de l'agent", items.length ? `<p>Les notions que tu as découvertes. Clique pour les relire.</p><div class="nb-list">${items.map((n) => `<button class="nb-item" data-n="${n.id}"><span>${esc(n.kicker || "")}</span><b>${esc(n.title)}</b></button>`).join("")}</div>` : `<p>Ton carnet est vide pour l'instant. Les notions s'y ajoutent au fil des missions.</p>`);
    $$(".nb-item", mo).forEach((b) => b.addEventListener("click", () => showNotion(b.dataset.n)));
  }

  /* ---------- CHOICE : choix simple ou multiple ---------- */
  RENDER.choice = (body, step, next) => {
    const sel = new Set();
    const ctx = exFrame(body, step, {
      next, kind: step.lock ? "Cadenas" : step.multi ? "Plusieurs réponses" : "Une seule réponse",
      check(ctx) {
        if (!sel.size) return ctx.info("Sélectionne au moins une réponse avant de vérifier.");
        $$(".opt", ctx.body).forEach((o) => o.classList.remove("ko"));
        const correct = step.options.filter((o) => o.correct).map((o) => o.id);
        const wrongSel = [...sel].filter((id) => !correct.includes(id));
        const missing = correct.filter((id) => !sel.has(id));
        if (!wrongSel.length && !missing.length) {
          $$(".opt", ctx.body).forEach((o) => { if (sel.has(o.dataset.id)) o.classList.add("ok"); o.disabled = true; });
          const fbs = step.options.filter((o) => sel.has(o.id)).map((o) => o.fb).filter(Boolean);
          return ctx.success(fbs.map((f) => `<span class="fb-line">✔ ${f}</span>`).join(""));
        }
        wrongSel.forEach((id) => { const o = $(`.opt[data-id="${id}"]`, ctx.body); if (o) o.classList.add("ko"); });
        let html = wrongSel.map((id) => `<span class="fb-line">✘ ${step.options.find((o) => o.id === id).fb}</span>`).join("");
        if (missing.length && step.multi) html += `<span class="fb-line">➕ Il manque ${missing.length > 1 ? "des bonnes réponses" : "une bonne réponse"}.</span>`;
        ctx.fail(html);
      },
      reveal() {
        $$(".opt", ctx.body).forEach((o) => { const d = step.options.find((x) => x.id === o.dataset.id); o.classList.toggle("ok", !!d.correct); o.classList.toggle("ko", !d.correct); o.disabled = true; });
        return step.options.map((o) => `<span class="fb-line">${o.correct ? "✔" : "✘"} ${o.fb}</span>`).join("");
      },
    });
    ctx.body.innerHTML = `<div class="opts ${step.layout ? "l-" + step.layout : ""}" role="${step.multi ? "group" : "radiogroup"}">${step.options.map((o, i) => `
      <button class="opt" data-id="${o.id}" role="${step.multi ? "checkbox" : "radio"}" aria-checked="false"><span class="opt-k" aria-hidden="true">${step.multi ? "☐" : String.fromCharCode(65 + i)}</span><span class="opt-t">${o.html}</span></button>`).join("")}</div>`;
    $$(".opt", ctx.body).forEach((b) => b.addEventListener("click", () => {
      if (ctx.solved) return;
      const id = b.dataset.id;
      if (step.multi) { sel.has(id) ? sel.delete(id) : sel.add(id); }
      else { sel.clear(); sel.add(id); }
      $$(".opt", ctx.body).forEach((o) => {
        const on = sel.has(o.dataset.id);
        o.classList.toggle("sel", on); o.setAttribute("aria-checked", on);
        if (step.multi) $(".opt-k", o).textContent = on ? "☑" : "☐";
        o.classList.remove("ko");
      });
    }));
  };

  /* ---------- ORDER : remettre dans l'ordre (règles flexibles) ---------- */
  function orderFromRules(items, rules) {
    const ids = items.map((i) => i.id);
    const res = [];
    const firsts = rules.filter((r) => r.first).map((r) => r.first);
    const pool = [...firsts, ...ids.filter((i) => !firsts.includes(i))];
    while (pool.length) {
      const k = pool.findIndex((id) => !rules.some((r) => r.after === id && !res.includes(r.before)));
      res.push(pool.splice(k < 0 ? 0 : k, 1)[0]);
    }
    return res;
  }
  RENDER.order = (body, step, next) => {
    let order = step.items.map((i) => i.id);
    const ctx = exFrame(body, step, {
      next, kind: "Remets dans l'ordre",
      check(ctx) {
        const pos = (id) => order.indexOf(id);
        const failed = step.rules.filter((r) => (r.first ? pos(r.first) >= r.within : pos(r.before) > pos(r.after)));
        $$(".ord-item", ctx.body).forEach((li) => li.classList.remove("ko"));
        if (!failed.length) { $$(".ord-item", ctx.body).forEach((li) => li.classList.add("ok")); lockOrder(); return ctx.success(""); }
        failed.forEach((r) => [r.first, r.before, r.after].filter(Boolean).forEach((id) => { const li = $(`.ord-item[data-id="${id}"]`, ctx.body); if (li) li.classList.add("ko"); }));
        ctx.fail(failed.slice(0, 2).map((r) => `<span class="fb-line">✘ ${r.msg}</span>`).join("") + (failed.length > 2 ? `<span class="fb-line">… et ${failed.length - 2} autre(s) point(s) à revoir.</span>` : ""));
      },
      reveal() { order = orderFromRules(step.items, step.rules); draw(); lockOrder(); $$(".ord-item", ctx.body).forEach((li) => li.classList.add("ok")); return step.rules.map((r) => `<span class="fb-line">✔ ${r.msg}</span>`).join(""); },
    });
    const lockOrder = () => $$("button", ctx.body).forEach((b) => (b.disabled = true));
    let dragId = null;
    function draw(focusId, focusDir) {
      ctx.body.innerHTML = `<ol class="ord">${order.map((id, k) => { const it = step.items.find((x) => x.id === id); return `
        <li class="ord-item" data-id="${id}" draggable="true"><span class="ord-n">${k + 1}</span><span class="ord-grip" aria-hidden="true">⠿</span><span class="ord-t">${it.html}${it.tag === "officiel" ? ' <span class="tag t-off">OFFICIEL</span>' : ""}</span>
        <span class="ord-btns"><button class="btn ghost xs" data-mv="-1" ${k === 0 ? "disabled" : ""} aria-label="Monter">▲</button><button class="btn ghost xs" data-mv="1" ${k === order.length - 1 ? "disabled" : ""} aria-label="Descendre">▼</button></span></li>`; }).join("")}</ol>`;
      $$(".ord-item", ctx.body).forEach((li) => {
        $$("[data-mv]", li).forEach((b) => b.addEventListener("click", () => {
          if (ctx.solved) return;
          const k = order.indexOf(li.dataset.id), d = +b.dataset.mv, j = k + d;
          if (j < 0 || j >= order.length) return;
          [order[k], order[j]] = [order[j], order[k]]; draw(li.dataset.id, d);
        }));
        li.addEventListener("dragstart", (e) => { dragId = li.dataset.id; li.classList.add("dragging"); try { e.dataTransfer.setData("text/plain", dragId); } catch (x) {} });
        li.addEventListener("dragend", () => li.classList.remove("dragging"));
        li.addEventListener("dragover", (e) => { e.preventDefault(); li.classList.add("over"); });
        li.addEventListener("dragleave", () => li.classList.remove("over"));
        li.addEventListener("drop", (e) => { e.preventDefault(); if (ctx.solved || !dragId || dragId === li.dataset.id) return; const from = order.indexOf(dragId); order.splice(from, 1); order.splice(order.indexOf(li.dataset.id) + (from <= order.indexOf(li.dataset.id) ? 1 : 0), 0, dragId); draw(); });
      });
      if (focusId) { const b = $(`.ord-item[data-id="${focusId}"] [data-mv="${focusDir}"]`, ctx.body) || $(`.ord-item[data-id="${focusId}"] [data-mv]:not([disabled])`, ctx.body); if (b) b.focus(); }
    }
    draw();
  };

  /* ---------- SORT : classer dans des catégories ---------- */
  RENDER.sort = (body, step, next) => {
    const place = {}; // itemId -> binId
    let selected = null;
    const accepted = (it) => (Array.isArray(it.bin) ? it.bin : [it.bin]);
    const ctx = exFrame(body, step, {
      next, kind: "Classe chaque élément",
      check(ctx) {
        const un = step.items.filter((it) => !place[it.id]);
        if (un.length) return ctx.info(`Il reste ${un.length} élément${un.length > 1 ? "s" : ""} à classer.`);
        const wrong = step.items.filter((it) => !accepted(it).includes(place[it.id]));
        draw();
        if (!wrong.length) { lock(); return ctx.success(step.items.filter((it) => Array.isArray(it.bin)).map((it) => `<span class="fb-line">ℹ ${it.fb}</span>`).join("")); }
        wrong.forEach((it) => { const c = $(`.card-it[data-id="${it.id}"]`, ctx.body); if (c) c.classList.add("ko"); });
        const head = `${wrong.length} élément${wrong.length > 1 ? "s sont mal classés" : " est mal classé"} (marqué${wrong.length > 1 ? "s" : ""} ✘).`;
        if (ctx.tries === 0) {
          // 1re erreur : on guide sans donner la réponse
          const nudge = step.nudge || (step.hints && step.hints[0]) || "Relis la notion, puis déplace les éléments marqués ✘.";
          return ctx.fail(`${head}<span class="fb-line">🤔 ${nudge}</span>`, { retry: "Déplace les éléments marqués ✘, puis vérifie à nouveau." });
        }
        ctx.fail(head + wrong.slice(0, 3).map((it) => `<span class="fb-line">✘ <b>${stripTags(it.html)}</b> → ${it.fb}</span>`).join("") + (wrong.length > 3 ? `<span class="fb-line">… regarde les autres éléments marqués ✘.</span>` : ""));
      },
      reveal() { step.items.forEach((it) => (place[it.id] = accepted(it)[0])); draw(); lock(); return step.items.map((it) => `<span class="fb-line">✔ <b>${stripTags(it.html)}</b> → ${it.fb}</span>`).join(""); },
    });
    const lock = () => { $$("button", ctx.body).forEach((b) => (b.disabled = true)); $$(".card-it", ctx.body).forEach((c) => { c.classList.add("ok"); c.draggable = false; }); };
    function itemHTML(it) { return `<button class="card-it${selected === it.id ? " sel" : ""}" data-id="${it.id}" draggable="true" aria-pressed="${selected === it.id}">${it.html}</button>`; }
    function draw() {
      const pool = step.items.filter((it) => !place[it.id]);
      ctx.body.innerHTML = `<p class="howto">👆 Clique sur un élément, puis sur la catégorie où le placer. Tu peux aussi le glisser-déposer.</p>
        <div class="pool" data-bin="">${pool.length ? pool.map(itemHTML).join("") : `<span class="pool-empty">Tout est classé ! Clique sur « Vérifier ».</span>`}</div>
        <div class="bins b-${step.bins.length}">${step.bins.map((b) => `<div class="bin" data-bin="${b.id}">
          <button class="bin-h" data-target="${b.id}"><span aria-hidden="true">${b.icon}</span>${esc(b.label)}<small>${selected ? "➕ placer ici" : ""}</small></button>
          <div class="bin-list">${step.items.filter((it) => place[it.id] === b.id).map(itemHTML).join("")}</div></div>`).join("")}</div>`;
      $$(".card-it", ctx.body).forEach((c) => {
        c.addEventListener("click", () => { if (ctx.solved) return; selected = selected === c.dataset.id ? null : c.dataset.id; draw(); const s = $(`.card-it[data-id="${selected}"]`, ctx.body); if (s) s.focus(); });
        c.addEventListener("dragstart", (e) => { selected = c.dataset.id; try { e.dataTransfer.setData("text/plain", c.dataset.id); } catch (x) {} });
      });
      $$(".bin-h", ctx.body).forEach((b) => b.addEventListener("click", () => { if (ctx.solved || !selected) return; place[selected] = b.dataset.target; const was = selected; selected = null; draw(); const nb = $(".pool .card-it", ctx.body); (nb || $(`.card-it[data-id="${was}"]`, ctx.body)).focus(); }));
      $$(".bin, .pool", ctx.body).forEach((z) => {
        z.addEventListener("dragover", (e) => { e.preventDefault(); z.classList.add("over"); });
        z.addEventListener("dragleave", () => z.classList.remove("over"));
        z.addEventListener("drop", (e) => { e.preventDefault(); if (ctx.solved || !selected) return; if (z.dataset.bin) place[selected] = z.dataset.bin; else delete place[selected]; selected = null; draw(); });
      });
    }
    draw();
  };
  const stripTags = (h) => String(h).replace(/<span class='src'>.*?<\/span>/g, "").replace(/<[^>]+>/g, "").trim();

  /* ---------- INSPECT : repérer les éléments suspects ---------- */
  RENDER.inspect = (body, step, next) => {
    const found = [];
    const total = Object.keys(step.targets).length;
    let ctx;
    ctx = exFrame(body, step, {
      next, kind: "Enquête", noCheck: true,
      onHint() { const t = Object.keys(step.targets).find((id) => !found.includes(id)); const h = t && $(`[data-hot="${t}"]`, ctx.body); if (h) { h.classList.add("hinted"); setTimeout(() => h.classList.remove("hinted"), 4000); } },
      reveal() { Object.keys(step.targets).forEach((id) => mark(id, true)); return Object.values(step.targets).map((t) => `<span class="fb-line">✔ <b>${t.title}</b> : ${t.fb}</span>`).join(""); },
    });
    ctx.body.innerHTML = `<div class="inspect"><div class="insp-mock">${V.mock(step.mock)}</div>
      <aside class="insp-side"><div class="insp-count"><b id="insp-n">0</b> / ${step.need} indices <small>(${total} au total)</small></div><ol class="insp-list" id="insp-list"></ol></aside></div>`;
    const listEl = $("#insp-list", ctx.body), nEl = $("#insp-n", ctx.body);
    function mark(id, silent) {
      if (found.includes(id)) return;
      found.push(id);
      const h = $(`[data-hot="${id}"]`, ctx.body);
      if (h) { h.classList.add("found"); h.dataset.n = found.length; h.setAttribute("aria-label", "Indice trouvé : " + step.targets[id].title); }
      listEl.insertAdjacentHTML("beforeend", `<li><b>${step.targets[id].title}</b><span>${step.targets[id].fb}</span></li>`);
      nEl.textContent = found.length;
      if (!silent) {
        toast(`Indice ${found.length}/${step.need}`, step.targets[id].title, "good", "🔍");
        if (found.length === step.need && !ctx.solved) ctx.success(`Tu as trouvé ${found.length} indices.${found.length < total ? ` Il en reste ${total - found.length} : tu peux continuer à chercher pour un bonus avant de cliquer sur « Continuer ».` : ""}`);
        if (found.length === total) { ms(currentMissionId).extra += 300; toast("Œil de lynx parfait !", "Tous les indices trouvés · +$300", "good", "💰"); save(); }
      }
    }
    $$("[data-hot]", ctx.body).forEach((h) => h.addEventListener("click", () => {
      const id = h.dataset.hot;
      if (step.targets[id]) return mark(id);
      if (step.decoys[id]) {
        if (h.classList.contains("decoy")) return ctx.info(step.decoys[id].fb);
        h.classList.add("decoy");
        if (ctx.solved) return ctx.info(step.decoys[id].fb);
        ctx.fail(`<span class="fb-line">${step.decoys[id].fb}</span>`, { retry: "Continue à chercher les vrais indices." });
      }
    }));
    const timer = $(".mb-count", ctx.body);
    if (timer && !S.settings.reduce) { let t = 299; const iv = setInterval(() => { if (!document.body.contains(timer)) return clearInterval(iv); t = t > 0 ? t - 1 : 299; timer.textContent = `0${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; }, 1000); }
  };

  /* ---------- SPACE : gestion du stockage ---------- */
  RENDER.space = (body, step, next) => {
    const dest = {}; step.items.forEach((it) => (dest[it.id] = "keep"));
    const go = (it) => (it.unit === "Mo" ? it.size / 1000 : it.unit === "To" ? it.size * 1000 : it.size);
    const sum = (d) => step.items.filter((it) => dest[it.id] === d).reduce((a, it) => a + go(it), 0);
    const ctx = exFrame(body, step, {
      next, kind: "Simulation",
      check(ctx) {
        const msgs = step.messages, errs = [];
        step.items.forEach((it) => {
          if (it.tag === "irreplaceable" && dest[it.id] === "del") errs.push(tpl(msgs.irreplaceable_del, it));
          if (it.tag === "playing" && dest[it.id] === "del") errs.push(tpl(msgs.playing_del, it));
          if (it.kind === "game" && dest[it.id] === "cloud") errs.push(tpl(msgs.game_cloud, it));
        });
        const cloud = sum("cloud");
        if (cloud > step.destinations.cloud.capacity) errs.push(tpl(msgs.cloud_full, { used: num(cloud) }));
        const free = step.capacity - sum("keep");
        if (free < step.need) errs.push(tpl(msgs.not_enough, { missing: num(step.need - free), free: num(free) }));
        if (errs.length) return ctx.fail(errs.map((e) => `<span class="fb-line">✘ ${e}</span>`).join(""));
        const notes = step.items.filter((it) => it.tag === "playing" && dest[it.id] === "ext").map((it) => `<span class="fb-line">ℹ ${tpl(msgs.playing_move, it)}</span>`).join("");
        lock();
        ctx.success(`Espace libre : <b>${num(free)} Go</b> ≥ ${step.need} Go. ${notes}`);
      },
      reveal() { Object.assign(dest, { course: "del", demo: "del", buts: "ext", photos: "cloud" }); draw(); lock(); return step.solutionText; },
    });
    const lock = () => $$(".seg button", ctx.body).forEach((b) => (b.disabled = true));
    const c = D.contacts[step.brief.from];
    function gauge(label, used, cap, opts = {}) {
      const pct = Math.min(100, (used / cap) * 100), over = used > cap;
      return `<div class="gauge ${over ? "over" : ""}"><div class="g-h"><b>${label}</b><span>${num(used)} / ${num(cap)} Go${over ? " · ⚠ plein !" : ""}</span></div>
        <div class="g-bar">${opts.segments || `<i style="width:${pct}%"></i>`}${opts.marker !== undefined ? `<span class="g-need" style="left:${opts.marker}%"></span>` : ""}</div>${opts.foot || ""}</div>`;
    }
    function draw() {
      const kept = sum("keep"), free = step.capacity - kept, ok = free >= step.need;
      const segs = step.items.filter((it) => dest[it.id] === "keep").map((it) => `<i class="seg-${it.kind}" style="width:${(go(it) / step.capacity) * 100}%" title="${esc(it.name)}"></i>`).join("");
      ctx.body.innerHTML = `<div class="space">
        <div class="sp-brief"><span class="av" style="background:${c.color}">${c.initials}</span><p><small>${esc(c.name)}</small>${esc(step.brief.text)}</p></div>
        <div class="sp-gauges">
          ${gauge("🎮 Console de Sam", kept, step.capacity, { segments: segs, marker: ((step.capacity - step.need) / step.capacity) * 100,
            foot: `<div class="g-foot ${ok ? "ok" : ""}"><span>Libre : <b>${num(free)} Go</b></span><span>Besoin : <b>${step.need} Go</b> <span class="tag t-off">OFFICIEL</span></span><span>${ok ? "✔ assez de place" : "✘ pas assez"}</span></div>` })}
          <div class="g-legend"><span><i class="seg-system"></i>système</span><span><i class="seg-game"></i>jeux</span><span><i class="seg-media"></i>photos, vidéos</span><span><i class="seg-app"></i>applis</span><span class="g-mk">▏zone à libérer</span></div>
          <div class="g-two">${gauge("💽 Disque externe", sum("ext"), step.destinations.ext.capacity)}${gauge("☁️ Cloud gratuit", sum("cloud"), step.destinations.cloud.capacity)}</div>
        </div>
        <div class="sp-table" role="table" aria-label="Contenu de la console">
          <div class="sp-row sp-headrow" role="row"><span role="columnheader">Élément</span><span role="columnheader">Taille</span><span role="columnheader">Que faire ?</span></div>
          ${step.items.map((it) => `<div class="sp-row" role="row"><span class="sp-name" role="cell"><span aria-hidden="true">${it.icon}</span> ${esc(it.name)}${it.tag === "irreplaceable" ? ' <span class="tag t-warn">perso</span>' : ""}</span>
            <span class="sp-size" role="cell">${num(it.size)} ${it.unit}</span>
            <span role="cell">${it.kind === "system" ? `<span class="sp-lock">🔒 Obligatoire</span>` : `<span class="seg" role="radiogroup" aria-label="Destination : ${esc(it.name)}">${Object.entries(step.destinations).map(([k, d]) => `<button role="radio" aria-checked="${dest[it.id] === k}" class="${dest[it.id] === k ? "on d-" + k : ""}" data-it="${it.id}" data-d="${k}" title="${d.label}"><span aria-hidden="true">${d.icon}</span><span class="seg-l">${d.label}</span></button>`).join("")}</span>`}</span></div>`).join("")}
        </div><p class="sp-note">${Object.values(step.destinations).map((d) => `${d.icon} ${d.label}`).join(" · ")}<br><span class="tag t-fic">FICTIF</span> Console de 500 Go (inventée). Les tailles en Mo sont converties en Go dans les jauges.</p></div>`;
      $$(".seg button", ctx.body).forEach((b) => b.addEventListener("click", () => { if (ctx.solved) return; dest[b.dataset.it] = b.dataset.d; const id = b.dataset.it, d = b.dataset.d; draw(); const f = $(`.seg button[data-it="${id}"][data-d="${d}"]`, ctx.body); if (f) f.focus(); }));
    }
    draw();
  };

  /* ---------- BRANCH : scénario à embranchements ---------- */
  RENDER.branch = (body, step, next) => {
    let node = step.start, nodeTries = 0;
    const ctx = exFrame(body, step, {
      next, kind: "À toi de décider", noCheck: true,
      reveal() { const n = step.nodes[node]; const c = n.choices.find((x) => x.correct); $$(".br-c", ctx.body).forEach((b) => { b.disabled = true; if (b.textContent.trim() === c.text) b.classList.add("ok"); }); return `Bonne réponse : « ${c.text} ». ${c.fb}`; },
    });
    function draw() {
      const n = step.nodes[node];
      ctx.body.innerHTML = `<div class="branch"><div class="br-scene">${esc(n.scene)}</div><p class="br-text">${n.text}</p>
        <div class="br-choices">${n.choices.map((c, i) => `<button class="br-c" data-i="${i}"><span class="opt-k">${String.fromCharCode(65 + i)}</span>${esc(c.text)}</button>`).join("")}</div><div class="br-out"></div></div>`;
      $$(".br-c", ctx.body).forEach((b) => b.addEventListener("click", () => {
        if (ctx.solved) return;
        const c = n.choices[+b.dataset.i];
        if (!c.correct) { b.classList.add("ko"); b.disabled = true; nodeTries++; return ctx.fail(`<span class="fb-line">💥 ${c.fb}</span>`, { retry: "Choisis une autre option." }); }
        b.classList.add("ok"); $$(".br-c", ctx.body).forEach((x) => (x.disabled = true));
        if (nodeTries > 0) wantedDown("Tu as trouvé la bonne réaction.");
        nodeTries = 0;
        if (c.next) {
          ctx.fbBox.hidden = true;
          const out = $(".br-out", ctx.body);
          out.innerHTML = `<div class="br-ok">✔ ${esc(c.fb)}</div><button class="btn primary" id="br-next">Suite de l'histoire ➜</button>`;
          $("#br-next", ctx.body).addEventListener("click", () => { node = c.next; draw(); $(".br-c", ctx.body).focus(); });
          $("#br-next", ctx.body).focus();
        } else { ctx.tries = 0; ctx.success(esc(c.fb)); }
      }));
    }
    draw();
  };

  /* ---------- TOGGLES : paramètres de confidentialité ---------- */
  RENDER.toggles = (body, step, next) => {
    const val = { public: true, name: true, geo: true, dm: true, a2f: false, game: true };
    step.settings.forEach((s) => { if (val[s.id] === undefined) val[s.id] = !s.expect; });
    const ctx = exFrame(body, step, {
      next, kind: "Paramètres",
      check(ctx) {
        const wrong = step.settings.filter((s) => s.expect !== null && val[s.id] !== s.expect);
        $$(".tg", ctx.body).forEach((t) => t.classList.toggle("ko", wrong.some((w) => w.id === t.dataset.id)));
        if (!wrong.length) { $$(".tg button", ctx.body).forEach((b) => (b.disabled = true)); return ctx.success(step.settings.filter((s) => s.expect === null).map((s) => `<span class="fb-line">ℹ ${s.label} : ${s.fb}</span>`).join("")); }
        if (ctx.tries === 0) return ctx.fail(`${wrong.length} réglage${wrong.length > 1 ? "s ne protègent" : " ne protège"} pas encore Sam (marqué${wrong.length > 1 ? "s" : ""} en rouge).<span class="fb-line">🤔 Pour chaque réglage marqué, demande-toi : un inconnu pourrait-il s'en servir ?</span>`, { retry: "Modifie les réglages marqués, puis vérifie à nouveau." });
        ctx.fail(wrong.map((s) => `<span class="fb-line">✘ <b>${s.label}</b> : ${s.fb}</span>`).join(""));
      },
      reveal() { step.settings.forEach((s) => { if (s.expect !== null) val[s.id] = s.expect; }); draw(); $$(".tg button", ctx.body).forEach((b) => (b.disabled = true)); return step.settings.map((s) => `<span class="fb-line">${s.expect === null ? "ℹ" : "✔"} <b>${s.label}</b> : ${s.fb}</span>`).join(""); },
    });
    function draw() {
      ctx.body.innerHTML = `<div class="profile"><div class="pf-head"><span class="av big" style="background:#2EE6E6">S</span><div><b>SamTheGoal_27</b><small>Paramètres du compte · confidentialité</small></div></div>
        <div class="tg-list">${step.settings.map((s) => `<div class="tg" data-id="${s.id}"><span class="tg-i" aria-hidden="true">${s.icon}</span><span class="tg-l">${esc(s.label)}</span>
          <button role="switch" aria-checked="${val[s.id]}" class="sw ${val[s.id] ? "on" : ""}" data-id="${s.id}" aria-label="${esc(s.label)}"><i></i><span>${val[s.id] ? "Activé" : "Désactivé"}</span></button></div>`).join("")}</div></div>`;
      $$(".sw", ctx.body).forEach((b) => b.addEventListener("click", () => { if (ctx.solved) return; val[b.dataset.id] = !val[b.dataset.id]; const id = b.dataset.id; draw(); $(`.sw[data-id="${id}"]`, ctx.body).focus(); }));
    }
    draw();
  };

  /* ---------- PASSWORD : atelier phrase de passe (rien n'est enregistré) ---------- */
  RENDER.password = (body, step, next) => {
    const ctx = exFrame(body, step, {
      next, kind: "Atelier", checkLabel: "Valider ma phrase de passe",
      check(ctx) {
        const r = evaluate($("#pw", ctx.body).value);
        if (r.every((c) => c.ok)) { $("#pw", ctx.body).value = ""; $("#pw", ctx.body).disabled = true; return ctx.success(""); }
        ctx.info("Pas tout à fait : regarde les critères encore marqués ✘. (Ce n'est pas une erreur de connaissance : pas d'étoile.)");
      },
    });
    const words = (v) => v.split(/[\s\-_.,;:+/]+|(?<=[a-zà-ÿ])(?=[A-ZÀ-Ý])/).filter((w) => w.replace(/[^a-zA-Zà-ÿÀ-Ý]/g, "").length >= 2);
    function evaluate(v) {
      const low = v.toLowerCase();
      const bad = step.forbidden.filter((f) => low.includes(f));
      return [
        { ok: v.length >= step.minLength, t: `Au moins ${step.minLength} caractères (${v.length} pour l'instant)` },
        { ok: words(v).length >= step.minWords, t: `Au moins ${step.minWords} mots (${words(v).length} détecté${words(v).length > 1 ? "s" : ""})` },
        { ok: /\d/.test(v), t: "Au moins un chiffre" },
        { ok: /[^\p{L}\p{N}\s]/u.test(v), t: "Au moins un symbole (! ? # - …)" },
        { ok: v.length > 0 && !bad.length, t: bad.length ? `Pas d'élément facile à deviner (« ${bad[0]} »)` : "Pas d'élément facile à deviner (nom du jeu, 123, azerty…)" },
      ];
    }
    ctx.body.innerHTML = `<div class="pwlab"><p class="pw-warn">🔐 ${esc(step.warning)}</p>
      <label for="pw" class="pw-l">Ta phrase de passe d'exemple</label>
      <input id="pw" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ex. Mangue-Radar-Flamant-Tuba!4">
      <div class="pw-meter" aria-hidden="true"><i id="pw-bar"></i></div><b id="pw-level" class="pw-level">—</b>
      <ul class="pw-crit" id="pw-crit"></ul></div>`;
    const inp = $("#pw", ctx.body);
    const upd = () => {
      if (!ctx.solved) ctx.fbBox.hidden = true;
      const r = evaluate(inp.value), n = r.filter((c) => c.ok).length;
      $("#pw-crit", ctx.body).innerHTML = r.map((c) => `<li class="${c.ok ? "ok" : ""}">${c.ok ? "✔" : "✘"} ${esc(c.t)}</li>`).join("");
      $("#pw-bar", ctx.body).style.width = (n / r.length) * 100 + "%";
      $("#pw-bar", ctx.body).className = "lv" + n;
      $("#pw-level", ctx.body).textContent = ["Très faible", "Très faible", "Faible", "Moyenne", "Presque !", "Solide 💪"][n];
    };
    inp.addEventListener("input", upd); upd(); inp.focus();
  };

  /* ---------- INPUT : réponse calculée ou tapée ---------- */
  function parseNumber(v) { const s = String(v).replace(/\s| /g, "").replace(",", ".").replace(/[^\d.\-]/g, ""); return s === "" ? NaN : parseFloat(s); }
  function parseDuration(v) {
    const s = String(v).toLowerCase().replace(",", ".").replace(/\s+/g, " ").trim();
    let m;
    if ((m = s.match(/^(\d+(?:\.\d+)?)\s*h(?:eures?)?\s*(?:et\s*)?(\d+)?\s*(?:min(?:utes?)?|m)?$/))) return parseFloat(m[1]) * 3600 + (m[2] ? +m[2] * 60 : 0);
    if ((m = s.match(/^(\d+)\s*:\s*(\d{1,2})$/))) return +m[1] * 3600 + +m[2] * 60;
    if ((m = s.match(/^(\d+(?:\.\d+)?)\s*min(?:utes?)?$/))) return parseFloat(m[1]) * 60;
    if ((m = s.match(/^(\d+(?:\.\d+)?)\s*(?:s|sec|secondes?)$/))) return parseFloat(m[1]);
    if ((m = s.match(/^(\d+(?:\.\d+)?)$/))) return parseFloat(m[1]) >= 1000 ? parseFloat(m[1]) : "unit";
    return NaN;
  }
  const fmtDur = (sec) => `${Math.floor(sec / 3600)} h ${String(Math.round((sec % 3600) / 60)).padStart(2, "0")} min`;
  const normText = (v) => String(v).toLowerCase().trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "").replace(/\s/g, "");
  RENDER.input = (body, step, next) => {
    const ctx = exFrame(body, step, {
      next, kind: step.lock ? "Cadenas" : "Calcul",
      check(ctx) {
        const msgs = []; let allOk = true, unitIssue = false;
        step.fields.forEach((f) => {
          const raw = $(`#in-${f.id}`, ctx.body).value;
          if (!raw.trim()) { allOk = false; unitIssue = true; return; }
          if (f.kind === "number") {
            const n = parseNumber(raw);
            if (isNaN(n)) { allOk = false; unitIssue = true; msgs.push("Écris un nombre (tu peux utiliser une virgule)."); return; }
            if (Math.abs(n - f.value) <= (f.tol || 0)) return;
            allOk = false;
            const sp = step.wrong && Object.keys(step.wrong).find((k) => Math.abs(parseFloat(k) - n) < 1e-6);
            msgs.push(sp ? step.wrong[sp] : `${num(n, 3)} n'est pas le bon résultat. Refais le calcul étape par étape.`);
          } else if (f.kind === "text") {
            const t = normText(raw);
            if (f.accept.map(normText).includes(t)) return;
            allOk = false;
            const sp = step.wrongText && Object.keys(step.wrongText).find((k) => normText(k) === t);
            msgs.push(sp ? step.wrongText[sp] : `« ${esc(raw)} » n'est pas le nom de domaine. Cherche le mot juste avant la première « / ».`);
          } else if (f.kind === "duration") {
            const d = parseDuration(raw);
            if (d === "unit") { allOk = false; unitIssue = true; msgs.push("Précise l'unité, par exemple <code>4h20</code> ou <code>260 min</code>."); return; }
            if (isNaN(d)) { allOk = false; unitIssue = true; msgs.push("Je ne comprends pas ce format. Écris par exemple <code>4h20</code>."); return; }
            if (Math.abs(d - f.seconds) <= f.tol) return;
            allOk = false;
            msgs.push(`Ta réponse fait ${fmtDur(d)}. Ce n'est pas encore ça : ${d > f.seconds ? "c'est trop long" : "c'est trop court"}. Vérifie la division.`);
          }
        });
        if (allOk) { $$("input", ctx.body).forEach((i) => (i.disabled = true)); return ctx.success(""); }
        if (unitIssue && !msgs.length) return ctx.info("Complète la réponse avant de vérifier.");
        if (unitIssue) return ctx.info(msgs.join(" "));
        ctx.fail(msgs.map((m) => `<span class="fb-line">✘ ${m}</span>`).join(""));
      },
      reveal() {
        step.fields.forEach((f) => { $(`#in-${f.id}`, ctx.body).value = f.kind === "number" ? num(f.value, 3) : f.kind === "duration" ? fmtDur(f.seconds) : f.accept[0]; });
        $$("input", ctx.body).forEach((i) => (i.disabled = true));
        return "";
      },
    });
    ctx.body.innerHTML = `<div class="inputs">${step.fields.map((f) => `<label class="in-f" for="in-${f.id}"><span>${esc(f.label)}</span>
      <span class="in-w"><input id="in-${f.id}" type="text" inputmode="${f.kind === "number" ? "decimal" : "text"}" autocomplete="off" spellcheck="false" placeholder="${esc(f.placeholder || "ta réponse")}">${f.suffix ? `<em>${esc(f.suffix)}</em>` : ""}</span></label>`).join("")}</div>`;
    $$("input", ctx.body).forEach((i) => i.addEventListener("keydown", (e) => { if (e.key === "Enter") $('[data-x="check"]', ctx.root).click(); }));
    $("input", ctx.body).focus();
  };

  /* =====================================================================
     MISSION RÉUSSIE
     ===================================================================== */
  function missionPassed(id) {
    const m = M(id), st = ms(id);
    const firstTime = st.status !== "done";
    const discreet = S.wanted === 0;
    const bonus = firstTime ? (discreet ? 300 : 0) + st.extra : 0;
    const gain = firstTime ? m.reward + bonus : 0;
    const before = S.wallet;
    st.wantedEnd = S.wanted;
    if (firstTime) {
      st.status = "done"; st.doneAt = Date.now(); st.earned = gain; S.wallet += gain;
      if (m.badge && !S.badges.includes(m.badge.id)) S.badges.push(m.badge.id);
      m.unlocks.forEach((u) => { if (ms(u).status === "locked") ms(u).status = "open"; });
      if (id === "mF") { S.finishedAt = Date.now(); S.clock = "00:00"; }
    }
    S.current = null;
    save();
    document.body.dataset.screen = "passed";
    renderHUD();
    refreshMoney(before);
    const final = id === "mF";
    const nxt = nextMission();
    screen.innerHTML = `
      <section class="passed ${final ? "final" : ""}">
        ${final ? V.titleScene() : ""}
        <div class="passed-inner">
          <div class="p-banner"><span class="p-kicker">${final ? "00:00 · 19 NOVEMBRE" : (m.kind === "bonus" ? "MISSION BONUS" : m.kind === "prologue" ? "PROLOGUE" : "MISSION " + m.code)}</span>
            <h1 class="p-title" tabindex="-1">${final ? "Vice City<br>débloquée" : "Mission réussie"}</h1>
            <p class="p-sub">${esc(m.subtitle || m.title)}</p></div>
          <div class="p-grid">
            <div class="p-card p-money"><small>Récompense</small><b>${firstTime ? "+" + money(gain) : "Déjà encaissée"}</b>${firstTime ? `<span>${money(m.reward)} mission${discreet ? " + 300 discrétion (0 ★)" : ""}${st.extra ? ` + ${st.extra} œil de lynx` : ""}</span>` : ""}</div>
            ${m.badge ? `<div class="p-card p-badge"><span class="bdg">${m.badge.icon}</span><small>Badge débloqué</small><b>${esc(m.badge.name)}</b></div>` : ""}
            <div class="p-card"><small>Niveau de recherche final</small><b class="p-stars">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= S.wanted ? "on" : ""}">★</i>`).join("")}</b><span>${st.errors} erreur${st.errors > 1 ? "s" : ""} · ${st.hints} indice${st.hints > 1 ? "s" : ""}${st.reveals ? ` · ${st.reveals} solution${st.reveals > 1 ? "s" : ""} affichée${st.reveals > 1 ? "s" : ""}` : ""}</span></div>
          </div>
          <div class="p-recap"><h2>Ce que tu retiens</h2><ul>${m.recap.map((r) => `<li>${esc(r)}</li>`).join("")}</ul></div>
          <div class="p-btns">
            ${final ? `<button class="btn primary xl" id="p-dash">🏆 Voir mon bilan d'agent</button>` : nxt && nxt !== id ? `<button class="btn primary xl" id="p-next">▶ ${esc(M(nxt).title)}</button>` : ""}
            ${!final && id === "m1" && ms("mB").status === "open" ? `<button class="btn ghost" id="p-bonus">⚡ Mission bonus (facultative)</button>` : ""}
            <button class="btn ghost" data-act="map">🗺️ Carte</button>
          </div>
        </div>
      </section>`;
    S.wanted = 0;
    const pn = $("#p-next"); if (pn) pn.addEventListener("click", () => startMission(nxt));
    const pd = $("#p-dash"); if (pd) pd.addEventListener("click", goDashboard);
    const pb = $("#p-bonus"); if (pb) pb.addEventListener("click", () => startMission("mB"));
    $(".p-title").focus();
    if (firstTime && m.badge) setTimeout(() => toast("Badge débloqué", `${m.badge.icon} ${m.badge.name}`, "good", "🏅"), 600);
  }

  /* =====================================================================
     BILAN FINAL
     ===================================================================== */
  /* Bilan d'une compétence : erreurs rapportées au nombre d'exercices réalisés. */
  function skillStatus(k) {
    const s = S.skills[k];
    const n = s.ok + s.reveals;
    if (!n) return { cls: "none", t: "Pas encore travaillé" };
    const avg = s.errors / n;
    if (s.reveals > 0 || avg >= 2) return { cls: "redo", t: "À retravailler" };
    if (avg >= 1) return { cls: "prog", t: "À consolider" };
    return { cls: "ok", t: "Maîtrisé" };
  }
  function goDashboard() {
    currentMissionId = null; S.wanted = 0; save();
    document.body.dataset.screen = "dash";
    renderHUD();
    const done = D.order.filter((id) => ms(id).status === "done");
    const errors = D.order.reduce((a, id) => a + ms(id).errors, 0), hints = D.order.reduce((a, id) => a + ms(id).hints, 0);
    const minutes = Math.round(D.order.reduce((a, id) => a + (ms(id).doneAt && ms(id).startedAt ? (ms(id).doneAt - ms(id).startedAt) : 0), 0) / 60000);
    const used = Object.keys(D.skills).filter((k) => S.skills[k].ok || S.skills[k].reveals);
    const redo = used.filter((k) => skillStatus(k).cls === "redo");
    const cons = used.filter((k) => skillStatus(k).cls === "prog");
    const allCore = CORE.every((id) => ms(id).status === "done");
    const rank = !allCore ? "Recrue" : errors <= 4 ? "Fantôme de Vice City" : errors <= 12 ? "Agent·e d'élite" : "Agent·e de terrain";
    screen.innerHTML = `
      <section class="dash">
        <div class="dash-hero"><div><span class="p-kicker">Bilan de l'agent</span><h1 tabindex="-1">${allCore ? "Opération réussie" : "Opération en cours"}</h1>
          <p>Rang : <b>${rank}</b> · ${done.length} mission${done.length > 1 ? "s" : ""} terminée${done.length > 1 ? "s" : ""} · ${money(S.wallet)} · ${minutes ? "≈ " + minutes + " min de jeu" : ""}</p></div>
          <label class="dash-name">Ton prénom pour le bilan (facultatif, reste sur cet ordinateur)<input id="d-name" type="text" maxlength="40" autocomplete="off" value="${esc(S.name)}"></label></div>
        <div class="dash-grid">
          <div class="d-card"><h2>🗺️ Missions</h2><ul class="d-missions">${D.order.map((id) => { const m = M(id), s = ms(id); return `<li class="${s.status}"><span>${s.status === "done" ? "✔" : s.status === "locked" ? "🔒" : "…"}</span><b>${esc(m.title)}</b><small>${s.status === "done" ? `${s.errors} err. · ${s.hints} ind.` : m.kind === "bonus" ? "facultative" : "à faire"}</small></li>`; }).join("")}</ul></div>
          <div class="d-card"><h2>🏅 Badges</h2><div class="d-badges">${D.missions.filter((m) => m.badge).map((m) => `<div class="db ${S.badges.includes(m.badge.id) ? "on" : ""}"><span>${m.badge.icon}</span><small>${esc(m.badge.name)}</small></div>`).join("")}</div>
            <div class="d-reward ${allCore ? "on" : ""}"><span>🌴</span><div><b>${allCore ? "Récompense finale : Légende de Leonida" : "Termine la finale pour la récompense"}</b><small>${allCore ? "Tu as protégé Vice City jusqu'à minuit." : ""}</small></div></div></div>
          <div class="d-card wide"><h2>🎯 Compétences travaillées</h2><table class="d-skills"><thead><tr><th>Compétence</th><th>Lien au programme</th><th>Bilan</th></tr></thead><tbody>
            ${Object.keys(D.skills).map((k) => { const st = skillStatus(k); return `<tr><td>${esc(D.skills[k].label)}<small class="lvl">${esc(D.skills[k].level)}</small></td><td><small>${esc(D.skills[k].ref)}</small></td><td><span class="st st-${st.cls}">${st.t}</span></td></tr>`; }).join("")}</tbody></table>
            <p class="small">Calcul par exercice : Maîtrisé = moins d'une erreur en moyenne · À consolider = une erreur ou plus · À retravailler = deux erreurs ou plus en moyenne, ou solution affichée.</p></div>
          <div class="d-card"><h2>💡 À retenir</h2><ul class="d-recap">${D.order.filter((id) => ms(id).status === "done").flatMap((id) => M(id).recap).map((r) => `<li>${esc(r)}</li>`).join("") || "<li>Termine une mission pour remplir cette liste.</li>"}</ul></div>
          <div class="d-card"><h2>🔁 À retravailler</h2>${redo.length ? `<ul class="d-redo">${redo.map((k) => `<li><b>${esc(D.skills[k].label)}</b>${notionFor(k) ? `<button class="btn ghost xs" data-nt="${notionFor(k)}">📖 Revoir</button>` : ""}</li>`).join("")}</ul>` : `<p>Aucune compétence à retravailler : bravo ! 💪</p>`}
            ${cons.length ? `<h3 class="d-sub">◐ À consolider</h3><ul class="d-redo">${cons.map((k) => `<li><span>${esc(D.skills[k].label)}</span>${notionFor(k) ? `<button class="btn ghost xs" data-nt="${notionFor(k)}">📖 Revoir</button>` : ""}</li>`).join("")}</ul>` : ""}
            <p class="small">${errors} erreur${errors > 1 ? "s" : ""} au total, ${hints} indice${hints > 1 ? "s" : ""} consulté${hints > 1 ? "s" : ""}. Les erreurs servent à apprendre : elles ne comptent pas dans ta récompense.</p></div>
        </div>
        <div class="dash-btns"><button class="btn primary" id="d-print" title="Si rien ne s'affiche, utilise Ctrl+P">🖨️ Imprimer mon bilan</button><button class="btn ghost" data-act="notebook">📖 Carnet</button><button class="btn ghost" data-act="map">🗺️ Carte</button><button class="btn ghost danger-t" id="d-reset">Recommencer le parcours</button></div>
      </section>`;
    $("#d-name").addEventListener("input", (e) => { S.name = e.target.value.slice(0, 40); save(); });
    $$("[data-nt]", screen).forEach((b) => b.addEventListener("click", () => showNotion(b.dataset.nt)));
    $("#d-print").addEventListener("click", printReport);
    $("#d-reset").addEventListener("click", () => confirmBox("Recommencer le parcours ?", "Toute la progression de cet ordinateur sera effacée (missions, dollars, badges).", "Tout recommencer", resetAll));
    $("h1", screen).focus();
  }
  function notionFor(k) { for (const m of D.missions) for (const s of m.steps) if (s.skill === k && s.notion) return s.notion; return null; }
  function printReport() {
    const pr = $("#print-report");
    const done = D.order.filter((id) => ms(id).status === "done");
    pr.innerHTML = `<h1>GTA · Gère. Traque. Agis. — Bilan de l'agent</h1>
      <p><b>Élève :</b> ${esc(S.name || "…………………………")} &nbsp; <b>Date :</b> ${new Date().toLocaleDateString("fr-BE")} &nbsp; <b>Cours :</b> ${esc(D.meta.course)}</p>
      <h2>Missions</h2><table><tr><th>Mission</th><th>Statut</th><th>Erreurs</th><th>Indices</th><th>Solutions affichées</th></tr>
      ${D.order.map((id) => { const m = M(id), s = ms(id); return `<tr><td>${esc(m.title)}${m.kind === "bonus" ? " (bonus)" : ""}</td><td>${s.status === "done" ? "Réussie" : "Non terminée"}</td><td>${s.errors}</td><td>${s.hints}</td><td>${s.reveals}</td></tr>`; }).join("")}</table>
      <h2>Compétences</h2><table><tr><th>Compétence</th><th>Lien au programme</th><th>Bilan</th></tr>
      ${Object.keys(D.skills).map((k) => `<tr><td>${esc(D.skills[k].label)} (${esc(D.skills[k].level)})</td><td>${esc(D.skills[k].ref)}</td><td>${skillStatus(k).t}</td></tr>`).join("")}</table>
      <h2>Ce que je retiens</h2><ul>${done.flatMap((id) => M(id).recap).map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      <p class="pr-foot">Badges : ${S.badges.length} · Portefeuille fictif : ${money(S.wallet)}. Aucune donnée n'a quitté cet ordinateur.</p>`;
    try { window.print(); } catch (e) { toast("Impression", "Utilise Ctrl+P (ou Cmd+P) pour imprimer ton bilan.", "info", "🖨️"); }
  }

  /* =====================================================================
     PARAMÈTRES · ESPACE ENSEIGNANT
     ===================================================================== */
  function openSettings() {
    const mo = openModal("⚙️ Paramètres", `
      <div class="set-list">
        <label class="set"><span><b>Réduire les animations</b><small>Supprime les mouvements, fondus et effets lumineux.</small></span><input type="checkbox" id="s-reduce" ${S.settings.reduce ? "checked" : ""}></label>
        <label class="set"><span><b>Texte plus grand</b><small>Agrandit tous les textes de l'application.</small></span><input type="checkbox" id="s-big" ${S.settings.big ? "checked" : ""}></label>
      </div>
      <p class="small">Tout fonctionne au clavier : Tab pour avancer, Entrée ou Espace pour choisir, Échap pour fermer une fenêtre.</p>
      <div class="row-end"><button class="btn ghost" id="s-teacher">Espace enseignant</button><button class="btn ghost danger-t" id="s-reset">Effacer ma progression</button></div>`);
    $("#s-reduce", mo).addEventListener("change", (e) => { S.settings.reduce = e.target.checked; applySettings(); save(); });
    $("#s-big", mo).addEventListener("change", (e) => { S.settings.big = e.target.checked; applySettings(); save(); });
    $("#s-teacher", mo).addEventListener("click", () => { closeModal(); goTeacher(); });
    $("#s-reset", mo).addEventListener("click", () => confirmBox("Effacer la progression ?", "Missions, dollars, badges et bilan de cet ordinateur seront effacés.", "Effacer", resetAll));
  }
  function goTeacher() {
    currentMissionId = null;
    $("#toasts").innerHTML = "";
    $("#hud").hidden = true;
    document.body.dataset.screen = "teacher";
    const rows = D.order.map((id) => { const m = M(id); return `<tr><td><b>${esc(m.kind === "final" ? "Finale" : m.kind === "bonus" ? "Bonus" : m.kind === "prologue" ? "Prologue" : "Mission " + m.code)} · ${esc(m.title)}</b><br><small>${esc(m.objective)}</small></td><td>≈ ${m.minutes} min</td>
      <td>${m.skills.map((k) => `${esc(D.skills[k].label)}<br><small>${esc(D.skills[k].ref)} · <i>${esc(D.skills[k].level)}</i></small>`).join("<hr>")}</td>
      <td><small>${m.steps.map((s) => s.type).join(" → ")}</small></td></tr>`; }).join("");
    screen.innerHTML = `<section class="teacher">
      <div class="th-head"><h1 tabindex="-1">Espace enseignant</h1><button class="btn ghost" id="th-back">◀ Retour</button></div>
      <div class="th-grid">
        <div class="d-card"><h2>Intentions</h2>
          <p>Serious game de ±90 minutes autour de la sortie de GTA VI (19/11/2026). Le jeu, classé PEGI 18, est un <b>décor culturel</b> : aucune image officielle, aucun contenu violent, on enquête sur la sortie.</p>
          <p><b>Choix pédagogiques.</b> Trois blocs seulement, pour être vraiment maîtrisés : <b>organiser ses données dans un espace de stockage adapté</b> (mission 1), <b>réagir face aux arnaques et protéger ses données personnelles</b> (missions 2 et 4), <b>vérifier une information</b> (mission 3). La finale réinvestit cinq notions.</p>
          <p><b>Niveaux.</b> D'après l'annexe consultée, l'ordre de grandeur des unités (ko → To) est un attendu de fin de parcours (S3) et la fiabilité des sources est travaillée en S2. Je les ai donc gardés en <b>découverte</b> ou en <b>anticipation</b>, avec des exigences modestes.</p></div>
        <div class="d-card"><h2>Mécaniques</h2><ul>
          <li><b>Étoiles</b> : +1 par erreur, −1 par indice ou par correction réussie. Jamais bloquant : après 3 essais, une « solution expliquée » est proposée (et signalée dans le bilan).</li>
          <li><b>Portefeuille</b> symbolique : récompense de mission + bonus discrétion (0 ★) + bonus d'exploration. Les erreurs ne retirent rien.</li>
          <li><b>Carnet</b> : toutes les notions vues restent consultables. Chaque erreur propose « Revoir la notion ».</li>
          <li><b>Bonus</b> facultatif (temps de téléchargement) pour les rapides, débloqué après la mission 1.</li>
          <li><b>Sauvegarde</b> dans le navigateur (localStorage), étape par étape. Aucune donnée envoyée. Même ordinateur + même navigateur = reprise possible.</li></ul></div>
        <div class="d-card wide"><h2>Missions, durées et liens au programme</h2><table class="d-skills"><thead><tr><th>Mission</th><th>Durée</th><th>Compétences · rattachement</th><th>Déroulé</th></tr></thead><tbody>${rows}</tbody></table>
          <p class="small">Rattachements établis à partir de l'annexe « Attendus en lien avec les S – SF – C » (fiches 3.3 et 3.6, volet N). À vérifier avec vos codes exacts du référentiel FMTTN et du programme SeGEC.</p></div>
        <div class="d-card"><h2>Officiel ou fictif ?</h2><p><b>Faits officiels utilisés</b> (vérifiés le 17/11/2026) :</p><ul>${D.facts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
          <p><b>Fictif</b> : personnages, console de Sam (500 Go), configurations de PC, sites, liens, publications, comptes. Chaque écran concerné porte une étiquette <span class="tag t-off">OFFICIEL</span> ou <span class="tag t-fic">FICTIF</span>. Aucun lien réel n'est cliquable.</p></div>
        <div class="d-card"><h2>Outils de classe</h2>
          <p><button class="btn ghost" id="th-unlock">Déverrouiller toutes les missions (démo)</button></p>
          <p><button class="btn ghost danger-t" id="th-reset">Réinitialiser cet ordinateur</button></p>
          <p class="small">Modifier un texte, une réponse ou un indice : fichier <code>js/data.js</code> (voir le README).</p>
          <h3>Sources</h3><ul class="src">${D.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join("")}</ul></div>
      </div></section>`;
    $("#th-back").addEventListener("click", goTitle);
    $("#th-unlock").addEventListener("click", () => { D.order.forEach((id) => { if (ms(id).status === "locked") ms(id).status = "open"; }); save(); toast("Mode démo", "Toutes les missions sont accessibles.", "info", "🔓"); });
    $("#th-reset").addEventListener("click", () => confirmBox("Réinitialiser ?", "La progression enregistrée dans ce navigateur sera effacée.", "Réinitialiser", resetAll));
    $("h1", screen).focus();
  }

  /* ---------- démarrage ---------- */
  VC.app = { goTitle, goMap, startMission, openStep, goDashboard, state: () => S };
  goTitle();
})();
