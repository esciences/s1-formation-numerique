/* ==========================================================================
   PANNE À BORD DU NÉON-86 — contenu du jeu (textes, énigmes, indices)
   --------------------------------------------------------------------------
   Ce fichier peut être modifié librement : textes, consignes, indices.
   Les réponses à saisir sont stockées sous forme d'empreintes (« hash »)
   pour que les élèves ne les lisent pas dans le code source.
   Pour changer une réponse : ouvrir outils/empreinte.html, taper la nouvelle
   réponse et copier l'empreinte obtenue à la place de l'ancienne.
   Les solutions en clair se trouvent dans docs/guide_enseignant.
   ========================================================================== */

window.NEON = {
  titre: "Panne à bord du Néon-86",
  version: "1.1",

  /* Code d'accès donné par l'enseignant au début de la séance (empreinte).
     Pour le changer : outils/empreinte.html. Mettre null pour supprimer le code. */
  codeAcces: "0lc5caz",

  intro: [
    { qui: "journal", txt: "Station orbitale NÉON-86. Année 2026… telle qu'on l'imaginait en 1986 : écrans cathodiques, disquettes, voyants qui clignotent et cactus de bord." },
    { qui: "boulon", txt: "Bonjour, humains ! Je suis BOULON, robot de maintenance. Ce matin, j'ai TOUT optimisé : j'ai démonté des pièces, compressé les archives et rebranché l'antenne. Résultat : la station est… très calme." },
    { qui: "journal", txt: "Trop calme. GLADYS 3000, l'ordinatrice de bord, s'est vexée et s'est mise en « veille boudeuse ». Sans elle : pas d'antenne, pas d'écran… et la cargo-comète de ravitaillement passe AUJOURD'HUI." },
    { qui: "gladys", txt: "… … (GLADYS fait semblant de dormir. Un voyant orange clignote : « Mémoire de démarrage effacée ».)" },
    { qui: "journal", txt: "Ta mission : réparer les trois secteurs de la station pour récupérer 11 cartes-mémoire. Avec elles, tu pourras réécrire la mémoire de démarrage de GLADYS et la réveiller." }
  ],

  regles: [
    "Tu choisis l'ordre : tous les secteurs sont ouverts dès le départ.",
    "Tu bloques ? Laisse l'énigme de côté et va dans un autre secteur.",
    "Chaque énigme propose 3 indices, du plus léger au plus précis.",
    "Certaines missions se font hors du jeu : sur papier, dans tes fichiers ou dans le navigateur. Le carnet de mission garde toutes les consignes.",
    "Ta progression est enregistrée sur cet ordinateur : tu peux reprendre la partie plus tard."
  ],

  secteurs: [
    { id: "A", nom: "Salle des machines", couleur: "ambre",
      accroche: "Boulon est en pièces détachées et les archives sont en vrac.",
      enigmes: ["A1", "A2"] },
    { id: "B", nom: "Antenne de communication", couleur: "vert",
      accroche: "L'antenne est rebranchée à l'envers. Plus aucun signal ne passe.",
      enigmes: ["B1", "B2", "B3"] },
    { id: "C", nom: "Atelier pixels & robotique", couleur: "cyan",
      accroche: "L'écran n'affiche plus que des 0 et des 1, et Boulon s'est perdu.",
      enigmes: ["C1", "C2", "C3", "C4"] }
  ],

  /* Cartes-mémoire : gagnées en résolvant les énigmes, utilisées au final. */
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
      titre: "Le grand tri de Boulon",
      notion: "Matériel, logiciel et système d'exploitation",
      statut: "Révision", lieu: "Dans le jeu", duree: 4,
      type: "tri",
      recit: [
        { qui: "boulon", txt: "Je me suis démonté pour m'améliorer. J'ai mis TOUTES mes pièces dans le même bac. Même celles qu'on ne peut pas toucher. Oups." },
        { qui: "journal", txt: "Pour remonter Boulon, il faut séparer ce qui se touche (le matériel) de ce qui ne se touche pas (les logiciels). Parmi les logiciels, repère ceux qui font démarrer l'ordinateur." }
      ],
      consigne: "Range chaque élément dans la bonne catégorie, puis clique sur « Valider le tri ».",
      categories: [
        { id: "mat", nom: "Matériel" },
        { id: "os",  nom: "Logiciel : système d'exploitation" },
        { id: "app", nom: "Logiciel : application" }
      ],
      elements: [
        { nom: "Écran cathodique", cat: "mat" },
        { nom: "Clavier", cat: "mat" },
        { nom: "Windows", cat: "os" },
        { nom: "Firefox", cat: "app" },
        { nom: "Processeur", cat: "mat" },
        { nom: "macOS", cat: "os" },
        { nom: "Minecraft Education", cat: "app" },
        { nom: "Clé USB", cat: "mat" },
        { nom: "Souris", cat: "mat" },
        { nom: "ChromeOS", cat: "os" },
        { nom: "Word (traitement de texte)", cat: "app" },
        { nom: "Imprimante", cat: "mat" }
      ],
      indices: [
        "Pose-toi la question : est-ce que je peux le toucher, le prendre dans ma main ?",
        "Le système d'exploitation démarre en premier quand on allume l'ordinateur. Il en existe peu : on les retrouve sur presque tous les ordinateurs de l'école ou de la maison.",
        "Il y a 6 éléments matériels, 3 systèmes d'exploitation (Windows, macOS, ChromeOS) et 3 applications."
      ],
      recompense: ["materiel", "os"],
      succes: "Clac, clic, vrrr… Boulon est remonté ! « J'étais déjà parfait, mais là je suis parfait ET rangé. » Il file vers l'atelier : tu peux maintenant le programmer (Atelier, énigme « Ramène Boulon à sa borne »)."
    },

    /* ---------------------------------------------------------------- A2 */
    A2: {
      titre: "La sauvegarde perdue",
      notion: "Fichier, extension, dossier, arborescence, téléchargement",
      statut: "Révision + découverte (fichier ZIP, versions)", lieu: "Sur l'ordinateur", duree: 8,
      type: "champs",
      recit: [
        { qui: "gladys", txt: "(Un message s'affiche en tout petit.) Ma sauvegarde de mémoire… Boulon l'a rangée… quelque part. Je ne boude pas. Je réfléchis." },
        { qui: "boulon", txt: "J'ai compressé toutes les archives dans UN SEUL fichier ZIP, pour gagner de la place. Génial, non ? Par contre, je ne sais plus où j'ai mis la sauvegarde." }
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
          "Extrais-le (voir l'aide selon ton ordinateur ci-dessous), puis ouvre le dossier archives_neon86.",
          "Lis le fichier LISEZ-MOI.txt : il explique quelle sauvegarde est la bonne.",
          "Explore les dossiers et les sous-dossiers pour la trouver."
        ],
        rapporter: "Le mot de passe écrit dans la bonne sauvegarde, et le nom du dossier où elle se trouvait.",
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
      succes: "Mémoire retrouvée ! GLADYS cligne d'un pixel : « Je ne boude plus… presque. Merci pour la v03. La v04 en image, c'était une blague de Boulon ? »"
    },

    /* ---------------------------------------------------------------- B1 */
    B1: {
      titre: "Panne en cascade",
      notion: "Internet, Web, navigateur, moteur de recherche, lien",
      statut: "Révision", lieu: "Dans le jeu", duree: 5,
      type: "vf",
      recit: [
        { qui: "boulon", txt: "J'ai rebranché l'antenne en suivant mes connaissances. Elles sont excellentes. Voici mes 7 certitudes." },
        { qui: "journal", txt: "Le moteur de recherche de la station, QUESTOR, refuse de démarrer tant que ces erreurs ne sont pas corrigées." }
      ],
      consigne: "Pour chaque affirmation de Boulon, choisis Vrai ou Faux.",
      affirmations: [
        { txt: "« Google, c'est mon navigateur. »", vrai: false,
          expl: "Faux. Google (le site) est un moteur de recherche. Le navigateur est le logiciel qui affiche les pages : Chrome, Firefox, Edge, Safari…" },
        { txt: "« Internet et le Web, c'est exactement la même chose. »", vrai: false,
          expl: "Faux. Internet est le réseau qui relie les appareils du monde entier. Le Web est l'ensemble des pages reliées par des liens : il utilise Internet, comme le courriel ou les jeux en ligne." },
        { txt: "« Firefox, Edge, Chrome et Safari sont des navigateurs. »", vrai: true,
          expl: "Vrai. Ce sont des logiciels qui permettent d'afficher les pages du Web." },
        { txt: "« Un lien hypertexte permet d'aller vers une autre page en cliquant dessus. »", vrai: true,
          expl: "Vrai. Un lien hypertexte contient l'adresse d'une autre page. Il est souvent souligné ou coloré." },
        { txt: "« Pour aller sur un site dont je connais l'adresse, je dois obligatoirement passer par un moteur de recherche. »", vrai: false,
          expl: "Faux. Il suffit de taper l'adresse (l'URL) dans la barre d'adresse du navigateur." },
        { txt: "« Un moteur de recherche trouve des pages à partir de mots-clés. »", vrai: true,
          expl: "Vrai. On lui donne des mots-clés et il propose une liste de pages. Ex. : Google, Bing, Qwant, Ecosia." },
        { txt: "« Le courriel (e-mail) utilise Internet, mais ce n'est pas une page du Web. »", vrai: true,
          expl: "Vrai. Le courriel est un autre service qui passe par Internet. Le Web n'est qu'une partie de ce qu'on fait sur Internet." }
      ],
      indices: [
        "Distingue bien un LOGICIEL qui affiche les pages (le navigateur) d'un SITE qui cherche des pages (le moteur de recherche).",
        "Internet, c'est la « route » qui relie les ordinateurs. Le Web, c'est un des « véhicules » qui roulent dessus, comme le courriel.",
        "Il y a 3 affirmations fausses : celle sur Google, celle sur Internet = Web, et celle sur l'obligation de passer par un moteur de recherche."
      ],
      recompense: ["navigateur", "internet"],
      succes: "Bzzzt… QUESTOR redémarre ! Boulon : « Je le savais. Je voulais juste vérifier que TOI tu le savais. »"
    },

    /* ---------------------------------------------------------------- B2 */
    B2: {
      titre: "La balise relais",
      notion: "URL, barre d'adresse, favoris",
      statut: "Révision", lieu: "Dans le navigateur", duree: 5,
      type: "champs",
      recit: [
        { qui: "gladys", txt: "Une balise relais flotte près de la station. Elle est timide : elle ne dit rien sur sa page. Son message est caché… dans sa propre adresse." },
        { qui: "boulon", txt: "Une adresse, c'est la même chose qu'une page, non ? Non ? Ah." }
      ],
      relais: { fichier: "relais.html?station=neon86&frequence=147", label: "Ouvrir la balise relais (nouvel onglet)" },
      mission: {
        titre: "Mission dans le navigateur : lire l'adresse de la balise",
        etapes: [
          "Ouvre la balise relais : elle s'affiche dans un nouvel onglet.",
          "Clique dans la barre d'adresse pour voir l'URL complète de la page.",
          "Repère le nom de la page (le fichier qui se termine par .html) et la fréquence indiquée dans l'URL.",
          "Ajoute la balise à tes favoris : la balise va se cacher, et tu en auras besoin pour la mission finale.",
          "Reviens dans l'onglet du jeu pour noter tes réponses."
        ],
        rapporter: "Le nom de la page de la balise et la valeur de la fréquence lue dans l'URL.",
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
      succes: "Signal capté sur la fréquence 147 ! La balise, gênée d'avoir été lue, se cache. Le lien disparaît du jeu. Tu pourras la retrouver grâce à tes favoris (ou à l'historique)."
    },

    /* ---------------------------------------------------------------- B3 */
    B3: {
      titre: "QUESTOR, le moteur de recherche",
      notion: "Mot-clé, lien hypertexte, fiabilité d'une source (https)",
      statut: "Révision + découverte (https et cadenas)", lieu: "Dans le jeu", duree: 6,
      type: "recherche",
      requiert: ["B1"],
      verrou: "QUESTOR est en panne : corrige d'abord les erreurs de Boulon (énigme « Panne en cascade »).",
      recit: [
        { qui: "gladys", txt: "Il faut connaître l'heure exacte de passage de la cargo-comète de ravitaillement, aujourd'hui. Utilise QUESTOR, le moteur de recherche de la station." },
        { qui: "boulon", txt: "Moi, je prends toujours le premier résultat. C'est le plus rapide. Donc le meilleur. Logique." }
      ],
      learn: {
        titre: "Découverte : http ou https ?",
        txt: "Une adresse qui commence par https:// (avec un cadenas) indique une connexion sécurisée : les données sont protégées pendant leur trajet. Attention : le cadenas ne prouve pas que le site dit la vérité. Il faut aussi regarder qui a écrit la page."
      },
      consigne: "Trouve l'heure de passage de la cargo-comète avec des mots-clés précis. Ouvre les résultats, compare-les et choisis une source fiable.",
      champs: [
        { id: "heure", label: "Heure de passage de la cargo-comète (ex. : 10h30)", ok: ["1xd89cl", "0kdlb5d"],
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
        "Essaie : horaire comète ravitaillement. Puis ouvre chaque résultat et regarde son adresse : qui a écrit la page ?",
        "La page fiable est celle de l'agence orbitale (https://horaires.agence-orbitale.neon). Le premier résultat n'est pas forcément le meilleur !"
      ],
      recompense: ["motcle"],
      succes: "Heure confirmée : 16 h 45. GLADYS : « Une source officielle, enfin. Boulon, le premier résultat n'est pas toujours le bon. » Boulon : « Je le savais. »"
    },

    /* ---------------------------------------------------------------- C1 */
    C1: {
      titre: "L'écran en panne",
      notion: "Pixel, image numérique, codage en 0 et 1",
      statut: "Révision", lieu: "Sur papier", duree: 6,
      type: "champs",
      recit: [
        { qui: "gladys", txt: "Mon écran de pilotage ne m'obéit plus. Il n'affiche que des 0 et des 1. C'est vexant pour un écran." },
        { qui: "journal", txt: "Chaque ligne de chiffres décrit une ligne de pixels. 1 = pixel allumé (colorié). 0 = pixel éteint (blanc)." }
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
          "Prends la fiche de mission (grille 10 × 10 de l'écran en panne).",
          "Pour chaque ligne, colorie les cases qui correspondent à un 1. Laisse en blanc les cases qui correspondent à un 0.",
          "Compte les pixels coloriés.",
          "Regarde le dessin obtenu : quel objet apparaît ?"
        ],
        rapporter: "Le nombre de pixels allumés et l'objet dessiné.",
        aide: { "Pas de fiche ?": "Dessine une grille de 10 cases sur 10 sur du papier quadrillé, puis colorie-la ligne par ligne." }
      },
      champs: [
        { id: "nb", label: "Nombre de pixels allumés (coloriés)", ok: ["147ccp1"],
          pieges: { "15bsqkk": "Ça, c'est le nombre de pixels ÉTEINTS (les 0). Compte les pixels allumés (les 1)."  } },
        { id: "objet", label: "Objet dessiné", type: "choix", options: ["Une fusée", "Une disquette", "Un robot", "Une clé"], bonne: 1 }
      ],
      indices: [
        "La grille a 10 lignes de 10 pixels : 100 pixels en tout. Avance ligne par ligne, de gauche à droite.",
        "Compte les 1 de chaque ligne et note le total au bout de la ligne. Il ne reste qu'à additionner les 10 totaux.",
        "Totaux par ligne : 8, 5, 6, 10, 10, 2, 8, 4, 8, 10. L'objet est rectangulaire avec une étiquette : c'est une disquette."
      ],
      recompense: ["pixel"],
      succes: "Tchiiik… L'écran affiche une disquette ! GLADYS : « C'est mon portrait de famille. Mon arrière-grand-mère était une disquette 3½. »"
    },

    /* ---------------------------------------------------------------- C2 */
    C2: {
      titre: "Boulon s'est perdu",
      notion: "Algorithme, instruction, boucle « répéter »",
      statut: "Révision", lieu: "Sur papier", duree: 5,
      type: "champs",
      recit: [
        { qui: "boulon", txt: "J'ai suivi un programme pour aller chercher ma pile de secours. Je l'ai exécuté parfaitement. Je ne sais juste plus où je suis." },
        { qui: "journal", txt: "Rejoue le programme de Boulon sur la carte de la soute. Il part de la case ★ et regarde vers le HAUT." }
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
          "Sur la fiche de mission, pose ton crayon sur la case ★. Boulon regarde vers le haut.",
          "« avancer » = 1 case dans la direction où il regarde. « tourner à droite » = il pivote sur place, sans avancer.",
          "À la fin de CHAQUE répétition de la boucle, note la lettre de la case où il se trouve.",
          "À la fin du programme, note aussi la lettre de la dernière case."
        ],
        rapporter: "Le mot de 4 lettres formé par les lettres notées.",
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
      succes: "Boulon a retrouvé sa PILE de secours ! « Je savais exactement où j'étais. Je testais ton sens de l'orientation. »"
    },

    /* ---------------------------------------------------------------- C3 */
    C3: {
      titre: "Ramène Boulon à sa borne",
      notion: "Programmer avec une boucle « répéter »",
      statut: "Révision", lieu: "Dans le jeu", duree: 6,
      type: "code",
      requiert: ["A1"],
      verrou: "Boulon est encore en pièces détachées. Remonte-le d'abord dans la Salle des machines (énigme « Le grand tri de Boulon »).",
      recit: [
        { qui: "boulon", txt: "Ma batterie est à 2 %. Ma mémoire ne retient que 6 instructions. Toi, tu vas me guider jusqu'à ma borne de recharge ⚡. Et vite." },
        { qui: "journal", txt: "Les caisses bloquent le passage. Écris un programme de 6 blocs maximum. La boucle « répéter » compte pour un bloc, plus les blocs qu'elle contient." }
      ],
      grille: { l: 6, h: 6, depart: [0, 5], dir: "E", arrivee: [3, 2],
                caisses: [[2, 5], [0, 3], [4, 4], [5, 1], [1, 1], [4, 2]] },
      maxBlocs: 6,
      consigne: "Construis le programme avec les boutons, puis clique sur « Exécuter ». Boulon part en regardant vers la DROITE.",
      indices: [
        "Fais d'abord le chemin dans ta tête ou sur une feuille : le seul passage libre ressemble à un escalier.",
        "Une marche de l'escalier = avancer, tourner à gauche, avancer, tourner à droite. Combien de marches faut-il ?",
        "Programme possible : répéter 3 fois [ avancer, tourner à gauche, avancer, tourner à droite ]. Cela fait 5 blocs."
      ],
      recompense: ["boucle"],
      succes: "Bip-bip ⚡ Boulon se recharge. « 100 % ! Je suis désormais prêt à faire des erreurs à pleine puissance. »"
    },

    /* ---------------------------------------------------------------- C4 */
    C4: {
      titre: "Le capteur d'étoiles",
      notion: "Résolution d'une image",
      statut: "Découverte accompagnée", lieu: "Sur l'ordinateur", duree: 5,
      type: "champs",
      recit: [
        { qui: "gladys", txt: "Pour viser la cargo-comète, mon capteur d'étoiles doit connaître la résolution de sa dernière photo. Elle est rangée dans les archives : 03_images > capteur_etoile.png." },
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
        rapporter: "La largeur, la hauteur et le nombre total de pixels.",
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
      succes: "Capteur calibré : 384 pixels d'étoile ! GLADYS : « Avec si peu de pixels, l'étoile ressemble à un biscuit. Mais un biscuit précis. »"
    }
  },

  /* ------------------------------------------------------------- FINAL */
  final: {
    titre: "Réveiller GLADYS",
    recit: [
      { qui: "gladys", txt: "Bon. Tu as réparé mes trois secteurs. Je veux bien me réveiller… à condition que tu réécrives ma mémoire de démarrage. Sans faute. J'ai ma fierté." }
    ],
    consigne: "Complète chaque ligne de la mémoire de démarrage avec la bonne carte-mémoire.",
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
      titre: "Dernière étape : le signal de la balise",
      txt: "Pour envoyer le signal de réveil, GLADYS a besoin du NOM de la balise relais. Il est écrit sur l'onglet de sa page (le titre de l'onglet), pas sur la page. Le lien a disparu du jeu : retrouve la balise grâce à tes favoris (ou à l'historique : Ctrl + H, Cmd + Y sur Mac).",
      label: "Nom de la balise (titre de l'onglet)",
      ok: ["15qpvgo","0zp6ptq","1tt7um8"],
      indices: [
        "Ouvre tes favoris (l'étoile, ou le menu du navigateur) et clique sur la balise relais. Regarde le titre de l'onglet tout en haut.",
        "Pas de favori ? Ouvre l'historique du navigateur (Ctrl + H, ou Cmd + Y sur Mac) et cherche « Balise ».",
        "Dernier recours : dans la barre d'adresse du jeu, remplace index.html par relais.html (ou ajoute relais.html à la fin de l'adresse). Le nom commence par ALT…"
      ]
    },
    indices: [
      "Relis la définition de chaque carte-mémoire dans le carnet de mission.",
      "Chaque carte n'est utilisée qu'une seule fois. Commence par les lignes dont tu es sûr(e) : il restera moins de choix pour les autres.",
      "Les lignes 1 et 2 parlent du matériel puis du système d'exploitation ; les lignes 4, 5 et 6 suivent le trajet navigateur → URL → Internet."
    ],
    succes: [
      { qui: "gladys", txt: "BIIIP… Mémoire de démarrage : 100 %. Antenne : OK. Écran : OK. Robot : … présent." },
      { qui: "gladys", txt: "Signal envoyé à la balise ALTAÏR. La cargo-comète KRONK s'amarre à 16 h 45 pile. Le cactus de bord est sauvé." },
      { qui: "boulon", txt: "Bravo à moi ! Euh… à nous ! Bon, d'accord : bravo à TOI." },
      { qui: "gladys", txt: "Je retire ma bouderie. Avant de partir, fais le point sur ce que tu as appris : c'est ta propre sauvegarde de mémoire." }
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
    question: "Explique avec tes mots comment tu as retrouvé la bonne sauvegarde de GLADYS (ou une autre manipulation que tu as faite dans tes fichiers ou ton navigateur)."
  },

  /* ---------------------------------------------- QUESTOR (énigme B3) */
  questor: {
    motsVides: ["le","la","les","l","de","du","des","d","a","au","aux","un","une","et","ou","en","est","sur","pour","par","que","qui","quoi","quel","quelle","quels","quelles","quand","comment","je","tu","il","elle","on","ce","cette","ces","mon","ma","mes","ton","ta","tes","son","sa","ses","avec","dans","va","vers","y","s","c","qu"],
    pages: [
      { titre: "COMÈTE GRATUITE !!! Horaire SECRET du ravitaillement", url: "http://comete-cadeau-gratuit.biz/gagner?id=8841",
        resume: "Clique vite ! Horaire secret de la comète de ravitaillement + cadeau gratuit…",
        mots: ["comete","gratuit","cadeau","horaire","ravitaillement","secret","gagner"],
        contenu: "<p class='clignote'>★ FÉLICITATIONS ! Tu es notre 1 000 000e visiteur ! ★</p><p>La comète de ravitaillement passe à <b>13 h 00</b>. Vite, vite !</p><p>Pour recevoir ta fusée GRATUITE, écris ici ton mot de passe : [__________]</p><p><small>Site créé par : un ami. Date : ???</small></p>" },
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
        contenu: "<p>Une comète est un petit corps de glace et de poussière. Près du Soleil, elle forme une longue queue lumineuse.</p><p>(Cette page explique ce qu'est une comète, mais ne donne pas d'horaire de ravitaillement.)</p>" },
      { titre: "Recette : le gâteau comète au chocolat", url: "https://cuisine-orbitale.neon/recettes/gateau-comete",
        resume: "Un gâteau qui file aussi vite qu'une comète… ou presque.",
        mots: ["comete","gateau","recette","chocolat","cuisine"],
        contenu: "<p>Ingrédients : 200 g de chocolat, 3 œufs, 1 pincée de poussière d'étoile (facultatif).</p>" },
      { titre: "Forum : la comète est en retard ?? (rumeurs)", url: "http://forum-potins-orbitaux.net/sujet/2231",
        resume: "Mon cousin a dit qu'elle passerait vers 18 h, je crois…",
        mots: ["comete","retard","rumeur","forum","ravitaillement","heure"],
        contenu: "<p><b>Zorg_42</b> : la comète de ravitaillement est en retard, non ?</p><p><b>Pixou</b> : mon cousin a dit 18 h, je crois. Ou peut-être demain. Je ne sais plus.</p>" },
      { titre: "Horaires de passage — Cargo-comète de ravitaillement", url: "https://horaires.agence-orbitale.neon/cargo-comete",
        resume: "Agence orbitale officielle. Horaires de passage de la cargo-comète pour les stations.",
        mots: ["horaire","horaires","heure","passage","cargo","comete","ravitaillement","neon86","neon","station","aujourd","agence","officiel"],
        contenu: "<p><b>Agence orbitale — service des ravitaillements</b></p><p>Station NÉON-86 : passage de la cargo-comète KRONK <b>aujourd'hui à 16 h 45</b>.</p><p>La station doit être allumée 10 minutes avant le passage.</p><p><small>Page mise à jour aujourd'hui par l'Agence orbitale.</small></p>" },
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
        contenu: "<p>Vents solaires modérés. Rien de grave pour les comètes.</p>" },
      { titre: "Fan-club officiel de BOULON", url: "https://boulon-fan-club.neon/accueil",
        resume: "Le seul club dont le président est aussi l'unique membre.",
        mots: ["boulon","robot","fan","club"],
        contenu: "<p>Bienvenue ! Membres : 1 (Boulon). Président : Boulon. Trésorier : Boulon.</p>" }
    ]
  }
};
