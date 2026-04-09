/* NesiSyncButton – Prominent CTA for triggering NESI bank data sync */
import { useState } from 'react'
import { useNesiSync } from '../../hooks/queries/useNesiSync'

function SyncIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function AlertIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}

export default function NesiSyncButton() {
  const { mutate: syncNesi, isPending, isSuccess, isError, error, reset } = useNesiSync()
  const [synced, setSynced] = useState(false)

  const handleSync = () => {
    reset()
    syncNesi(undefined, {
      onSuccess: () => {
        setSynced(true)
        setTimeout(() => setSynced(false), 4000)
      },
    })
  }

  if (isSuccess && synced) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-800/40 flex items-center justify-center">
            <CheckIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300">¡Sincronización exitosa!</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-400/80 mt-0.5">
              Tus datos bancarios han sido actualizados. Tu score y proyecciones se recalcularán automáticamente.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-800/40 flex items-center justify-center">
            <AlertIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-red-900 dark:text-red-300">Error de sincronización</h3>
            <p className="text-sm text-red-700 dark:text-red-400/80 mt-0.5">
              {error?.response?.data?.message || 'No se pudieron sincronizar tus datos. Intenta de nuevo.'}
            </p>
          </div>
          <button
            onClick={handleSync}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      id="nesi-sync-btn"
      onClick={handleSync}
      disabled={isPending}
      className="group relative w-full overflow-hidden rounded-2xl border border-teal-200 dark:border-teal-800/30 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 dark:from-teal-700 dark:via-cyan-700 dark:to-teal-800 p-6 text-left transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/20 disabled:opacity-80 disabled:cursor-wait"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

      <div className="relative flex items-center gap-4">
        <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center ${isPending ? '' : 'group-hover:scale-110 transition-transform'}`}>
          <SyncIcon className={`w-7 h-7 text-white ${isPending ? 'animate-spin' : ''}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">
            {isPending ? 'Sincronizando datos...' : 'Sincronizar datos NESI'}
          </h3>
          <p className="text-sm text-teal-100/80 mt-0.5">
            {isPending
              ? 'Conectando con tu institución bancaria, esto puede tomar unos segundos.'
              : 'Conecta tu cuenta bancaria para obtener un análisis actualizado de tu salud financiera.'}
          </p>
        </div>
        {!isPending && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        )}
      </div>

      {isPending && (
        <div className="mt-4 h-1 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-white/60 rounded-full animate-pulse" style={{ width: '70%', animation: 'indeterminate 1.5s ease-in-out infinite' }} />
        </div>
      )}
    </button>
  )
}
