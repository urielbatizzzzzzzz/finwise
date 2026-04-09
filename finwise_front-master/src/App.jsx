import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { store } from './store'
import { useTheme } from './hooks/useTheme'
import { FinWiseProvider } from './context/FinWiseContext'
import { Phase3Provider } from './context/Phase3Context'

/* ─── Layout & Auth ──────────────────────────────────── */
import Navbar          from './components/layout/Navbar'
import ProtectedRoute  from './components/auth/ProtectedRoute'
import Phase3Layout    from './components/layout/Phase3Layout'

/* ─── Pages ──────────────────────────────────────────── */
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import DashboardPage    from './pages/DashboardPage'

/* ─── Phase 3 Pages ──────────────────────────────────── */
import HistoricalDashboard from './pages/phase3/HistoricalDashboard'
import TransactionsPage    from './pages/phase3/TransactionsPage'
import DebtsPage           from './pages/phase3/DebtsPage'
import GoalsPage           from './pages/phase3/GoalsPage'
import AccountSettings     from './pages/phase3/AccountSettings'

/* ─── MVP Pages ──────────────────────────────────────── */
import LandingPage      from './pages/LandingPage'
import DiagnosisPage    from './pages/DiagnosisPage'
import PreRegDashboard  from './pages/PreRegDashboard'

/* ─── React Query client ─────────────────────────────── */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 3,
    },
    mutations: {
      retry: 0,
    },
  },
})

function ThemeInitializer() {
  useTheme()
  return null
}

function AppRoutes() {
  return (
    <>
      <ThemeInitializer />
      <div className="min-h-screen bg-white dark:bg-finwise-dark-bg transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <main className="w-full px-[8%] py-8 sm:py-12">
                  <DashboardPage />
                </main>
              </ProtectedRoute>
            }
          />

          {/* ── Protected: Phase 3 – Nested layout ── */}
          <Route
            path="/phase3"
            element={
              <ProtectedRoute>
                <Phase3Layout />
              </ProtectedRoute>
            }
          >
            <Route index                     element={<HistoricalDashboard />} />
            <Route path="transacciones"      element={<TransactionsPage />} />
            <Route path="deudas"             element={<DebtsPage />} />
            <Route path="metas"              element={<GoalsPage />} />
            <Route path="ajustes"            element={<AccountSettings />} />
          </Route>

          <Route path="/"           element={<LandingPage />} />
          <Route path="/diagnostico" element={<DiagnosisPage />} />
          <Route path="/resultado"  element={<PreRegDashboard />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default function App() {

  return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <FinWiseProvider>
            <Phase3Provider>
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </Phase3Provider>
          </FinWiseProvider>
        </QueryClientProvider>
      </Provider>
  )
}
