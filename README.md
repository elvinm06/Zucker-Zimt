# 🍰 Bakery — Online cake catalog (MVP)

There is **no** customer registration, cart or online payment. A customer browses
the catalog, opens a product detail page and completes the order over chat via
the WhatsApp/Telegram button. JWT login and product CRUD exist **only for the
admin panel**.

```
Bakery/
├── backend/    # NestJS + TypeORM + PostgreSQL   → :4000
├── frontend/   # Public site (German/English)    → :3000
└── admin/      # Admin panel, separate app       → :3002
```

The admin panel is a **separate Next.js app**: the site links to it nowhere, it
runs on its own port and is deployed separately. All three talk to the same backend.


## API

| Method | Endpoint                  | Auth | Description                  |
| ------ | ------------------------- | ---- | ---------------------------- |
| POST   | `/api/auth/login`         | —    | Returns a JWT token          |
| GET    | `/api/auth/me`            | JWT  | Token validation             |
| GET    | `/api/products`           | —    | Only `is_active: true`       |
| GET    | `/api/products/:id`       | —    | Product detail               |
| GET    | `/api/products/admin/all` | JWT  | Includes hidden products     |
| POST   | `/api/products`           | JWT  | Create product               |
| PUT    | `/api/products/:id`       | JWT  | Update                       |
| DELETE | `/api/products/:id`       | JWT  | Delete                       |

## Getting started

**Backend**

```bash
cd backend
cp .env.example .env          # fill in your database credentials
npm install
npm run seed                  # creates the tables + the first admin user
npm run seed:products         # adds 6 sample cakes (optional)
npm run start:dev             # http://localhost:4000/api
```

**Frontend**

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

**Admin panel**

```bash
cd admin
cp .env.local.example .env.local
npm install
npm run dev                   # http://localhost:3002
```

Login: `http://localhost:3002/login` (ADMIN_USERNAME / ADMIN_PASSWORD from `.env`).

## Configuration

The brand name, WhatsApp number and social links are managed from a single place:
[app.config.ts](frontend/src/config/app.config.ts). Values are read from
`.env.local` (`NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, etc.); when an
env var is missing, the defaults apply.

```tsx
import { appConfig, buildWhatsAppLink } from '@/config/app.config';

<h1>{appConfig.name}</h1>
<a href={buildWhatsAppLink(product.name)}>Order via WhatsApp</a>
```

## Language

All user-facing copy on the site is **German** (`<html lang="de">`), including the
backend's error messages — because those are shown directly in the UI. Code comments
are **English**. Keep this split when writing new components.

## Color palette

`primary` #452D19 (dark chocolate) · `secondary` #F5EBDD (beige/cream) ·
`accent` #C67C3C (warm caramel) · `surface` #FBF6EF · `ink` #2E1D10.
See [tailwind.config.js](frontend/tailwind.config.js) for the full scale.
