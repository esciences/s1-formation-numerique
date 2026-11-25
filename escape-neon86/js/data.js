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
  version: "2.0",

  /* Code d'accès donné par l'enseignant (empreinte). null = pas de verrou. */
  codeAcces: "0lc5caz",

  /* Taille de l'équipage devant un même ordinateur (modifiable). */
  equipage: { min: 1, max: 4 },

  /* ---------------------------------------------------- RÉCIT D'ACCUEIL */
  intro: [
    { titre: "Où sommes-nous ?", lieu: "hub",
      lignes: [
        { qui: "journal", txt: "Année 2056. Vous êtes l'équipe de maintenance stagiaire de l'Agence orbitale. La navette du matin vient de vous déposer sur NÉON-86." },
        { qui: "journal", txt: "NÉON-86 est la dernière station « modèle 86 » : elle a été construite d'après les plans du programme orbital de 1986. Ses écrans cathodiques, ses disquettes et ses commutateurs résistent aux tempêtes solaires. C'est pour ça qu'on la garde." }
      ] },
    { titre: "Que s'est-il passé ?", lieu: "A",
      lignes: [
        { qui: "boulon", txt: "Bonjour, stagiaires ! Je suis BOULON, robot de maintenance. Cette nuit, j'ai lancé une « optimisation générale ». Je me suis démonté, j'ai compressé les archives, j'ai recâblé l'antenne… et j'ai fait un peu de ménage dans la mémoire de GLADYS." },
        { qui: "gladys", txt: "Mémoire de démarrage : effacée. Je fonctionne en mode de secours. Je ne boude pas. Je… économise mon énergie." }
      ] },
    { titre: "Votre mission", lieu: "hub",
      lignes: [
        { qui: "journal", txt: "Le vaisseau de ravitaillement COMÈTE approche. Sans antenne, sans balise et sans GLADYS, il ne peut pas s'amarrer. Il attend en orbite d'attente : il n'y a pas de compte à rebours." },
        { qui: "journal", txt: "GLADYS n'a pas de bras et Boulon n'a plus de tête : il faut des mains humaines. Réparez les trois secteurs. Chaque système réparé imprime une disquette de maintenance qui contient une notion." },
        { qui: "gladys", txt: "Avec les 11 disquettes, vous reconstruirez ma mémoire de démarrage. Ensuite, la balise enverra le signal d'amarrage. Simple. Pour des humains." }
      ] }
  ],

  tutoriel: [
    { cible: ".hotspot[data-o='porteA']", txt: "Les objets avec un anneau sont interactifs, comme cette porte. Survole-les ou utilise la touche Tab pour lire leur nom. Clique pour les examiner ou pour changer de lieu." },
    { cible: "#btn-carnet", txt: "Le carnet de mission garde tout : vos disquettes, les consignes hors du jeu et l'équipage." },
    { cible: "#btn-hub", txt: "Le bouton « Poste de pilotage » te ramène ici depuis n'importe quel lieu. Le bouton « Je suis perdu » propose une prochaine action." }
  ],

  regles: [
    "Pas d'ordre imposé : les trois secteurs sont ouverts dès le départ.",
    "Une énigme vous bloque ? Allez dans un autre secteur et revenez plus tard.",
    "Chaque énigme propose 3 indices, du plus léger au plus précis.",
    "Certaines missions se font hors du jeu : sur papier, dans vos fichiers ou dans le navigateur.",
    "Pas de compte à rebours : l'heure de bord de l'histoire n'est pas l'heure de votre cours.",
    "La progression est enregistrée sur cet ordinateur : vous pouvez reprendre plus tard."
  ],

  /* ------------------------------------------------------------ LIEUX */
  lieux: {
    hub: { nom: "Poste de pilotage", objectif: "Choisir un secteur à réparer. Quand les 9 systèmes fonctionnent, réveiller GLADYS à sa console." },
    A: { nom: "Salle des machines", objectif: "Remonter Boulon et retrouver la sauvegarde de mémoire de GLADYS.", enigmes: ["A1", "A2"] },
    B: { nom: "Antenne de communication", objectif: "Rebrancher l'antenne, capter la balise et trouver l'heure d'amarrage.", enigmes: ["B1", "B2", "B3"] },
    C: { nom: "Atelier pixels & robotique", objectif: "Réparer l'écran, retrouver la pile de Boulon, le recharger et calibrer le capteur.", enigmes: ["C1", "C2", "C3", "C4"] }
  },

  infos: {
    hublot: "Par le hublot, le vaisseau COMÈTE attend en orbite d'attente. Plus vous réparez de systèmes, plus il se rapproche. Il ne repartira pas : prenez le temps qu'il faut.",
    imprimante: "L'imprimante à papier continu imprime une disquette de maintenance chaque fois qu'un système est réparé. Vos disquettes sont rangées dans le carnet de mission.",
    courant: "Tableau électrique : un voyant s'allume pour chaque système réparé dans cette salle. Quand les deux sont verts, la salle retrouve la pleine lumière.",
    oscillo: "Console de diagnostic : elle mesure la force du signal de l'antenne. Chaque réparation du secteur B le renforce."
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
      titre: "L'atelier de Boulon",
      notion: "Matériel, logiciel et système d'exploitation",
      statut: "Révision", lieu: "Dans le jeu", duree: 6, salle: "A",
      type: "atelier",
      panne: "Boulon s'est démonté pour « s'améliorer ». Toutes ses pièces, et même ses logiciels, sont mélangés sur l'établi.",
      afaire: "Chaque membre range les pièces de son lot dans le bon bac. Glisse une pièce vers un bac, ou clique sur la pièce puis sur le bac.",
      valider: "Chaque membre vérifie son lot. Quand tous les lots sont justes, Boulon est remonté.",
      recit: [
        { qui: "boulon", txt: "J'ai mis TOUTES mes pièces dans le même bac. Même celles qu'on ne peut pas toucher. C'était audacieux." }
      ],
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
        "Pose-toi la question : est-ce que je peux le toucher, le prendre dans ma main ? Si oui, c'est du matériel.",
        "Les systèmes d'exploitation sont peu nombreux : ce sont eux qui démarrent l'ordinateur (on les retrouve à l'école et à la maison). Les applications sont les programmes qu'on ouvre ensuite.",
        "Il y a 6 pièces de matériel, 3 systèmes d'exploitation (Windows, macOS, ChromeOS) et 3 applications (Firefox, Minecraft Education, Word)."
      ],
      recompense: ["materiel", "os"],
      changement: "Boulon est remonté et se tient debout sur l'établi. Il file vers l'atelier : la grille de déplacement (C3) est maintenant utilisable.",
      succes: "Clac, clic, vrrr… « J'étais déjà parfait. Maintenant, je suis parfait ET rangé. »"
    },

    /* ---------------------------------------------------------------- A2 */
    A2: {
      titre: "La sauvegarde perdue",
      notion: "Fichier, extension, dossier, arborescence, téléchargement",
      statut: "Révision + découverte (fichier ZIP, versions)", lieu: "Sur l'ordinateur", duree: 8, salle: "A",
      type: "champs",
      panne: "Boulon a compressé toutes les archives dans un seul fichier ZIP. La sauvegarde de mémoire de GLADYS est perdue dedans.",
      afaire: "Télécharger les archives, les extraire, puis explorer les dossiers dans le vrai explorateur de fichiers de l'ordinateur.",
      valider: "Le mot de passe de la bonne sauvegarde et le nom du dossier où elle se trouvait.",
      recit: [
        { qui: "gladys", txt: "Ma sauvegarde est la version la plus récente… au format TEXTE. Les images, je ne sais pas les lire. Je suis une ordinatrice, pas une galerie d'art." }
      ],
      learn: {
        titre: "Découverte : le fichier compressé (.zip)",
        txt: "Un fichier .zip regroupe plusieurs fichiers et dossiers dans un seul fichier, plus léger. Pour voir son contenu, il faut l'extraire (le décompresser)."
      },
      telechargement: { fichier: "ressources/archives_neon86.zip", label: "Télécharger les archives (archives_neon86.zip)" },
      mission: {
        titre: "Mission sur l'ordinateur : retrouver la sauvegarde",
        etapes: [
          "Clique sur le bouton de téléchargement des archives.",
          "Ouvre ton dossier Téléchargements et retrouve le fichier archives_neon86.zip.",
          "Extrais-le (voir l'aide selon ton ordinateur), puis ouvre le dossier archives_neon86.",
          "Lis le fichier LISEZ-MOI.txt : il explique quelle sauvegarde est la bonne.",
          "Explore les dossiers et les sous-dossiers pour la trouver."
        ],
        rapporter: "le mot de passe écrit dans la bonne sauvegarde et le nom du dossier où elle se trouvait.",
        aide: {
          "Windows": "Clic droit sur le fichier .zip > « Extraire tout… » > « Extraire ». Un dossier normal apparaît à côté du .zip.",
          "macOS": "Double-clique sur le fichier .zip : un dossier archives_neon86 apparaît à côté.",
          "ChromeOS": "Dans l'application Fichiers, double-clique sur le .zip : son contenu s'ouvre. Tu peux copier le dossier archives_neon86 dans « Mes fichiers »."
        }
      },
      champs: [
        { id: "mdp", label: "Mot de passe de la bonne sauvegarde", ok: ["1sh5p74"],
          pieges: {
            "1ncmvgg": "C'est le mot de la version 01 : elle est périmée. Cherche une version plus récente.",
            "16c1mgi": "C'est le mot de la version 02. Une version plus récente existe : Boulon l'a peut-être mal rangée.",
            "1ou9miq": "Ce mot vient d'une image (.png). Relis le LISEZ-MOI : GLADYS ne lit que les fichiers texte. Regarde bien les extensions."
          } },
        { id: "dossier", label: "Nom du dossier qui contenait cette sauvegarde", ok: ["0reuuz4"],
          pieges: {
            "01xchx2": "C'est le dossier « 03_images ». La sauvegarde est rangée encore un niveau plus bas, dans un sous-dossier.",
            "1m7qf4f": "Le dossier « sauvegardes » contient les anciennes versions. La plus récente en texte a été rangée ailleurs par Boulon."
          } }
      ],
      indices: [
        "Les sauvegardes s'appellent memoire_gladys_v01, v02, v03… Le numéro le plus élevé est le plus récent. Mais attention à l'extension !",
        "La v04 est une image (.png) : ce n'est pas un fichier texte. La bonne sauvegarde est la v03 en .txt. Boulon l'a rangée parmi des photos… Tu peux aussi utiliser la recherche de ton explorateur de fichiers.",
        "Chemin complet : archives_neon86 > 03_images > vacances_boulon > memoire_gladys_v03.txt. Ouvre ce fichier pour lire le mot de passe."
      ],
      recompense: ["fichier"],
      changement: "Le terminal des archives affiche « ARCHIVES RESTAURÉES » et le tiroir du meuble est refermé.",
      succes: "GLADYS : « Mémoire v03 chargée. La v04 en image, c'était une blague de Boulon ? »"
    },

    /* ---------------------------------------------------------------- B1 */
    B1: {
      titre: "Le tableau de branchement",
      notion: "Internet, Web, navigateur, moteur de recherche, lien, courriel",
      statut: "Révision", lieu: "Dans le jeu", duree: 5, salle: "B",
      type: "branchement",
      panne: "Boulon a recâblé le tableau de l'antenne « selon ses connaissances ». Certains câbles relient un mot à la mauvaise description. QUESTOR, le moteur de recherche de la station, ne démarre plus.",
      afaire: "Diagnostiquer chaque câble. Pour rebrancher : clique sur une prise de gauche (un mot), puis sur la bonne prise de droite (sa description). Les câbles justes peuvent rester en place.",
      valider: "Lancer le test du tableau : les 6 câbles doivent être justes.",
      recit: [
        { qui: "boulon", txt: "J'ai TOUT branché. Enfin, presque tout correctement. Statistiquement, au moins un câble doit être juste." }
      ],
      prises: [
        { id: "internet", mot: "Internet" },
        { id: "web", mot: "Le Web" },
        { id: "navigateur", mot: "Un navigateur" },
        { id: "moteur", mot: "Un moteur de recherche" },
        { id: "lien", mot: "Un lien hypertexte" },
        { id: "courriel", mot: "Le courriel (e-mail)" }
      ],
      descriptions: [
        { id: "d-reseau", txt: "Réseau mondial qui relie des appareils grâce à des câbles, des antennes et des routeurs.", bonne: "internet" },
        { id: "d-pages", txt: "Ensemble de pages reliées entre elles par des liens ; il utilise Internet pour voyager.", bonne: "web" },
        { id: "d-logiciel", txt: "Logiciel qui affiche les pages : Firefox, Chrome, Edge, Safari.", bonne: "navigateur" },
        { id: "d-cherche", txt: "Site qui propose des pages à partir de mots-clés : Google, Qwant, Bing, Ecosia.", bonne: "moteur" },
        { id: "d-clic", txt: "Élément sur lequel on clique pour aller vers une autre page.", bonne: "lien" },
        { id: "d-message", txt: "Service qui envoie des messages par Internet, sans être une page du Web.", bonne: "courriel" }
      ],
      /* Câblage de départ de Boulon : 2 erreurs croisées + 2 câbles justes + 2 câbles débranchés */
      depart: { internet: "d-pages", web: "d-reseau", navigateur: "d-cherche", moteur: "d-logiciel", lien: "d-clic", courriel: null },
      explications: {
        internet: "Internet est le RÉSEAU (câbles, antennes, routeurs). Les pages, c'est le Web.",
        web: "Le Web, ce sont les PAGES reliées par des liens. Il utilise Internet, mais ce n'est pas le réseau lui-même.",
        navigateur: "Un navigateur est un LOGICIEL qui affiche les pages (Firefox, Chrome…). Google, c'est un moteur de recherche.",
        moteur: "Un moteur de recherche est un SITE qui cherche des pages à partir de mots-clés.",
        lien: "Un lien hypertexte, c'est ce sur quoi on clique pour changer de page.",
        courriel: "Le courriel utilise Internet, mais un e-mail n'est pas une page du Web."
      },
      indices: [
        "Commence par les câbles dont tu es sûr(e). Puis distingue un LOGICIEL qui affiche les pages (navigateur) d'un SITE qui cherche des pages (moteur de recherche).",
        "Internet, c'est la « route » qui relie les ordinateurs. Le Web, c'est l'un des « véhicules » qui roulent dessus, comme le courriel.",
        "Boulon a croisé Internet et le Web, puis le navigateur et le moteur de recherche. Le câble du courriel est débranché : il va vers « Service qui envoie des messages… »."
      ],
      recompense: ["navigateur", "internet"],
      changement: "Les câbles du tableau sont droits et les voyants passent au vert. QUESTOR s'allume : sa console (B3) est maintenant utilisable.",
      succes: "Boulon : « Je le savais. Je voulais juste vérifier que VOUS le saviez. »"
    },

    /* ---------------------------------------------------------------- B2 */
    B2: {
      titre: "La balise relais",
      notion: "URL, barre d'adresse, favoris",
      statut: "Révision", lieu: "Dans le navigateur", duree: 5, salle: "B",
      type: "champs",
      panne: "La balise relais ALT… flotte près de la station, mais elle est timide : elle n'écrit rien d'utile sur sa page. Son message est caché dans sa propre adresse.",
      afaire: "Ouvrir la balise dans un nouvel onglet, lire son URL dans la vraie barre d'adresse et l'ajouter aux favoris.",
      valider: "Le nom de la page de la balise et la fréquence lue dans l'URL.",
      recit: [
        { qui: "boulon", txt: "Une adresse, c'est la même chose qu'une page, non ? Non ? Ah." }
      ],
      relais: { fichier: "relais.html?station=neon86&frequence=147", label: "Ouvrir la balise relais (nouvel onglet)" },
      mission: {
        titre: "Mission dans le navigateur : lire l'adresse de la balise",
        etapes: [
          "Ouvre la balise relais : elle s'affiche dans un nouvel onglet.",
          "Clique dans la barre d'adresse pour voir l'URL complète de la page.",
          "Repère le nom de la page (le fichier qui se termine par .html) et la fréquence indiquée dans l'URL.",
          "Ajoute la balise à tes favoris : elle va se cacher, et vous en aurez besoin pour la mission finale.",
          "Reviens dans l'onglet du jeu pour noter tes réponses."
        ],
        rapporter: "le nom de la page de la balise et la valeur de la fréquence lue dans l'URL.",
        aide: {
          "Favori (Windows / ChromeOS)": "Appuie sur Ctrl + D, ou clique sur l'étoile ☆ dans la barre d'adresse.",
          "Favori (macOS)": "Appuie sur Cmd + D, ou clique sur l'étoile ☆ (ou « Ajouter un signet » dans Safari).",
          "Voir l'adresse complète": "Certains navigateurs raccourcissent l'adresse. Clique une fois dans la barre d'adresse pour l'afficher en entier."
        }
      },
      champs: [
        { id: "page", label: "Nom de la page de la balise (fichier .html)", ok: ["17xj0qm", "0ussh83"],
          pieges: { "15dwwo3": "Ça, c'est le nom de la station écrit dans l'URL. Le nom de la page est le fichier qui se termine par .html, juste avant le « ? »." } },
        { id: "freq", label: "Fréquence lue dans l'URL", ok: ["0wsa76l"] }
      ],
      indices: [
        "Le message n'est pas écrit sur la page de la balise. Regarde tout en haut de la fenêtre du navigateur, dans la barre d'adresse.",
        "Après le « ? », l'URL contient des informations de la forme nom=valeur, séparées par « & ». Cherche celle qui commence par frequence=.",
        "La page s'appelle relais.html. Dans l'URL, tu peux lire : frequence=147."
      ],
      recompense: ["url"],
      changement: "La balise est captée sur la fréquence 147. Gênée, elle se cache : le lien disparaît du jeu. Retrouvez-la plus tard avec vos favoris ou l'historique.",
      succes: "GLADYS : « Fréquence 147 enregistrée. Gardez bien cette balise dans vos favoris. »"
    },

    /* ---------------------------------------------------------------- B3 */
    B3: {
      titre: "QUESTOR, le moteur de recherche",
      notion: "Mot-clé, lien hypertexte, fiabilité d'une source (https)",
      statut: "Révision + découverte (https et cadenas)", lieu: "Dans le jeu", duree: 6, salle: "B",
      type: "recherche",
      requiert: ["B1"],
      verrou: "QUESTOR est éteint : il faut d'abord réparer le tableau de branchement (B1) dans cette salle.",
      panne: "Personne ne connaît l'heure d'amarrage prévue pour le vaisseau COMÈTE. Plusieurs pages donnent des heures différentes.",
      afaire: "Chercher avec des mots-clés précis, ouvrir les résultats et choisir une source fiable.",
      valider: "L'heure d'amarrage (heure de bord) et les indices qui montrent qu'un site n'est pas fiable.",
      recit: [
        { qui: "boulon", txt: "Moi, je prends toujours le premier résultat. C'est le plus rapide. Donc le meilleur. Logique." }
      ],
      learn: {
        titre: "Découverte : http ou https ?",
        txt: "Une adresse qui commence par https:// (avec un cadenas) indique une connexion sécurisée : les données sont protégées pendant leur trajet. Attention : le cadenas ne prouve pas que le site dit la vérité. Il faut aussi regarder qui a écrit la page."
      },
      champs: [
        { id: "heure", label: "Heure d'amarrage du vaisseau COMÈTE, en heure de bord (ex. : 10h30)", ok: ["1xd89cl", "0kdlb5d"],
          pieges: {
            "0zqky07": "13 h 00 vient du site « comète gratuite ». Est-ce une source fiable ? Regarde son adresse et ce qu'il te demande.",
            "0i3jjin": "13 h 00 vient du site « comète gratuite ». Est-ce une source fiable ? Regarde son adresse et ce qu'il te demande.",
            "08mw5u4": "18 h vient d'un forum de rumeurs (« mon cousin a dit… »). Ce n'est pas une source officielle.",
            "1bdppgs": "18 h vient d'un forum de rumeurs (« mon cousin a dit… »). Ce n'est pas une source officielle."
          } }
      ],
      choixMultiple: {
        question: "Quels indices montrent que le site « COMÈTE GRATUITE » n'est pas fiable ? (plusieurs réponses)",
        options: [
          { txt: "Son adresse commence par http:// (sans S, pas de cadenas)", ok: true },
          { txt: "Il promet un cadeau gratuit", ok: true },
          { txt: "Il demande ton mot de passe", ok: true },
          { txt: "Il apparaît en premier dans les résultats", ok: false },
          { txt: "Son titre contient le mot « comète »", ok: false }
        ]
      },
      indices: [
        "Un seul mot comme « comète » donne trop de résultats. Ajoute des mots-clés plus précis : que cherches-tu exactement ?",
        "Essaie : horaire amarrage comète. Puis ouvre chaque résultat et regarde son adresse : qui a écrit la page ?",
        "La page fiable est celle de l'agence orbitale (https://horaires.agence-orbitale.neon). Le premier résultat n'est pas forcément le meilleur !"
      ],
      recompense: ["motcle"],
      changement: "La console QUESTOR affiche l'heure d'amarrage confirmée. La parabole se tourne vers la COMÈTE.",
      succes: "GLADYS : « Une source officielle, enfin. Boulon, le premier résultat n'est pas toujours le bon. » Boulon : « Je le savais. »"
    },

    /* ---------------------------------------------------------------- C1 */
    C1: {
      titre: "L'écran en panne",
      notion: "Pixel, image numérique, codage en 0 et 1",
      statut: "Révision", lieu: "Sur papier", duree: 6, salle: "C",
      type: "champs",
      panne: "L'écran de l'atelier n'affiche plus d'image : seulement des 0 et des 1.",
      afaire: "Redessiner l'image sur la grille de la fiche papier : 1 = pixel allumé (colorié), 0 = pixel éteint (blanc).",
      valider: "Le nombre de pixels allumés et l'objet qui apparaît.",
      recit: [
        { qui: "gladys", txt: "Cet écran ne m'obéit plus. Il n'affiche que des 0 et des 1. C'est vexant pour un écran." }
      ],
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
        titre: "Mission sur papier : redessiner l'écran",
        etapes: [
          "Prends la fiche de mission (grille C1, 10 × 10).",
          "Pour chaque ligne, colorie les cases qui correspondent à un 1. Laisse en blanc les cases qui correspondent à un 0.",
          "Note le nombre de pixels allumés au bout de chaque ligne, puis fais le total.",
          "Regarde le dessin obtenu : quel objet apparaît ?"
        ],
        rapporter: "le nombre de pixels allumés et l'objet dessiné.",
        aide: { "Pas de fiche ?": "Dessine une grille de 10 cases sur 10 sur du papier quadrillé, puis colorie-la ligne par ligne." }
      },
      champs: [
        { id: "nb", label: "Nombre de pixels allumés (coloriés)", ok: ["147ccp1"],
          pieges: { "15bsqkk": "Ça, c'est le nombre de pixels ÉTEINTS (les 0). Compte les pixels allumés (les 1)." } },
        { id: "objet", label: "Objet dessiné", type: "choix", options: ["Une fusée", "Une disquette", "Un robot", "Une clé"], bonne: 1 }
      ],
      indices: [
        "La grille a 10 lignes de 10 pixels : 100 pixels en tout. Avance ligne par ligne, de gauche à droite.",
        "Compte les 1 de chaque ligne et note le total au bout de la ligne. Il ne reste qu'à additionner les 10 totaux.",
        "Totaux par ligne : 8, 5, 6, 10, 10, 2, 8, 4, 8, 10. L'objet est rectangulaire avec une étiquette : c'est une disquette."
      ],
      recompense: ["pixel"],
      changement: "L'écran de l'atelier affiche une disquette en pixels verts.",
      succes: "GLADYS : « C'est mon portrait de famille. Mon arrière-grand-mère était une disquette 3½. »"
    },

    /* ---------------------------------------------------------------- C2 */
    C2: {
      titre: "Boulon s'est perdu",
      notion: "Algorithme, instruction, boucle « répéter »",
      statut: "Révision", lieu: "Sur papier", duree: 5, salle: "C",
      type: "champs",
      panne: "Pendant son optimisation, Boulon a suivi un programme pour aller chercher sa pile de secours. Personne ne sait où il s'est arrêté.",
      afaire: "Rejouer le programme de Boulon sur la carte de la soute (fiche papier), case par case.",
      valider: "Le mot de 4 lettres formé par les lettres notées.",
      recit: [
        { qui: "boulon", txt: "J'ai exécuté ce programme parfaitement. Je ne sais juste plus où je suis." }
      ],
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
        titre: "Mission sur papier : rejouer le programme",
        etapes: [
          "Sur la fiche de mission (carte C2), pose ton crayon sur la case ★. Boulon regarde vers le HAUT.",
          "« avancer » = 1 case dans la direction où il regarde. « tourner à droite » = il pivote sur place, sans avancer.",
          "À la fin de CHAQUE répétition de la boucle, note la lettre de la case où il se trouve.",
          "À la fin du programme, note aussi la lettre de la dernière case."
        ],
        rapporter: "le mot de 4 lettres formé par les lettres notées.",
        aide: { "Astuce": "Trace le chemin au crayon et dessine une petite flèche pour savoir où regarde Boulon après chaque virage." }
      },
      champs: [
        { id: "mot", label: "Mot de 4 lettres", ok: ["0b7e68d"],
          pieges: { "1r4nn78": "BOUM ! Tu as oublié la toute première instruction « avancer », celle qui se trouve AVANT la boucle." } }
      ],
      indices: [
        "Le programme a 3 parties : une instruction avant la boucle, la boucle (3 répétitions), puis une instruction après.",
        "Une répétition = avancer, avancer, tourner à droite. Après la première répétition, Boulon est 3 cases au-dessus de ★ et regarde vers la droite.",
        "Les lettres notées sont P (fin de la 1re répétition), I, L, puis E. Le mot est PILE."
      ],
      recompense: ["algorithme"],
      changement: "Le chemin de Boulon s'affiche en rouge sur la table lumineuse : sa pile de secours est retrouvée.",
      succes: "Boulon : « Je savais exactement où j'étais. Je testais votre sens de l'orientation. »"
    },

    /* ---------------------------------------------------------------- C3 */
    C3: {
      titre: "Ramène Boulon à sa borne",
      notion: "Programmer avec une boucle « répéter »",
      statut: "Révision", lieu: "Dans le jeu", duree: 6, salle: "C",
      type: "code",
      requiert: ["A1"],
      verrou: "Boulon est encore en pièces dans la Salle des machines. Remontez-le d'abord (A1, l'atelier de Boulon).",
      panne: "La batterie de Boulon est à 2 % et sa mémoire ne retient que 6 blocs. Des caisses bloquent le passage vers la borne ⚡.",
      afaire: "Construire un programme sur la piste : glisse les blocs ou utilise les boutons. Tu peux insérer, déplacer et supprimer des blocs.",
      valider: "Exécuter le programme : Boulon doit arriver sur la borne ⚡ avec 6 blocs maximum.",
      recit: [
        { qui: "boulon", txt: "Je pars en regardant vers la DROITE. Et vite, avant que je m'endorme. Zzz… non, je plaisante. Vite quand même." }
      ],
      grille: { l: 6, h: 6, depart: [0, 5], dir: "E", arrivee: [3, 2],
                caisses: [[2, 5], [0, 3], [4, 4], [5, 1], [1, 1], [4, 2]] },
      maxBlocs: 6,
      indices: [
        "Fais d'abord le chemin dans ta tête ou sur une feuille : le seul passage libre ressemble à un escalier.",
        "Une marche de l'escalier = avancer, tourner à gauche, avancer, tourner à droite. Combien de marches faut-il ?",
        "Programme possible : répéter 3 fois [ avancer, tourner à gauche, avancer, tourner à droite ]. Cela fait 5 blocs."
      ],
      recompense: ["boucle"],
      changement: "Boulon est branché sur la borne de recharge : le voyant de la borne est vert.",
      succes: "Bip-bip ⚡ « 100 % ! Je suis prêt à faire des erreurs à pleine puissance. »"
    },

    /* ---------------------------------------------------------------- C4 */
    C4: {
      titre: "Le capteur d'étoiles",
      notion: "Résolution d'une image",
      statut: "Découverte accompagnée", lieu: "Sur l'ordinateur", duree: 5, salle: "C",
      type: "champs",
      panne: "Pour guider le vaisseau COMÈTE, le capteur d'étoiles doit connaître la résolution de sa dernière photo, rangée dans les archives.",
      afaire: "Ouvrir l'image capteur_etoile.png dans les archives extraites et trouver ses dimensions en pixels.",
      valider: "La largeur, la hauteur et le nombre total de pixels.",
      recit: [
        { qui: "boulon", txt: "La résolution ? C'est quand on prend une bonne résolution, genre « je range ma chambre » ? Non ? Encore ?" }
      ],
      learn: {
        titre: "Découverte : la résolution d'une image",
        txt: "La résolution d'une image, c'est son nombre de pixels en largeur et en hauteur. On l'écrit « largeur × hauteur ». Exemple : une image de 100 × 50 pixels a 100 × 50 = 5 000 pixels. Plus il y a de pixels, plus l'image peut être détaillée."
      },
      telechargement: { fichier: "ressources/archives_neon86.zip", label: "Télécharger les archives (si ce n'est pas déjà fait)" },
      mission: {
        titre: "Mission sur l'ordinateur : mesurer l'image",
        etapes: [
          "Dans les archives extraites, ouvre le dossier 03_images.",
          "Ouvre capteur_etoile.png et agrandis-la (zoom) : observe les petits carrés.",
          "Trouve ses dimensions en pixels (voir l'aide selon ton ordinateur).",
          "Calcule le nombre total de pixels : largeur × hauteur."
        ],
        rapporter: "la largeur, la hauteur et le nombre total de pixels.",
        aide: {
          "Méthode valable partout": "Glisse l'image dans un onglet vide du navigateur : les dimensions s'affichent dans le titre de l'onglet, par exemple « (24 × 16) ».",
          "Windows": "Clic droit sur l'image > Propriétés > onglet « Détails » > Dimensions.",
          "macOS": "Ouvre l'image dans Aperçu > menu Outils > « Afficher l'inspecteur ». Ou, dans le Finder, clic droit > « Lire les informations ».",
          "ChromeOS": "Ouvre l'image dans la Galerie et clique sur l'icône « i » (infos)."
        }
      },
      champs: [
        { id: "larg", label: "Largeur (en pixels)", ok: ["129x3xv"], pieges: { "076w5r2": "Tu as inversé : la largeur se mesure horizontalement (←→) et elle s'écrit en premier." } },
        { id: "haut", label: "Hauteur (en pixels)", ok: ["076w5r2"], pieges: { "129x3xv": "Tu as inversé : la hauteur se mesure verticalement (↑↓)." } },
        { id: "total", label: "Nombre total de pixels", ok: ["1m3k2mm"], pieges: { "129bzc9": "Tu as additionné. Pour une grille, on multiplie : largeur × hauteur." } }
      ],
      indices: [
        "Les dimensions d'une image sont écrites dans ses propriétés (ou dans le titre de l'onglet si tu l'ouvres dans le navigateur).",
        "Les dimensions s'écrivent largeur × hauteur. Pour le total, imagine une grille : on multiplie le nombre de colonnes par le nombre de lignes.",
        "L'image mesure 24 pixels de large et 16 pixels de haut : 24 × 16 = 384 pixels."
      ],
      recompense: ["resolution"],
      changement: "Le capteur d'étoiles vise la bonne étoile : une étoile jaune brille au-dessus de lui.",
      succes: "GLADYS : « Avec si peu de pixels, l'étoile ressemble à un biscuit. Mais un biscuit précis. »"
    }
  },

  /* ------------------------------------------------------------- FINAL */
  final: {
    titre: "Reconstruire la mémoire de GLADYS",
    panne: "La mémoire de démarrage de GLADYS est vide : 11 fentes attendent une disquette.",
    afaire: "Insérer chaque disquette dans la fente dont la phrase lui correspond. Glisse une disquette vers une fente, ou clique sur la disquette puis sur la fente.",
    valider: "Lancer le démarrage. Ensuite, envoyer le signal grâce au nom de la balise relais.",
    recit: [
      { qui: "gladys", txt: "Bon. Mes trois secteurs fonctionnent. Je veux bien me réveiller… si vous reconstruisez ma mémoire de démarrage. Sans faute. J'ai ma fierté." }
    ],
    lignes: [
      { avant: "1. Quand on appuie sur le bouton, c'est le", carte: "materiel", apres: "qui se met en marche : écran, processeur, clavier…" },
      { avant: "2. Puis le", carte: "os", apres: "démarre : il fait le lien entre le matériel et les autres logiciels." },
      { avant: "3. Il range chaque", carte: "fichier", apres: "(texte, image, son…) dans des dossiers." },
      { avant: "4. Pour visiter un site, j'ouvre un", carte: "navigateur", apres: "comme Firefox ou Chrome…" },
      { avant: "5. … et je tape son adresse, l'", carte: "url", apres: ", dans la barre d'adresse." },
      { avant: "6. Ma demande voyage par", carte: "internet", apres: ", le réseau mondial qui relie les ordinateurs." },
      { avant: "7. Si je ne connais pas l'adresse, je choisis chaque", carte: "motcle", apres: "avec soin avant de lancer ma recherche." },
      { avant: "8. La page s'affiche à l'écran : chaque", carte: "pixel", apres: "est un petit carré de couleur." },
      { avant: "9. Le nombre de pixels en largeur et en hauteur s'appelle la", carte: "resolution", apres: "." },
      { avant: "10. Pour guider Boulon, j'écris un", carte: "algorithme", apres: ": une suite d'instructions dans un ordre précis." },
      { avant: "11. Quand des instructions se répètent, je les place dans une", carte: "boucle", apres: "« répéter »." }
    ],
    signal: {
      titre: "Dernière étape : le signal d'amarrage",
      txt: "Pour envoyer le signal, GLADYS a besoin du NOM de la balise relais. Il est écrit sur l'onglet de sa page (le titre de l'onglet), pas sur la page. Le lien a disparu du jeu : retrouvez la balise grâce à vos favoris (ou à l'historique : Ctrl + H, Cmd + Y sur Mac).",
      label: "Nom de la balise (titre de l'onglet)",
      ok: ["15qpvgo", "0zp6ptq", "1tt7um8"],
      indices: [
        "Ouvrez vos favoris (l'étoile, ou le menu du navigateur) et cliquez sur la balise relais. Regardez le titre de l'onglet tout en haut.",
        "Pas de favori ? Ouvrez l'historique du navigateur (Ctrl + H, ou Cmd + Y sur Mac) et cherchez « Balise ».",
        "Dernier recours : dans la barre d'adresse du jeu, remplacez index.html par relais.html (ou ajoutez relais.html à la fin de l'adresse). Le nom commence par ALT…"
      ]
    },
    indices: [
      "Relisez la définition de chaque disquette dans le carnet de mission.",
      "Chaque disquette n'est utilisée qu'une seule fois. Commencez par les phrases dont vous êtes sûrs : il restera moins de choix pour les autres.",
      "Les phrases 1 et 2 parlent du matériel puis du système d'exploitation ; les phrases 4, 5 et 6 suivent le trajet navigateur → URL → Internet."
    ],
    succes: [
      { qui: "gladys", txt: "BIIIP… Mémoire de démarrage : 100 %. Antenne : OK. Écran : OK. Robot : présent. Hélas." },
      { qui: "gladys", txt: "Signal envoyé à la balise ALTAÏR. Le vaisseau COMÈTE s'amarre à 16 h 45, heure de bord. Le cactus de bord est sauvé." },
      { qui: "boulon", txt: "Bravo à moi ! Euh… à nous ! Bon, d'accord : bravo à VOUS." }
    ]
  },

  /* ------------------------------------------------------------- BILAN */
  bilan: {
    erreurs: [
      { titre: "Navigateur ≠ moteur de recherche", txt: "Firefox ou Chrome sont des navigateurs (logiciels). Google ou Qwant sont des moteurs de recherche (sites qui cherchent des pages)." },
      { titre: "Internet ≠ Web", txt: "Internet est le réseau mondial. Le Web est l'ensemble des pages reliées par des liens, qui utilise Internet." },
      { titre: "Le nom d'un fichier ne suffit pas", txt: "Deux fichiers peuvent avoir presque le même nom. L'extension (.txt, .png…) indique leur type." },
      { titre: "Le premier résultat n'est pas toujours le bon", txt: "On vérifie qui a écrit la page, son adresse et ce qu'elle demande." },
      { titre: "La résolution se multiplie", txt: "24 × 16 pixels = 384 pixels, et non 24 + 16." }
    ],
    autoeval: [
      "Je distingue le matériel, le système d'exploitation et les applications.",
      "Je retrouve un fichier dans des dossiers et je reconnais son extension.",
      "Je distingue Internet, le Web, un navigateur et un moteur de recherche.",
      "Je lis une URL dans la barre d'adresse et j'utilise les favoris.",
      "Je choisis des mots-clés précis et je vérifie la fiabilité d'une page.",
      "J'explique ce qu'est un pixel et la résolution d'une image.",
      "Je suis un algorithme et j'utilise une boucle « répéter »."
    ],
    question: "Expliquez avec vos mots comment vous avez retrouvé la bonne sauvegarde de GLADYS (ou une autre manipulation faite dans vos fichiers ou votre navigateur)."
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
