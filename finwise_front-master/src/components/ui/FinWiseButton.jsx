/* FinWiseButton – primary CTA button, monochromatic palette */

const variants = {
  primary: [
    'bg-teal-700 dark:bg-teal-200 text-white dark:text-gray-950 font-semibold',
    'hover:bg-teal-800 dark:hover:bg-teal-300 active:scale-95',
    'shadow-sm hover:shadow-md transition-colors',
  ].join(' '),

  outline: [
    'border-2 border-teal-700 dark:border-teal-200 text-teal-700 dark:text-teal-200',
    'hover:bg-teal-50 dark:hover:bg-teal-900/50',
  ].join(' '),

  ghost: [
    'text-gray-600 dark:text-gray-400',
    'hover:text-teal-700 dark:hover:text-teal-300 hover:bg-gray-100 dark:hover:bg-gray-800',
  ].join(' '),
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
}

export default function FinWiseButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  pulse = false,
  ...props
}) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-medium transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        pulse ? 'animate-pulse-brand' : '',
        className,
      ].join(' ')}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
