

# 🚀 AdFlow Pro – Modern Marketplace Web App

Welcome to **AdFlow Pro** 🎯  
A modern, responsive online marketplace web application where users can browse, post, and manage advertisements easily.

## 🌐 Live Demo
https://adsflow-017.vercel.app/

## 📌 About the Project

AdFlow Pro is a full-stack marketplace application inspired by modern classified platforms like OLX and Daraz. It connects buyers and sellers in a seamless ecosystem with real-time messaging, favorites tracking, and comprehensive ad management.

### Key Capabilities:
- **Buyers**: Browse ads, search by category/location, save favorites, message sellers
- **Sellers**: Post ads with images, manage listings, track views, communicate with buyers
- **Admin**: (Ready for implementation)

## ⚙️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast bundler
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Navigation

### Backend
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **Node.js** - Runtime

### DevTools
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Git & GitHub** - Version control
- **Vercel** - Deployment

## ✨ Features

### User Management
- ✅ Email/password authentication
- ✅ Role-based access (Buyer/Seller/Admin)
- ✅ Auto profile creation on signup
- ✅ User dashboard with statistics
- ✅ Profile management

### Marketplace Features
- ✅ Browse all active ads
- ✅ Advanced search with filters (category, price, condition, location)
- ✅ Category browsing
- ✅ Ad detail pages with seller info
- ✅ View count tracking
- ✅ Featured ads highlighting

### Seller Features
- ✅ Post new ads (with image upload)
- ✅ Manage own listings (edit/delete/mark sold)
- ✅ Track ad views and performance
- ✅ View buyer inquiries

### Buyer Features
- ✅ Save favorite ads
- ✅ View saved favorites list
- ✅ Message sellers directly
- ✅ View conversation history
- ✅ Mark messages as read

### Additional
- ✅ Real-time notifications
- ✅ Dark/light theme support
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Error handling & user feedback
- ✅ Loading states & skeletons



## 📁 Project Structure

```
adflow-pro/
├── 📄 Configuration Files
│   ├── package.json              # Project dependencies
│   ├── package-lock.json         # Dependency lock file
│   ├── bun.lockb                 # Bun package manager lock
│   ├── vite.config.ts            # Vite bundler config
│   ├── vitest.config.ts          # Testing config
│   ├── tsconfig.json             # TypeScript config
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   ├── eslint.config.js          # ESLint rules
│   ├── components.json           # Component library config
│   └── README.md                 # Project documentation
│
├── 📂 public/                    # Static assets
│   └── robots.txt
│
├── 📂 supabase/                  # Backend configuration
│   ├── config.toml               # Supabase local config
│   └── migrations/               # Database migrations
│       ├── 20260417102127...sql  # Initial schema (profiles, ads, messages, etc.)
│       ├── 20260417102153...sql  # Additional views/policies
│       └── 20260427...sql        # Test data (optional)
│
└── 📂 src/                       # Source code
    ├── App.tsx                   # Main app component
    ├── main.tsx                  # Entry point
    ├── index.css                 # Global styles
    ├── App.css                   # App styles
    ├── vite-env.d.ts             # Vite environment types
    │
    ├── 📂 assets/                # Static assets (images, icons, etc.)
    │
    ├── 📂 components/            # React components
    │   ├── NavLink.tsx           # Navigation link component
    │   ├── layout/               # Layout components
    │   │   ├── Header.tsx        # App header
    │   │   └── PageShell.tsx     # Page wrapper
    │   ├── marketplace/          # Marketplace components
    │   │   ├── AdCard.tsx        # Ad listing card
    │   │   ├── CategoryGrid.tsx  # Category display
    │   │   └── SearchBar.tsx     # Search input
    │   └── ui/                   # shadcn/ui components (40+ components)
    │       ├── button.tsx, input.tsx, card.tsx, dialog.tsx, etc.
    │
    ├── 📂 hooks/                 # Custom React hooks
    │   ├── useAuth.ts            # Authentication hook
    │   ├── useTheme.ts           # Theme toggle hook
    │   ├── use-toast.ts          # Notification hook
    │   └── use-mobile.tsx        # Mobile detection hook
    │
    ├── 📂 lib/                   # Utility functions
    │   ├── auth.ts               # Auth utilities (demo, roles, etc.)
    │   ├── marketplace.ts        # Demo marketplace data (DEMO_ADS, CATEGORIES, etc.)
    │   ├── supabase.ts           # Supabase utilities
    │   └── utils.ts              # General utilities
    │
    ├── 📂 integrations/          # External service integrations
    │   └── supabase/
    │       ├── client.ts         # Supabase client initialization
    │       └── types.ts          # Database type definitions
    │
    ├── 📂 pages/                 # Page components (routes)
    │   ├── Index.tsx             # Homepage with featured ads
    │   ├── AdDetail.tsx          # Single ad detail page
    │   ├── Categories.tsx        # Category browse page
    │   ├── Search.tsx            # Search & filter page
    │   ├── PostAd.tsx            # Create new ad page
    │   ├── Login.tsx             # Login page
    │   ├── Signup.tsx            # Signup page
    │   ├── NotFound.tsx          # 404 page
    │   └── dashboard/            # User dashboard pages
    │       ├── DashboardLayout.tsx   # Dashboard wrapper
    │       ├── Overview.tsx          # Dashboard stats
    │       ├── MyAds.tsx             # User's listings
    │       ├── Favorites.tsx         # Saved favorites
    │       ├── Messages.tsx          # Conversations list
    │       ├── MessageThread.tsx     # Individual chat
    │       └── Profile.tsx           # User profile settings
    │
    └── 📂 test/                  # Tests
        ├── setup.ts              # Test setup
        └── example.test.ts       # Example tests
```

## 🗄️ Database Schema

### Tables Created:

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **profiles** | User profile information | user_id, display_name, phone, city, bio |
| **user_roles** | User roles (buyer/seller) | user_id, role |
| **ads** | Marketplace listings | id, seller_id, title, price, category, condition, location, images, status |
| **favorites** | User's saved ads | user_id, ad_id |
| **conversations** | Buyer-seller chats | id, ad_id, buyer_id, seller_id |
| **messages** | Individual messages | id, conversation_id, sender_id, body, read_at |
| **ad_views** | View tracking analytics | id, ad_id, viewer_id |

### Security Features:
- ✅ Row Level Security (RLS) on all tables
- ✅ 50+ security policies
- ✅ Foreign key constraints with CASCADE deletes
- ✅ Performance indexes on frequently queried columns

## 🔐 Authentication Flow

1. User signs up with email, password, display name
2. Supabase creates auth record + profile automatically
3. User role (buyer/seller) set during signup
4. JWT token stored in localStorage
5. Auto-refresh on page load
6. Demo mode fallback for testing



## 🚀 Getting Started

### Prerequisites
- Node.js 16+ or Bun
- Supabase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/adflow-pro.git
cd adflow-pro
```

2. **Install dependencies**
```bash
npm install
# or
bun install
```

3. **Setup environment variables**
Create `.env.local` in project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

4. **Start development server**
```bash
npm run dev
# or
bun run dev
```

5. **Open in browser**
Navigate to `http://localhost:8080`

## 🧪 Testing the App

### Test User Flow:
1. **Create Account** → Sign up as Buyer or Seller
2. **Post Ad** (Seller) → Fill details and submit
3. **Browse Ads** → View all listings
4. **Search** → Filter by category, price, location
5. **Add Favorites** → Save ads you like
6. **Message** → Chat with buyers/sellers
7. **Dashboard** → View your stats and listings

### Test Accounts:
- All authentication goes through Supabase
- Creates real database records
- Demo mode available as fallback

## 🏗️ Building & Deployment

### Build for Production
```bash
npm run build
# or
bun run build
```

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

**Live URL:** https://adsflow-017.vercel.app/

## 📊 Key Statistics

- **React Components:** 50+
- **UI Components:** 40+ (shadcn/ui)
- **Database Tables:** 7
- **Security Policies:** 50+
- **Page Routes:** 12+
- **Custom Hooks:** 4

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |

## 🐛 Troubleshooting

### Issue: "Could not find the table 'public.ads'"
**Solution:** Run database migrations in Supabase SQL editor. All 7 tables need to be created.

### Issue: Images not uploading
**Solution:** Ensure `ad-images` bucket exists in Supabase Storage with public access enabled.

### Issue: Authentication not working
**Solution:** Check Supabase URL and publishable key in `.env.local`

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Name:** Tahreem Ahmad  
**Project:** AdFlow Pro – Modern Marketplace  
**Institute:** Semester 6 Midproject  
**Contact:** [Your Email/Contact Info]

## 🌟 Acknowledgments

- **shadcn/ui** - For amazing components
- **Supabase** - For backend infrastructure
- **Tailwind CSS** - For styling utilities
- **Vite** - For fast development experience

---

## 💡 Future Enhancements

- [ ] Payment integration (Stripe/PayPal)
- [ ] Admin dashboard
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] SMS alerts
- [ ] AI-powered recommendations
- [ ] Verified seller badges
- [ ] Rating & review system
- [ ] Mobile app (React Native)
- [ ] API documentation

## 📞 Support

For issues, questions, or suggestions:
- 🐛 Report bugs on GitHub Issues
- 💬 Start a discussion
- ⭐ Star the repository if you like it!

---

**Made with ❤️ by Tahreem Ahmad**
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


>>>>>>> abd45705397241c3438a3a7bb50969724503a4f1
