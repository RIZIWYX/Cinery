# 🎬 CINERY


🌐 **Démo en ligne** : https://cinery-riziwyx.vercel.app/
Cinery est une plateforme web de découverte cinématographique permettant d'explorer des films, séries et animés, de rechercher des contenus et de gérer une liste personnelle.

Le projet a été développé avec une approche full-stack moderne en utilisant Next.js, React, TypeScript, PostgreSQL et Prisma.

> ⚠️ Cinery est une plateforme de découverte et de gestion de contenus. Elle ne permet pas de regarder directement les films ou séries.

## ✨ Fonctionnalités

### 🎥 Découverte

- Page d'accueil présentant différents contenus
- Exploration de films, séries et animés
- Consultation des informations détaillées d'un film
- Affichage du casting
- Accès aux bandes-annonces
- Affichage des plateformes permettant de regarder un contenu

### 🔎 Recherche

- Recherche de contenus
- Affichage des résultats sous forme de grille
- Accès à la page détaillée de chaque film

### 👤 Authentification

- Connexion utilisateur
- Gestion des sessions
- Gestion des comptes associés à un utilisateur
- Authentification avec NextAuth

### 📚 Listes personnelles

Chaque utilisateur connecté peut gérer ses propres listes :

- ❤️ Favoris
- 👁️ Déjà vus
- 🔖 À regarder

Un même film peut être présent dans plusieurs catégories.

Les films sont enregistrés avec leur date d'ajout afin de conserver un ordre chronologique.

### 👤 Profil

- Accès au profil utilisateur
- Gestion des contenus enregistrés
- Informations liées au compte

## 🖥️ Pages principales

| Route | Description |
|---|---|
| `/` | Page d'accueil |
| `/login` | Connexion |
| `/search` | Recherche de contenus |
| `/movie/[id]` | Détails d'un film |
| `/lists` | Listes personnelles |
| `/profile` | Profil utilisateur |
| `/api/auth/[...nextauth]` | API d'authentification |

## 🛠️ Technologies utilisées

### Front-end

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### Back-end

- Next.js App Router
- Server Actions
- API REST
- NextAuth

### Base de données

- PostgreSQL
- Prisma ORM

### API externe

- TMDB API

### Outils

- Git
- GitHub
- ESLint
- VS Code

## 🏗️ Architecture

```text
cinery/
│
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   │
│   ├── lists/
│   │   └── page.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── movie/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── profile/
│   │   └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── CastCard.tsx
│   ├── LandingPage.tsx
│   ├── MovieActions.tsx
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   ├── MovieRow.tsx
│   ├── NavLinks.tsx
│   ├── SearchBar.tsx
│   ├── TrailerModal.tsx
│   ├── UserMenu.tsx
│   └── WatchProviders.tsx
│
├── lib/
│   ├── actions.ts
│   ├── auth.ts
│   └── tmdb.ts
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│   ├── header.png
│   ├── icones.png
│   ├── inscription.png
│   ├── logo-nom.png
│   └── logo.png
│
├── next.config.ts
├── package.json
├── prisma.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── README.md
````

## 🗄️ Base de données

Cinery utilise PostgreSQL avec Prisma ORM.

Le schéma contient les modèles nécessaires à l'authentification, aux sessions et à la gestion des listes personnelles.

### User

Représente un utilisateur.

```text
User
├── id
├── name
├── email
├── emailVerified
├── image
└── createdAt
```

Un utilisateur peut avoir plusieurs comptes d'authentification, sessions et films enregistrés.

### Account

Stocke les comptes d'authentification associés à un utilisateur.

### Session

Gère les sessions des utilisateurs.

### VerificationToken

Gère les tokens de vérification.

### UserMovie

Associe un utilisateur à un film.

```text
UserMovie
├── id
├── userId
├── movieId
├── status
└── addedAt
```

Les statuts disponibles sont :

```text
FAVORITE
WATCHED
TO_WATCH
```

Une contrainte d'unicité empêche d'enregistrer plusieurs fois le même film dans la même catégorie pour un utilisateur.

## 🔐 Gestion des listes

La gestion des listes est réalisée avec des Server Actions Next.js.

Lorsqu'un utilisateur ajoute ou retire un film :

1. La session est vérifiée.
2. L'utilisateur est recherché dans la base de données.
3. Le système vérifie si le film existe déjà dans la catégorie sélectionnée.
4. Si le film existe, il est retiré.
5. Sinon, il est ajouté.
6. Les pages concernées sont revalidées.

La logique est centralisée dans :

```text
lib/actions.ts
```

Un film peut également avoir plusieurs statuts simultanément, par exemple :

```text
FAVORITE + WATCHED
```

## 🎨 Interface

Cinery utilise une interface sombre, minimaliste et inspirée des plateformes cinématographiques modernes.

### Palette

| Couleur         | Code      |
| --------------- | --------- |
| Noir profond    | `#090909` |
| Gris foncé      | `#1A1A1A` |
| Bleu électrique | `#3772FF` |
| Blanc           | `#FFFFFF` |

Le bleu électrique est utilisé comme couleur d'accent pour les éléments interactifs et l'identité visuelle de Cinery.

## 📱 Responsive Design

L'interface est adaptée aux différentes tailles d'écran :

* 💻 Ordinateur
* 📱 Mobile
* 📟 Tablette

Tailwind CSS est utilisé pour gérer le responsive design et la mise en page.

## ⚙️ Installation

### 1. Cloner le projet

```bash
git clone https://github.com/VOTRE_USERNAME/cinery.git
cd cinery
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```env
DATABASE_URL="votre_url_postgresql"
AUTH_SECRET="votre_secret"
TMDB_API_KEY="votre_cle_tmdb"
```

### 4. Générer Prisma

```bash
npx prisma generate
```

### 5. Appliquer les migrations

Pour le développement :

```bash
npx prisma migrate dev
```

Pour la production :

```bash
npx prisma migrate deploy
```

### 6. Lancer le projet

```bash
npm run dev
```

Le projet sera disponible sur :

```text
http://localhost:3000
```

## 🚀 Scripts disponibles

| Commande                    | Description                              |
| --------------------------- | ---------------------------------------- |
| `npm run dev`               | Lance le serveur de développement        |
| `npm run build`             | Compile l'application                    |
| `npm run start`             | Lance l'application en production        |
| `npm run lint`              | Vérifie le code avec ESLint              |
| `npx prisma generate`       | Génère le client Prisma                  |
| `npx prisma migrate dev`    | Applique les migrations en développement |
| `npx prisma migrate deploy` | Applique les migrations en production    |

## 🔑 Variables d'environnement

```env
DATABASE_URL=
AUTH_SECRET=
TMDB_API_KEY=
```

### DATABASE_URL

URL de connexion à la base de données PostgreSQL.

### AUTH_SECRET

Clé secrète utilisée pour sécuriser l'authentification et les sessions.

### TMDB_API_KEY

Clé permettant d'accéder aux données de l'API TMDB.

> Les variables d'environnement ne doivent jamais être publiées dans le dépôt Git.

## 🌐 Déploiement

Cinery peut être déployé sur une plateforme compatible avec Next.js.

La base de données PostgreSQL peut être hébergée séparément et connectée à l'application grâce à la variable `DATABASE_URL`.

Les variables d'environnement doivent être configurées dans l'environnement de production avant le déploiement.

## 🔒 Sécurité

Le projet utilise plusieurs mécanismes pour protéger les données utilisateur :

* Vérification de la session côté serveur
* Accès aux listes limité à l'utilisateur connecté
* Utilisation de Prisma pour les requêtes à la base de données
* Variables sensibles stockées dans l'environnement
* Contraintes d'unicité au niveau de la base de données
* Gestion des sessions avec NextAuth

## 📂 Organisation du code

### `app/`

Contient les pages et routes de l'application avec le système App Router de Next.js.

### `components/`

Contient les composants React réutilisables :

* `MovieCard`
* `MovieGrid`
* `MovieRow`
* `SearchBar`
* `MovieActions`
* `TrailerModal`
* `UserMenu`
* `CastCard`
* `WatchProviders`

### `lib/`

Contient la logique applicative :

```text
actions.ts  → gestion des listes utilisateur
auth.ts     → authentification et Prisma
tmdb.ts     → communication avec TMDB
```

### `prisma/`

Contient le schéma PostgreSQL et les migrations Prisma.

### `public/`

Contient les ressources statiques :

* logos
* icônes
* images
* éléments graphiques

## 🎯 Objectifs du projet

Ce projet m'a permis de mettre en pratique :

* Le développement full-stack
* Next.js et son App Router
* React et TypeScript
* PostgreSQL
* Prisma ORM
* L'authentification utilisateur
* Les Server Actions
* La consommation d'une API externe
* Le responsive design
* La conception d'une interface moderne
* L'organisation d'un projet web
* La gestion des données utilisateur

## 🧰 Stack technique

```text
Next.js 16
React 19
TypeScript
Tailwind CSS 4
PostgreSQL
Prisma 7
NextAuth 5
TMDB API
ESLint
Git / GitHub
```

## 👨‍💻 Auteur

**Rayane Graïne**

Étudiant en informatique à l'Université de Rouen Normandie.

Projet réalisé dans le cadre de mon parcours en développement informatique et destiné à mon portfolio.

## 📄 Licence

Projet personnel réalisé à des fins d'apprentissage et de portfolio.

