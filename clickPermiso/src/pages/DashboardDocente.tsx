import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { solicitudApi } from '../api/apiClient';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import { FiCheckCircle, FiClock, FiInfo, FiPlusCircle, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import type { Solicitud } from '../types';

const DashboardDocente = () => {
  const { user } = useAuthStore();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useRealtimeNotifications(user?.id);

  const DIAS_TOTALES = 6;

  useEffect(() => {
    if (user) fetchDatos();
  }, [user]);

  const fetchDatos = async () => {
    setLoading(true);
    try {
      const data = await solicitudApi.getMias();
      setSolicitudes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const diasConsumidos = solicitudes
    .filter((s) => s.estado === 'aprobada' && !s.permisoNoRetribuido)
    .reduce((acc, curr) => acc + curr.numDias, 0);

  const diasPendientes = solicitudes
    .filter((s) => s.estado === 'pendiente' && !s.permisoNoRetribuido)
    .reduce((acc, curr) => acc + curr.numDias, 0);

  const diasDisponibles = Math.max(0, DIAS_TOTALES - diasConsumidos);
  const porcentaje = (diasConsumidos / DIAS_TOTALES) * 100;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi Panel</h1>
          <p className="text-slate-500 text-sm">Estado de tus solicitudes y días disponibles.</p>
        </div>
        <Link 
          to="/solicitar" 
          className="btn-primary inline-flex items-center gap-2 text-sm"
        >
          <FiPlusCircle size={18} />
          Nueva Solicitud
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
            <FiCalendar className="text-slate-400" />
            Días de Asuntos Propios
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-4xl font-bold text-slate-900">{diasDisponibles}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disponibles</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-600">{diasConsumidos} / {DIAS_TOTALES}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consumidos</p>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-800 transition-all duration-500"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Estado actual</p>
                <p className="text-sm font-semibold text-slate-700">Cuenta al día</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">En trámite</p>
                <p className="text-sm font-semibold text-slate-700">{diasPendientes} días pendientes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-xl p-6 text-white shadow-sm">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">
            <FiInfo className="text-white/70" />
          </div>
          <h3 className="text-sm font-bold mb-4">Información Útil</h3>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <span className="w-1 h-1 bg-white/40 rounded-full mt-2" />
              <p className="text-xs text-white/70 leading-relaxed">
                Los permisos no retribuidos no descuentan días del cupo anual.
              </p>
            </li>
            <li className="flex gap-2">
              <span className="w-1 h-1 bg-white/40 rounded-full mt-2" />
              <p className="text-xs text-white/70 leading-relaxed">
                Solicita con al menos 48h de antelación.
              </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Actividad Reciente</h2>
          <Link to="/mis-solicitudes" className="text-xs text-slate-500 hover:text-slate-900 font-medium">Ver historial</Link>
        </div>
        {solicitudes.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No hay solicitudes registradas.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {solicitudes.slice(0, 5).map((sol) => (
              <div key={sol.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                    ${sol.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-600' : 
                      sol.estado === 'rechazada' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                    {new Date(sol.diaSolicitado).getDate()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Solicitud de permiso</p>
                    <p className="text-xs text-slate-500">
                      {new Date(sol.diaSolicitado).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border
                  ${sol.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    sol.estado === 'rechazada' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                  {sol.estado}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardDocente;