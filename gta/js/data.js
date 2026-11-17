/* =====================================================================
   GTA · Gère. Traque. Agis.
   CONTENUS PÉDAGOGIQUES — ce fichier se modifie sans toucher au moteur.

   Pour chaque mission : textes, exercices, réponses attendues,
   indices et explications. Les types d'étapes disponibles :
   story · learn · choice · sort · order · inspect · space · branch ·
   toggles · password · input   (voir README.md)

   Règle d'or : chaque exercice a un "skill" (compétence suivie dans le
   bilan) et, si possible, un "notion" (fiche à revoir en cas d'erreur).
   ===================================================================== */
window.VC = window.VC || {};
(function () {
  const V = VC.V; // helpers visuels (visuals.js)

  VC.DATA = {
    meta: {
      title: "GTA",
      subtitle: "Gère. Traque. Agis.",
      pitch: "Bienvenue à Leonida. Fais de la place, déjoue les pièges et garde le contrôle.",
      verbs: [
        { id: "G", word: "Gère", text: "ton espace de stockage et tes fichiers.", icon: "💾" },
        { id: "T", word: "Traque", text: "les arnaques, les fausses annonces et les indices suspects.", icon: "🔍" },
        { id: "A", word: "Agis", text: "en faisant les bons choix pour terminer les missions.", icon: "⚡" },
      ],
      course: "Formation numérique · 1re secondaire (S1)",
      duration: "2 périodes · ±90 minutes",
      version: "1.0 · novembre 2026",
      storageKey: "vicecheck.leonida.v1",
    },

    /* ---------------- Personnages (tous fictifs) ---------------- */
    contacts: {
      dee:    { name: "Dee",            role: "Brigade numérique · ton contact", color: "#FF3D8B", initials: "D" },
      sam:    { name: "Sam",            role: "ton cousin",                       color: "#2EE6E6", initials: "S" },
      kenzo:  { name: "Kenzo",          role: "copain de classe",                 color: "#FFC83D", initials: "K" },
      lina:   { name: "Lina",           role: "ta voisine",                       color: "#A78BFA", initials: "L" },
      unknown:{ name: "Numéro inconnu", role: "",                                 color: "#8A7F99", initials: "?" },
    },

    /* ---------------- Compétences suivies (référentiel) ----------------
       ref : rattachement à l'annexe "Attendus en lien avec les S-SF-C"
       (programme FMTTN, volet N). level : S1 = attendu de l'année ;
       "découverte" = notion abordée avant l'année où elle est attendue. */
    skills: {
      unites:    { label: "Ordonner les unités ko, Mo, Go, To (≈ ×1 000)", ref: "Informations et données · attendu de fin de parcours (S3)", level: "Découverte" },
      memoire:   { label: "Distinguer mémoire vive et stockage, stockage interne et externe", ref: "Informations et données · hardware, mémoire, stockage", level: "S1" },
      stockage:  { label: "Organiser des données dans un espace de stockage adapté", ref: "Informations et données · C11 (+ SF déplacer, supprimer)", level: "S1" },
      web:       { label: "Lire une adresse web et distinguer HTTP et HTTPS", ref: "Sécurité · « Distinguer HTTP et HTTPS »", level: "S1" },
      arnaque:   { label: "Réagir face à une tentative d'arnaque ou de cyberattaque", ref: "Sécurité · C19", level: "S1" },
      vieprivee: { label: "Repérer les données personnelles avant de les encoder", ref: "Sécurité · vie privée, données personnelles", level: "S1" },
      source:    { label: "Vérifier une information et sa source", ref: "Informations et données · fiabilité (attendue en S2)", level: "Anticipation S2" },
      identite:  { label: "Gérer son identité numérique, ses traces et ses comptes", ref: "Sécurité · C22, effacer ses traces, paramétrer la confidentialité", level: "S1" },
      pegi:      { label: "Décoder une signalétique (PEGI)", ref: "Sécurité · « Décoder une signalétique (PEGI…) »", level: "S1" },
      debit:     { label: "Estimer un temps de téléchargement (Mbit/s, Mo/s)", ref: "Informations et données · prolongement", level: "Bonus" },
    },

    /* ---------------- Faits officiels utilisés (vérifiés le 17/11/2026) ---------------- */
    facts: [
      "Sortie mondiale le 19 novembre 2026, sur PlayStation 5 et Xbox Series X|S.",
      "Préchargement depuis le 10 novembre : jusqu'à 212 Go selon la console (annonce de Rockstar Games, 3 novembre 2026).",
      "Pas de version PC, pas de version mobile, pas de bêta et pas de démo annoncées pour le lancement.",
      "La boîte vendue en magasin contient un code de téléchargement.",
      "Classement PEGI 18.",
    ],

    /* =================================================================
       MISSIONS
       ================================================================= */
    missions: [
      /* ---------------------------------------------------------------
         PROLOGUE
         --------------------------------------------------------------- */
      {
        id: "m0", code: "00", kind: "prologue",
        title: "Bienvenue à la Brigade",
        place: "QG de la Brigade · Vice City", time: "18:00", minutes: 5,
        objective: "Découvrir ta mission, ton téléphone et les règles du jeu.",
        skills: ["pegi"], reward: 200, badge: null,
        map: { x: 548, y: 300, icon: "★" },
        unlocks: ["m1"],
        recap: [
          "PEGI 18 = jeu conseillé à partir de 18 ans. Ce n'est pas une note de qualité.",
          "Une erreur fait monter tes étoiles. Un indice ou une correction les fait redescendre.",
        ],
        steps: [
          { type: "story", messages: [
            { from: "dee", text: "Salut, recrue 👋 Bienvenue à la Brigade numérique de Vice City." },
            { from: "dee", text: "Ce soir à minuit, le jeu le plus attendu de la décennie sort. Tout Leonida est surexcité." },
            { from: "dee", text: "Et les Requins du Net, un gang de cyber-escrocs, comptent bien en profiter 🦈" },
            { from: "dee", text: "Ta mission : protéger la ville jusqu'à minuit. Je t'envoie tes ordres sur ce téléphone." },
          ], cta: "C'est parti" },
          { type: "learn", id: "n-pegi", kicker: "Avant de commencer", title: "Un jeu qui n'est pas pour toi",
            slides: [
              { visual: "pegiLabel", html: `<p>Le jeu dont tout le monde parle est classé <strong>PEGI 18</strong>. PEGI est la signalétique européenne des jeux vidéo.</p>
                <ul><li>Le <strong>chiffre</strong> donne l'âge conseillé : 3, 7, 12, 16 ou 18 ans.</li>
                <li>Les <strong>pictogrammes</strong> expliquent pourquoi : violence, langage grossier, peur, achats en jeu…</li>
                <li>Ce n'est <strong>pas une note de qualité</strong>.</li></ul>
                <p class="callout">Ici, on n'y joue pas. On enquête sur tout ce qui se passe <strong>autour</strong> de sa sortie : téléchargements, arnaques, rumeurs, comptes piratés.</p>` },
              { visual: "hudGuide", html: `<p>En haut de l'écran, ton <strong>HUD</strong> (l'affichage du jeu) :</p>
                <ul><li><strong>Étoiles de recherche</strong> : une erreur ajoute une étoile. Pas de panique : un indice ou une bonne correction en enlève une. Tu n'es <strong>jamais bloqué·e</strong>.</li>
                <li><strong>Portefeuille</strong> : chaque mission réussie rapporte des dollars (fictifs, bien sûr).</li>
                <li><strong>Horloge</strong> : l'heure avance à chaque mission. Minuit = sortie du jeu.</li>
                <li><strong>Carnet</strong> 📖 : tu peux y relire toutes les notions découvertes.</li></ul>` },
            ] },
          { type: "choice", id: "c-pegi", skill: "pegi", notion: "n-pegi",
            prompt: "Test du HUD. Que t'apprend l'étiquette « PEGI 18 » sur la boîte d'un jeu ?",
            tip: "Astuce : tu peux essayer une mauvaise réponse pour voir comment réagissent les étoiles.",
            options: [
              { id: "a", html: "Le jeu est conseillé à partir de 18 ans.", correct: true, fb: "Exact : c'est un âge conseillé, pour protéger les plus jeunes." },
              { id: "b", html: "Le jeu a reçu la note de 18 sur 20.", fb: "PEGI ne donne pas de note de qualité : le chiffre est un âge." },
              { id: "c", html: "Le jeu pèse 18 Go.", fb: "Ce chiffre n'a rien à voir avec la taille du fichier : c'est un âge." },
              { id: "d", html: "Le jeu coûte 18 €.", fb: "Ce n'est pas un prix : c'est l'âge conseillé." },
            ],
            hints: ["PEGI sert à protéger les joueurs plus jeunes.", "Le chiffre se lit comme l'âge indiqué pour un film."],
            success: "Tu sais décoder le chiffre d'une étiquette PEGI. Les pictogrammes reviendront plus tard…" },
        ],
      },

      /* ---------------------------------------------------------------
         MISSION 1 · ESPACE INSUFFISANT
         --------------------------------------------------------------- */
      {
        id: "m1", code: "01", verb: "G",
        title: "Espace insuffisant",
        place: "Palm Heights · chez Sam", time: "19:00", minutes: 20,
        objective: "Libérer assez de place sur la console de Sam, sans rien perdre d'important.",
        skills: ["unites", "memoire", "stockage"], reward: 1500, badge: { id: "archiviste", icon: "🗄️", name: "Archiviste de Leonida" },
        map: { x: 372, y: 196, icon: "💾" },
        unlocks: ["m2", "mB"],
        recap: [
          "1 octet = 8 bits. ko → Mo → Go → To : environ ×1 000 à chaque marche.",
          "La mémoire vive (RAM) sert pendant l'utilisation et se vide à l'extinction. Le stockage garde les fichiers.",
          "Stockage interne, externe ou en ligne : je choisis l'espace adapté à chaque fichier.",
          "Avant de supprimer, je me demande si c'est irremplaçable. Si oui, je déplace au lieu de supprimer.",
        ],
        steps: [
          { type: "story", messages: [
            { from: "sam", text: "Au secours !! Ma console affiche « Espace insuffisant » 😭" },
            { from: "sam", text: "Le jeu demande 212 Go et j'ai même pas 70 Go de libres. Je supprime tout ?" },
            { from: "dee", text: "Surtout pas tout ! Certaines choses sont irremplaçables." },
            { from: "dee", text: "D'abord, un point sur les unités. Ensuite, tu fais le ménage avec lui.", tag: "facts" },
          ], cta: "Accepter la mission",
            note: { official: "212 Go : taille maximale du préchargement annoncée par Rockstar Games.", fictional: "Tout le contenu de la console de Sam est inventé pour l'exercice." } },

          { type: "learn", id: "n-units", kicker: "Découverte", title: "Du bit au téraoctet",
            slides: [
              { visual: "bitsToA", html: `<p>Un ordinateur ne connaît que deux états : <strong>0</strong> ou <strong>1</strong>. C'est un <strong>bit</strong>.</p>
                <p>On regroupe <strong>8 bits</strong> pour former <strong>1 octet</strong>. Un octet suffit pour coder une lettre, comme « A ».</p>` },
              { visual: "unitLadder", html: `<p>Les fichiers sont énormes : on utilise donc des multiples de l'octet.</p>
                <p class="callout">Chaque marche est environ <strong>1 000 fois</strong> plus grande que la précédente.</p>
                <p class="small">Le savais-tu ? Les informaticiens comptent parfois par 1 024. C'est pour ça qu'un disque vendu « 1 To » affiche environ 931 Go. Ici, on compte par 1 000.</p>` },
              { visual: "unitCompare", html: `<p>Pour comparer deux tailles, <strong>ramène-les à la même unité</strong>.</p>
                <ul><li>1,2 Go = 1 200 Mo, donc <strong>plus</strong> que 950 Mo.</li>
                <li>900 ko, c'est <strong>moins</strong> que 1 Mo.</li></ul>
                <p class="callout">Go → Mo : × 1 000 &nbsp;·&nbsp; Mo → Go : ÷ 1 000</p>` },
            ] },

          { type: "order", id: "o-sizes", skill: "unites", notion: "n-units",
            prompt: "Range ces fichiers du plus léger (en haut) au plus lourd (en bas).",
            items: [
              { id: "clip",  html: "🎬 Clip de but en 4K <b>· 1,2 Go</b>" },
              { id: "vocal", html: "🎙️ Message vocal de Sam <b>· 900 ko</b>" },
              { id: "game",  html: "🎮 Le jeu, préchargement <b>· 212 Go</b>", tag: "officiel" },
              { id: "patch", html: "🩹 Mise à jour d'une appli <b>· 950 Mo</b>" },
              { id: "disk",  html: "💽 Disque externe vide <b>· 1 To</b>" },
              { id: "photo", html: "📸 Photo de vacances <b>· 3 Mo</b>" },
            ],
            rules: [
              { before: "vocal", after: "photo", msg: "900 ko, c'est moins que 1 Mo : le message vocal est plus léger que la photo de 3 Mo." },
              { before: "photo", after: "patch", msg: "3 Mo, c'est beaucoup moins que 950 Mo." },
              { before: "patch", after: "clip",  msg: "Piège ! 1,2 Go = 1 200 Mo. La mise à jour de 950 Mo est donc plus légère que le clip." },
              { before: "clip",  after: "game",  msg: "1,2 Go, c'est bien moins que 212 Go." },
              { before: "game",  after: "disk",  msg: "1 To = 1 000 Go : le disque vide peut contenir plus que les 212 Go du jeu." },
            ],
            hints: ["Commence par repérer l'unité de chaque fichier : ko, Mo, Go ou To.", "Compare 950 Mo et 1,2 Go : convertis 1,2 Go en Mo (× 1 000)."],
            success: "Tu as comparé des tailles exprimées dans des unités différentes. C'est exactement ce qu'il faut faire avant de télécharger." },

          { type: "learn", id: "n-memory", kicker: "Découverte", title: "Mémoire vive ou stockage ?",
            slides: [
              { visual: "ramVsStorage", html: `<p>Imagine la cuisine d'un restaurant de Vice City.</p>
                <ul><li>Le <strong>stockage</strong>, ce sont les <strong>armoires</strong> : on y range tout, même quand la console est éteinte.</li>
                <li>La <strong>mémoire vive (RAM)</strong>, c'est le <strong>plan de travail</strong> : on y pose seulement ce qu'on utilise maintenant. Plus il est grand, plus on peut faire de choses en même temps.</li></ul>
                <p class="callout">Quand on lance le jeu, une partie est copiée du stockage vers la RAM. Quand on éteint, la RAM se vide.</p>` },
              { visual: "storageTypes", html: `<p>Il existe plusieurs <strong>espaces de stockage</strong> :</p>
                <ul><li><strong>Interne</strong> : dans l'appareil (le SSD de la console). C'est là qu'un jeu doit être installé pour être joué.</li>
                <li><strong>Externe</strong> : un support qu'on branche (disque dur USB, clé USB).</li>
                <li><strong>En ligne (cloud)</strong> : sur les serveurs d'une entreprise, accessible avec Internet. Souvent limité en place.</li></ul>
                <p class="callout">Bien organiser ses données, c'est choisir l'espace <strong>adapté</strong> à chaque fichier.</p>` },
            ] },

          { type: "sort", id: "s-memory", skill: "memoire", notion: "n-memory",
            prompt: "Classe chaque description dans le bon type de mémoire.",
            bins: [
              { id: "ram", label: "Mémoire vive (RAM)", icon: "⚡" },
              { id: "int", label: "Stockage interne", icon: "🎮" },
              { id: "ext", label: "Stockage externe ou en ligne", icon: "💽" },
            ],
            items: [
              { id: "i1", html: "Elle se vide quand on éteint la console.", bin: "ram", fb: "C'est la RAM : sans courant, elle ne garde rien." },
              { id: "i2", html: "16 Go qui font tourner le jeu pendant que tu joues.", bin: "ram", fb: "Faire tourner un jeu en ce moment, c'est le rôle de la RAM (le plan de travail)." },
              { id: "i3", html: "Plus elle est grande, plus on peut ouvrir de programmes en même temps.", bin: "ram", fb: "Un grand plan de travail permet de faire plus de choses à la fois : c'est la RAM." },
              { id: "i4", html: "Le SSD de 1 To vissé à l'intérieur de la console.", bin: "int", fb: "Il est à l'intérieur de l'appareil : c'est du stockage interne." },
              { id: "i5", html: "L'endroit où le jeu doit être installé pour qu'on puisse y jouer.", bin: "int", fb: "Pour être joué, le jeu doit être installé dans le stockage interne de la console." },
              { id: "i6", html: "Une clé USB de 64 Go pour transporter ton exposé.", bin: "ext", fb: "On la branche et on l'emporte : stockage externe." },
              { id: "i7", html: "Un espace en ligne, accessible avec Internet.", bin: "ext", fb: "C'est le cloud : un stockage en ligne, en dehors de ton appareil." },
              { id: "i8", html: "Un disque dur USB pour archiver des vidéos.", bin: "ext", fb: "Il se branche de l'extérieur : stockage externe." },
            ],
            hints: ["Pose-toi la question : est-ce que ça se vide à l'extinction ? Si oui, c'est la RAM.", "Interne = dans l'appareil. Externe ou en ligne = en dehors (branché ou via Internet)."],
            success: "Tu fais la différence entre la mémoire qui travaille (RAM) et celle qui range (stockage)." },

          { type: "space", id: "sp-sam", skill: "stockage", notion: "n-memory",
            prompt: "Libère au moins 212 Go sur la console de Sam. Pour chaque élément, choisis : garder, déplacer ou supprimer.",
            brief: { from: "sam", text: "Je joue au foot tous les week-ends et je suis au milieu du jeu d'aventure. Je tiens à mes vidéos de buts et aux photos avec mamie. Le jeu de course, j'y ai plus touché depuis un an. La démo, jamais lancée." },
            capacity: 500, need: 212,
            destinations: {
              keep:  { label: "Garder", icon: "🎮" },
              ext:   { label: "Disque externe", icon: "💽", capacity: 1000 },
              cloud: { label: "Cloud", icon: "☁️", capacity: 50 },
              del:   { label: "Supprimer", icon: "🗑️" },
            },
            items: [
              { id: "sys",     name: "Système de la console", icon: "⚙️", size: 50,   unit: "Go", kind: "system" },
              { id: "foot",    name: "Jeu de foot (joué chaque week-end)", icon: "⚽", size: 110, unit: "Go", kind: "game", tag: "playing" },
              { id: "aventure",name: "Jeu d'aventure (en cours, chapitre 6)", icon: "🗺️", size: 85, unit: "Go", kind: "game", tag: "playing" },
              { id: "course",  name: "Jeu de course (plus lancé depuis 1 an)", icon: "🏎️", size: 95, unit: "Go", kind: "game" },
              { id: "buts",    name: "Vidéos 4K de ses meilleurs buts", icon: "🎬", size: 60000, unit: "Mo", kind: "media", tag: "irreplaceable" },
              { id: "photos",  name: "Photos de vacances avec mamie", icon: "📸", size: 8000, unit: "Mo", kind: "media", tag: "irreplaceable" },
              { id: "demo",    name: "Démo jamais lancée", icon: "🧪", size: 22, unit: "Go", kind: "game" },
              { id: "appli",   name: "Appli de streaming vidéo", icon: "📺", size: 2, unit: "Go", kind: "app" },
              { id: "captures",name: "Captures d'écran de parties", icon: "🖼️", size: 1500, unit: "Mo", kind: "media" },
            ],
            messages: {
              system: "Le système fait fonctionner la console : impossible de le déplacer ou de le supprimer.",
              irreplaceable_del: "« {name} » : c'est irremplaçable ! Une fois supprimé, c'est perdu pour toujours. Déplace-le plutôt vers un stockage externe ou en ligne.",
              playing_del: "« {name} » : Sam y joue encore ! Le supprimer l'obligerait à tout retélécharger. Cherche de la place ailleurs.",
              game_cloud: "« {name} » : un jeu ne se range pas dans un cloud de photos et de documents. Pour l'archiver, utilise le disque externe.",
              cloud_full: "Le cloud gratuit n'offre que 50 Go et tu y as mis {used} Go. Choisis un autre espace pour certains fichiers.",
              not_enough: "Il manque encore {missing} Go : l'espace libre est de {free} Go, il en faut au moins 212.",
              playing_move: "« {name} » déplacé : c'est possible, mais Sam devra le recopier sur la console pour y rejouer.",
            },
            hints: [
              "Commence par ce que Sam n'utilise plus du tout : il peut le supprimer sans regret (un jeu acheté peut être retéléchargé).",
              "Ce qui est irremplaçable (photos, vidéos personnelles) ne se supprime pas : on le déplace.",
              "Le cloud gratuit est petit (50 Go) : les grosses vidéos iront plutôt sur le disque externe.",
            ],
            solutionText: "Une solution : supprimer le jeu de course (95 Go) et la démo (22 Go), déplacer les vidéos de buts (60 Go) sur le disque externe et les photos (8 Go) dans le cloud. Espace libre : 251,5 Go.",
            success: "Il y a plusieurs bonnes solutions : la tienne en est une ! Tu as choisi un espace adapté à chaque fichier, sans rien perdre d'important." },

          { type: "choice", id: "c-config", skill: "memoire", notion: "n-memory",
            prompt: "Le grand frère de Sam choisit un PC portable. Le jeu qu'il veut (exemple fictif) demande <b>16 Go de mémoire vive</b> minimum et <b>150 Go d'espace libre</b>. Quel PC convient ?",
            layout: "cards",
            options: [
              { id: "a", html: V.spec("PC Néon", [["Mémoire vive", "32 Go"], ["Stockage", "SSD 128 Go"]]), fb: "Beaucoup de RAM… mais 128 Go de stockage : le jeu (150 Go) ne rentre même pas !" },
              { id: "b", html: V.spec("PC Palmier", [["Mémoire vive", "16 Go"], ["Stockage", "SSD 1 To"]]), correct: true, fb: "16 Go de RAM (le minimum demandé) et 1 To de stockage : largement assez." },
              { id: "c", html: V.spec("PC Océan", [["Mémoire vive", "8 Go"], ["Stockage", "HDD 2 To"]]), fb: "Énorme stockage, mais seulement 8 Go de RAM : moins que les 16 Go demandés. Ne confonds pas les deux mémoires !" },
              { id: "d", html: V.spec("PC Flamant", [["Mémoire vive", "16 Go"], ["Stockage", "SSD 256 Go, dont 200 Go déjà occupés"]]), fb: "256 − 200 = 56 Go libres seulement. Il en faut 150." },
            ],
            hints: ["Vérifie les DEUX conditions : la RAM ET l'espace libre.", "Attention au PC Flamant : calcule l'espace qui reste vraiment libre."],
            success: "Tu as vérifié deux caractéristiques différentes sans les confondre : la mémoire vive et l'espace de stockage." },
        ],
      },

      /* ---------------------------------------------------------------
         MISSION 2 · OFFRE TROP BELLE
         --------------------------------------------------------------- */
      {
        id: "m2", code: "02", verb: "T",
        title: "Offre trop belle",
        place: "Neon Beach · simulateur de la Brigade", time: "20:00", minutes: 20,
        objective: "Démasquer le faux site qui promet le jeu gratuit, sans jamais cliquer sur un vrai lien.",
        skills: ["web", "arnaque", "vieprivee"], reward: 1500, badge: { id: "lynx", icon: "🔍", name: "Œil de lynx" },
        map: { x: 628, y: 254, icon: "🌐" },
        unlocks: ["m3"],
        recap: [
          "Le vrai propriétaire d'un site, c'est le nom juste avant la première « / » (par exemple gta6-free.xyz).",
          "HTTPS chiffre les échanges, mais ne prouve pas qu'un site est honnête.",
          "Trop beau, urgent, données demandées, fichier bizarre : je m'arrête et je préviens un adulte.",
          "Mot de passe, carte bancaire, adresse, téléphone, école : je ne les encode jamais sur un site inconnu.",
        ],
        steps: [
          { type: "story", messages: [
            { from: "kenzo", text: "Regarde 😱😱 Le jeu GRATUIT sur PC et Android avant tout le monde !!" },
            { from: "kenzo", text: "🔗 gta6-free.xyz/download", style: "link" },
            { from: "dee", text: "Stop. Ne clique pas. On l'ouvre dans le simulateur sécurisé de la Brigade : rien n'y est réel." },
            { from: "dee", text: "Les faits officiels : sortie le 19 novembre, sur PS5 et Xbox Series X|S seulement. Aucune version PC ou mobile au lancement, ni bêta, ni démo." },
          ], cta: "Lancer le simulateur",
            note: { official: "Plateformes et date de sortie : annonces de Rockstar Games.", fictional: "Le site, les liens et les messages de cette mission sont inventés. Aucun n'existe." } },

          { type: "learn", id: "n-url", kicker: "Découverte", title: "Qui se cache derrière l'adresse ?",
            slides: [
              { visual: "urlAnatomy", html: `<p>Une adresse web se lit comme une adresse postale.</p>
                <p class="callout">Le <strong>vrai propriétaire</strong>, c'est le <strong>nom de domaine</strong> : le mot juste avant la première barre « / », avec son extension (.com, .be, .xyz…).</p>
                <p>Tout ce qui est écrit à sa gauche peut être inventé par n'importe qui.</p>` },
              { visual: "urlTrap", html: `<p>Les escrocs déguisent leur adresse en y glissant le nom d'une marque connue.</p>
                <p>Dans <code>rockstargames.com.gta6-free.xyz</code>, le propriétaire n'est <strong>pas</strong> rockstargames.com : c'est <strong>gta6-free.xyz</strong>.</p>
                <p>Autres pièges : une lettre remplacée (<code>rn</code> au lieu de <code>m</code>, <code>0</code> au lieu de <code>o</code>), un tiret ou un mot ajouté.</p>` },
              { visual: "httpEnvelope", html: `<p><strong>HTTP</strong> : les informations voyagent comme une <strong>carte postale</strong>. N'importe qui sur le trajet peut les lire.</p>
                <p><strong>HTTPS</strong> (S = sécurisé) : elles voyagent dans une <strong>enveloppe fermée</strong>. Elles sont chiffrées. Le navigateur affiche un cadenas.</p>
                <p class="callout warn">HTTPS protège le <strong>trajet</strong>, pas l'<strong>honnêteté</strong> du site. Un escroc peut aussi avoir un cadenas !</p>` },
            ] },

          { type: "choice", id: "c-urls", skill: "web", notion: "n-url", multi: true,
            prompt: "Quelles adresses appartiennent vraiment à l'éditeur du jeu, <code>rockstargames.com</code> ? <b>Plusieurs réponses possibles.</b>",
            layout: "mono",
            options: [
              { id: "u1", html: "https://www.rockstargames.com/VI", correct: true, fb: "Le nom de domaine est rockstargames.com : c'est bien l'éditeur." },
              { id: "u2", html: "https://rockstargames.com.gta6-free.xyz/download", fb: "Le nom de domaine est gta6-free.xyz. « rockstargames.com » n'est qu'un déguisement placé à gauche." },
              { id: "u3", html: "https://support.rockstargames.com", correct: true, fb: "« support. » est un sous-domaine : le domaine reste rockstargames.com." },
              { id: "u4", html: "http://rockstargarnes.com/promo", fb: "Regarde bien : « rn » imite un « m ». Et l'adresse commence par http, sans S." },
              { id: "u5", html: "https://rockstar-games-gift.com", fb: "Un tiret et un mot en plus : c'est un tout autre domaine." },
            ],
            hints: ["Pour chaque adresse, cherche la première barre « / » après https:// et lis le mot juste avant.", "Il y a exactement deux bonnes réponses."],
            success: "Tu lis une adresse comme un pro : tu cherches le nom de domaine, pas le premier mot connu." },

          { type: "choice", id: "c-https", skill: "web", notion: "n-url",
            prompt: "Un site affiche <b>🔒 https://</b> dans la barre d'adresse. Que peux-tu en conclure ?",
            options: [
              { id: "a", html: "Le site est forcément le site officiel.", fb: "Non : n'importe qui peut obtenir un cadenas, même un escroc." },
              { id: "b", html: "Les échanges avec le site sont chiffrés, mais le site peut quand même être une arnaque.", correct: true, fb: "Exactement : le cadenas protège le trajet des informations, pas leur destination." },
              { id: "c", html: "Le site ne contient aucun virus.", fb: "HTTPS ne vérifie pas le contenu du site : un fichier piégé peut voyager en HTTPS." },
              { id: "d", html: "Je peux y entrer mon mot de passe sans réfléchir.", fb: "Surtout pas : vérifie d'abord le nom de domaine." },
            ],
            hints: ["Repense à l'enveloppe fermée : elle protège la lettre pendant le trajet… mais qui la reçoit ?"],
            success: "Tu as compris la différence entre une connexion sécurisée et un site digne de confiance." },

          { type: "inspect", id: "i-fake", skill: "arnaque", notion: "n-url", mock: "fakeSite", need: 5,
            prompt: "Voici le site envoyé par Kenzo, dans le simulateur. Clique sur les éléments suspects. Trouve-en <b>au moins 5</b>.",
            targets: {
              url:      { title: "Adresse piégée", fb: "Le domaine est gta6-free.xyz, pas rockstargames.com. Et il n'y a pas de S : la connexion n'est pas chiffrée." },
              promise:  { title: "Promesse impossible", fb: "Aucune version PC ou Android n'existe au lancement. Et un jeu à ±80 € offert gratuitement ? Trop beau pour être vrai." },
              timer:    { title: "Fausse urgence", fb: "Le compte à rebours sert à te faire paniquer pour que tu cliques sans réfléchir." },
              form:     { title: "Données sensibles demandées", fb: "Jamais de mot de passe ni de numéro de carte sur un site inconnu. « Vérifier ton âge » n'est qu'un prétexte." },
              file:     { title: "Fichier bizarre", fb: "Un fichier .exe de 12 Mo pour un jeu de 212 Go ? Impossible. C'est sans doute un programme malveillant." },
              typos:    { title: "Fautes d'orthographe", fb: "Les faux sites sont souvent faits vite, avec des fautes : « maintenent », « securiser »." },
              reviews:  { title: "Faux avis", fb: "Cinq avis identiques, tous du même jour : ils sont inventés pour te rassurer." },
            },
            decoys: {
              nav:   { fb: "Un menu de navigation, c'est normal sur un site. Ce n'est pas un indice." },
              image: { fb: "Une belle image ne prouve rien, ni dans un sens ni dans l'autre. Ce n'est pas un indice." },
              pegi:  { fb: "Afficher le PEGI 18 est normal. Les escrocs copient d'ailleurs les détails officiels pour paraître crédibles." },
            },
            hints: ["Commence par la barre d'adresse tout en haut.", "Regarde ce que le site te demande d'écrire… et ce qu'il te propose de télécharger.", "Compare la taille du fichier avec celle du vrai jeu (mission 1)."],
            success: "Site démasqué ! Tu as repéré les signaux typiques d'une arnaque au téléchargement." },

          { type: "sort", id: "s-privacy", skill: "vieprivee", notion: "n-signals",
            prompt: "Le faux site voulait te faire remplir un formulaire. Sur un site inconnu, quelles informations dois-tu garder pour toi ?",
            bins: [
              { id: "keep", label: "Je garde pour moi", icon: "🔒" },
              { id: "ok",   label: "Sans grand risque", icon: "🙂" },
            ],
            items: [
              { id: "p1", html: "Mon mot de passe", bin: "keep", fb: "Un mot de passe ne se donne jamais, à personne, même pas à un « support »." },
              { id: "p2", html: "Le numéro de la carte bancaire de mes parents", bin: "keep", fb: "Avec ce numéro, un escroc peut faire des achats." },
              { id: "p3", html: "Mon adresse", bin: "keep", fb: "Ton adresse permet de savoir où tu vis : c'est une donnée personnelle." },
              { id: "p4", html: "Ma date de naissance complète", bin: "keep", fb: "Elle sert souvent à vérifier ton identité : un escroc peut s'en servir." },
              { id: "p5", html: "Le nom de mon école", bin: "keep", fb: "Avec le nom de ton école, on peut savoir où te trouver la journée." },
              { id: "p6", html: "Mon numéro de téléphone", bin: "keep", fb: "Ton numéro peut être utilisé pour t'envoyer d'autres arnaques." },
              { id: "p7", html: "Mon jeu vidéo préféré", bin: "ok", fb: "Ce n'est pas une donnée qui permet de t'identifier." },
              { id: "p8", html: "Le pays où je vis", bin: ["ok", "keep"], fb: "Information assez vague : elle ne te met pas en danger, mais rien ne t'oblige à la donner." },
            ],
            hints: ["Demande-toi : un inconnu pourrait-il me retrouver, se faire passer pour moi ou payer avec cette info ?"],
            success: "Tu sais repérer les données personnelles avant de les encoder. C'est un réflexe qui protège ta vie privée." },

          { type: "learn", id: "n-signals", kicker: "À retenir", title: "Les 6 signaux d'alerte",
            slides: [
              { visual: "signalsGrid", html: `<p>Si tu repères un seul de ces signaux, méfie-toi. Si tu en repères plusieurs, c'est presque sûrement une arnaque.</p>` },
              { visual: "stopReflex", html: `<p>Le bon réflexe face à un message ou un site douteux : <strong>STOP</strong>.</p>
                <p class="callout">Et si tu as déjà cliqué ? Pas de honte : ça arrive aussi aux adultes. Préviens vite un adulte, change ton mot de passe depuis l'application officielle et lance une analyse avec l'antivirus.</p>` },
            ] },
        ],
      },

      /* ---------------------------------------------------------------
         MISSION 3 · INFO OU INTOX ?
         --------------------------------------------------------------- */
      {
        id: "m3", code: "03", verb: "T",
        title: "Info ou intox ?",
        place: "Studio Vice FM", time: "21:30", minutes: 15,
        objective: "Retrouver la vraie annonce et trier le vrai du faux avant que la ville partage n'importe quoi.",
        skills: ["source", "arnaque"], reward: 1500, badge: { id: "radar", icon: "📡", name: "Détecteur d'intox" },
        map: { x: 452, y: 372, icon: "📡" },
        unlocks: ["m4"],
        recap: [
          "Avant de croire ou de partager : Qui le dit ? Quand ? Comment le sait-il ?",
          "Je vérifie l'identifiant exact du compte et je cherche la même info dans au moins deux sources fiables.",
          "Un compte officiel ne demande jamais de mot de passe ni d'argent par message.",
        ],
        steps: [
          { type: "story", messages: [
            { from: "dee", text: "Les Requins changent de tactique : ils inondent les réseaux de fausses annonces." },
            { from: "lina", text: "J'ai vu que le jeu sortait plus tôt sur PC. Et qu'il ferait 600 Go ?? C'est vrai ?" },
            { from: "dee", text: "Ta mission : trier le vrai du faux. Et retrouver la seule annonce vraiment officielle." },
          ], cta: "Allumer le studio",
            note: { official: "Date, plateformes et taille de 212 Go : annonces officielles.", fictional: "Les publications et les comptes sont reconstitués pour l'exercice." } },

          { type: "learn", id: "n-source", kicker: "Découverte", title: "Trois questions avant de partager",
            slides: [
              { visual: "threeQuestions", html: `<p>Avant de croire une info, pose-toi trois questions :</p>
                <ul><li><strong>Qui</strong> la publie ? Le compte officiel, un média connu, ou un inconnu ?</li>
                <li><strong>Quand</strong> ? Une vieille info peut être dépassée.</li>
                <li><strong>Comment le sait-il ?</strong> Y a-t-il une preuve, un lien vers une source ?</li></ul>
                <p class="callout">Puis <strong>recoupe</strong> : cherche la même info dans au moins deux sources fiables.</p>` },
              { visual: "officialAccount", html: `<p>Pour reconnaître un <strong>compte officiel</strong> :</p>
                <ul><li>L'<strong>identifiant</strong> est exact, lettre par lettre (les copies remplacent un « o » par un « 0 » ou ajoutent « _Officiel »).</li>
                <li>Il renvoie vers le <strong>site officiel</strong>.</li>
                <li>Il ne demande <strong>jamais</strong> ton mot de passe, ni de l'argent par message.</li></ul>` },
            ] },

          { type: "choice", id: "c-official", skill: "source", notion: "n-source", layout: "posts",
            prompt: "Ces quatre publications parlent de la sortie du jeu. <b>Laquelle est la vraie annonce officielle ?</b>",
            options: [
              { id: "a", html: V.post({ name: "Rockstar Games", handle: "@Rockstar_Games_Officiel", verified: true, date: "18 nov.", color: "#111",
                  text: "🎁 Le jeu OFFERT aux 1 000 premiers fans ! Envoie ton identifiant et ton mot de passe en message privé pour réserver ta copie." }),
                fb: "Identifiant modifié (« _Officiel ») et demande de mot de passe : c'est une copie. Le badge vérifié ne suffit pas, il peut s'acheter sur certains réseaux." },
              { id: "b", html: V.post({ name: "R0ckstar Games", handle: "@R0ckstarGames", verified: false, date: "17 nov.", color: "#222",
                  text: "Sortie avancée au 12 novembre sur PC ! Précharge ici 👉 bit.ly/vi-pc-early" }),
                fb: "Regarde l'identifiant : un zéro remplace le « o ». La date et la version PC sont fausses, et le lien est raccourci pour cacher sa destination." },
              { id: "c", html: V.post({ name: "Rockstar Games", handle: "@RockstarGames", verified: true, date: "3 nov.", color: "#111",
                  text: "Grand Theft Auto VI arrive le 19 novembre 2026 sur PlayStation 5 et Xbox Series X|S. Préchargement à partir du 10 novembre. Infos : rockstargames.com/VI" }),
                correct: true, fb: "Identifiant exact, informations cohérentes avec la presse, lien vers le vrai site et aucune demande : c'est l'annonce officielle." },
              { id: "d", html: V.post({ name: "VI Leaks Daily", handle: "@vi_leaks_daily", verified: false, date: "16 nov.", color: "#5B2A86",
                  text: "🚨 SOURCE SÛRE : version Android prévue pour décembre, crois-moi frère 🔥🔥" }),
                fb: "« Source sûre », « crois-moi » : aucune preuve, aucun lien. C'est une rumeur." },
            ],
            hints: ["Compare les identifiants (@…) lettre par lettre.", "Une seule publication ne te demande rien et renvoie vers le site officiel."],
            success: "Tu as retrouvé la vraie annonce en vérifiant l'identifiant, la cohérence des infos et le lien." },

          { type: "sort", id: "s-feed", skill: "source", notion: "n-source",
            prompt: "Le fil de Vice FM déborde. Classe chaque message.",
            bins: [
              { id: "true",  label: "Info vérifiée", icon: "✅" },
              { id: "rumor", label: "Rumeur ou intox", icon: "❓" },
              { id: "scam",  label: "Arnaque", icon: "🦈" },
            ],
            items: [
              { id: "f1", html: "« Le jeu sort le 19 novembre sur PS5 et Xbox Series X|S. » <span class='src'>Annonce officielle, reprise par la presse</span>", bin: "true", fb: "Source officielle confirmée par plusieurs médias : info vérifiée." },
              { id: "f2", html: "« Le préchargement peut demander jusqu'à 212 Go. » <span class='src'>Annonce officielle du 3 novembre</span>", bin: "true", fb: "Chiffre annoncé par l'éditeur lui-même et repris par la presse." },
              { id: "f3", html: "« Capture virale : le jeu pèserait 600 Go !!! » <span class='src'>Image partagée sans source</span>", bin: "rumor", fb: "Une capture sans source n'est pas une preuve. Le chiffre officiel est 212 Go maximum." },
              { id: "f4", html: "« Mon cousin dit que la version PC sort en janvier. » <span class='src'>Message vocal transféré</span>", bin: "rumor", fb: "Un témoignage invérifiable : c'est une rumeur, peut-être vraie, peut-être fausse." },
              { id: "f5", html: "« Gagne une clé du jeu : envoie juste 5 € de frais de livraison ! » <span class='src'>Compte créé hier</span>", bin: "scam", fb: "Demander de l'argent pour un « cadeau » : arnaque classique." },
              { id: "f6", html: "« Générateur de dollars illimités pour le jeu : télécharge l'outil. » <span class='src'>Lien de téléchargement</span>", bin: "scam", fb: "Ces « générateurs » n'existent pas : ils servent à installer des programmes malveillants." },
              { id: "f7", html: "« Bêta secrète sur invitation, clique vite ! » <span class='src'>Message privé</span>", bin: "scam", fb: "Aucune bêta n'a été annoncée. Ces fausses invitations servent à voler des comptes." },
              { id: "f8", html: "« La boîte en magasin contient seulement un code de téléchargement. » <span class='src'>Plusieurs médias spécialisés</span>", bin: "true", fb: "Information rapportée par plusieurs médias qui citent l'éditeur." },
            ],
            hints: ["Arnaque = on te demande d'agir : payer, cliquer, télécharger, donner un mot de passe.", "Rumeur = aucune preuve, mais pas de piège direct."],
            success: "Tu sais faire la différence entre une info vérifiée, une rumeur et un piège." },

          { type: "choice", id: "c-verify", skill: "source", notion: "n-source", multi: true,
            prompt: "Une capture affirme : « Le jeu pèsera 600 Go ». <b>Quelles sont les deux bonnes façons de vérifier ?</b>",
            options: [
              { id: "v1", html: "Chercher l'info sur le site ou le compte officiel de l'éditeur.", correct: true, fb: "La source officielle est la première à vérifier." },
              { id: "v2", html: "Regarder si des médias fiables en parlent et citent leur source.", correct: true, fb: "Recouper avec des médias fiables permet de confirmer ou de démentir." },
              { id: "v3", html: "Compter les likes : 50 000 likes, c'est forcément vrai.", fb: "Une intox peut devenir virale. Les likes mesurent la popularité, pas la vérité." },
              { id: "v4", html: "La partager pour voir si quelqu'un confirme.", fb: "Partager une info non vérifiée, c'est aider l'intox à se répandre." },
            ],
            hints: ["Repense au mot « recouper »."],
            success: "Tu appliques la bonne méthode : source officielle + médias fiables." },
        ],
      },

      /* ---------------------------------------------------------------
         MISSION 4 · COMPTE PIRATÉ
         --------------------------------------------------------------- */
      {
        id: "m4", code: "04", verb: "A",
        title: "Compte piraté",
        place: "Cyber-café Little Byte", time: "22:45", minutes: 20,
        objective: "Comprendre comment le compte de Sam a été piraté, le récupérer et le protéger.",
        skills: ["identite", "arnaque"], reward: 1500, badge: { id: "gardien", icon: "🛡️", name: "Gardien de compte" },
        map: { x: 306, y: 288, icon: "🔐" },
        unlocks: ["mF"],
        recap: [
          "Sur un appareil partagé : je me déconnecte, j'efface les données de navigation et je n'enregistre jamais mon mot de passe.",
          "Une phrase de passe longue, différente pour chaque compte, et la double authentification.",
          "Compte piraté : je préviens un adulte et je change mon mot de passe depuis l'application officielle.",
          "Je règle la confidentialité de mon profil : privé, sans position, sans vrai nom.",
        ],
        steps: [
          { type: "story", messages: [
            { from: "sam", text: "Grosse panique : mon compte de jeu envoie des liens bizarres à tous mes amis 😱" },
            { from: "sam", text: "Et mon mot de passe ne marche plus !" },
            { from: "dee", text: "Hier, Sam a joué au cyber-café Little Byte… On rembobine pour comprendre ce qui s'est passé." },
          ], cta: "Rembobiner" },

          { type: "branch", id: "b-cafe", skill: "identite", notion: "n-identity", start: "n1",
            prompt: "Rembobine la soirée de Sam. À chaque moment, choisis la bonne réaction.",
            nodes: {
              n1: { scene: "⏪ HIER · 17:30 · Cyber-café Little Byte",
                text: "Sam a fini de jouer sur un ordinateur partagé. <b>Que doit-il faire avant de partir ?</b>",
                choices: [
                  { text: "Fermer l'onglet du navigateur, ça suffit.", fb: "Fermer l'onglet ne déconnecte pas toujours le compte. Le client suivant peut tomber dessus, déjà connecté !" },
                  { text: "Se déconnecter de son compte, puis effacer les données de navigation.", correct: true, fb: "Parfait : plus aucune trace de connexion sur cet ordinateur.", next: "n2" },
                  { text: "Éteindre l'écran.", fb: "L'écran est éteint, mais l'ordinateur et la session restent allumés." },
                ] },
              n2: { scene: "⏪ HIER · 17:05 · Un peu plus tôt",
                text: "En se connectant, le navigateur lui a demandé : « Enregistrer le mot de passe ? ». <b>Sur un ordinateur public, que fallait-il répondre ?</b>",
                choices: [
                  { text: "Oui, c'est plus pratique.", fb: "Le mot de passe resterait sur cet ordinateur… pour tous les clients suivants." },
                  { text: "Jamais pour ce site.", correct: true, fb: "Bien vu : sur un appareil partagé, on n'enregistre jamais de mot de passe.", next: "n3" },
                  { text: "Plus tard.", fb: "La question reviendrait, et le client suivant pourrait accepter à sa place." },
                ] },
              n3: { scene: "▶ RETOUR À 22:45 · Chez Sam",
                text: "Le compte de Sam est piraté. Un mail arrive : « Récupère ton compte ici ». <b>Quelle est la première chose à faire ?</b>",
                choices: [
                  { text: "Prévenir un adulte et changer le mot de passe depuis l'application officielle.", correct: true, fb: "C'est la bonne réaction : on passe toujours par l'application officielle, jamais par un lien reçu.", next: null },
                  { text: "Cliquer sur le mail « Récupère ton compte ici ».", fb: "Piège classique : les escrocs envoient de faux mails de récupération juste après un piratage." },
                  { text: "Créer un nouveau compte et oublier l'ancien.", fb: "Le pirate garderait l'ancien compte et continuerait à piéger les amis de Sam." },
                  { text: "Ne rien dire : ça finira par s'arrêter.", fb: "Plus on attend, plus le pirate a le temps d'agir. Il faut réagir vite et en parler." },
                ] },
            },
            hints: ["Pense à tout ce qui reste sur un ordinateur après ton passage.", "Sur un appareil qui n'est pas à toi, on ne laisse rien derrière soi."],
            success: "Tu as reconstitué l'histoire : une session restée ouverte et un mot de passe enregistré sur un ordinateur public." },

          { type: "learn", id: "n-identity", kicker: "Découverte", title: "Ton identité numérique",
            slides: [
              { visual: "tracesVisual", html: `<p>Ton <strong>identité numérique</strong>, c'est tout ce qui te représente en ligne : ton profil, tes comptes, tes publications… et tes <strong>traces</strong>.</p>
                <p>Sur un appareil, tu laisses : l'historique, les cookies, les comptes connectés, les mots de passe enregistrés, les fichiers téléchargés.</p>
                <p class="callout">Sur un appareil partagé : <strong>navigation privée</strong>, <strong>déconnexion</strong>, <strong>effacer les données</strong>. Et jamais « enregistrer le mot de passe ».</p>` },
              { visual: "lockVisual", html: `<p>Un compte bien protégé, c'est :</p>
                <ul><li>une <strong>phrase de passe</strong> : 4 mots sans lien + un chiffre + un symbole. Longue, facile à retenir, dure à deviner ;</li>
                <li>un <strong>mot de passe différent</strong> pour chaque compte ;</li>
                <li>la <strong>double authentification</strong> : un code arrive sur un autre appareil. Un pirate qui a ton mot de passe reste bloqué ;</li>
                <li>des <strong>paramètres de confidentialité</strong> bien réglés : profil privé, pas de position partagée.</li></ul>` },
            ] },

          { type: "order", id: "o-recover", skill: "identite", notion: "n-identity",
            prompt: "Aide Sam à récupérer son compte : remets ces actions dans un ordre logique. <b>Plusieurs ordres sont possibles.</b>",
            items: [
              { id: "c", html: "🔑 Activer la double authentification" },
              { id: "e", html: "📣 Prévenir ses amis que les liens ne venaient pas de lui" },
              { id: "a", html: "🧑‍🏫 Prévenir un adulte de confiance" },
              { id: "d", html: "📵 Déconnecter les appareils inconnus" },
              { id: "b", html: "🔁 Changer le mot de passe depuis l'application officielle" },
            ],
            rules: [
              { first: "a", within: 2, msg: "Préviens un adulte dès le début : il t'aidera pour toutes les étapes suivantes." },
              { before: "b", after: "c", msg: "Reprends d'abord le contrôle avec un nouveau mot de passe, puis active la double authentification." },
              { before: "b", after: "d", msg: "Change le mot de passe avant de déconnecter les appareils : sinon le pirate se reconnecte aussitôt avec l'ancien." },
            ],
            hints: ["Qui peut t'aider dès la première minute ?", "Tant que le pirate connaît le mot de passe, il peut revenir. Que faut-il changer en premier ?"],
            success: "Ton ordre est logique. D'autres ordres l'étaient aussi : l'essentiel, c'est l'adulte au début et le nouveau mot de passe avant le reste." },

          { type: "toggles", id: "t-privacy", skill: "identite", notion: "n-identity",
            prompt: "Sam a récupéré son compte. Règle les paramètres de confidentialité de son profil.",
            settings: [
              { id: "public", label: "Profil visible par tout le monde", icon: "🌍", expect: false, fb: "Un profil public est visible par des inconnus. Mieux vaut le réserver à ses amis." },
              { id: "name",   label: "Afficher mon nom et mon prénom", icon: "🪪", expect: false, fb: "Un pseudo suffit : ton vrai nom permet de te retrouver." },
              { id: "geo",    label: "Partager ma position", icon: "📍", expect: false, fb: "Ta position indique où tu es en ce moment : à garder pour toi." },
              { id: "dm",     label: "Recevoir des messages de tout le monde", icon: "💬", expect: false, fb: "C'est par les messages d'inconnus qu'arrivent beaucoup d'arnaques. Choisis « amis seulement »." },
              { id: "a2f",    label: "Double authentification", icon: "🔑", expect: true, fb: "Indispensable : elle bloque le pirate même s'il connaît le mot de passe." },
              { id: "game",   label: "Montrer à mes amis le jeu auquel je joue", icon: "🎮", expect: null, fb: "C'est ton choix : ce n'est pas une information sensible." },
            ],
            hints: ["Pour chaque réglage, demande-toi : un inconnu pourrait-il s'en servir ?"],
            success: "Profil verrouillé ! Remarque que le dernier réglage était libre : la confidentialité, c'est aussi faire des choix." },

          { type: "password", id: "p-lab", skill: "identite", notion: "n-identity",
            prompt: "Atelier : invente une phrase de passe solide pour le nouveau compte de Sam.",
            warning: "Invente un exemple. N'écris jamais ton vrai mot de passe ici. Rien n'est enregistré.",
            minLength: 16, minWords: 4,
            forbidden: ["gta", "vice", "leonida", "sam", "123", "azerty", "qwerty", "password", "motdepasse", "0000"],
            success: "Phrase de passe validée : longue, imprévisible et facile à retenir. Rien n'a été enregistré." },
        ],
      },

      /* ---------------------------------------------------------------
         MISSION FINALE · VICE CITY DÉBLOQUÉE
         --------------------------------------------------------------- */
      {
        id: "mF", code: "★", kind: "final", verb: "GTA",
        title: "Vice City débloquée",
        place: "Neon Tower · toit", time: "23:50", minutes: 12,
        objective: "Ouvrir les 5 cadenas numériques des Requins avant minuit.",
        skills: ["stockage", "unites", "web", "pegi", "arnaque"], reward: 3000, badge: { id: "legende", icon: "🌴", name: "Légende de Leonida" },
        map: { x: 556, y: 392, icon: "🗼" },
        unlocks: [],
        subtitle: "Tu as protégé Leonida jusqu'à minuit.",
        recap: [
          "Cadenas 1 · Espace à libérer = taille demandée − espace libre.",
          "Cadenas 2 · Mo → Go : on divise par 1 000.",
          "Cadenas 3 · Le vrai propriétaire d'une adresse = le nom de domaine, juste avant la première « / ».",
          "Cadenas 4 · PEGI : un âge conseillé + des pictogrammes qui expliquent pourquoi.",
          "Cadenas 5 · Urgence + mot de passe demandé = arnaque : je ne clique pas, je vérifie dans l'appli officielle et je préviens un adulte.",
        ],
        steps: [
          { type: "story", messages: [
            { from: "dee", text: "23:50. Dernier coup des Requins : ils ont verrouillé le réseau de Vice City avec 5 cadenas numériques 🔒" },
            { from: "dee", text: "Chaque cadenas s'ouvre avec une notion de ce soir. L'horloge est symbolique : prends le temps de réfléchir." },
          ], cta: "Attaquer le premier cadenas" },

          { type: "input", id: "L1", lock: 1, skill: "stockage", notion: "n-memory",
            prompt: "Ta voisine Lina veut installer le jeu. Sa console (données fictives) a <b>1 000 Go</b> au total, dont <b>860 Go</b> déjà occupés. Le jeu demande <b>212 Go</b>. <b>Combien de Go doit-elle libérer, au minimum ?</b>",
            fields: [{ id: "x", label: "Espace à libérer", suffix: "Go", kind: "number", value: 72, tol: 0 }],
            wrong: { 140: "140 Go, c'est l'espace déjà libre. Il faut encore comparer avec les 212 Go demandés.", 212: "212 Go, c'est la taille du jeu. Mais Lina a déjà un peu de place libre." },
            hints: ["Calcule d'abord l'espace libre : 1 000 − 860.", "Puis : 212 − espace libre."],
            success: "1 000 − 860 = 140 Go libres. 212 − 140 = 72 Go à libérer. Cadenas 1 ouvert !" },

          { type: "input", id: "L2", lock: 2, skill: "unites", notion: "n-units",
            prompt: "Le correctif du premier jour pèse <b>8 500 Mo</b>. <b>Combien de Go cela représente-t-il ?</b>",
            fields: [{ id: "x", label: "Taille", suffix: "Go", kind: "number", value: 8.5, tol: 0.001 }],
            wrong: { 8500000: "Tu as multiplié. Pour passer des Mo aux Go (unité plus grande), on divise par 1 000.", 85: "Presque ! Vérifie la position de la virgule : 8 500 ÷ 1 000." },
            hints: ["On passe d'une petite unité (Mo) à une plus grande (Go) : on divise.", "8 500 ÷ 1 000 = ?"],
            success: "8 500 Mo ÷ 1 000 = 8,5 Go. Cadenas 2 ouvert !" },

          { type: "input", id: "L3", lock: 3, skill: "web", notion: "n-url",
            prompt: "Un message propose le correctif gratuit ici : <code>https://rockstargames.com.day1-patch.net/free</code>. <b>Quel est le vrai nom de domaine ?</b>",
            fields: [{ id: "x", label: "Nom de domaine", kind: "text", accept: ["day1-patch.net"], placeholder: "exemple.com" }],
            wrongText: { "rockstargames.com": "C'est le déguisement ! Lis le mot juste avant la première barre « / »." },
            hints: ["Repère la première barre « / » après https://.", "Le nom de domaine, c'est le dernier mot avant cette barre, avec son extension."],
            success: "Le propriétaire est day1-patch.net : ce n'est pas l'éditeur. Cadenas 3 ouvert !" },

          { type: "choice", id: "L4", lock: 4, skill: "pegi", notion: "n-pegi",
            prompt: `La boîte du jeu de foot de Sam affiche cette signalétique. <b>Que signifie-t-elle ?</b>${V.pegiMini(3, ["💳 Achats en jeu"])}`,
            options: [
              { id: "a", html: "Le jeu convient dès 3 ans, mais il propose des achats avec de l'argent réel.", correct: true, fb: "Bien décodé : l'âge ET le pictogramme." },
              { id: "b", html: "Le jeu est gratuit.", fb: "Le pictogramme indique des achats possibles, pas la gratuité." },
              { id: "c", html: "Le jeu est réservé aux 3 premiers joueurs.", fb: "Le chiffre est un âge conseillé." },
              { id: "d", html: "Le jeu coûte 3 €.", fb: "Le chiffre n'est pas un prix : c'est l'âge conseillé." },
            ],
            hints: ["Lis le chiffre ET le pictogramme."],
            success: "Signalétique décodée. Cadenas 4 ouvert !" },

          { type: "choice", id: "L5", lock: 5, skill: "arnaque", notion: "n-signals", multi: true,
            prompt: `23:59. Une notification s'affiche :${V.notif("Numéro inconnu", "⚠️ Ton compte sera SUPPRIMÉ à minuit ! Confirme ton mot de passe ici : rockstar-verif.net")} <b>Choisis les deux bons réflexes.</b>`,
            options: [
              { id: "a", html: "Ne pas cliquer, et vérifier dans l'application officielle.", correct: true, fb: "Oui : l'application officielle te dira si ton compte a un problème." },
              { id: "b", html: "Prévenir un adulte.", correct: true, fb: "Oui : en parler, c'est le meilleur réflexe." },
              { id: "c", html: "Cliquer vite : il reste une minute.", fb: "L'urgence est un piège pour t'empêcher de réfléchir." },
              { id: "d", html: "Répondre au message pour demander si c'est vrai.", fb: "Répondre confirme à l'escroc que ton numéro est actif." },
              { id: "e", html: "Transférer le message à tous tes amis.", fb: "Tu diffuserais le lien piégé. Préviens-les plutôt sans transférer le lien." },
            ],
            hints: ["Urgence + mot de passe demandé = signaux d'alerte. Que dit le réflexe STOP ?"],
            success: "Dernier cadenas ouvert !" },
        ],
      },

      /* ---------------------------------------------------------------
         MISSION BONUS · TURBO-TÉLÉCHARGEMENT (facultative)
         --------------------------------------------------------------- */
      {
        id: "mB", code: "B", kind: "bonus", verb: "G",
        title: "Turbo-téléchargement",
        place: "Data Keys · antenne relais", time: "—", minutes: 10,
        objective: "Bonus pour les rapides : calculer combien de temps prend le téléchargement du jeu.",
        skills: ["debit"], reward: 800, badge: { id: "turbo", icon: "⚡", name: "Turbo" },
        map: { x: 590, y: 458, icon: "📶" },
        unlocks: [],
        recap: [
          "Le débit se donne en Mbit/s. Pour obtenir des Mo par seconde, on divise par 8.",
          "212 Go à 100 Mbit/s : environ 4 h 43. D'où l'intérêt du préchargement !",
        ],
        steps: [
          { type: "learn", id: "n-debit", kicker: "Bonus", title: "Mbit/s ou Mo/s ?",
            slides: [
              { visual: "debitVisual", html: `<p>La vitesse d'une connexion (le <strong>débit</strong>) se donne en <strong>Mbit/s</strong> : mégabits par seconde.</p>
                <p>Or les fichiers se mesurent en <strong>octets</strong>. Et 1 octet = 8 bits.</p>
                <p class="callout">Mbit/s ÷ 8 = Mo/s<br>Exemple : 80 Mbit/s ÷ 8 = 10 Mo par seconde.</p>
                <p>Temps = taille (en Mo) ÷ vitesse (en Mo/s).</p>` },
            ] },
          { type: "input", id: "d1", skill: "debit", notion: "n-debit",
            prompt: "La connexion de Sam affiche <b>100 Mbit/s</b>. <b>Combien de Mo arrivent chaque seconde ?</b>",
            fields: [{ id: "x", label: "Vitesse", suffix: "Mo/s", kind: "number", value: 12.5, tol: 0.001 }],
            wrong: { 100: "100, ce sont des mégabits. Il faut diviser par 8 pour avoir des mégaoctets.", 800: "Tu as multiplié par 8 : il faut diviser." },
            hints: ["Mbit/s ÷ 8 = Mo/s."],
            success: "100 ÷ 8 = 12,5 Mo/s." },
          { type: "input", id: "d2", skill: "debit", notion: "n-debit",
            prompt: "À 12,5 Mo/s, combien de temps faut-il pour télécharger <b>212 Go</b> (212 000 Mo) ? <span class='small'>Réponds en heures et minutes, par exemple <code>3h20</code>.</span>",
            fields: [{ id: "x", label: "Durée", kind: "duration", seconds: 16960, tol: 180, placeholder: "ex. 3h20" }],
            hints: ["Temps en secondes = 212 000 ÷ 12,5.", "16 960 secondes ÷ 3 600 = nombre d'heures. Le reste ÷ 60 = minutes."],
            success: "212 000 ÷ 12,5 = 16 960 s, soit environ 4 h 43 min." },
          { type: "input", id: "d3", skill: "debit", notion: "n-debit",
            prompt: "Chez Lina, la connexion plafonne à <b>30 Mbit/s</b>. Combien de temps pour les mêmes 212 Go ?",
            fields: [{ id: "x", label: "Durée", kind: "duration", seconds: 56533, tol: 300, placeholder: "ex. 10h05" }],
            hints: ["30 ÷ 8 = 3,75 Mo/s.", "212 000 ÷ 3,75 = nombre de secondes."],
            success: "30 ÷ 8 = 3,75 Mo/s → 212 000 ÷ 3,75 ≈ 56 533 s, soit environ 15 h 42 min. Le préchargement, c'est malin !" },
        ],
      },
    ],

    /* Ordre d'affichage dans la feuille de route */
    order: ["m0", "m1", "m2", "m3", "m4", "mF", "mB"],

    sources: [
      { label: "Annexe « Attendus en lien avec les S – SF – C » (programme FMTTN, volet N) — fiches 3.3 et 3.6", url: "https://netboardme-cf1.s3.amazonaws.com/published/343873/files/71f8a1a271e0298d39eaa004377cded5.pdf" },
      { label: "Préchargement le 10 novembre, jusqu'à 212 Go (mac4ever, 3/11/2026)", url: "https://www.mac4ever.com/a/198863" },
      { label: "Préchargement, sortie à minuit le 19 novembre (playnews)", url: "https://www.playnews.gg/dates-de-sortie/le-pre-chargement-de-gta-6-commence-le-10-novembre-jusqu-a-212-go-avec-des-codes-en-boite-des-le-12-novembre" },
      { label: "ESET / WeLiveSecurity : pas de PC, de démo, de bêta ni d'accès anticipé", url: "https://www.welivesecurity.com/fr/cybersecurite/gta-vi-nest-pas-encore-sorti-mais-les-cybercriminels-sont-deja-a-laffut/" },
      { label: "Malwarebytes : l'accès anticipé est une arnaque", url: "https://www.malwarebytes.com/fr/blog/threat-intel/2026/06/gta-6-early-access-is-nothing-but-a-scam" },
      { label: "Rumeur des 600 Go (WeArePlayStation)", url: "https://www.weareplaystation.fr/communautes/gta-vi/actualites-communaute/gta-6-a-plus-de-600-go-voici-ce-que-lon-sait-vraiment-sur-la-taille-du-jeu" },
    ],
  };
})();
