import { useAuthStore } from '../stores/authStore';
import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { perfil } = useAuthStore();

  return (
    <header className="flex items-center justify-between py-6 sticky top-0 z-30 bg-[#f8fafc]/80 backdrop-blur-md mb-4">
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 text-slate-500 hover:bg-white hover:text-primary-600 rounded-2xl transition-all shadow-sm border border-slate-200/50"
        >
          <FiMenu size={22} />
        </button>
        
        <div className="relative hidden md:block group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-11 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-white rounded-2xl transition-all relative border border-slate-200/50 shadow-sm">
          <FiBell size={22} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary-500 border-2 border-white rounded-full" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-2" />

        <div className="flex items-center gap-3 pl-2 pr-1 py-1 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="hidden sm:block text-right px-2">
            <p className="text-sm font-bold text-slate-800 leading-none mb-1">
              {perfil?.nombre} {perfil?.apellidos}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{perfil?.rol}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-primary-500/20">
            {perfil?.nombre?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;