# Main Tasks

## Fixes
### BE fixes:

+ Search - Home and Properties page
+ Map accuracy 
+ Login - direct and quick
+ DB properties access
+ Admin - images and Metrics
+ profile user details

### UI fixes:

+ nav bar
+ Hero section
+ map colors
+ Login page
+ Signup page
+ Property cards
+ property page
+ About us and Contact us page 
+ footer
+ profile page

### Content fixes:

+ Hero section
+ Home page more content
+ About us
+ Contact us
+ footer

---
---
---
---

## Premia Goldclass Estate

Premium real-estate experience built with React, Tailwind, and Firebase. The application showcases a luxury property portfolio, concierge contact flows, and authenticated dashboards for discerning clients.

---

## Contents
- [Main Tasks](#main-tasks)
  - [Fixes](#fixes)
    - [BE fixes:](#be-fixes)
    - [UI fixes:](#ui-fixes)
    - [Content fixes:](#content-fixes)
  - [Premia Goldclass Estate](#premia-goldclass-estate)
  - [Contents](#contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Local Development](#local-development)
    - [Production Build](#production-build)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
  - [Core Modules](#core-modules)
  - [Data \& Firebase Flow](#data--firebase-flow)
  - [Development Guidelines](#development-guidelines)
  - [Roadmap](#roadmap)

---

## Features
- Hero landing with animated stats, mock search filters, and curated collection gallery.
- Properties portfolio that prefers Firestore listings and falls back to bundled JSON when offline.
- Authenticated save-hearts flow storing favourites in `users/{uid}/savedProperties`.
- Concierge contact form that auto-fills authenticated user details and persists messages to Firestore plus user-specific history.
- Account dashboard streaming saved residences and concierge conversations in realtime, with profile editing and sign-out.
- Email or phone based authentication surfaces with graceful validation and redirects.
- Responsive glassmorphism UI with Tailwind utilities, gradient accents, and lucide icons.

---

## Tech Stack
- React 19 + Vite 7
- React Router DOM 7
- Tailwind CSS 3 with custom utilities (`glass-card`, gradient helpers, motion classes)
- Firebase Auth & Firestore (modular v9 SDK)
- ESLint flat config, PostCSS, Autoprefixer
- lucide-react icon set

---

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- Firebase project configured for Web (Auth + Firestore)

### Installation
```bash
npm install
```

### Local Development
```bash
npm run dev
```
The Vite dev server runs at http://localhost:5173.

### Production Build
```bash
npm run build
```
Outputs static assets to `dist/`. To preview the built output locally:
```bash
npm run preview
```

---

## Environment Variables
Create `.env` in the project root with your Firebase configuration. Follow Vite naming (`VITE_` prefix) so values are exposed to the client bundle:
```ini
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender-id
VITE_FIREBASE_APP_ID=app-id
```
Never commit secrets to version control.

---

## Available Scripts
- `npm run dev` - start development server with HMR
- `npm run build` - bundle production artifacts
- `npm run preview` - serve the production build locally
- `npm run lint` - run ESLint across the project

---

## Core Modules
- `src/App.jsx` - router shell that wires global `Navbar`, `Footer`, and route definitions
- `src/main.jsx` - mounts React tree, wrapping `App` in `AuthProvider`
- `src/context/AuthContext.jsx` - exposes `user`, realtime Firestore profile, `signOut`, `loading`, `isAuthenticated`
- `src/hooks/useAuth.js` - convenience hook for Auth context
- `src/data/firebaseService.js` - Firestore CRUD (properties, contacts, user profiles) plus Firebase Auth helpers
- `src/data/properties.json` - static seed used when Firestore has no inventory
- `src/components/` - shared UI (glass navigation, hero, footer)
- `src/pages/` - screen-level components (Home, Properties, About, Contact, Login, Signup, Account)

---

## Data & Firebase Flow
- `src/firebase.js` initialises Firebase and exports `auth` and `db` instances.
- `Properties.jsx` loads Firestore listings via `getAllProperties`; falls back to JSON when necessary and syncs saved residences with `subscribeToSavedProperties`.
- `Contact.jsx` posts concierge forms using `addContactForm`, mirroring history to `users/{uid}/contactRequests` for authenticated users.
- `Account.jsx` guards access, streams saved residences and contact history, and updates the Firestore profile document via `updateUserProfile`.
- `Signup.jsx` accepts phone numbers, converting them to alias emails (`phone_{digits}@premia-users.local`) before account creation.

Expected Firestore collections:
```
properties
contacts
users/{uid}
users/{uid}/savedProperties
users/{uid}/contactRequests
```
Ensure Firestore rules align with these reads and writes (see `firestore.rules`).

---

## Development Guidelines
- Keep components wrapped in `AuthProvider` so `useAuth` continues to function.
- Clean up Firestore listeners on unmount (pattern illustrated in `AuthContext`, `Account`, `Properties`).
- Restart Vite when altering Tailwind config or adding new utility classes to `index.css`.
- Run `npm run lint` before commits; the ruleset enforces React hooks best practices.
- Prices inside `properties.json` are placeholder strings; adjust formatting once real data sources are connected.

---

## Roadmap
1. Seed Firestore `properties` to eliminate reliance on local JSON.
2. Wire the search capsule on Home/Properties to real Firestore queries.
3. Add password reset and email verification flows.
4. Introduce an admin workspace for approving contacts and managing listings.
5. Externalise hero copy and metrics into a CMS for faster content iteration.

---

_Last updated: 2025-10-06_
