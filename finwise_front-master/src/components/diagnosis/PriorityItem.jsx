/* PriorityItem – displays a single actionable priority from the score engine */

const impactColors = {
  high:   'bg-teal-700 text-white dark:bg-teal-200 dark:text-gray-900',
  medium: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  low:    'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const impactLabels = {
  high:   'Alta prioridad',
  medium: 'Media prioridad',
  low:    'En progreso',
}

export default function PriorityItem({ priority, index = 0 }) {
  const { icon, title, description, impact, scoreImpact } = priority

  return (
    <div
      className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-fade-in-up"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Icon bubble */}
      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xl">
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {title}
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${impactColors[impact]}`}>
            {impactLabels[impact]}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
        {scoreImpact && (
          <p className="mt-1.5 text-xs font-semibold text-teal-900 dark:text-sky-300">
            Impacto potencial: {scoreImpact}
          </p>
        )}
      </div>
    </div>
  )
}
