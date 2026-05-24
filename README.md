# Pawwl Ecommerce

Full-stack Pawwl ecommerce app for Hostinger Node.js deployment.

## Structure

```txt
frontend/   React + Vite storefront
backend/    Express + Prisma API
```

## Local Setup

```bash
npm install
cp backend/.env.example backend/.env
npm run prisma:generate
npm run frontend:build
npm run backend:build
```

Set `DATABASE_URL` in `backend/.env` before running migrations:

```bash
npm run prisma:migrate
npm run seed
```

## Development

Frontend:

```bash
npm run frontend:dev
```

Backend:

```bash
npm run backend:dev
```

For local frontend API calls, set `VITE_API_URL=http://localhost:4000`.

## Production

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

In production, Express serves:

- `/api/...` backend routes
- `frontend/dist` static React files
- SPA fallback routes such as `/products/:id`, `/checkout`, and `/admin`

## Product Import

The spreadsheet importer reads `Name` and `Sales Price With GST` from:

```txt
frontend/src/data/List of items for shazil.xlsx
```

Run:

```bash
npm run import:products
```

Imported products are saved as `draft` with `Uncategorized`, `0` stock, and placeholder editable metadata.

## Razorpay

Razorpay routes are intentionally placeholders for v1:

```txt
POST /api/payments/razorpay/create-order
POST /api/payments/razorpay/verify
POST /api/webhooks/razorpay
```

Enable them after product/admin/cart/checkout/order flows are stable.
