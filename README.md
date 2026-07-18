# 🍰 Bakery — Onlayn tort kataloqu (MVP)

Müştəri qeydiyyatı, səbət və onlayn ödəniş **yoxdur**. Müştəri kataloqa baxır,
məhsulun detalını açır və WhatsApp/Telegram düyməsi ilə sifarişi çat üzərindən
tamamlayır. JWT login və məhsul CRUD **yalnız admin paneli** üçündür.

```
Bakery/
├── backend/    # NestJS + TypeORM + PostgreSQL  → :4000
├── frontend/   # Öndəki sayt (almanca/ingiliscə) → :3000
└── admin/      # İdarəetmə paneli, ayrıca tətbiq  → :3002
```

Admin paneli **ayrıca Next.js tətbiqidir**: saytdan ona heç bir link yoxdur,
öz portunda işləyir və ayrıca deploy olunur. Hər üçü eyni backend-ə bağlanır.


## API

| Metod  | Endpoint                  | Qoruma   | Təsvir                       |
| ------ | ------------------------- | -------- | ---------------------------- |
| POST   | `/api/auth/login`         | —        | JWT token qaytarır           |
| GET    | `/api/auth/me`            | JWT      | Token yoxlaması              |
| GET    | `/api/products`           | —        | Yalnız `is_active: true`     |
| GET    | `/api/products/:id`       | —        | Məhsul detalı                |
| GET    | `/api/products/admin/all` | JWT      | Gizlilər də daxil            |
| POST   | `/api/products`           | JWT      | Yeni məhsul                  |
| PUT    | `/api/products/:id`       | JWT      | Yeniləmə                     |
| DELETE | `/api/products/:id`       | JWT      | Silmə                        |

## İşə salma

**Backend**

```bash
cd backend
cp .env.example .env          # DB məlumatlarını doldurun
npm install
npm run seed                  # cədvəlləri qurur + ilk admini yaradır
npm run seed:products         # 6 nümunə tort əlavə edir (istəyə bağlı)
npm run start:dev             # http://localhost:4000/api
```

**Frontend**

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

**Admin paneli**

```bash
cd admin
cp .env.local.example .env.local
npm install
npm run dev                   # http://localhost:3002
```

Giriş: `http://localhost:3002/login` (`.env`-dəki ADMIN_USERNAME / ADMIN_PASSWORD).

## Konfiqurasiya

Brend adı, WhatsApp nömrəsi və sosial linklər tək mərkəzdən idarə olunur:
[app.config.ts](frontend/src/config/app.config.ts). Dəyərlər `.env.local`-dan
oxunur (`NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_WHATSAPP_NUMBER` və s.), env yoxdursa
default-lar işləyir.

```tsx
import { appConfig, buildWhatsAppLink } from '@/config/app.config';

<h1>{appConfig.name}</h1>
<a href={buildWhatsAppLink(product.name)}>WhatsApp ilə sifariş</a>
```

## Dil

Saytdakı bütün istifadəçi mətnləri **almancadır** (`<html lang="de">`), backend-in
xəta mesajları da daxil — çünki onlar birbaşa UI-da göstərilir. Kod şərhləri
**ingiliscədir**. Yeni komponent yazanda bu ayrımı saxlayın.

## Rəng palitrası

`primary` #452D19 (dark chocolate) · `secondary` #F5EBDD (beige/cream) ·
`accent` #C67C3C (warm caramel) · `surface` #FBF6EF · `ink` #2E1D10.
Tam şkala üçün [tailwind.config.js](frontend/tailwind.config.js).
