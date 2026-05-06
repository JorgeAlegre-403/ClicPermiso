import { useAuthStore } from '../stores/authStore';
import { FiLogOut, FiMenu, FiBell } from 'react-icons/fi';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { perfil, logout } = useAuthStore();

  return (
    <header className="flex items-center justify-between py-5 mb-8 border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-30 -mx-4 sm:-mx-8 px-4 sm:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <FiMenu className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
          ClicPermiso
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all relative">
          <FiBell className="text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            {perfil?.nombre?.charAt(0) || 'U'}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800">
              {perfil?.nombre}
            </p>
            <p className="text-xs text-slate-500 capitalize">{perfil?.rol}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium text-sm"
        >
          <FiLogOut className="text-lg" />
          <span className="hidden sm:inline">Cerrar</span>
        </button>
      </div>
    </header>
  );
};

export default Header;