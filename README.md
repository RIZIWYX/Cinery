# Cinery

> Plateforme de catalogue de films type Netflix, avec comptes utilisateurs et listes personnalisées (favoris, déjà vus, à voir).

**🚧 Projet en cours de développement.** Ce README documente la stack technique choisie, l'architecture cible et la roadmap des sprints.

---

## 🎯 Objectif du projet

Construire une application web moderne pour explorer un catalogue de films, créer un compte, et gérer ses propres listes (favoris, déjà vus, à voir). Le projet a un double objectif :

1. **Apprentissage** : maîtriser une stack frontend / backend moderne (Next.js, TypeScript, Tailwind, Prisma).
2. **Portfolio** : produire un projet déployé en ligne, avec authentification, base de données et consommation d'une API externe.

Le projet **n'implémente pas de streaming vidéo réel** : il se concentre sur le catalogue, les comptes et les listes. Les données de films proviennent de l'API publique [TMDB](https://www.themoviedb.org/documentation/api).

---

## 🛠 Stack technique

| Couche                   | Choix                       | Pourquoi                                                                 |
|--------------------------|-----------------------------|--------------------------------------------------------------------------|
| Framework                | **Next.js 15** (App Router) | Full-stack JS moderne : routing, API routes, Server Components intégrés. |
| Langage                  | **TypeScript**              | Typage statique, plus sûr et lisible que JavaScript.                     |
| Style                    | **Tailwind CSS**            | Utility-first, rapide à mettre en place, standard de l'industrie.        |
| ORM                      | **Prisma**                  | Migrations versionnées, requêtes typées, schéma déclaratif.              |
| Base de données (dev)    | **SQLite**                  | Zéro configuration en local.                                             |
| Base de données (prod)   | **PostgreSQL** (Neon)       | Hébergement gratuit, production-ready.                                   |
| Authentification         | **Auth.js (NextAuth v5)**   | OAuth (Google, GitHub) + sessions sécurisées, intégration Next native.   |
| Source des films         | **API TMDB**                | Catalogue mondial, posters HD, gratuit avec clé API.                     |
| Déploiement              | **Vercel**                  | CI/CD automatique depuis GitHub, gratuit, créateurs de Next.js.          |

---

## 📐 Architecture

```
Cinery/
├── app/                    # App Router Next.js 15
│   ├── (auth)/             # Pages d'authentification (login, signup)
│   ├── (main)/             # Pages principales (accueil, recherche)
│   │   ├── page.tsx        # Catalogue d'accueil
│   │   ├── search/         # Recherche
│   │   ├── movie/[id]/     # Fiche détaillée d'un film
│   │   └── lists/          # Listes personnelles (favoris, à voir...)
│   └── api/                # API Routes (endpoints REST internes)
│
├── components/             # Composants React réutilisables
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   ├── SearchBar.tsx
│   └── ...
│
├── lib/                    # Code partagé (sans UI)
│   ├── tmdb.ts             # Client API TMDB
│   ├── auth.ts             # Configuration NextAuth
│   └── db.ts               # Instance Prisma
│
├── prisma/
│   └── schema.prisma       # Schéma de la base de données
│
├── public/                 # Assets statiques (images, fonts)
│
└── README.md
```

### Modèle de données (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  lists     UserMovie[]
}

model UserMovie {
  id        String      @id @default(cuid())
  userId    String
  movieId   Int         // ID TMDB du film
  status    MovieStatus // FAVORITE | WATCHED | TO_WATCH
  addedAt   DateTime    @default(now())
  user      User        @relation(fields: [userId], references: [id])

  @@unique([userId, movieId, status])
}

enum MovieStatus {
  FAVORITE
  WATCHED
  TO_WATCH
}
```

---

## 🗺 Roadmap

### Sprint 1 — Setup du projet
- Initialiser le projet Next.js 15 avec TypeScript et Tailwind
- Configurer Prisma + SQLite
- Mettre en place la structure de dossiers
- Créer un compte TMDB et obtenir une clé API
- Variables d'environnement (`.env.local`)
- Premier déploiement sur Vercel (page vide pour valider le pipeline)

### Sprint 2 — Catalogue d'accueil
- Client API TMDB (`lib/tmdb.ts`)
- Composant `MovieCard` (poster + titre + note)
- Composant `MovieGrid` (grille responsive)
- Page d'accueil : films populaires, tendances, nouveautés
- Layout général : header, navigation, footer

### Sprint 3 — Recherche et fiche détaillée
- Barre de recherche en haut de page
- Page de résultats avec pagination
- Page film `/movie/[id]` : poster, synopsis, casting, note, bande-annonce
- Films similaires en bas de page

### Sprint 4 — Authentification
- Configuration Auth.js (NextAuth v5)
- Login OAuth (Google + GitHub)
- Gestion des sessions
- Pages protégées (middleware)
- Profil utilisateur

### Sprint 5 — Listes personnelles
- Boutons « ❤ Favori », « ✓ Vu », « 📌 À voir » sur chaque film
- Pages dédiées : `/lists/favorites`, `/lists/watched`, `/lists/to-watch`
- Persistence en base via Prisma
- Compteurs et statistiques utilisateur

### Sprint 6 (bonus) — Polish
- Mode sombre / clair
- Skeleton loaders pendant les chargements
- Optimisation des images Next.js
- Tests E2E avec Playwright
- README final avec captures d'écran

---

## 🔐 Considérations de sécurité

Étant donné que ce projet manipule des comptes utilisateurs et des données personnelles, plusieurs bonnes pratiques sont appliquées dès la conception :

- **OAuth uniquement** (pas de mots de passe stockés en clair ou hashés)
- **Validation côté serveur** de toutes les entrées utilisateur (Zod)
- **CSRF protection** via NextAuth
- **HTTPS forcé** en production (Vercel)
- **Variables d'environnement** pour toutes les clés API et secrets (jamais commitées)
- **Headers de sécurité** : Content-Security-Policy, X-Frame-Options, etc.

---

## 🚀 Démarrage rapide (dès que le Sprint 1 sera complété)

```bash
# Cloner le repo
git clone https://github.com/RIZIWYX/Cinery.git
cd Cinery

# Installer les dépendances
npm install

# Copier le fichier d'environnement et le remplir
cp .env.example .env.local
# Ajouter : TMDB_API_KEY, NEXTAUTH_SECRET, etc.

# Initialiser la base de données
npx prisma migrate dev

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:3000`.

---

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation TMDB API](https://developer.themoviedb.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Auth.js](https://authjs.dev/)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

---

## 👤 Auteur

**Rayane Graïne** — Étudiant L3 Informatique, Université de Rouen Normandie
GitHub : [@RIZIWYX](https://github.com/RIZIWYX) · LinkedIn : [rayane-graine](https://linkedin.com/in/rayane-graine)
