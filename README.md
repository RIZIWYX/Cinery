# Cinery

[![Démo](https://img.shields.io/badge/d%C3%A9mo-cinery--riziwyx.vercel.app-3772FF)](https://cinery-riziwyx.vercel.app/)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-336791)
[![Licence MIT](https://img.shields.io/badge/licence-MIT-green)](LICENSE)

Catalogue de films, séries et animés construit avec Next.js et l'API TMDB. On y cherche des contenus, on consulte leur fiche (casting, bande-annonce, plateformes de diffusion) et, une fois connecté avec Google, on gère ses propres listes.

**Démo en ligne : https://cinery-riziwyx.vercel.app/**

## Fonctionnalités

- **Découverte** : films, séries et animés, fiche détaillée, casting, bande-annonce, plateformes où regarder
- **Recherche** avec résultats en grille
- **Connexion Google** (OAuth2 avec NextAuth), sessions stockées en base
- **Listes personnelles** : Favoris, Déjà vus, À regarder. Un même film peut être dans plusieurs listes.

## Stack

| Couche | Outils |
|---|---|
| Front-end | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 |
| Back-end | Server Actions, NextAuth |
| Données | PostgreSQL, Prisma ORM |
| API externe | TMDB |

## Sécurité

- Chaque action sur les listes vérifie la session **côté serveur** avant de toucher à la base.
- Les requêtes passent par Prisma : aucune requête SQL construite à la main.
- Un utilisateur ne voit et ne modifie que ses propres listes.
- Une contrainte d'unicité `(utilisateur, film, statut)` empêche les doublons au niveau de la base.
- Les secrets sont dans les variables d'environnement, jamais dans le dépôt.

## Modèle de données

```text
User ──< UserMovie (movieId, status : FAVORITE | WATCHED | TO_WATCH, addedAt)
User ──< Account, Session      (gérés par NextAuth)
```

## Lancer le projet en local

```bash
git clone https://github.com/RIZIWYX/Cinery.git
cd Cinery
npm install
```

Créer un fichier `.env.local` à la racine :

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="une_chaine_aleatoire"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
TMDB_ACCESS_TOKEN="..."
```

Puis :

```bash
npx prisma migrate dev
npm run dev
```

L'application est disponible sur http://localhost:3000.

## Organisation du dépôt

| Dossier | Contenu |
|---|---|
| `app/` | Pages (accueil, recherche, fiche film, listes, profil) et route d'authentification |
| `components/` | Composants React (cartes, grilles, bande-annonce, menu) |
| `lib/` | Authentification, appels TMDB, Server Actions des listes |
| `prisma/` | Schéma et migrations de la base |

## Auteur

Rayane Graïne - [GitHub](https://github.com/RIZIWYX) - [LinkedIn](https://linkedin.com/in/rayane-graine)

## Licence

Distribué sous licence MIT, voir [LICENSE](LICENSE).
