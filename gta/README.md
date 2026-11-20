# GTA · Gère. Traque. Agis.

> Bienvenue à Leonida. Fais de la place, déjoue les pièges et garde le contrôle.
>
> - **Gère** ton espace de stockage et tes fichiers (mission 1, bonus).
> - **Traque** les arnaques, les fausses annonces et les indices suspects (missions 2 et 3).
> - **Agis** en faisant les bons choix pour terminer les missions (mission 4, finale).

Parcours interactif de **Formation numérique (S1)** construit autour de la sortie de GTA VI (19 novembre 2026).
Durée : 2 périodes (±90 min) · seul·e ou à 2-3 · navigateur d'ordinateur.

Le jeu est classé PEGI 18 : il sert de **décor culturel**. Il n'y a aucune image officielle, aucun contenu violent et on ne joue pas au jeu. Les élèves enquêtent sur ce qui se passe autour de sa sortie.

---

## 1. Lancer l'application

- **En classe, sans installation** : ouvrir `index.html` dans Chrome, Edge ou Firefox. Tout fonctionne hors ligne, polices comprises.
- **Sur eSCIENCES** : déposer le dossier complet tel quel (par exemple `/ressources/vice-check/`) et donner le lien vers `index.html`.
  - Sous WordPress, téléversez le dossier par FTP ou avec le gestionnaire de fichiers de l'hébergeur. Ne passez pas par la médiathèque, qui casse l'arborescence.
  - Vous pouvez aussi l'intégrer dans une page avec `<iframe src="/ressources/vice-check/index.html" style="width:100%;height:90vh;border:0"></iframe>`.
- Aucun serveur, aucune base de données, aucun compte.

## 2. Vie privée

- La progression est enregistrée **dans le navigateur de l'élève** (`localStorage`, clé `vicecheck.leonida.v1`). Rien n'est envoyé sur Internet.
- Le prénom est facultatif. Il ne sert qu'au bilan imprimé et reste sur l'ordinateur.
- L'atelier « phrase de passe » ne conserve **rien** : le champ est vidé à la validation.
- Pour effacer un poste : Paramètres ⚙️ → « Effacer ma progression », ou Espace enseignant → « Réinitialiser ».
- ⚠️ Avec une session Windows partagée et le même navigateur, deux élèves partagent la même sauvegarde. Le bouton « Nouvelle partie » permet de repartir à zéro.

## 3. Structure

```
index.html          page unique
css/style.css       direction artistique (variables en tête de fichier)
js/visuals.js       illustrations SVG originales (scènes, carte, schémas, faux site)
js/data.js          ← TOUS LES CONTENUS : textes, réponses, indices, explications
js/app.js           moteur (HUD, étoiles, sauvegarde, exercices, bilan)
fonts/              Inter (licence SIL OFL, voir OFL-Inter.txt)
```

## 4. Modifier un contenu (`js/data.js`)

Chaque mission contient une liste `steps`. Chaque étape a un `type` :

| type | usage | champs principaux |
|---|---|---|
| `story` | messages sur le téléphone | `messages[{from, text}]`, `cta`, `note{official, fictional}` |
| `learn` | fiche notion en diapositives | `id`, `title`, `slides[{visual, html}]` |
| `choice` | choix simple ou multiple | `options[{id, html, correct, fb}]`, `multi` |
| `sort` | classer dans des catégories | `bins[]`, `items[{html, bin, fb}]` (`bin` peut être une liste : plusieurs réponses acceptées) |
| `order` | remettre dans l'ordre | `items[]`, `rules[{before, after, msg}]` ou `{first, within, msg}` (plusieurs ordres acceptés) |
| `inspect` | repérer des indices sur un faux site | `targets{}`, `decoys{}`, `need` |
| `space` | gérer l'espace de stockage | `capacity`, `need`, `items[]`, `destinations{}` |
| `branch` | scénario à embranchements | `nodes{ id: {scene, text, choices[{text, correct, fb, next}]}}` |
| `toggles` | paramètres de confidentialité | `settings[{label, expect: true/false/null}]` (`null` = libre) |
| `password` | atelier phrase de passe | `minLength`, `minWords`, `forbidden[]` |
| `input` | calcul ou réponse tapée | `fields[{kind: number/text/duration/hours, value, tol, accept[]}]` (`hours` : heures à virgule, avec conversion en h et min affichée à côté), `wrong{}` (messages pour erreurs typiques) |

Champs communs aux exercices : `prompt`, `skill` (compétence suivie dans le bilan), `notion` (fiche proposée en cas d'erreur), `hints[]` (indices progressifs), `success` (explication finale).

Les propositions (`choice`, `branch`, `sort`, `order`) sont mélangées à chaque affichage : ne faites jamais référence à « la réponse A » dans un texte.

**Fiches mémo du bilan** (« À retenir ») : dans `memo`. Chaque fiche a une `mission` (elle se débloque quand cette mission est réussie), une `notion` (fiche à relire), un `icon`, une `color`, un petit schéma `visual` (HTML), 2 ou 3 `points` courts et une version texte `print` pour le bilan imprimé.

**Questions de piratage** : dans `hack`, en bas du fichier. `seconds` (temps de réponse), `win` (prime si réussite), `loss` (perte maximale si échec), puis `questions[{id, notion, q, options[{t, ok}], why}]`. Le champ `notion` est l'`id` d'une fiche `learn` : la question n'est posée que si l'élève a déjà vu cette fiche.

Après une modification, rechargez la page. Si un élève a déjà une sauvegarde, les nouvelles missions s'ajoutent automatiquement.

## 5. Mécaniques

- **Étoiles de recherche** : +1 par erreur, −1 par indice consulté ou par correction réussie. Après 3 essais, une « solution expliquée » est proposée et signalée dans le bilan.
- **Piratage à 5 étoiles** : les Requins « piratent » l'ordinateur. L'élève lance la contre-attaque quand il est prêt, puis a 40 secondes pour répondre à une question sur une notion déjà vue. Réussite : +150 $. Échec ou temps écoulé : jusqu'à −300 $ (jamais sous zéro), avec la bonne réponse expliquée. Dans les deux cas, les étoiles retombent à zéro.
- **Portefeuille** fictif : chaque exercice réussi rapporte 200 $ (250 pour un cadenas), moins 30 %, 55 % ou 75 % selon le nombre d'erreurs, moins 15 $ par indice, plus un bonus de rapidité jamais affiché comme un chronomètre (+60 ou +25, seulement sans erreur). Une solution affichée ne rapporte rien. En fin de mission : prime (récompense de la mission, réduite selon les erreurs) + 300 $ si 0 étoile + bonus d'exploration.
- **Rejouer** : une mission terminée peut être rejouée (depuis la carte ou le bilan). Seul le meilleur score compte, le portefeuille ne peut donc pas baisser.
- **Horloge** : l'heure avance de quelques minutes à chaque étape et d'une minute par erreur, sans jamais dépasser le début de la mission suivante. Minuit à la fin de la finale.
- **Carnet** : toutes les notions vues restent consultables.
- **Mission bonus** (temps de téléchargement) débloquée après la mission 1. L'élève la fait quand il veut, mais elle est obligatoire avant la finale (la finale reste verrouillée tant qu'elle n'est pas réussie).
- **Bilan** : missions (avec Parfait / Bien / À rejouer et un bouton pour rejouer), badges, compétences (Maîtrisé / À consolider / À retravailler, calculé par exercice), notions à retenir et bilan imprimable.
- **Accessibilité** : utilisable entièrement au clavier, option « Réduire les animations » (activée d'office si le système la demande), option « Texte plus grand », information jamais donnée par la couleur seule (✔ ✘ + texte).

## 6. Liens avec le programme

Rattachements établis à partir de l'annexe « Attendus en lien avec les S – SF – C » (programme FMTTN, volet N, fiches 3.3 et 3.6). Le détail par mission est dans **Espace enseignant** (écran titre).
Selon cette annexe, l'ordre de grandeur ko → To est un attendu de fin de parcours (S3) et la fiabilité des sources est travaillée en S2 : ces notions sont donc abordées en **découverte** ou en **anticipation**.
Vérifiez les codes S/SF/C exacts dans votre référentiel et votre programme.

## 7. Crédits

Parcours pédagogique **non officiel**, sans lien avec Rockstar Games ni Take-Two Interactive. *Grand Theft Auto*, *GTA VI*, *Vice City* et *Leonida* sont des marques de Take-Two Interactive : elles sont citées uniquement pour décrire un phénomène d'actualité. Toutes les illustrations sont des créations originales en SVG. Les personnages, sites, liens et publications sont fictifs.
Faits officiels vérifiés le 17/11/2026 (sources dans l'Espace enseignant).
