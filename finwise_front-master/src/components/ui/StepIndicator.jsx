/* StepIndicator – horizontal progress dots for multi-step form */

export default function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Paso ${current} de ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const step   = i + 1
        const done   = step < current
        const active = step === current

        return (
          <div
            key={step}
            className={[
              'h-1.5 rounded-full transition-all duration-400',
              active           ? 'w-8 bg-black'    : '',
              done             ? 'w-4 bg-gray-400'  : '',
              !active && !done ? 'w-4 bg-gray-200'  : '',
            ].join(' ')}
          />
        )
      })}
      <span className="ml-2 text-xs text-gray-500">
        {current}/{total}
      </span>
    </div>
  )
}
