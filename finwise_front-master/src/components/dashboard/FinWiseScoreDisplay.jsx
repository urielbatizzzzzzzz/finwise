/* FinWiseScoreDisplay – animated SVG gauge with score counter */
import { useEffect, useRef, useState } from 'react'
import { getScoreColor, getScoreLabel, getScoreDescription } from '../../utils/scoreEngine'

const RADIUS        = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export default function FinWiseScoreDisplay({
  score = 0,
  size = 220,
  showLabel = true,
  showDescription = false,
  animationDuration = 1600,
}) {
  const [displayScore, setDisplayScore] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const start = performance.now()

    const animate = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / animationDuration, 1)
      const eased    = easeOutCubic(progress)
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score, animationDuration])

  const color  = getScoreColor(displayScore)
  const label  = getScoreLabel(displayScore)
  const desc   = getScoreDescription(displayScore)
  const offset = CIRCUMFERENCE * (1 - displayScore / 100)

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 120 120"
        aria-label={`Score financiero: ${displayScore} – ${label}`}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="currentColor"
          className="text-gray-100 dark:text-gray-800" strokeWidth="9" />

        {/* Progress arc */}
        <circle cx="60" cy="60" r={RADIUS} fill="none" stroke={color}
          strokeWidth="9" strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          filter={displayScore > 50 ? 'url(#glow)' : undefined}
          style={{ transition: 'stroke-dashoffset 0.08s linear, stroke 0.4s ease' }}
        />

        {/* Score number */}
        <text x="60" y="56" textAnchor="middle" dominantBaseline="middle"
          fontSize="22" fontWeight="700" fill="currentColor"
          className="text-gray-900 dark:text-gray-100">
          {displayScore}
        </text>

        {/* Label */}
        <text x="60" y="74" textAnchor="middle" fontSize="9" fontWeight="600"
          fill={color} letterSpacing="0.5">
          {label.toUpperCase()}
        </text>
      </svg>

      {/* Score impact bars */}
      {showLabel && (
        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4, 5].map((i) => {
            const active = displayScore >= i * 20
            return (
              <div
                key={i}
                className="h-1.5 w-8 rounded-full transition-all duration-300"
                style={{ backgroundColor: active ? color : 'var(--surface)' }}
              />
            )
          })}
        </div>
      )}

      {showDescription && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 max-w-xs">
          {desc}
        </p>
      )}
    </div>
  )
}
