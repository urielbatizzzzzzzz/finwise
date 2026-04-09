/* FinWiseCard – surface container, monochromatic palette */

const elevations = {
  flat: '',
  sm:   'shadow-sm',
  md:   'shadow-md',
  lg:   'shadow-lg',
}

export default function FinWiseCard({
  children,
  className = '',
  elevation = 'md',
  noPad = false,
  onClick,
  selected = false,
}) {
  const interactive = !!onClick

  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={[
        'rounded-2xl',
        'bg-white dark:bg-gray-900',
        'border',
        selected
          ? 'border-teal-700 dark:border-teal-200 ring-2 ring-teal-700/50 dark:ring-teal-200/50'
          : 'border-gray-100 dark:border-gray-800',
        elevations[elevation],
        interactive ? 'cursor-pointer hover:border-gray-500 transition-all duration-200' : '',
        noPad ? '' : 'p-5',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
