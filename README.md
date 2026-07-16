# Sales & Inventory Management System — Frontend

A React dashboard for the Sales & Inventory Management System, built to pair with the backend API.

## Features

- **Login** — JWT-based authentication against the backend
- **Dashboard** — today's sales total, transaction count, low-stock alerts, and a top-selling-products chart
- **Inventory** — full product list with stock levels; admins can add, edit, and delete products
- **Point of Sale** — search products, build a cart, complete a sale (stock deducts automatically on the backend), and get a printable-style receipt
- **Sales History** — browse past transactions with date-range filtering

## Tech Stack

- **React** (via Vite)
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **Recharts** for the dashboard chart
- **Axios** for API calls
- **Lucide React** for icons

## Design Notes

The visual language borrows from physical retail artifacts — receipt paper, ledger sheets, and price tags — rather than a generic SaaS admin template. Monospace type is used for anything numeric (prices, SKUs, quantities) to reflect the precision inventory data demands. Completing a sale renders an actual perforated-edge receipt instead of a plain toast notification.

## Getting Started

### 1. Make sure the backend is running first
This frontend expects the API at `http://localhost:5000` (proxied through `/api` in development — see `vite.config.js`).

### 2. Install dependencies
```bash
npm install
```

### 3. Run the dev server
```bash
npm run dev
```

Visit `http://localhost:5173`.

### 4. Log in
Use the account you registered via the backend's `/api/auth/register` endpoint (or Thunder Client/Postman) to log in here.

## Project Structure

```
src/
├── api/            # Axios calls to the backend (auth, products, sales)
├── context/        # AuthContext — global user/token state
├── components/     # Layout (sidebar), ProtectedRoute
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx      # Inventory CRUD
│   ├── Sales.jsx          # Point-of-sale / cart / receipt
│   └── SalesHistory.jsx
└── index.css        # Tailwind v4 theme tokens (colors, fonts)
```

## Build for Production

```bash
npm run build
```

Output goes to `dist/` — deployable to Vercel, Netlify, or any static host.

## Setup Journey & Notes

Compared to the backend (see [sales-inventory-backend](https://github.com/SusaineRico/sales-inventory-backend) for that saga), getting the frontend running was fairly smooth. A couple of things worth noting:

### Tailwind CSS v4 setup differs from v3
Following older tutorials, I initially tried `npx tailwindcss init -p` to generate a `tailwind.config.js` — this failed with `could not determine executable to run`. Turned out the installed version was Tailwind v4, which uses a different setup entirely: no config file generation step, and configuration happens via a `@theme` block directly in CSS instead of a JS config file. Also uses a dedicated Vite plugin (`@tailwindcss/vite`) rather than PostCSS.

**Lesson:** always check which major version a tool installed before following a tutorial — breaking changes between major versions (like Tailwind v3 → v4) can make old instructions fail in confusing ways.

### CSS `@import` order
Got a build warning: `@import rules must precede all rules aside from @charset and @layer statements`. This was because I had the Google Fonts `@import` listed *after* the Tailwind `@import` in `index.css`. CSS requires all `@import` statements to come first in a file — fixed by reordering them.

### Running frontend and backend together
Since this is a separate app from the backend (different `package.json`, different dev server), I run both at once using two terminal tabs in the same VSCode window, with both project folders added to one multi-root workspace (`File → Add Folder to Workspace`). The frontend's `vite.config.js` proxies `/api` requests to `http://localhost:5000` in development, so the backend needs to already be running before the frontend can successfully log in or fetch data.

### Key takeaways
- Check package major versions before following setup guides — Tailwind v3 vs v4 instructions are not interchangeable
- CSS `@import` statements are order-sensitive
- A multi-root VSCode workspace is a clean way to develop two related-but-separate apps (frontend/backend) side by side without juggling multiple windows