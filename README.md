  LIVE LINK: https://adsflow-017.vercel.app/
# AdFlow Frontend

A professional, mobile-responsive **Ad Analytics Platform** built with **Next.js 14** + **TypeScript**.

---

## 📁 Project Structure

```
adflow-frontend/
├── app/
│   ├── globals.css          # Design system (CSS variables, utilities)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard (home)
│   ├── campaigns/page.tsx   # Campaigns manager
│   ├── analytics/page.tsx   # Analytics & charts
│   ├── audiences/page.tsx   # Audience segments
│   ├── creatives/page.tsx   # Ad creatives
│   ├── reports/page.tsx     # Reports
│   ├── integrations/page.tsx# Platform integrations
│   ├── settings/page.tsx    # Account settings
│   └── help/page.tsx        # Help & documentation
├── components/
│   ├── Sidebar.tsx          # Responsive sidebar nav
│   ├── Header.tsx           # Page header
│   ├── StatCard.tsx         # KPI stat card
│   ├── MiniChart.tsx        # SVG sparkline chart
│   ├── BarChart.tsx         # SVG bar chart
│   └── DonutChart.tsx       # SVG donut/pie chart
├── lib/
│   └── utils.ts             # Utility functions
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📄 Pages

| Route           | Description                          |
|-----------------|--------------------------------------|
| `/`             | Dashboard — KPIs, charts, campaigns  |
| `/campaigns`    | Campaign manager with table & filters|
| `/analytics`    | Funnel, trends, geo, devices         |
| `/audiences`    | Audience segments & demographics     |
| `/creatives`    | Ad creatives library                 |
| `/reports`      | Generate & download reports          |
| `/integrations` | Platform connections (Google, Meta…) |
| `/settings`     | Profile, notifications, danger zone  |
| `/help`         | Docs, FAQs, support                  |

---

## 🎨 Design System

All design tokens are CSS variables in `globals.css`:

- **Colors**: `--accent`, `--green`, `--red`, `--amber`, `--purple`
- **Surfaces**: `--bg`, `--surface`, `--surface-2`
- **Text**: `--text-primary`, `--text-secondary`, `--text-muted`
- **Layout**: `--sidebar-w: 240px`, `--header-h: 64px`
- **Typography**: DM Sans + DM Mono

---

## 📱 Mobile Responsive

- Sidebar collapses to hamburger menu on mobile
- Grid layouts stack to single column below 768px
- Tables become horizontally scrollable
- All touch targets meet minimum size requirements
- <img width="1356" height="730" alt="image" src="https://github.com/user-attachments/assets/ca0af3c0-784b-4c13-b7c7-7e180cbeeceb" />


