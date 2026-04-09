import { useNavigate } from 'react-router-dom'
import FinWiseButton from '../components/ui/FinWiseButton'
import FinWiseCard   from '../components/ui/FinWiseCard'

const features = [
  { icon: '🔍', title: 'Sin formularios aburridos',   desc: 'Preguntas cotidianas, no declaraciones fiscales.' },
  { icon: '⚡', title: 'Diagnóstico en 3 minutos',    desc: 'Tu Score de Salud Financiera al instante.' },
  { icon: '🎯', title: 'Acciones concretas',           desc: 'No solo números: te decimos exactamente qué hacer.' },
  { icon: '🔒', title: 'Sin datos bancarios',          desc: 'No pedimos claves, solo tus percepciones.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main className="min-h-screen bg-transparent">
      <section className="pt-20 pb-24 px-[5%]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-700 text-xs font-semibold mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
            Diagnóstico 100% gratuito · Sin tarjeta de crédito
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6 animate-fade-in-up text-gray-900 dark:text-gray-100">
            Conoce tu{' '}
            <span className="text-teal-900 dark:text-sky-300">salud financiera</span>{' '}
            en menos de 3 minutos
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-10 animate-fade-in-up delay-100">
            Sin formularios complejos. Sin datos bancarios. Solo preguntas honestas
            y un plan de acción real para que tu dinero trabaje mejor.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up delay-200">
            <FinWiseButton size="lg" pulse onClick={() => navigate('/diagnostico')} className="w-full sm:w-auto min-w-56">
              Empezar Diagnóstico Gratis →
            </FinWiseButton>
            <button
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
              className="text-sm border border-transparent px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-teal-900 dark:hover:text-sky-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              ¿Cómo funciona?
            </button>
          </div>

          <p className="mt-8 text-xs text-gray-500 dark:text-gray-500 animate-fade-in-up delay-300">
            +12,000 personas ya conocen su score · Datos nunca compartidos
          </p>
        </div>
      </section>

      {/* Score Preview */}
      <section className="px-[5%] pb-20">
        <div className="max-w-sm mx-auto">
          <FinWiseCard elevation="lg" className="text-center py-8">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Score de Salud Financiera
            </p>
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#F3F4F6" strokeWidth="9" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#000000" strokeWidth="9"
                  strokeLinecap="round" strokeDasharray="339.3" strokeDashoffset="101.8"
                  transform="rotate(-90 60 60)" />
                <text x="60" y="57" textAnchor="middle" fontSize="22" fontWeight="700" fill="currentColor" className="text-gray-900 dark:text-gray-100">?</text>
                <text x="60" y="74" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor" className="text-gray-500 dark:text-gray-400" letterSpacing="0.5">TU SCORE</text>
              </svg>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Responde 7 preguntas y descubre<br />
              <span className="text-black font-semibold">tu número real</span>
            </p>
            <FinWiseButton size="sm" onClick={() => navigate('/diagnostico')} className="mt-5 mx-auto">
              Calcular mi score
            </FinWiseButton>
          </FinWiseCard>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-[5%] pb-20 w-full mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
          ¿Por qué FinWise?
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-10 text-sm">
          Diseñado para mexicanos que quieren avanzar sin rodeos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <FinWiseCard key={f.title} elevation="sm" className="animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold mb-1 text-gray-900 dark:text-gray-100">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </FinWiseCard>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="px-[5%] pb-24">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Tu situación financiera merece<br />
            <span className="text-teal-900 dark:text-sky-300">claridad, no culpa.</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">
            Empieza gratis. Sin registro. Sin tarjeta. Solo honestidad.
          </p>
          <FinWiseButton size="lg" onClick={() => navigate('/diagnostico')} pulse>
            Empezar Diagnóstico Gratis →
          </FinWiseButton>
        </div>
      </section>
    </main>
  )
}
