# Sanatan Diksha — Next.js 15 (App Router)

Converted from React (Vite) → Next.js 15 App Router.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Folder Structure

```
src/
├── app/                    ← All routes (App Router)
│   ├── layout.jsx          ← Root layout (providers, CSS)
│   ├── not-found.jsx       ← 404 page
│   ├── (public)/           ← Public pages with Header+Footer
│   │   ├── layout.jsx
│   │   ├── page.jsx        ← Home /
│   │   ├── signin/page.jsx
│   │   ├── signup/page.jsx
│   │   ├── shop/page.jsx
│   │   ├── geeta/[slug]/page.jsx
│   │   └── ... (all public routes)
│   ├── user/               ← Protected Customer pages
│   │   ├── layout.jsx      ← Auth guard + sidebar
│   │   ├── dashboard/page.jsx
│   │   └── ... (all user routes)
│   ├── vendor/             ← Protected Vendor pages
│   │   ├── layout.jsx      ← Auth guard + KYC check + sidebar
│   │   ├── dashboard/page.jsx
│   │   └── ... (all vendor routes)
│   └── investoropportunity/page.jsx
│
├── components/
│   ├── inc/                ← header.jsx, footer.jsx
│   ├── pages/              ← All public page components (from src/Pages/)
│   ├── user/               ← All user dashboard components (from src/User/)
│   ├── vendor/             ← All vendor dashboard components (from src/Vendor/)
│   ├── investor/           ← Investoropportunity component
│   └── shared/             ← PrivateGuard, AnalyticsProvider, Pagination, Helper, SkeletonLoader
│
├── context/
│   ├── AuthProvider.jsx    ← Auth state (isAuthenticated, userType, login, logout)
│   └── VisitorContext.jsx
│
├── services/
│   ├── Apiconnect.js       ← Axios wrapper (Next.js safe — lazy localStorage)
│   └── HelperCodebase.js
│
├── constants/
│   └── config.js
│
├── styles/
│   ├── style.css
│   ├── user.css
│   └── index.css
│
└── lib/
    ├── analytics.js
    └── i18.js
```

## Key Changes from React (Vite)

| React                     | Next.js                          |
|---------------------------|----------------------------------|
| `react-router-dom`        | `next/navigation` + file system routing |
| `useNavigate()`           | `useRouter()` from `next/navigation` |
| `<Link to="...">`         | `<Link href="...">` from `next/link` |
| `useLocation()`           | `usePathname()` from `next/navigation` |
| `useParams()`             | `useParams()` from `next/navigation` |
| `src/main.jsx`            | `src/app/layout.jsx`             |
| Route groups              | `(public)/`, `user/`, `vendor/` layouts |
| `PrivateRoutes.jsx`       | `PrivateGuard` + layout auth checks |

## Public Assets

Copy the `public/eduassets/` folder from your original project into the `public/` folder here. This provides CSS, icons, fonts and images that the templates reference.

Also copy these to `public/`:
- `favicon.svg`, `favicon.ico`, `favicon.png`
- `icons.svg`, `newlogo.png`, `newwww.png`
- `s.png`, `Sanatan Logo-high res.png`, `Sanatan Logo.png`

## Environment Variables

Create `.env.local` for any secrets:

```
NEXT_PUBLIC_GA_ID=G-H8REM9SBYQ
NEXT_PUBLIC_API_URL=https://api.sanatandiksha.com/
```
