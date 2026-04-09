/* ShadowMarketplace – B2B conditional product catalog with lead conversion */
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useMarketplaceProducts, useAcceptOffer } from '../../hooks/queries/useMarketplace'
import { formatMXN } from '../../utils/formatters'

function LockIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

function ProductCard({ product, canAccept, isLocked, onAccept, isAccepting }) {
  return (
    <div className={`relative rounded-2xl border p-5 transition-all duration-300 ${
      isLocked
        ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40'
        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-lg hover:shadow-teal-500/5 hover:border-teal-200 dark:hover:border-teal-800/60'
    }`}>
      {isLocked && (
        <div className="absolute inset-0 rounded-2xl backdrop-blur-[2px] bg-white/30 dark:bg-gray-900/30 z-10 flex flex-col items-center justify-center gap-2">
          <LockIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center px-4">
            Mejora tu score para desbloquear esta oferta
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-800/30">
          {product.provider || 'Institución'}
        </span>
        {product.featured && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
            <StarIcon className="w-3 h-3" />
            Destacado
          </span>
        )}
      </div>

      <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-1">
        {product.name || 'Producto financiero'}
      </h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
        {product.description || 'Oferta personalizada basada en tu perfil financiero.'}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {product.rate !== undefined && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Tasa</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{product.rate}%</p>
          </div>
        )}
        {product.maxAmount !== undefined && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2.5">
            <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase">Monto máx.</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatMXN(product.maxAmount)}</p>
          </div>
        )}
      </div>

      {canAccept && (
        <button
          id={`accept-offer-${product.id}`}
          onClick={() => onAccept(product.id)}
          disabled={isAccepting}
          className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-60 disabled:cursor-wait shadow-md shadow-teal-500/20 hover:shadow-lg hover:shadow-teal-500/30"
        >
          {isAccepting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Procesando...
            </span>
          ) : '✨ Aceptar Oferta'}
        </button>
      )}

      {!isLocked && !canAccept && (
        <div className="w-full py-3 rounded-xl text-sm font-semibold text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          🔒 Score insuficiente para aplicar
        </div>
      )}
    </div>
  )
}

export default function ShadowMarketplace() {
  const score        = useSelector((s) => s.user.score)
  const creditIntent = useSelector((s) => s.user.creditIntent)
  const { products, isLoading } = useMarketplaceProducts()
  const { mutate: acceptOffer, isPending: isAccepting } = useAcceptOffer()
  const [acceptedId, setAcceptedId] = useState(null)

  if (score === null || score < 40) return null

  const isLocked  = score >= 40 && score < 70
  const canAccept = score >= 70 && creditIntent === true

  const handleAccept = (productId) => {
    acceptOffer(productId, {
      onSuccess: () => setAcceptedId(productId),
    })
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ofertas Personalizadas</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {isLocked
              ? 'Mejora tu score para desbloquear ofertas exclusivas'
              : 'Productos financieros seleccionados para tu perfil'}
          </p>
        </div>
        {score >= 70 && !creditIntent && (
          <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30">
            Activa tu intención de crédito en tu perfil
          </span>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              canAccept={canAccept && acceptedId !== product.id}
              isLocked={isLocked}
              onAccept={handleAccept}
              isAccepting={isAccepting}
            />
          ))}
        </div>
      )}

      {acceptedId && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/30 p-5 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h4 className="font-bold text-emerald-800 dark:text-emerald-300">¡Oferta aceptada!</h4>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Tu solicitud ha sido registrada. Un representante se comunicará contigo pronto.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No hay ofertas disponibles en este momento.</p>
        </div>
      )}
    </div>
  )
}
