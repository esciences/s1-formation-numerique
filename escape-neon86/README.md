# Panne à bord du Néon-86 (version 2)

Escape game numérique pour la **formation numérique en 1re secondaire** (12-13 ans).
Application statique HTML/CSS/JavaScript : sans serveur, sans base de données, sans compte élève.

**Version 2 :** scénario en 2056, quatre lieux dessinés et explorables qui évoluent à chaque réparation, inscription de 1 à 4 membres, atelier A1 en lots nominatifs, tableau de branchement (B1), piste de programmation (C3), disquettes à insérer (finale), tutoriel et aide « Je suis perdu ».

## Contenu du dossier

```
escape-neon86/
├── index.html                 ← le jeu
├── relais.html                ← page de la « balise relais » (énigme B2 + finale)
├── css/style.css              ← apparence (couleurs en haut du fichier)
├── js/data.js                 ← TEXTES, ÉNIGMES, INDICES (à modifier ici)
├── js/engine.js               ← moteur du jeu
├── js/art.js                  ← portraits SVG (GLADYS, Boulon, journal)
├── js/scenes.js               ← décors des 4 lieux + positions des objets cliquables
├── ressources/
│   ├── archives_neon86.zip    ← archive téléchargée par les élèves (A2, C4)
│   └── archives_neon86/       ← même contenu, déjà extrait (plan B / consultation)
├── docs/
│   ├── fiche_mission.pdf      ← fiche papier à imprimer (1 par équipe)
│   ├── guide_enseignant.pdf   ← solutions (NE PAS publier sur le dépôt public)
│   └── guide_enseignant.md / fiche_mission.html (sources)
├── outils/empreinte.html      ← pour changer une réponse (voir guide §13)
└── .nojekyll                  ← indique à GitHub Pages de servir les fichiers tels quels
```

## Lancer le jeu

**En ligne (recommandé) :** publier le dossier sur GitHub Pages (voir ci-dessous), puis donner l'adresse aux élèves.

**En local :** double-cliquer sur `index.html`. Tout fonctionne, avec deux différences :

| | GitHub Pages | Ouverture locale (file://) |
|---|---|---|
| Sauvegarde de la progression | ✔ | ✔ dans Chrome, Edge et Firefox ; liée au fichier ouvert |
| Téléchargement du ZIP (A2) | ✔ | ✔ (copie le fichier depuis le dossier `ressources`) |
| Balise relais et URL (B2) | ✔ adresse en `https://` | ✔ mais l'adresse commence par `file:///` : c'est moins parlant pour les élèves |
| Favori de la balise | ✔ | ✔ |

Pour une séance en classe, préfère **GitHub Pages** : l'URL de la balise ressemble alors à une vraie adresse web.

## Publier sur GitHub Pages

1. Crée un dépôt (ou utilise un dépôt existant, par exemple `s1-formation-numerique`).
2. Dépose tout le contenu du dossier `escape-neon86/` dans le dépôt, par exemple dans un sous-dossier `escape-neon86/`.
   Sur github.com : bouton **Add file > Upload files**, puis glisse les fichiers et les dossiers.
3. **Settings > Pages** : choisis la branche `main` et le dossier `/ (root)` si ce n'est pas déjà fait.
4. Après une ou deux minutes, le jeu est disponible à l'adresse :
   `https://<ton-compte>.github.io/<depot>/escape-neon86/`
5. Teste le téléchargement du ZIP et l'ouverture de la balise relais avant la séance.

Tous les chemins sont relatifs : le jeu fonctionne dans n'importe quel sous-dossier.

## Code d'accès

L'écran titre demande un **code d'accès** (par défaut : voir le guide enseignant, §8). Une fois saisi, il est retenu par le navigateur de l'ordinateur.
Pour le changer : `outils/empreinte.html`, puis remplacer `codeAcces` dans `js/data.js` (mettre `null` pour supprimer le verrou).
Le nombre maximal d'élèves par ordinateur se règle dans `js/data.js` (`equipage.max`, 4 par défaut).
Ce verrou empêche l'accès par simple curiosité ; un élève très débrouillard pourrait le contourner en modifiant la page.

## Progression des élèves

- Enregistrée **dans le navigateur** de l'ordinateur (localStorage), sous la clé `neon86-sauvegarde-v2` (prénoms, lots de A1, réparations, indices, saisies). Rien n'est envoyé sur Internet.
- **Ancienne version :** une partie de la v1 (`neon86-sauvegarde-v1`) est détectée à l'ouverture. Le jeu propose de la continuer (il faut inscrire l'équipage, les réparations sont conservées) ou d'en commencer une nouvelle. L'ancienne sauvegarde n'est jamais effacée.
- **Reprendre :** l'écran titre propose « Reprendre la partie ».
- **Remise à zéro :** Carnet > « Recommencer une nouvelle partie » (avec confirmation). Le code d'accès reste mémorisé.
- La progression est perdue en navigation privée, si la session est effacée à la déconnexion ou si l'élève change d'ordinateur. La fiche papier permet de noter les réponses pour les ressaisir rapidement.

## Réponses et modification

Les solutions complètes se trouvent dans `docs/guide_enseignant.pdf`. Ce fichier n'est pas publié sur le dépôt GitHub (public) : garde-le de ton côté.
Dans `js/data.js`, les réponses sont remplacées par des empreintes, pour qu'un élève curieux ne les trouve pas dans le code source. Pour changer une réponse, utilise `outils/empreinte.html`.

## Licence

Tommy Berben · eSCIENCES.be · CC BY-NC-SA 4.0
