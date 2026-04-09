import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogout } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

export default function Navbar() {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated)
  const email = useSelector((s) => s.user.email)
  const { isDark, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const logout = useLogout()

  const isLanding = pathname === '/'
  const displayName = email ? email.split('@')[0] : null

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800/30 bg-white/80 dark:bg-finwise-dark-bg/80 backdrop-blur-md">
      <div className="w-full px-[5%] h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 tracking-tight group">
          <span className="text-teal-900 dark:text-sky-300 text-5xl font-extrabold transition-colors group-hover:text-teal-800 dark:group-hover:text-sky-200">Fin</span>
          <span className="text-gray-900 dark:text-gray-100 text-5xl font-extrabold transition-colors">Wise</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {displayName ? `Hola, ${displayName}` : 'Dashboard'}
              </Link>
              <Link
                to="/phase3"
                className="hidden sm:block text-sm font-medium text-teal-700 dark:text-sky-300 hover:text-teal-900 dark:hover:text-sky-200 transition-colors"
              >
                Gestión
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                Salir
              </button>
            </>
          )}

          {!isAuthenticated && isLanding && (
            <Link
              to="/login"
              className="text-sm font-medium text-black dark:text-white hover:text-gray-600 transition-colors"
            >
              Iniciar sesión
            </Link>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </nav>
  )
}
