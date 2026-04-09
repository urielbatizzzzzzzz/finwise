import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { clearUser } from '../../store/slices/userSlice'
import { useIdentity } from '../../hooks/usePhase3Data'
import FinWiseButton from '../ui/FinWiseButton'

const navItems = [
  { path: '/phase3',               label: 'Dashboard Histórico', icon: '📊' },
  { path: '/phase3/transacciones', label: 'movimientos',        icon: '💸' },
  { path: '/phase3/deudas',        label: 'Deudas (Avalancha)',   icon: '⚡' },
  { path: '/phase3/metas',         label: 'Metas de Ahorro',      icon: '🏦' },
  { path: '/phase3/ajustes',       label: 'Ajustes de Cuenta',    icon: '⚙️' },
]

export default function Phase3Layout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const profile = useSelector((s) => s.user.profile)
  const email = useSelector((s) => s.user.email)
  const { setBaseline } = useIdentity()

  const displayName = profile?.firstName || (email ? email.split('@')[0] : 'Usuario')

  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearUser())
    navigate('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full">
      <aside className="w-64 border-r border-gray-100 dark:border-gray-800 hidden md:flex flex-col bg-white dark:bg-transparent shrink-0">
        <div className="p-6">
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
              Gestión Financiera
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {displayName}
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/phase3'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-900/40 text-teal-900 dark:text-sky-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <FinWiseButton
            variant="ghost"
            size="sm"
            className="w-full justify-start px-4 text-gray-500 dark:text-gray-400 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-900/30"
            onClick={() => navigate('/dashboard')}
          >
            <span className="mr-2">←</span> Dashboard Principal
          </FinWiseButton>
          <FinWiseButton
            variant="ghost"
            size="sm"
            className="w-full justify-start px-4 text-red-500 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
            onClick={handleLogout}
          >
            <span className="mr-2">🚪</span> Cerrar sesión
          </FinWiseButton>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex md:hidden overflow-x-auto gap-2 pb-4 mb-4 border-b border-gray-100 dark:border-gray-800 no-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/phase3'}
                className={({ isActive }) =>
                  `whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-900/40 text-teal-900 dark:text-sky-300'
                      : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="animate-fade-in">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
