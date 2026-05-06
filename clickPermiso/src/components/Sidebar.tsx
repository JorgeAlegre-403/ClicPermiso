import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Logo from '../assets/logo_albarregas.png';
import { FiCalendar, FiClock, FiUser, FiLayout, FiClipboard, FiUsers, FiX } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { perfil } = useAuthStore();
  const isDirectivo = perfil?.rol === 'directivo';

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
    ${isActive
      ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-l-4 border-blue-600'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-200
        flex flex-col shadow-xl lg:shadow-none
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Cabecera Sidebar */}
        <div className="p-6 border-b border-slate-200 bg-linear-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <img src={Logo} alt="IES Albarregas" className="w-6 h-6 filter brightness-0 invert" />
              </div>
              <div>
                <h2 className="text-sm font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ClicPermiso
                </h2>
                <p className="text-xs text-slate-500">IES Albarregas</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div>
            <p className="px-4 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Mi Espacio</p>
            <div className="space-y-2">
              <NavLink to="/mi-panel" className={linkClasses} onClick={onClose}>
                <FiLayout className="text-lg" />
                <span>Panel principal</span>
              </NavLink>
              <NavLink to="/solicitar" className={linkClasses} onClick={onClose}>
                <FiCalendar className="text-lg" />
                <span>Solicitar día</span>
              </NavLink>
              <NavLink to="/mis-solicitudes" className={linkClasses} onClick={onClose}>
                <FiClock className="text-lg" />
                <span>Mis solicitudes</span>
              </NavLink>
              <NavLink to="/perfil" className={linkClasses} onClick={onClose}>
                <FiUser className="text-lg" />
                <span>Mi perfil</span>
              </NavLink>
            </div>
          </div>

          {isDirectivo && (
            <div>
              <p className="px-4 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Administración</p>
              <div className="space-y-2">
                <NavLink to="/dashboard" className={linkClasses} onClick={onClose}>
                  <FiLayout className="text-lg" />
                  <span>Panel general</span>
                </NavLink>
                <NavLink to="/calendario" className={linkClasses} onClick={onClose}>
                  <FiCalendar className="text-lg" />
                  <span>Calendario</span>
                </NavLink>
                <NavLink to="/gestion-solicitudes" className={linkClasses} onClick={onClose}>
                  <FiClipboard className="text-lg" />
                  <span>Validar permisos</span>
                </NavLink>
                <NavLink to="/profesores" className={linkClasses} onClick={onClose}>
                  <FiUsers className="text-lg" />
                  <span>Directorio</span>
                </NavLink>
              </div>
            </div>
          )}
        </nav>

        {/* Usuario (Pie) */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {perfil?.nombre?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {perfil?.nombre}
              </p>
              <p className="text-xs text-slate-500 capitalize">{perfil?.rol}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
