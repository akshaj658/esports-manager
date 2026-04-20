import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TeamProvider } from './context/TeamContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import Navbar from './components/layout/Navbar'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import RosterPage from './pages/RosterPage'
import PlayerProfile from './pages/PlayerProfile'
import TournamentsPage from './pages/TournamentsPage'

// Lazy load analytics
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))

function AppLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  )
}

function AnalyticsFallback() {
  return (
    <div className="page-container flex items-center justify-center min-h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-display text-brand-400 tracking-widest text-sm">LOADING ANALYTICS...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TeamProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roster"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <RosterPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/roster/:id"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlayerProfile />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tournaments"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <TournamentsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Suspense fallback={<AnalyticsFallback />}>
                      <AnalyticsPage />
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </TeamProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
