# Sanatan Diksha — Next.js 15 (App Router)

A spiritual-services platform built with Next.js 15 App Router. It supports three user roles — **Guest/Public**, **Customer**, and **Vendor (Pandit)** — each with their own layout, auth guard, and dashboard.

---

## Prerequisites

- **Node.js** 18.17 or later (required by Next.js 15)
- **npm** 9+

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_GA_ID=G-H8REM9SBYQ
```

> **Note:** The API base URL (`https://api.sanatandiksha.com/`) is currently hardcoded in `src/services/Apiconnect.js`. To make it configurable, replace the `API_URL` constant with `process.env.NEXT_PUBLIC_API_URL`.

---

## Public Assets

The templates reference static assets served from the `public/` folder. Make sure the following are present:

**`public/eduassets/`** — CSS, fonts, icons, and vendor JS libraries referenced in `src/app/layout.jsx`.

**Logos and favicons** (copy to `public/`):
- `favicon.svg`, `favicon.ico`, `favicon.png`
- `icons.svg`
- `newlogo.png`, `newwww.png` (used as the site favicon in metadata)
- `s.png`
- `Sanatan Logo-high res.png`, `Sanatan Logo.png`

---

## Folder Structure

```
src/
├── app/                          ← All routes (Next.js App Router)
│   ├── layout.jsx                ← Root layout: providers, global CSS, fonts
│   ├── not-found.jsx             ← Global 404 page
│   │
│   ├── (public)/                 ← Public pages (Header + Footer wrapper)
│   │   ├── layout.jsx            ← Renders Header/Footer (hidden on /investoropportunity)
│   │   ├── page.jsx              ← Home /
│   │   ├── signin/page.jsx
│   │   ├── signup/page.jsx
│   │   ├── register/page.jsx
│   │   ├── shop/page.jsx
│   │   ├── productdetails/page.jsx
│   │   ├── geeta/page.jsx
│   │   ├── geeta/[slug]/page.jsx
│   │   ├── index/[slug]/page.jsx
│   │   ├── versedetail/page.jsx
│   │   ├── panchang/page.jsx
│   │   ├── temples/page.jsx
│   │   ├── practice/page.jsx
│   │   ├── investor/page.jsx
│   │   ├── feedback/page.jsx
│   │   ├── orderdetails/page.jsx
│   │   ├── bookingsuccess/page.jsx
│   │   ├── thankyou/page.jsx
│   │   ├── panditthank/page.jsx
│   │   ├── razorpay/page.jsx
│   │   ├── customerrazorpay/page.jsx
│   │   ├── forgetpass/page.jsx
│   │   ├── forgetpassvendor/page.jsx
│   │   ├── resetpass/[email]/page.jsx
│   │   ├── resetpassvendor/[email]/page.jsx
│   │   ├── verify/[id]/page.jsx
│   │   ├── verifytoken/[id]/page.jsx
│   │   ├── verifyvendor/[id]/page.jsx
│   │   ├── privacypolicy/page.jsx
│   │   ├── refundpolicy/page.jsx
│   │   ├── terms/page.jsx
│   │   └── comingsoon/page.jsx
│   │
│   ├── investoropportunity/      ← Standalone page (no Header/Footer)
│   │   └── page.jsx
│   │
│   ├── user/                     ← Protected Customer pages
│   │   ├── layout.jsx            ← Auth guard (user_typ === 'Customer') + Header + Sidebar
│   │   ├── dashboard/page.jsx
│   │   ├── profile/page.jsx
│   │   ├── browse/page.jsx
│   │   ├── browsedetails/[id]/page.jsx
│   │   ├── pooja/page.jsx
│   │   ├── poojadetail/[ritual_id]/page.jsx
│   │   ├── bookingpage/page.jsx
│   │   ├── mybookings/page.jsx
│   │   ├── payment/page.jsx
│   │   ├── paymentpage/[order_id]/page.jsx
│   │   ├── wallet/page.jsx
│   │   ├── calender/page.jsx
│   │   ├── datetime/page.jsx
│   │   ├── location/page.jsx
│   │   ├── familytree/page.jsx
│   │   ├── refer/page.jsx
│   │   ├── review/page.jsx
│   │   ├── reviews/page.jsx
│   │   ├── notification/page.jsx
│   │   ├── support/page.jsx
│   │   ├── changepassword/page.jsx
│   │   ├── thankyou/page.jsx
│   │   └── logout/page.jsx
│   │
│   └── vendor/                   ← Protected Vendor (Pandit) pages
│       ├── layout.jsx            ← Auth guard (user_typ === 'Vendor') + KYC status + Header + Sidebar
│       ├── dashboard/page.jsx
│       ├── profile/page.jsx
│       ├── browse/page.jsx
│       ├── service/page.jsx
│       ├── product/page.jsx
│       ├── booking/page.jsx
│       ├── availability/page.jsx
│       ├── blockedslot/page.jsx
│       ├── earning/page.jsx
│       ├── wallet/page.jsx
│       ├── gallery/page.jsx
│       ├── media/page.jsx
│       ├── video/page.jsx
│       ├── videolisting/page.jsx
│       ├── review/page.jsx
│       ├── reviews/page.jsx
│       ├── notification/page.jsx
│       ├── support/page.jsx
│       ├── referal/page.jsx
│       ├── changepassword/page.jsx
│       └── logout/page.jsx
│
├── components/
│   ├── inc/                      ← Shared site chrome
│   │   ├── header.jsx
│   │   └── footer.jsx
│   ├── pages/                    ← One component per public route
│   ├── user/                     ← Customer dashboard components + sidebar, header, footer
│   ├── vendor/                   ← Vendor dashboard components + sidebar, header, footer
│   ├── investor/                 ← Investoropportunity component
│   └── shared/
│       ├── PrivateGuard.jsx      ← Redirect unauthenticated users to /
│       ├── AnalyticsProvider.jsx ← Google Analytics 4 via react-ga4
│       ├── Pagination.jsx
│       ├── Helper.jsx
│       └── SkeletonLoader.jsx
│
├── context/
│   ├── AuthProvider.jsx          ← Global auth state (isAuthenticated, userType, login, logout)
│   └── VisitorContext.jsx        ← Visitor/session tracking
│
├── services/
│   ├── Apiconnect.js             ← Axios wrapper with AES encryption + lazy localStorage access
│   └── HelperCodebase.js
│
├── constants/
│   └── config.js                 ← App-wide constants (DEFAULT_RECORDS_PER_PAGE, DEBOUNCE_DELAY)
│
├── styles/
│   ├── global.css                ← Global styles (imported in root layout)
│   ├── App.css
│   └── index.css
│
└── lib/
    ├── analytics.js              ← GA4 helpers
    └── i18.js                    ← i18next configuration
```

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `next` ^15 | Framework + App Router |
| `react` ^19 | UI library |
| `axios` | HTTP client |
| `bootstrap` + `react-bootstrap` | UI components and grid |
| `bootstrap-icons` | Icon set |
| `crypto-js` | AES encryption for API payloads |
| `i18next` + `react-i18next` | Internationalisation |
| `react-toastify` | Toast notifications |
| `react-loading-skeleton` | Loading placeholders |
| `react-datepicker` | Date picker |
| `react-image-crop` | Profile image cropping |
| `react-speech-recognition` | Voice input |
| `react-ga4` | Google Analytics 4 |
| `luxon` | Date/time utilities |
| `@react-google-maps/api` | Google Maps integration |

---

## Authentication & Route Protection

Auth state is managed in `AuthProvider` (React Context + `localStorage`).

- **`PrivateGuard`** — wraps protected layouts; redirects to `/` if no valid token is found.
- **User layout** — additionally checks `localStorage.getItem('user_typ') === 'Customer'`.
- **Vendor layout** — checks `user_typ === 'Vendor'` and fetches KYC status from the API to conditionally restrict vendor features.

---

## Next.js Image Optimisation

Remote images from `api.sanatandiksha.com` are whitelisted in `next.config.mjs`. Use `next/image` instead of plain `<img>` tags to take advantage of automatic optimisation:

```jsx
import Image from 'next/image';
<Image src="https://api.sanatandiksha.com/..." width={100} height={100} alt="..." />
```

---

## i18n

Internationalisation is configured in `src/lib/i18.js` using `i18next` + `react-i18next`. Add locale JSON files under `public/locales/` as needed.