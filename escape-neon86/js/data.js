/* ==========================================================================
   PANNE À BORD DU NÉON-86 — contenu du jeu (version 2 « immersive »)
   --------------------------------------------------------------------------
   Ce fichier peut être modifié librement : textes, consignes, indices.
   Les réponses à saisir sont stockées sous forme d'empreintes (« hash »).
   Pour changer une réponse ou le code d'accès : outils/empreinte.html.
   Les solutions en clair se trouvent dans le guide enseignant (non publié).
   ========================================================================== */

window.NEON = {
  titre: "Panne à bord du Néon-86",
  version: "2.1",

  /* Code d'accès donné par l'enseignant (empreinte). null = pas de verrou. */
  codeAcces: "0lc5caz",

  /* Taille de l'équipage devant un même ordinateur (modifiable). */
  equipage: { min: 1, max: 4 },

  /* ---------------------------------------------------- RÉCIT D'ACCUEIL */
  intro: [
    { lieu: "hub", txt: "2056. Bienvenue à bord du NÉON-86." },
    { lieu: "A", txt: "BOULON a tout « optimisé ». La station est en panne." },
    { lieu: "hub", txt: "Réparez les trois secteurs pour accueillir le vaisseau COMÈTE." }
  ],

  /* Astuces montrées une seule fois, au moment utile */
  astuces: {
    porte: "Clique sur la porte pour entrer.",
    pilotage: "Ce bouton te ramène au poste de pilotage.",
    indice: "Bloqué ? Demande un indice ici.",
    carnet: "Tes disquettes sont rangées dans le carnet."
  },

  /* ------------------------------------------------------------ LIEUX */
  lieux: {
    hub: { nom: "Poste de pilotage", objectif: "Choisis un secteur à réparer." },
    A: { nom: "Salle des machines", objectif: "Remonte Boulon. Retrouve la sauvegarde de GLADYS.", enigmes: ["A1", "A2"] },
    B: { nom: "Antenne de communication", objectif: "Rebranche l'antenne. Capte la balise.", enigmes: ["B1", "B2", "B3"] },
    C: { nom: "Atelier pixels & robotique", objectif: "Répare l'écran, guide Boulon, règle le capteur.", enigmes: ["C1", "C2", "C3", "C4"] }
  },

  infos: {
    hublot: "Le vaisseau COMÈTE attend. Il se rapproche à chaque réparation.",
    imprimante: "Chaque réparation imprime une disquette. Elles sont dans le carnet.",
    courant: "Un voyant vert par système réparé dans cette salle.",
    oscillo: "La force du signal monte à chaque réparation du secteur B."
  },

  /* Disquettes de maintenance (cartes-mémoire) */
  cartes: {
    materiel:   { nom: "Matériel (hardware)", def: "Tout ce qu'on peut toucher dans un appareil numérique : écran, clavier, processeur, clé USB…" },
    os:         { nom: "Système d'exploitation", def: "Logiciel principal qui démarre en premier. Il fait le lien entre le matériel et les autres logiciels, et gère les fichiers. Ex. : Windows, macOS, ChromeOS." },
    fichier:    { nom: "Fichier", def: "Ensemble de données enregistré sous un nom (texte, image, son…). Son extension (.txt, .png…) indique son type. Les fichiers se rangent dans des dossiers." },
    navigateur: { nom: "Navigateur", def: "Logiciel qui affiche les pages du Web. Ex. : Firefox, Chrome, Edge, Safari." },
    internet:   { nom: "Internet", def: "Immense réseau mondial qui relie des ordinateurs et des appareils entre eux. Le Web, le courriel ou les jeux en ligne l'utilisent." },
    url:        { nom: "URL", def: "Adresse unique d'une page ou d'un fichier sur le Web. Elle s'écrit dans la barre d'adresse du navigateur." },
    motcle:     { nom: "Mot-clé", def: "Mot important et précis que l'on donne à un moteur de recherche pour trouver une information." },
    pixel:      { nom: "Pixel", def: "Plus petit point (carré) d'une image numérique ou d'un écran. Une image est une grille de pixels." },
    resolution: { nom: "Résolution", def: "Nombre de pixels d'une image en largeur et en hauteur (ex. : 24 × 16 pixels)." },
    algorithme: { nom: "Algorithme", def: "Suite d'instructions précises, dans un ordre donné, pour résoudre un problème ou réaliser une tâche." },
    boucle:     { nom: "Boucle", def: "Instruction « répéter » : elle fait recommencer plusieurs fois les mêmes instructions." }
  },

  enigmes: {

    /* ---------------------------------------------------------------- A1 */
    A1: {
      titre: "Remonte BOULON",
      notion: "Matériel, logiciel et système d'exploitation",
      statut: "Révision", lieu: "Dans le jeu", duree: 6, salle: "A",
      consigne: "{nom}, range tes {n} éléments dans les bons bacs.",
      replique: { qui: "boulon", txt: "J'ai mis TOUTES mes pièces dans le même bac. Audacieux, non ?" },
      aide: "Glisse un élément vers un bac, ou clique sur l'élément puis sur le bac. Clique sur un élément rangé pour le reprendre.",
      type: "atelier",
      bacs: [
        { id: "mat", nom: "Matériel", aide: "ce qu'on peut toucher" },
        { id: "os",  nom: "Systèmes d'exploitation", aide: "logiciel qui démarre en premier", famille: "logiciel" },
        { id: "app", nom: "Applications", aide: "programme qu'on lance pour une tâche", famille: "logiciel" }
      ],
      /* ORDRE IMPORTANT : les lots sont formés de pièces consécutives (12/n).
         Cet ordre garantit que chaque lot mélange matériel et logiciels pour 2, 3 ou 4 joueurs. */
      elements: [
        { nom: "Écran cathodique", cat: "mat", ico: "🖥" },
        { nom: "Windows", cat: "os", ico: "🪟" },
        { nom: "Firefox", cat: "app", ico: "🦊" },
        { nom: "Clavier", cat: "mat", ico: "⌨" },
        { nom: "Minecraft Education", cat: "app", ico: "⛏" },
        { nom: "Processeur", cat: "mat", ico: "🔲" },
        { nom: "macOS", cat: "os", ico: "🍏" },
        { nom: "Clé USB", cat: "mat", ico: "🔌" },
        { nom: "Souris", cat: "mat", ico: "🖱" },
        { nom: "Word (traitement de texte)", cat: "app", ico: "📝" },
        { nom: "ChromeOS", cat: "os", ico: "🟡" },
        { nom: "Imprimante", cat: "mat", ico: "🖨" }
      ],
      indices: [
        "Peux-tu le toucher ? Alors c'est du matériel.",
        "Un système d'exploitation démarre l'ordinateur. Une application, on la lance ensuite.",
        "Systèmes d'exploitation : Windows, macOS, ChromeOS. Applications : Firefox, Minecraft, Word."
      ],
      recompense: ["materiel", "os"],
      changement: "BOULON est remonté. Sa borne de recharge est accessible.",
    },

    /* ---------------------------------------------------------------- A2 */
    A2: {
      titre: "Retrouve la sauvegarde de GLADYS",
      notion: "Fichier, extension, dossier, arborescence, téléchargement",
      statut: "Révision + découverte (fichier ZIP, versions)", lieu: "Sur l'ordinateur", duree: 8, salle: "A",
      consigne: "Trouve la sauvegarde la plus récente au format texte.",
      replique: { qui: "gladys", txt: "Les images, je ne sais pas les lire." },
      type: "champs",
      learn: {
        titre: "Nouveau : le fichier .zip",
        txt: "Un .zip range plusieurs fichiers dans un seul. Pour les voir, il faut l'extraire.",
        exemple: "📦 archives.zip  →  📁 archives"
      },
      telechargement: { fichier: "ressources/archives_neon86.zip", label: "Télécharger les archives (archives_neon86.zip)" },
      mission: {
        etapes: ["Télécharge les archives.", "Extrais le ZIP et ouvre le dossier.", "Lis LISEZ-MOI.txt pour trouver la bonne sauvegarde."],
        aide: {
          "Windows": "Clic droit sur le .zip > « Extraire tout… » > « Extraire ».",
          "macOS": "Double-clique sur le .zip : un dossier apparaît à côté.",
          "ChromeOS": "Dans Fichiers, double-clique sur le .zip, puis copie le dossier dans « Mes fichiers »."
        }
      },

      champs: [
        { id: "mdp", label: "Mot de passe", ok: ["1sh5p74"],
          pieges: {
            "1ncmvgg": "Version 01 : périmée. Cherche plus récent.",
            "16c1mgi": "Version 02 : une version plus récente existe.",
            "1ou9miq": "Ce mot vient d'une image (.png). GLADYS ne lit que les fichiers texte (.txt)."
          } },
        { id: "dossier", label: "Dossier où elle se trouvait", ok: ["0reuuz4"],
          pieges: {
            "01xchx2": "Presque : regarde un sous-dossier plus bas.",
            "1m7qf4f": "Ce dossier contient les anciennes versions. La v03 est ailleurs."
          } }
      ],
      indices: [
        "Le numéro le plus grand est la version la plus récente. Regarde aussi l'extension.",
        "La v04 est une image (.png). Cherche la v03 en .txt.",
        "Elle est dans 03_images > vacances_boulon."
      ],
      recompense: ["fichier"],
      changement: "Archives restaurées : GLADYS retrouve sa mémoire.",
    },

    /* ---------------------------------------------------------------- B1 */
    B1: {
      titre: "Répare les connexions",
      notion: "Internet, Web, navigateur, moteur de recherche, lien, courriel",
      statut: "Révision", lieu: "Dans le jeu", duree: 5, salle: "B",
      consigne: "Relie chaque mot à sa description.",
      replique: { qui: "boulon", txt: "J'ai TOUT branché. Enfin, presque correctement." },
      aide: "Clique sur un mot, puis sur sa description. Tu peux aussi glisser le mot. Les bons câbles peuvent rester.",
      type: "branchement",
      prises: [
        { id: "internet", mot: "Internet" },
        { id: "web", mot: "Le Web" },
        { id: "navigateur", mot: "Un navigateur" },
        { id: "moteur", mot: "Un moteur de recherche" },
        { id: "lien", mot: "Un lien hypertexte" },
        { id: "courriel", mot: "Le courriel (e-mail)" }
      ],
      descriptions: [
        { id: "d-reseau", txt: "Réseau mondial qui relie les appareils.", bonne: "internet" },
        { id: "d-pages", txt: "Pages reliées par des liens. Il utilise Internet.", bonne: "web" },
        { id: "d-logiciel", txt: "Logiciel qui affiche les pages (Firefox, Chrome…).", bonne: "navigateur" },
        { id: "d-cherche", txt: "Site qui trouve des pages avec des mots-clés (Google, Qwant…).", bonne: "moteur" },
        { id: "d-clic", txt: "On clique dessus pour aller vers une autre page.", bonne: "lien" },
        { id: "d-message", txt: "Messages envoyés par Internet, sans être une page du Web.", bonne: "courriel" }
      ],
      /* Câblage de départ de Boulon : 2 erreurs croisées + 2 câbles justes + 2 câbles débranchés */
      depart: { internet: "d-pages", web: "d-reseau", navigateur: "d-cherche", moteur: "d-logiciel", lien: "d-clic", courriel: null },
      explications: {
        internet: "Internet = le réseau. Les pages, c'est le Web.",
        web: "Le Web = des pages reliées par des liens.",
        navigateur: "Navigateur = logiciel qui affiche les pages. Google est un moteur de recherche.",
        moteur: "Moteur de recherche = site qui cherche avec des mots-clés.",
        lien: "Lien = on clique pour changer de page.",
        courriel: "Le courriel passe par Internet, mais ce n'est pas une page du Web."
      },
      indices: [
        "Commence par les câbles dont tu es sûr.",
        "Internet est la route. Le Web et le courriel roulent dessus.",
        "Boulon a inversé Internet et le Web, puis le navigateur et le moteur de recherche."
      ],
      recompense: ["navigateur", "internet"],
      changement: "L'antenne est rebranchée. QUESTOR s'allume.",
    },

    /* ---------------------------------------------------------------- B2 */
    B2: {
      titre: "Capte la balise",
      notion: "URL, barre d'adresse, favoris",
      statut: "Révision", lieu: "Dans le navigateur", duree: 5, salle: "B",
      consigne: "Lis l'adresse de la balise, puis ajoute-la à tes favoris.",
      replique: { qui: "gladys", txt: "Elle est timide : son message est dans son adresse." },
      type: "champs",
      relais: { fichier: "relais.html?station=neon86&frequence=147", label: "Ouvrir la balise relais (nouvel onglet)" },
      mission: {
        etapes: ["Ouvre la balise (nouvel onglet).", "Clique dans la barre d'adresse et lis toute l'URL.", "Ajoute la page aux favoris, puis reviens ici."],
        aide: {
          "Windows / ChromeOS": "Favori : Ctrl + D, ou l'étoile ☆ dans la barre d'adresse.",
          "macOS": "Favori : Cmd + D, ou l'étoile ☆ (« Ajouter un signet » dans Safari).",
          "Adresse raccourcie ?": "Clique une fois dans la barre d'adresse pour la voir en entier."
        }
      },

      champs: [
        { id: "page", label: "Nom de la page (.html)", ok: ["17xj0qm", "0ussh83"],
          pieges: { "15dwwo3": "C'est le nom de la station. La page se termine par .html." } },
        { id: "freq", label: "Fréquence", ok: ["0wsa76l"] }
      ],
      indices: [
        "Le message n'est pas sur la page. Regarde la barre d'adresse.",
        "Après le « ? », cherche frequence=…",
        "La page s'appelle relais.html. La fréquence est 147."
      ],
      recompense: ["url"],
      changement: "Balise captée sur la fréquence 147. Elle se cache dans tes favoris.",
    },

    /* ---------------------------------------------------------------- B3 */
    B3: {
      titre: "Trouve l'heure d'amarrage",
      notion: "Mot-clé, lien hypertexte, fiabilité d'une source (https)",
      statut: "Révision + découverte (https et cadenas)", lieu: "Dans le jeu", duree: 6, salle: "B",
      consigne: "Cherche l'heure d'amarrage du vaisseau COMÈTE. Choisis une source fiable.",
      replique: { qui: "boulon", txt: "Moi, je prends toujours le premier résultat." },
      aide: "Tape quelques mots-clés précis. Ouvre plusieurs résultats et compare leurs adresses.",
      type: "recherche",
      requiert: ["B1"],
      verrou: "QUESTOR est éteint. Répare d'abord les connexions (B1).",
      learn: {
        titre: "Nouveau : http ou https ?",
        txt: "https (🔒) protège le trajet des données. Mais le cadenas ne prouve pas que la page dit vrai.",
        exemple: "🔒 https://…  ·  ⚠ http://…"
      },
      champs: [
        { id: "heure", label: "Heure d'amarrage", ok: ["1xd89cl", "0kdlb5d"],
          pieges: {
            "0zqky07": "13 h vient d'un site douteux. Vérifie son adresse.",
            "0i3jjin": "13 h vient d'un site douteux. Vérifie son adresse.",
            "08mw5u4": "18 h vient d'un forum de rumeurs.",
            "1bdppgs": "18 h vient d'un forum de rumeurs."
          } }
      ],
      choixMultiple: {
        question: "Pourquoi « COMÈTE GRATUITE » n'est pas fiable ?",
        options: [
          { txt: "Adresse en http:// (pas de cadenas)", ok: true },
          { txt: "Promet un cadeau gratuit", ok: true },
          { txt: "Demande ton mot de passe", ok: true },
          { txt: "Apparaît en premier", ok: false },
          { txt: "Contient le mot « comète »", ok: false }
        ]
      },
      indices: [
        "Un seul mot donne trop de résultats. Ajoute des mots précis.",
        "Essaie : horaire amarrage comète. Compare les adresses.",
        "La page fiable est celle de l'agence orbitale (https)."
      ],
      recompense: ["motcle"],
      changement: "Heure confirmée. La parabole se tourne vers la COMÈTE.",
    },

    /* ---------------------------------------------------------------- C1 */
    C1: {
      titre: "Retrouve l'image",
      notion: "Pixel, image numérique, codage en 0 et 1",
      statut: "Révision", lieu: "Sur papier", duree: 6, salle: "C",
      consigne: "Sur ta fiche : colorie les 1 et laisse les 0 blancs.",
      type: "champs",
      pixels: [
        "1111111100",
        "1100001110",
        "1100001111",
        "1111111111",
        "1111111111",
        "1000000001",
        "1011111101",
        "1010000101",
        "1011111101",
        "1111111111"
      ],
      mission: {
        etapes: ["Prends la grille C1 de ta fiche.", "Colorie chaque 1, laisse chaque 0 blanc.", "Compte les cases coloriées."],
        aide: { "Pas de fiche ?": "Dessine une grille de 10 × 10 cases sur du papier quadrillé." }
      },

      champs: [
        { id: "nb", label: "Pixels coloriés", ok: ["147ccp1"],
          pieges: { "15bsqkk": "Ça, ce sont les 0. Compte les 1." } },
        { id: "objet", label: "Objet reconnu", type: "choix", options: ["Une fusée", "Une disquette", "Un robot", "Une clé"], bonne: 1 }
      ],
      indices: [
        "Avance ligne par ligne, de gauche à droite.",
        "Note le total de chaque ligne, puis additionne.",
        "Totaux : 8, 5, 6, 10, 10, 2, 8, 4, 8, 10. C'est une disquette."
      ],
      recompense: ["pixel"],
      changement: "L'écran affiche à nouveau une image.",
    },

    /* ---------------------------------------------------------------- C2 */
    C2: {
      titre: "Retrouve BOULON",
      notion: "Algorithme, instruction, boucle « répéter »",
      statut: "Révision", lieu: "Sur papier", duree: 5, salle: "C",
      consigne: "Sur ta fiche : suis le programme depuis ★ et note les lettres.",
      replique: { qui: "boulon", txt: "J'ai suivi ce programme parfaitement. Je ne sais juste plus où je suis." },
      type: "champs",
      carte: [
        "KAZTRUW",
        "NYFCXHJ",
        "GDQVZSA",
        "RPTIONE",
        "WBXOCQT",
        "AJELFKY",
        "H*MUDGV"
      ],
      programme: [
        { t: "avancer" },
        { t: "repeter", n: 3, corps: [{ t: "avancer" }, { t: "avancer" }, { t: "droite" }] },
        { t: "avancer" }
      ],
      mission: {
        etapes: ["Pose ton crayon sur ★ : BOULON regarde vers le HAUT.", "Suis le programme case par case.", "Note la lettre à la fin de chaque répétition, puis la dernière."],
        aide: { "Avancer ou tourner ?": "« avancer » = 1 case. « tourner » = pivoter sur place, sans changer de case." }
      },

      champs: [
        { id: "mot", label: "Mot trouvé (4 lettres)", ok: ["0b7e68d"],
          pieges: { "1r4nn78": "BOUM ! Tu as oublié le « avancer » avant la boucle." } }
      ],
      indices: [
        "N'oublie pas le « avancer » placé avant la boucle.",
        "Après la 1re répétition, BOULON est 3 cases au-dessus de ★.",
        "Les lettres sont P, I, L, E."
      ],
      recompense: ["algorithme"],
      changement: "Le chemin de BOULON s'allume sur la table lumineuse.",
    },

    /* ---------------------------------------------------------------- C3 */
    C3: {
      titre: "Ramène BOULON à sa borne",
      notion: "Programmer avec une boucle « répéter »",
      statut: "Révision", lieu: "Dans le jeu", duree: 6, salle: "C",
      consigne: "Construis un programme de 6 blocs maximum pour atteindre ⚡.",
      aide: "Glisse un bloc vers « ＋ », ou clique le bloc puis « ＋ ». Les blocs placés se déplacent pareil. ✕ supprime.",
      type: "code",
      requiert: ["A1"],
      verrou: "BOULON est en pièces. Remonte-le d'abord (salle des machines, A1).",
      grille: { l: 6, h: 6, depart: [0, 5], dir: "E", arrivee: [3, 2],
                caisses: [[2, 5], [0, 3], [4, 4], [5, 1], [1, 1], [4, 2]] },
      maxBlocs: 6,
      indices: [
        "Le passage libre ressemble à un escalier.",
        "Une marche = avancer, gauche, avancer, droite.",
        "répéter 3 fois [avancer, gauche, avancer, droite]."
      ],
      recompense: ["boucle"],
      changement: "BOULON est sur sa borne : 100 % de batterie.",
    },

    /* ---------------------------------------------------------------- C4 */
    C4: {
      titre: "Règle le capteur d'étoiles",
      notion: "Résolution d'une image",
      statut: "Découverte accompagnée", lieu: "Sur l'ordinateur", duree: 5, salle: "C",
      consigne: "Trouve la taille en pixels de l'image capteur_etoile.png.",
      type: "champs",
      learn: {
        titre: "Nouveau : la résolution",
        txt: "C'est le nombre de pixels en largeur × hauteur.",
        exemple: "100 × 50 pixels = 5 000 pixels"
      },
      telechargement: { fichier: "ressources/archives_neon86.zip", label: "Télécharger les archives (si ce n'est pas déjà fait)" },
      mission: {
        etapes: ["Dans les archives, ouvre 03_images.", "Ouvre capteur_etoile.png et zoome.", "Trouve sa largeur et sa hauteur en pixels."],
        aide: {
          "Partout": "Glisse l'image dans un onglet vide du navigateur : la taille s'affiche dans le titre de l'onglet.",
          "Windows": "Clic droit sur l'image > Propriétés > Détails > Dimensions.",
          "macOS": "Aperçu > Outils > Afficher l'inspecteur.",
          "ChromeOS": "Ouvre l'image dans la Galerie, puis l'icône « i »."
        }
      },

      champs: [
        { id: "larg", label: "Largeur", ok: ["129x3xv"], pieges: { "076w5r2": "Inversé : la largeur se mesure ←→." } },
        { id: "haut", label: "Hauteur", ok: ["076w5r2"], pieges: { "129x3xv": "Inversé : la hauteur se mesure ↑↓." } },
        { id: "total", label: "Total de pixels", ok: ["1m3k2mm"], pieges: { "129bzc9": "Tu as additionné. On multiplie." } }
      ],
      indices: [
        "La taille est dans les propriétés de l'image.",
        "Largeur × hauteur : on multiplie.",
        "24 × 16 = 384 pixels."
      ],
      recompense: ["resolution"],
      changement: "Le capteur vise la bonne étoile.",
    }
  },

  /* ------------------------------------------------------------- FINAL */
  final: {
    titre: "Réveille GLADYS",
    consigne: "Glisse chaque disquette dans la bonne fente.",
    replique: { qui: "gladys", txt: "Reconstruisez ma mémoire. Sans faute. J'ai ma fierté." },
    aide: "Glisse une disquette vers une fente, ou clique la disquette puis la fente. Clique une fente pleine pour reprendre sa disquette.",
    groupes: [
      { titre: "L'ordinateur démarre", lignes: [0, 1, 2] },
      { titre: "Sur Internet", lignes: [3, 4, 5, 6] },
      { titre: "Image et programme", lignes: [7, 8, 9, 10] }
    ],
    lignes: [
      { avant: "On appuie sur le bouton : le", carte: "materiel", apres: "se met en marche." },
      { avant: "Le", carte: "os", apres: "démarre et relie matériel et logiciels." },
      { avant: "Chaque", carte: "fichier", apres: "est rangé dans un dossier." },
      { avant: "J'ouvre un", carte: "navigateur", apres: "pour visiter un site." },
      { avant: "Je tape l'", carte: "url", apres: "dans la barre d'adresse." },
      { avant: "Ma demande voyage par", carte: "internet", apres: "." },
      { avant: "Sans adresse, je cherche avec un", carte: "motcle", apres: "précis." },
      { avant: "L'écran affiche chaque", carte: "pixel", apres: "." },
      { avant: "Largeur × hauteur en pixels : c'est la", carte: "resolution", apres: "." },
      { avant: "Pour guider BOULON, j'écris un", carte: "algorithme", apres: "." },
      { avant: "Pour répéter des instructions, j'utilise une", carte: "boucle", apres: "." }
    ],
    signal: {
      titre: "Envoie le signal d'amarrage",
      txt: "Ouvre la balise depuis tes favoris (ou l'historique). Son nom est sur l'onglet.",
      label: "Nom de la balise",
      ok: ["15qpvgo", "0zp6ptq", "1tt7um8"],
      indices: [
        "Ouvre tes favoris et clique sur la balise. Lis le titre de l'onglet.",
        "Pas de favori ? Historique : Ctrl + H (Cmd + Y sur Mac).",
        "Remplace index.html par relais.html dans la barre d'adresse. Le nom commence par ALT…"
      ]
    },
    indices: [
      "Les définitions sont dans le carnet.",
      "Chaque disquette sert une seule fois. Commence par les phrases sûres.",
      "Ordre du démarrage : matériel, système d'exploitation, fichier."
    ],
    succes: [
      { qui: "gladys", txt: "Mémoire : 100 %. Signal envoyé à la balise ALTAÏR." },
      { qui: "boulon", txt: "Bravo à moi ! Euh… bravo à VOUS." }
    ]
  },

  /* ------------------------------------------------------------- BILAN */
  bilan: {
    autoeval: [
      "Matériel, système d'exploitation, applications",
      "Retrouver un fichier, lire une extension",
      "Internet, Web, navigateur, moteur de recherche",
      "Lire une URL, utiliser les favoris",
      "Mots-clés précis, source fiable",
      "Pixel et résolution",
      "Algorithme et boucle"
    ],
    question: "Comment avez-vous retrouvé la sauvegarde de GLADYS ?"
  },

  /* ---------------------------------------------- QUESTOR (énigme B3) */
  questor: {
    motsVides: ["le","la","les","l","de","du","des","d","a","au","aux","un","une","et","ou","en","est","sur","pour","par","que","qui","quoi","quel","quelle","quels","quelles","quand","comment","je","tu","il","elle","on","ce","cette","ces","mon","ma","mes","ton","ta","tes","son","sa","ses","avec","dans","va","vers","y","s","c","qu"],
    pages: [
      { titre: "COMÈTE GRATUITE !!! Horaire SECRET de l'amarrage", url: "http://comete-cadeau-gratuit.biz/gagner?id=8841",
        resume: "Clique vite ! Horaire secret de l'amarrage du vaisseau COMÈTE + cadeau gratuit…",
        mots: ["comete","gratuit","cadeau","horaire","amarrage","ravitaillement","secret","gagner","vaisseau"],
        contenu: "<p class='clignote'>★ FÉLICITATIONS ! Tu es notre 1 000 000e visiteur ! ★</p><p>Le vaisseau COMÈTE s'amarre à <b>13 h 00</b>. Vite, vite !</p><p>Pour recevoir ta fusée GRATUITE, écris ici ton mot de passe : [__________]</p><p><small>Site créé par : un ami. Date : ???</small></p>" },
      { titre: "Poèmes sur les comètes", url: "https://poesie-cosmique.neon/cometes",
        resume: "« Ô comète, cheveux de glace… » Une sélection de poèmes spatiaux.",
        mots: ["comete","poeme","poesie","ciel","etoile"],
        contenu: "<p>Ô comète, cheveux de glace,<br>tu passes et tu repasses…</p><p>(Aucune information sur des horaires ici.)</p>" },
      { titre: "Comète — le jeu de cartes de l'espace", url: "https://ludotheque.neon86.space/jeux/comete",
        resume: "Règles du jeu de cartes Comète : de 2 à 6 joueurs, dès 8 ans.",
        mots: ["comete","jeu","cartes","regles","ludotheque"],
        contenu: "<p>Comète est un jeu de cartes rapide. Le premier joueur qui n'a plus de cartes gagne.</p>" },
      { titre: "Wiki-Cosmos : qu'est-ce qu'une comète ?", url: "https://wiki-cosmos.neon/comete",
        resume: "Une comète est un petit corps de glace et de poussière qui tourne autour du Soleil…",
        mots: ["comete","definition","glace","queue","soleil","astronomie"],
        contenu: "<p>Une comète est un petit corps de glace et de poussière. Près du Soleil, elle forme une longue queue lumineuse.</p><p>(Cette page parle des vraies comètes, pas du vaisseau COMÈTE.)</p>" },
      { titre: "Recette : le gâteau comète au chocolat", url: "https://cuisine-orbitale.neon/recettes/gateau-comete",
        resume: "Un gâteau qui file aussi vite qu'une comète… ou presque.",
        mots: ["comete","gateau","recette","chocolat","cuisine"],
        contenu: "<p>Ingrédients : 200 g de chocolat, 3 œufs, 1 pincée de poussière d'étoile (facultatif).</p>" },
      { titre: "Forum : le vaisseau COMÈTE est en retard ?? (rumeurs)", url: "http://forum-potins-orbitaux.net/sujet/2231",
        resume: "Mon cousin a dit qu'il s'amarrerait vers 18 h, je crois…",
        mots: ["comete","retard","rumeur","forum","amarrage","heure","vaisseau"],
        contenu: "<p><b>Zorg_42</b> : le vaisseau COMÈTE est en retard, non ?</p><p><b>Pixou</b> : mon cousin a dit 18 h, je crois. Ou peut-être demain. Je ne sais plus.</p>" },
      { titre: "Horaires d'amarrage — vaisseau de ravitaillement COMÈTE", url: "https://horaires.agence-orbitale.neon/comete",
        resume: "Agence orbitale officielle. Horaires d'amarrage du vaisseau COMÈTE pour les stations.",
        mots: ["horaire","horaires","heure","amarrage","passage","comete","vaisseau","ravitaillement","neon86","neon","station","aujourd","agence","officiel"],
        contenu: "<p><b>Agence orbitale — service des ravitaillements</b></p><p>Station NÉON-86 : amarrage du vaisseau COMÈTE prévu à <b>16 h 45, heure de bord</b>, dès que la balise d'amarrage est active.</p><p>La station doit être allumée avant l'amarrage.</p><p><small>Page mise à jour aujourd'hui par l'Agence orbitale.</small></p>" },
      { titre: "Ravitaillement des cactus de bord", url: "https://jardinage-spatial.neon/cactus",
        resume: "Combien d'eau pour un cactus en apesanteur ?",
        mots: ["ravitaillement","cactus","arrosage","plante","station","eau"],
        contenu: "<p>Un cactus de bord se contente d'une goutte d'eau par semaine. Il adore les compliments.</p>" },
      { titre: "Horaires de la cantine NÉON-86", url: "https://neon86.space/cantine",
        resume: "Menu du jour : purée lunaire. Horaires d'ouverture de la cantine.",
        mots: ["horaire","horaires","cantine","neon86","neon","station","menu","heure","aujourd"],
        contenu: "<p>Cantine ouverte de 11 h 30 à 13 h 30. Aujourd'hui : purée lunaire et compote de météorites.</p>" },
      { titre: "Météo spatiale du jour", url: "https://meteo-spatiale.neon/aujourdhui",
        resume: "Vents solaires modérés, risque de pluie de poussière d'étoiles.",
        mots: ["meteo","aujourd","vent","solaire","tempete"],
        contenu: "<p>Vents solaires modérés. Rien de grave pour les vaisseaux.</p>" },
      { titre: "Fan-club officiel de BOULON", url: "https://boulon-fan-club.neon/accueil",
        resume: "Le seul club dont le président est aussi l'unique membre.",
        mots: ["boulon","robot","fan","club"],
        contenu: "<p>Bienvenue ! Membres : 1 (Boulon). Président : Boulon. Trésorier : Boulon.</p>" }
    ]
  }
};
