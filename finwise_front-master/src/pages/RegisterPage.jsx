import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useRegister } from '../hooks/useAuth'
import { clearError } from '../store/slices/authSlice'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const { isLoading, error: authError } = useSelector((s) => s.auth)
  const registerMutation = useRegister()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = (cleanName, cleanEmail) => {
    const e = {}
    if (!cleanName) e.name = 'Ingresa tu nombre completo'
    if (!/\S+@\S+\.\S+/.test(cleanEmail)) e.email = 'Ingresa un correo válido'
    if (password.length < 8) e.password = 'Mínimo 8 caracteres'
    if (password !== confirmPassword) e.confirmPassword = 'Las contraseñas no coinciden'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    dispatch(clearError())
    
    const cleanName = name.trim()
    const cleanEmail = email.trim()

    const e = validate(cleanName, cleanEmail)
    if (Object.keys(e).length) {
      setFieldErrors(e)
      return
    }
    
    setFieldErrors({})
    
    registerMutation.mutate({
      email: cleanEmail,
      password: password,
      name: cleanName,
    })
  }

  const isPending = isLoading || registerMutation.isPending

  return (
    <main className="min-h-screen flex items-center justify-center px-[5%] py-12">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-1 mb-6">
            <span className="text-teal-900 dark:text-sky-300 text-4xl font-extrabold">Fin</span>
            <span className="text-gray-900 dark:text-gray-100 text-4xl font-extrabold">Wise</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Crea tu cuenta
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Comienza tu camino hacia el bienestar financiero
          </p>
        </div>

        {/* Auth error */}
        {authError && (
          <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 px-4 py-3 animate-fade-in">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="animate-fade-in-up delay-100">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-xl shadow-black/5 dark:shadow-black/20 p-6 space-y-5">

            <div className="space-y-1.5">
              <label htmlFor="register-name" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Nombre <span className="text-gray-400">*</span>
              </label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                autoComplete="name"
                required
                className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
              {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-email" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Correo electrónico <span className="text-gray-400">*</span>
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                autoComplete="email"
                required
                className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
              {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-password" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Contraseña <span className="text-gray-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    )}
                  </svg>
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4].map((i) => {
                    const strength = password.length >= 12 ? 4 : password.length >= 10 ? 3 : password.length >= 8 ? 2 : 1
                    const colors = ['bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500']
                    return (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? colors[strength - 1] : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )
                  })}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Confirmar contraseña <span className="text-gray-400">*</span>
              </label>
              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
              {fieldErrors.confirmPassword && <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-700 hover:from-teal-700 hover:via-cyan-700 hover:to-teal-800 transition-all duration-200 disabled:opacity-60 disabled:cursor-wait shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creando cuenta...
                </span>
              ) : (
                'Crear cuenta y comenzar →'
              )}
            </button>

          </div>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 animate-fade-in-up delay-200">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-teal-700 dark:text-sky-300 font-semibold hover:text-teal-600 dark:hover:text-sky-200 transition-colors"
          >
            Iniciar sesión
          </Link>
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 dark:text-gray-500 animate-fade-in-up delay-300">
          <span>🔒 Datos encriptados</span>
          <span>🚫 Sin spam</span>
          <span>❌ Sin tarjeta de crédito</span>
        </div>
      </div>
    </main>
  )
}