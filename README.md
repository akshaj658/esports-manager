# 🎮 Esports Manager

A production-grade React + Supabase web app for managing esports teams, tracking tournament performance, and analyzing player stats.

## 🧠 Problem Statement

Amateur and semi-pro esports teams have no centralized tool to manage their rosters, track tournament performance, and analyze stats. Coaches and team captains juggle spreadsheets and Discord messages. This app solves that with a single, focused command center.

**User:** Esports team captains, coaches, and org managers  
**Problem:** No dedicated, lightweight tool exists for grassroots team management  
**Value:** Centralized roster + tournament + analytics in one real-time app

---

## ✨ Features

- 🔐 **Authentication** — Secure login/signup via Supabase Auth
- 🧑‍🤝‍🧑 **Roster Management** — Add, edit, delete players with full stats (kills, deaths, assists, win rate)
- 🏆 **Tournament Tracker** — Create tournaments, log matches with W/L/D results and scores
- 📊 **Analytics Dashboard** — Bar charts, pie charts, win rate, K/D, role distribution (Recharts)
- 🔒 **Protected Routes** — Auth-guarded navigation with React Router
- ⚡ **Lazy Loading** — Analytics page loaded on demand with React.lazy + Suspense
- 📱 **Responsive Design** — Mobile and desktop, dark esports aesthetic

---

## 🛠️ Tech Stack

| Layer       | Tool                          |
|-------------|-------------------------------|
| Frontend    | React 18 + Vite               |
| Routing     | React Router v6               |
| State       | Context API + useReducer      |
| Styling     | Tailwind CSS                  |
| Charts      | Recharts                      |
| Backend     | Supabase (Auth + PostgreSQL)  |
| Deployment  | Vercel                        |

---

## ⚛️ React Concepts Used

| Concept | Where |
|---|---|
| `useState` | Forms, filters, UI toggles |
| `useEffect` | Data fetching on mount |
| `useReducer` | TeamContext global state |
| `useContext` | Auth + Team state access |
| `useMemo` | Filtered lists, computed stats |
| `useCallback` | Stable event handlers |
| `useRef` | Auth form focus |
| `React.lazy + Suspense` | Analytics lazy load |
| Controlled components | All forms |
| Protected Routes | Auth guard HOC |
| Custom Hooks | `usePlayers`, `useTournaments` |

---

## 🚀 Setup Instructions

### 1. Clone and install

```bash
git clone <your-repo>
cd esports-manager
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase_schema.sql`
3. Get your **Project URL** and **anon public key** from Settings → API

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally

```bash
npm run dev
```

### 5. Deploy to Vercel

```bash
npm run build
# Deploy /dist to Vercel, add env vars in Vercel dashboard
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/     Navbar
│   └── ui/         PlayerCard, StatCard, ProtectedRoute
├── context/        AuthContext, TeamContext
├── hooks/          usePlayers, useTournaments
├── pages/          AuthPage, Dashboard, RosterPage, PlayerProfile, TournamentsPage, AnalyticsPage
└── services/       supabase.js, authService.js, playerService.js, tournamentService.js
```
