# Premia Goldclass Estate – Codex Blueprint

This file documents the recreated React + Vite application so any teammate (or another Codex session) can understand the project at a glance.

---

## Stack
- **Framework**: React 19 with Vite 7.
- **Routing**: React Router DOM v6 style API (`BrowserRouter`, `Routes`, `Route`).
- **Styling**: Tailwind CSS 3 with custom palette and typography.
- **Build Tooling**: PostCSS + Autoprefixer, Vite config kept default.

Run commands from the project root:
- `npm install` – install dependencies (already done locally; rerun after pulling).
- `npm run dev` – launch the dev server (default http://localhost:5173).
- `npm run build` – create production bundle in `dist/`.
- `npm run preview` – preview the production bundle locally.

---

## Directory Guide
```
premia_goldclass_estate/
+-- codex/
¦   +-- overview.md  ? this document
+-- public/
¦   +-- favicon.ico  ? dark roundel with PG initials
¦   +-- logo.png     ? 512×512 brand mark used for sharing/SEO
+-- src/
¦   +-- components/
¦   ¦   +-- Navbar.jsx        ? sticky top navigation with mobile menu
¦   ¦   +-- Footer.jsx        ? site-wide footer with contact details
¦   ¦   +-- HeroSection.jsx   ? reusable hero banner with CTA buttons
¦   ¦   +-- PropertyCard.jsx  ? luxury property card with hover effects
¦   +-- pages/
¦   ¦   +-- Home.jsx          ? hero, advantages grid, featured property
¦   ¦   +-- Properties.jsx    ? listing grid using mock data
¦   ¦   +-- About.jsx         ? story, vision, mission sections
¦   ¦   +-- Contact.jsx       ? contact form + concierge details
¦   +-- data/
¦   ¦   +-- properties.json   ? mocked property entries consumed across pages
¦   +-- App.jsx               ? router layout wiring navbar/footer + routes
¦   +-- main.jsx              ? bootstraps React root and global CSS
¦   +-- index.css             ? Tailwind directives + base tokens
+-- index.html                ? font imports, meta, root mounting point
+-- tailwind.config.js        ? component paths, palette, typography, shadows
+-- postcss.config.js         ? tailwind + autoprefixer plugins
+-- vite.config.js            ? default Vite config
+-- package.json              ? project scripts + dependencies
+-- package-lock.json         ? generated lockfile (do not edit manually)
```

Node tooling (`node_modules/`) is not committed but will be recreated with `npm install`.

---

## Page Walkthrough
- **Home**: Uses `HeroSection` for the hero banner, highlights brand advantages, and showcases the first property from `properties.json` with supporting stats.
- **Properties**: Hero banner styled with background image overlay and responsive property card grid using all entries from `properties.json`.
- **About Us**: Full-bleed hero with gradient overlay, vision/mission cards, and bullet list describing differentiators.
- **Contact**: Concierge introduction, contact details, and a static form ready for backend wiring.

All pages share the `Navbar` and `Footer` via the layout in `App.jsx`.

---

## Styling Notes
- Tailwind color tokens (`background`, `surface`, `accent`, `muted`, `border`) mirror the Lovable prototype palette.
- Typography combines `Playfair Display` (headings) and `Poppins` (body) via Google Fonts loaded in `index.html`.
- Common effects: gradient hero overlay, hover scale on cards, accent glow shadow.

---

## Future Hooks
- Swap `properties.json` with API integration or CMS when ready.
- Wire the contact form to a backend endpoint and add validation/state.
- Tailwind config leaves room for more utilities (plugins array empty).

---

_Last updated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') IST_