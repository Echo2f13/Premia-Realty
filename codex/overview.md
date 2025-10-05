# Premia Goldclass Estate - Codex Blueprint

Living document describing the React + Vite project so collaborators (and Codex) can navigate the codebase quickly.

---

## Stack
- **Framework**: React 19 on Vite 7
- **Router**: React Router DOM v7
- **Styling**: Tailwind CSS 3 with a bespoke “silk” palette and gradient utilities
- **Icons**: lucide-react icon set

### Useful Commands
- `npm install` – install dependencies
- `npm run dev` – start the Vite dev server (http://localhost:5173)
- `npm run build` – production build into `dist/`
- `npm run preview` – preview the production build

---

## Directory Guide
```
premia_goldclass_estate/
  codex/
    overview.md          – this document
  public/
    favicon.ico          – PG roundel
    assets/
      hero-skyline-B9OuM1TT.jpg
      property-1-BYXSAaID.jpg
      property-2-C4DbY7wx.jpg
      property-3-zqLbcdWX.jpg
  src/
    components/
      Navbar.jsx         – glass navigation with mobile drawer
      Footer.jsx         – contact footer with brand + quick links
      HeroSection.jsx    – landing hero banner & search capsule
    data/
      properties.json    – collection + listings data sets
    pages/
      Home.jsx           – hero + curated collection
      Properties.jsx     – listings, filters, market insight
      About.jsx          – story, values, metrics
      Contact.jsx        – concierge form + info tiles
    App.jsx              – router layout wrapping navbar/footer
    main.jsx             – React bootstrap
    index.css            – Tailwind base + custom utilities
  index.html             – HTML shell + Google Fonts
  tailwind.config.js     – color tokens, animations, container options
  package.json           – scripts and dependencies
  package-lock.json      – npm lockfile
```

`node_modules/` is ignored and regenerated via `npm install`.

---

## Page Walkthrough
- **Home**: `HeroSection` renders the skyline hero with gradient overlays, filter capsule, stats, and CTA buttons. Below, `Home.jsx` showcases the three-feature “Exclusive Collection” cards using `collection` data.
- **Properties**: Hero banner with filter pills, a concierge briefing panel, market insights, and the full listings grid bound to `listings` data.
- **About**: Legacy hero, “Our Story” narrative, philosophy highlights, numeric metrics, and founder letter/house directory panels.
- **Contact**: Concierge intro with quick-access cards, metaverse highlight, and an enquiry form with city selector + options.

All routes share the glass navigation (`Navbar`) and footer (`Footer`).

---

## Styling & Effects
- Core palette defined via CSS variables in `index.css` (luxury black base, gold accents, platinum typography).
- Custom utilities (`glass-card`, `bg-gradient-gold`, `shadow-glass`, etc.) provide the silk aesthetic.
- Tailwind animations (`fade-in`, `slide-up`, `scale-in`) mirror the Lovable reference transitions.

---

## Data Sources
- `src/data/properties.json`
  * `collection` – used on Home “Exclusive Collection” cards
  * `listings` – used on Properties page grid

---

## Future Hooks
- Connect form submit handlers to backend or CRM
- Replace static selects with live filters once APIs exist
- Consider extracting stats/metrics into CMS-driven content

---

Last updated: 2025-10-05 23:45 IST