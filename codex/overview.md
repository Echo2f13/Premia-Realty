# Premia Goldclass Estate - Codex Blueprint

This blueprint captures the current behaviour, architecture, and conventions inside the luxury real-estate experience so collaborators (and Codex) can orient quickly.

---

## Project Snapshot
- **Framework**: React 19 on Vite 7 with JSX modules
- **Styling**: Tailwind CSS 3 plus custom glassmorphism utilities declared in `src/index.css`
- **State & Data**: Local React state, React Context for auth, Firestore realtime streams, JSON fallbacks
- **Routing**: React Router DOM v7 with nested routes supplied by `App.jsx`
- **Icons**: `lucide-react`
- **Backend**: Firebase Auth and Firestore (modular v9 SDK)
- **Build Tooling**: ESLint flat config, PostCSS and Tailwind, Vite scripts (`dev`, `build`, `preview`, `lint`)

### Useful Commands
- `npm install` - install dependencies
- `npm run dev` - launch Vite dev server at http://localhost:5173
- `npm run build` - generate production build in `dist/`
- `npm run preview` - serve the production build locally
- `npm run lint` - run ESLint (must pass before shipping)

---

## Directory Guide
```
premia_goldclass_estate/
  codex/
    overview.md            - this document
  public/
    favicon.ico            - PG roundel displayed in browser tab
    assets/                - curated photography referenced by components
      hero-skyline-B9OuM1TT.jpg
      property-1-BYXSAaID.jpg
      property-2-C4DbY7wx.jpg
      property-3-zqLbcdWX.jpg
  src/
    App.jsx                - router shell with global layout
    main.jsx               - React bootstrap plus AuthProvider wrapping App
    index.css              - Tailwind layer config plus custom utility classes
    firebase.js            - Firebase app initialisation, exports `auth` and `db`
    components/
      Navbar.jsx           - glass navigation bar with auth-aware CTA and mobile drawer
      Footer.jsx           - brand footer and concierge contact roll-up
      HeroSection.jsx      - hero banner with lifestyle stats and search capsule (UI-only)
    context/
      AuthContext.jsx      - provides `user`, `profile`, `signOut`, and loading state
    hooks/
      useAuth.js           - thin hook re-exporting the Auth context
    data/
      properties.json      - static collection/listing seed data
      firebaseService.js   - Firestore CRUD plus Auth helpers reused across pages
    pages/
      Home.jsx             - hero and exclusive collection gallery
      Properties.jsx       - Firestore-backed listings, save hearts, concierge modules
      About.jsx            - legacy, philosophy, metrics, founder letter
      Contact.jsx          - concierge form writing to Firestore and info tiles
      Login.jsx            - auth form accepting email or phone identifiers
      Signup.jsx           - onboarding with email/phone toggle and validation
      Account.jsx          - authenticated dashboard (profile, saved, concierge history)
  .env                     - Vite Firebase secrets (never commit)
  package.json             - npm scripts and dependency manifest
  tailwind.config.js       - theme, palette, animations, container rules
  vite.config.js           - Vite root config (React plugin)
```

---

## Feature Highlights
- **Luxury Landing (Home)**: `HeroSection` overlays multi-gradient art direction, mock search filters (non-functional), animated stats, and CTAs linking deeper into the funnel. Exclusive property cards animate on hover with faux actions.
- **Dynamic Portfolio (Properties)**:
  - Fetches Firestore `properties` on mount; gracefully falls back to `properties.json` when empty or offline.
  - Authenticated guests can toggle a gold heart to persist favourites via `users/{uid}/savedProperties`.
  - Portfolio hero, filter capsule (UI only), concierge perks grid, and market insight card enrich the narrative.
- **Concierge Contact (Contact)**: Inquiry form autocompletes name, email, and phone for logged-in users and posts to `contacts` plus the user subcollection (`contactRequests`). Lifestyle toggles (`virtualWalkthrough`, `twilightPreview`) captured as booleans.
- **Private Suite (Account)**:
  - Guards route and redirects unauthenticated visitors back to `Login`.
  - Streams saved residences and concierge history in realtime using Firestore listeners.
  - Profile editor updates Firestore document `users/{uid}` with optimistic messaging.
  - Sign-out action returns guests to landing page.
- **Auth Surfaces (Login/Signup)**:
  - Both pages redirect authenticated users to their intended destination.
  - Signup accepts email or phone; phone values convert into alias emails (`phone_{digits}@premia-users.local`) before creating Firebase accounts.
  - Forms enforce password confirmation, basic validation, and display friendly status errors.
- **Global Chrome**: `Navbar` swaps the primary CTA between `Sign In` and `My Account`, locks body scroll when the mobile drawer is opened, and reacts to scroll depth for blurred background. `Footer` reiterates contact channels with luxury branding.

---

## Data and Firebase Flow
- `src/firebase.js` bootstraps the Firebase app using Vite env vars: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
- `firebaseService.js` centralises Firestore operations:
  - `addProperty`, `getAllProperties` manage portfolio inventory.
  - `addContactForm` stores enquiries and, when `userId` is provided, mirrors a note to the user's private contact log.
  - `signUpCustomer`, `signInCustomer`, `signOutCustomer`, `signInAdmin` wrap Firebase Auth APIs.
  - `subscribeToUserProfile`, `subscribeToSavedProperties`, `subscribeToContactRequests` expose realtime listeners consumed by `AuthContext` and account surfaces.
  - `savePropertyForUser` normalises IDs (prefers `id`/`slug`/slugified `title`) before writing.
- `properties.json` remains the local seed to populate UI on first load or when Firestore is empty; update alongside remote data to avoid UI surprises.

### Firestore shape (expected collections)
```
properties
contacts
users/{uid}
users/{uid}/savedProperties
users/{uid}/contactRequests
```

Security rules (see `firestore.rules`) restrict writes to authenticated owners and admin custom claims.

---

## Styling System
- Tailwind configured with bespoke silk palette values such as `luxury-black`, `gold-primary`, and `platinum-pearl`.
- `index.css` layers global typography (Playfair Display, Inter), gradient utilities (`bg-gradient-gold`), glass treatments (`glass-card`, `shadow-glass`), and motion helpers (`animate-fade-in`, `animate-slide-up`, `animate-scale-in`).
- Components lean on uppercase tracking plus serif display to maintain brand aesthetic; follow existing patterns for new UI.

---

## Development Notes
- Wrap all consumer components in `AuthProvider` so `useAuth` works as expected.
- When adding Firestore listeners, unsubscribe on cleanup to avoid memory leaks (pattern already used in `AuthContext`, `Account`, `Properties`).
- Mock search and filter controls are present but not wired; future enhancements can hook these to Firestore queries.
- Prices in `properties.json` are placeholder strings; normalise formatting when sourcing real data.
- Maintain accessibility: interactive elements use semantic buttons, alt text, and aria labels. Continue this discipline for future work.

### QA Checklist
- Configure `.env` before running locally; missing Firebase keys will throw during app initialisation.
- Verify auth flows end-to-end (signup, login, logout) and saved property toggles whenever Firebase security rules change.
- After modifying Tailwind config or `index.css`, restart Vite so the JIT picks up new classes.
- Run `npm run lint` prior to commits; ESLint config mirrors the Vite React template with hooks checks enabled.

---

## Roadmap and Ideas
1. Seed Firestore `properties` so the portfolio is fully dynamic.
2. Introduce server-side price and area filters for the Properties search capsule.
3. Add password reset plus email verification flows (Firebase Auth helpers ready).
4. Build an admin suite to review `contacts` and manage featured listings.
5. Externalise marketing copy and metrics to a CMS for easier iteration.

---

_Last updated: 2025-10-06 16:00 IST_
