import { useEffect, useState } from 'react';
import { perfilApi } from '../api/apiClient';
import type { Perfil } from '../types';
import { FiSearch, FiMail, FiCreditCard, FiBriefcase, FiAward, FiUsers } from 'react-icons/fi';

const Profesores = () => {
  const [profesores, setProfesores] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => { fetchProfesores(); }, []);

  const fetchProfesores = async () => {
    setLoading(true);
    try {
      const data = await perfilApi.getAll();
      setProfesores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtrados = profesores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.email.toLowerCase().includes(busqueda.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium">Cargando directorio del claustro...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Directorio del <span className="text-primary-600">Claustro</span>
          </h2>
          <p className="text-slate-500 font-medium">Listado completo del personal docente y directivo del IES Albarregas.</p>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar por nombre, email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200/60 rounded-[20px] text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.length === 0 ? (
          <div className="lg:col-span-3 glass-card rounded-[32px] p-20 text-center border-dashed border-2 border-slate-200">
            <FiUsers size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">No se han encontrado profesores con ese criterio.</p>
          </div>
        ) : (
          filtrados.map((prof) => (
            <div key={prof.id} className="glass-card rounded-[32px] border border-slate-200/60 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-500/20 group-hover:rotate-3 transition-transform">
                  {prof.nombre.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-800 truncate leading-tight">
                    {prof.nombre} {prof.apellidos}
                  </h3>
                  <span className={`inline-block px-2 py-0.5 mt-1 rounded-lg text-[9px] font-black uppercase tracking-widest border
                    ${prof.rol === 'directivo' ? 'bg-primary-50 text-primary-600 border-primary-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {prof.rol}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <IconData icon={<FiMail />} value={prof.email} />
                <IconData icon={<FiCreditCard />} value={prof.dni || 'Sin DNI'} />
                <IconData icon={<FiBriefcase />} value={prof.relJuridica || 'No especificado'} />
                <IconData icon={<FiAward />} value={`${prof.aniosServicio || 0} años de servicio`} />
              </div>

              <div className="mt-6 flex justify-between items-center">
                 <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${prof.haceSustitucion ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sustituciones</span>
                 </div>
                <button className="text-[10px] font-black text-primary-600 uppercase hover:underline">Ver Historial</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const IconData = ({ icon, value }: any) => (
  <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-700 transition-colors">
    <div className="text-primary-400">{icon}</div>
    <span className="text-xs font-bold truncate">{value}</span>
  </div>
);

export default Profesores;