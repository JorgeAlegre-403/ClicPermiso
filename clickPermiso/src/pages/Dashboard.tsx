import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/apiClient';
import type { Solicitud, DashboardStats } from '../types';
import { FiTrendingUp, FiClock, FiCheckCircle, FiXCircle, FiUsers, FiActivity, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0, profesores: 0 });
  const [recientes, setRecientes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const [s, r] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecientes(),
      ]);
      setStats(s);
      setRecientes(r);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
        <p className="text-slate-500 text-sm">Resumen de actividad y estadísticas generales.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, icon: <FiTrendingUp />, color: 'slate' },
          { label: 'Pendientes', value: stats.pendientes, icon: <FiClock />, color: 'amber' },
          { label: 'Aprobadas', value: stats.aprobadas, icon: <FiCheckCircle />, color: 'emerald' },
          { label: 'Denegadas', value: stats.rechazadas, icon: <FiXCircle />, color: 'red' },
          { label: 'Profesores', value: stats.profesores, icon: <FiUsers />, color: 'slate' },
        ].map(({ label, value, icon, color }: any) => (
          <div key={label} className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
            <div className={`flex items-center justify-between mb-3`}>
              <span className="text-slate-400">{icon}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                ${color === 'amber' ? 'bg-amber-50 text-amber-600' : 
                  color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  color === 'red' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                {label}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FiActivity size={16} />
              Actividad Reciente
            </h2>
            <Link to="/gestion-solicitudes" className="text-xs text-slate-500 hover:text-slate-900 font-medium">Ver todas</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recientes.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm italic">No hay actividad.</div>
            ) : (
              recientes.map((sol) => (
                <div key={sol.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {sol.perfiles?.nombre?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {sol.perfiles?.nombre} {sol.perfiles?.apellidos}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(sol.createdAt).toLocaleDateString('es-ES')} • {sol.motivo || 'Sin motivo'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border
                      ${sol.estado === 'pendiente' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        sol.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          'bg-red-50 text-red-600 border-red-100'}`}>
                      {sol.estado}
                    </span>
                    <FiChevronRight className="text-slate-300" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white">
            <h3 className="text-sm font-bold mb-4">Estado de Aprobación</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] uppercase font-bold mb-1 opacity-70">
                  <span>Porcentaje</span>
                  <span>{stats.total > 0 ? Math.round((stats.aprobadas / stats.total) * 100) : 0}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${stats.total > 0 ? (stats.aprobadas / stats.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <p className="text-[11px] text-white/60 leading-relaxed italic">
                Información actualizada en tiempo real según la base de datos.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{stats.profesores}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Profesores registrados</p>
            <Link to="/profesores" className="mt-4 btn-primary w-full inline-block text-xs text-center">
              Directorio completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;