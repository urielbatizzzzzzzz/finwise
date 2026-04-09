/* ConfidenceGauge – Semicircular SVG speedometer for Confidence Score */
import { useEffect, useRef, useState } from 'react'

const RADIUS = 80
const STROKE = 12
const SVG_SIZE = 200
const CENTER = SVG_SIZE / 2
const SEMICIRCLE = Math.PI * RADIUS

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function getScoreConfig(score) {
  if (score < 40) return { color: '#EF4444', glow: '#EF444466', label: 'Bajo',  labelColor: 'text-red-500' }
  if (score < 70) return { color: '#F59E0B', glow: '#F59E0B55', label: 'Medio', labelColor: 'text-amber-500' }
  return             { color: '#10B981', glow: '#10B98166', label: 'Alto',  labelColor: 'text-emerald-500' }
}

export default function ConfidenceGauge({ score = 0, size = 240 }) {
  const [displayScore, setDisplayScore] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (score === null || score === undefined) return
    const start    = performance.now()
    const duration = 1800

    const animate = (now) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased    = easeOutExpo(progress)
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [score])

  const config = getScoreConfig(displayScore)
  const offset = SEMICIRCLE * (1 - displayScore / 100)
  const viewBox = `0 0 ${SVG_SIZE} ${SVG_SIZE * 0.65}`

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size * 0.6 }}>
        <svg
          width="100%"
          height="100%"
          viewBox={viewBox}
          aria-label={`Score de confianza: ${displayScore} – ${config.label}`}
        >
          <defs>
            <filter id="gauge-glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#EF4444" />
              <stop offset="40%"  stopColor="#F59E0B" />
              <stop offset="70%"  stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Track */}
          <path
            d={describeArc(CENTER, CENTER, RADIUS, 180, 360)}
            fill="none"
            stroke="currentColor"
            className="text-gray-200 dark:text-gray-700/50"
            strokeWidth={STROKE}
            strokeLinecap="round"
          />

          {/* Tick marks */}
          {[0, 20, 40, 60, 80, 100].map((tick) => {
            const angle  = 180 + (tick / 100) * 180
            const rad    = (angle * Math.PI) / 180
            const innerR = RADIUS - STROKE / 2 - 6
            const outerR = RADIUS - STROKE / 2 - 2
            return (
              <line
                key={tick}
                x1={CENTER + innerR * Math.cos(rad)} y1={CENTER + innerR * Math.sin(rad)}
                x2={CENTER + outerR * Math.cos(rad)} y2={CENTER + outerR * Math.sin(rad)}
                stroke="currentColor"
                className="text-gray-300 dark:text-gray-600"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )
          })}

          {/* Progress arc */}
          <path
            d={describeArc(CENTER, CENTER, RADIUS, 180, 360)}
            fill="none"
            stroke={config.color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={SEMICIRCLE}
            strokeDashoffset={offset}
            filter={displayScore >= 50 ? 'url(#gauge-glow)' : undefined}
            style={{ transition: 'stroke-dashoffset 0.08s linear, stroke 0.4s ease' }}
          />

          {/* Needle */}
          {(() => {
            const needleAngle = 180 + (displayScore / 100) * 180
            const needleRad   = (needleAngle * Math.PI) / 180
            const needleLen   = RADIUS - STROKE / 2 - 10
            const nx = CENTER + needleLen * Math.cos(needleRad)
            const ny = CENTER + needleLen * Math.sin(needleRad)
            return (
              <>
                <line
                  x1={CENTER} y1={CENTER} x2={nx} y2={ny}
                  stroke={config.color} strokeWidth="2.5" strokeLinecap="round"
                  style={{ transition: 'all 0.1s linear' }}
                />
                <circle cx={CENTER} cy={CENTER} r="5" fill={config.color} />
                <circle cx={CENTER} cy={CENTER} r="2.5" fill="white" className="dark:fill-gray-900" />
              </>
            )
          })()}

          {/* Score text */}
          <text x={CENTER} y={CENTER - 18} textAnchor="middle" dominantBaseline="middle"
            fontSize="36" fontWeight="800" fill="currentColor" className="text-gray-900 dark:text-gray-100">
            {displayScore}
          </text>

          {/* Label text */}
          <text x={CENTER} y={CENTER - 42} textAnchor="middle"
            fontSize="11" fontWeight="600" fill={config.color} letterSpacing="1.5">
            {config.label.toUpperCase()}
          </text>

          {/* Min/Max labels */}
          <text x="18" y={CENTER + 16} fontSize="10" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontWeight="500">0</text>
          <text x={SVG_SIZE - 28} y={CENTER + 16} fontSize="10" fill="currentColor" className="text-gray-400 dark:text-gray-500" fontWeight="500">100</text>
        </svg>
      </div>

      {/* Risk level badge */}
      <div
        className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
        style={{
          backgroundColor: `${config.color}18`,
          color: config.color,
          border: `1px solid ${config.color}33`,
        }}
      >
        Nivel de confianza: {config.label}
      </div>
    </div>
  )
}

/* SVG arc path helper */
function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start    = polarToCartesian(cx, cy, r, endAngle)
  const end      = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}
