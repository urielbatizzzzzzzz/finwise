import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { clearUser } from '../../store/slices/userSlice'
import { useIdentity } from '../../hooks/usePhase3Data'
import FinWiseButton from '../../components/ui/FinWiseButton'
import FinWiseCard   from '../../components/ui/FinWiseCard'

export default function AccountSettings() {
  const { profile, wipeAccount, isLoading } = useIdentity()
  const dispatch     = useDispatch()
  const navigate     = useNavigate()
  const reduxProfile = useSelector((s) => s.user.profile)
  const reduxEmail   = useSelector((s) => s.user.email)

  const [name, setNames] = useState(profile?.name || '')

  useEffect(() => {
    if (!name && reduxProfile?.name) {
      setNames(`${reduxProfile.name} ${reduxProfile.lastName || ''}`.trim())
    }
  }, [reduxProfile, name])


  const handleWipe = async () => {
    if (confirm('¿Estás SEGURO de querer eliminar toda tu cuenta y datos? Esta acción es irreversible y ejecutará el derecho al olvido eliminando tu UserAccount, metas, transacciones y perfil financiero.')) {
      await wipeAccount(() => {
        dispatch(logout())
        dispatch(clearUser())
        navigate('/')
      })
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Ajustes de Cuenta</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Gestiona tu identidad y controles de privacidad.
        </p>
      </div>

      {/* Account info from Redux */}
      <FinWiseCard>
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Información de Cuenta</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
            <span className="text-sm text-gray-500 dark:text-gray-400">Correo registrado</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{reduxEmail || 'No disponible'}</span>
          </div>
          {reduxProfile && (
            <>
              <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800">
                <span className="text-sm text-gray-500 dark:text-gray-400">Nombre</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{reduxProfile.name} {reduxProfile.lastName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Tipo de usuario</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">{reduxProfile.userType || 'Individual'}</span>
              </div>
            </>
          )}
        </div>
      </FinWiseCard>

      <FinWiseCard className="border-red-200 dark:border-red-900/50 bg-white dark:bg-gray-900">
        <h2 className="text-lg font-bold mb-2 text-red-600 dark:text-red-400">Zona de Peligro</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Al eliminar tu cuenta, invocaremos el borrado en cascada de tu entidad `UserAccount` y todos sus registros asociados (`FinancialProfile`, `PrimaryGoal`, `FinancialSnapshot`). Esta acción no puede deshacerse.
        </p>
        <FinWiseButton variant="ghost" onClick={handleWipe} loading={isLoading}
          className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40">
          Ejecutar Derecho al Olvido (Borrar Cuenta)
        </FinWiseButton>
      </FinWiseCard>
    </div>
  )
}
