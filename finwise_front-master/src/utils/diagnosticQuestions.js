/* Behavioral questions for Phase 1 diagnosis.
   Each answer is "soft" (emotional / perceptual) and gets
   mapped to hard financial variables by the score engine. */

export const INCOME_RANGES = [
  { label: 'Menos de $8,000',   value: 6_000  },
  { label: '$8,000 – $15,000',  value: 11_500 },
  { label: '$15,000 – $25,000', value: 20_000 },
  { label: '$25,000 – $40,000', value: 32_500 },
  { label: 'Más de $40,000',    value: 50_000 },
]

export const DEBT_OPTIONS = [
  { label: 'Sin deudas, tranquilo/a',            emoji: '😌', factor: 0   },
  { label: 'Una deuda pequeña y manejable',       emoji: '🙂', factor: 0.3 },
  { label: 'Varias deudas activas',               emoji: '😐', factor: 1.5 },
  { label: 'Mi deuda me preocupa bastante',        emoji: '😟', factor: 3.0 },
  { label: 'Situación crítica con mis deudas',     emoji: '😰', factor: 5.0 },
]

export const DISCRETIONARY_OPTIONS = [
  { label: 'Comer fuera / delivery',              emoji: '🍔', factor: 0.08 },
  { label: 'Entretenimiento y salidas',            emoji: '🎉', factor: 0.05 },
  { label: 'Ropa y compras personales',            emoji: '👗', factor: 0.07 },
  { label: 'Viajes y experiencias',                emoji: '✈️', factor: 0.06 },
  { label: 'Casi no gasto en extras',              emoji: '🏦', factor: 0.02 },
]

export const EMERGENCY_OPTIONS = [
  { label: 'Sí, tengo 3+ meses cubiertos',        emoji: '✅', months: 3  },
  { label: 'Algo tengo, pero no es suficiente',   emoji: '🔶', months: 1  },
  { label: 'No tengo ahorros de emergencia',       emoji: '❌', months: 0  },
]

export const STRESS_LABELS = [
  'Muy preocupado/a',
  'Preocupado/a',
  'Neutral',
  'Tranquilo/a',
  'Muy tranquilo/a',
]

export const QUESTIONS = [
  {
    id: 'stress',
    step: 1,
    title: '¿Cómo te sientes hoy respecto a tu dinero?',
    subtitle: 'No hay respuesta correcta. Solo queremos entender tu punto de partida.',
    type: 'slider-emoji',
  },
  {
    id: 'income',
    step: 2,
    title: '¿Cuánto estimas que ganas al mes (neto)?',
    subtitle: 'Elige el rango que más se acerca a tu ingreso mensual real.',
    type: 'range-picker',
  },
  {
    id: 'fixedExpenseRatio',
    step: 3,
    title: '¿Qué parte de tu ingreso se va en gastos fijos?',
    subtitle: 'Renta, servicios, transporte, suscripciones… ¿cuánto estimas?',
    type: 'slider-percent',
    min: 10,
    max: 85,
    default: 35,
    unit: '%',
  },
  {
    id: 'savingsRate',
    step: 4,
    title: '¿Cuánto de tu ingreso logras ahorrar cada mes?',
    subtitle: 'Si actualmente no ahorras, ponlo en 0%. Sin juicios.',
    type: 'slider-percent',
    min: 0,
    max: 50,
    default: 5,
    unit: '%',
  },
  {
    id: 'debtLevel',
    step: 5,
    title: '¿Cómo describes tu situación con deudas?',
    subtitle: 'Tarjetas, créditos, préstamos personales, BNPL…',
    type: 'choice-cards',
    options: DEBT_OPTIONS,
  },
  {
    id: 'discretionaryCategory',
    step: 6,
    title: '¿En qué gastas más fuera de lo básico?',
    subtitle: 'Selecciona la categoría donde más se va tu dinero "extra".',
    type: 'choice-cards',
    options: DISCRETIONARY_OPTIONS,
  },
  {
    id: 'emergencyFund',
    step: 7,
    title: '¿Tienes un "colchón" para emergencias?',
    subtitle: 'Dinero que podrías usar ahora mismo si algo inesperado ocurre.',
    type: 'choice-cards',
    options: EMERGENCY_OPTIONS,
  },
]
