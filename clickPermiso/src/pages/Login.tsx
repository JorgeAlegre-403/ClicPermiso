import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Logo from '../assets/logo_albarregas.png';
import { FiMail, FiLock, FiEye, FiEyeOff, FiChevronRight } from 'react-icons/fi';

const Login = () => {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [consent,     setConsent]     = useState(false);
  const [showPassword,setShowPassword]= useState(false);
  const [error,       setError]       = useState('');
  const [isLoading,   setIsLoading]   = useState(false);

  const { login }  = useAuthStore();
  const navigate   = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!consent) {
      setError('Debes aceptar el tratamiento de datos para continuar.');
      return;
    }
    
    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 gap-0 relative z-10 mx-4 glass-card rounded-[32px] overflow-hidden premium-shadow border-white/10">
        
        {/* Lado Izquierdo: Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-linear-to-br from-primary-600 to-indigo-800 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
               <img src={Logo} alt="IES Albarregas" className="w-10 h-10 filter brightness-0 invert" />
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Gestiona tus ausencias de forma inteligente.
            </h2>
            <p className="text-primary-100 text-lg">
              Simplificamos los trámites administrativos para que puedas centrarte en lo que importa: la enseñanza.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-6 mt-auto">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">100%</span>
              <span className="text-primary-200 text-sm">Digital</span>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">Realtime</span>
              <span className="text-primary-200 text-sm">Notificaciones</span>
            </div>
          </div>

          {/* Círculos decorativos internos */}
          <div className="absolute top-1/2 right-[-20%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>

        {/* Lado Derecho: Formulario */}
        <div className="p-8 lg:p-16 bg-white/80 backdrop-blur-xl">
          <div className="text-center lg:text-left mb-10">
            <div className="lg:hidden flex justify-center mb-6">
               <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <img src={Logo} alt="Logo" className="w-8 h-8 filter brightness-0 invert" />
               </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido de nuevo</h1>
            <p className="text-slate-500">Introduce tus credenciales del IES Albarregas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Institucional</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                  <FiMail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700"
                  placeholder="usuario@iesalbarregas.es"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                  <FiLock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-slate-700"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-fade-in flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                {error}
              </div>
            )}

            <div className="flex items-start gap-3 p-2">
              <div className="relative flex items-center h-5">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </div>
              <label className="text-sm text-slate-500 leading-tight cursor-pointer select-none">
                Acepto el tratamiento de mis datos personales según la normativa vigente del centro.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar al Panel
                  <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-400 text-xs">
              &copy; {new Date().getFullYear()} ClicPermiso - IES Albarregas. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;