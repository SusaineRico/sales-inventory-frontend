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
