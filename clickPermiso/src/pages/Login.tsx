import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Logo from '../assets/logo_albarregas.png';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Debes aceptar el tratamiento de datos para continuar.');
      return;
    }

    if (!email || !password) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.error) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Contenedor principal */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <img src={Logo} alt="IES Albarregas" className="w-12 h-12 filter brightness-0 invert" />
            </div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              ClicPermiso
            </h1>
            <p className="text-slate-600 text-lg font-medium">IES Albarregas</p>
            <p className="text-slate-500 text-sm mt-2">Gestión de Ausencias del Profesorado</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Correo Electrónico
              </label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-lg" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@iesalbarregas.es"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 hover:border-slate-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 hover:border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <span className="text-red-600 text-xl shrink-0">⚠️</span>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* RGPD Consent */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-5 h-5 mt-0.5 border-2 border-blue-300 rounded-lg text-blue-600 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all"
                />
                <span className="text-sm text-slate-700 leading-relaxed">
                  Acepto el tratamiento de mis datos personales (nombre, correo, horarios) según la política de privacidad del IES Albarregas.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl uppercase text-sm tracking-wide"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Accediendo...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-xs text-slate-600">
              ¿Problemas para acceder?{' '}
              <a href="#" className="text-blue-600 font-semibold hover:text-blue-700">
                Contacta con Jefatura
              </a>
            </p>
          </div>
        </div>

        {/* Información adicional - Features */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: '🔒', title: 'Seguro', desc: 'Datos protegidos' },
            { icon: '⚡', title: 'Rápido', desc: 'Solicitudes al instante' },
            { icon: '📱', title: 'Accesible', desc: 'Cualquier dispositivo' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="text-center p-4 bg-white rounded-2xl shadow-md border border-slate-200/50 hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-slate-800 text-xs font-bold">{item.title}</p>
              <p className="text-slate-500 text-[10px] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
