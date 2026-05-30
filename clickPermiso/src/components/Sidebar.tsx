import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Logo from '../assets/logo_albarregas.png';
import { FiCalendar, FiClock, FiUser, FiLayout, FiClipboard, FiUsers, FiX, FiLogOut } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { perfil, logout } = useAuthStore();
  const isDirectivo = perfil?.rol === 'directivo';

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all
    ${isActive
      ? 'bg-slate-900 text-white shadow-sm'
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-200
        flex flex-col
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center shrink-0">
                <img src={Logo} alt="IES Albarregas" className="w-6 h-6 invert" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 leading-none">ClicPermiso</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">IES Albarregas</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:bg-slate-100 rounded">
              <FiX />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto pb-6">
          <div className="space-y-1">
            <p className="px-4 text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Docente</p>
            <NavLink to="/mi-panel" className={linkClasses} onClick={onClose}>
              <FiLayout size={18} />
              <span>Escritorio</span>
            </NavLink>
            <NavLink to="/solicitar" className={linkClasses} onClick={onClose}>
              <FiCalendar size={18} />
              <span>Nueva Solicitud</span>
            </NavLink>
            <NavLink to="/mis-solicitudes" className={linkClasses} onClick={onClose}>
              <FiClock size={18} />
              <span>Mis Permisos</span>
            </NavLink>
            <NavLink to="/perfil" className={linkClasses} onClick={onClose}>
              <FiUser size={18} />
              <span>Mi Perfil</span>
            </NavLink>
          </div>

          {isDirectivo && (
            <div className="space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Gestión</p>
              <NavLink to="/dashboard" className={linkClasses} onClick={onClose}>
                <FiLayout size={18} />
                <span>Estadísticas</span>
              </NavLink>
              <NavLink to="/calendario" className={linkClasses} onClick={onClose}>
                <FiCalendar size={18} />
                <span>Calendario Global</span>
              </NavLink>
              <NavLink to="/gestion-solicitudes" className={linkClasses} onClick={onClose}>
                <FiClipboard size={18} />
                <span>Validar Permisos</span>
              </NavLink>
              <NavLink to="/profesores" className={linkClasses} onClick={onClose}>
                <FiUsers size={18} />
                <span>Profesores</span>
              </NavLink>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 font-bold text-xs border border-slate-200">
              {perfil?.nombre?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{perfil?.nombre}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">{perfil?.rol}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 mt-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
