import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { solicitudApi, getFileUrl } from '../api/apiClient';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiFilter, FiDownload, FiCalendar } from 'react-icons/fi';
import type { Solicitud } from '../types';

const MisSolicitudes = () => {
  const { user } = useAuthStore();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('todas');

  useRealtimeNotifications(user?.id);

  useEffect(() => {
    if (user) fetchSolicitudes();
  }, [user]);

  const fetchSolicitudes = async () => {
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

  const filtradas =
    filtro === 'todas' ? solicitudes : solicitudes.filter((s) => s.estado === filtro);

  const getStatusInfo = (estado: string) => {
    switch (estado) {
      case 'aprobada': 
        return { 
          icon: <FiCheckCircle className="text-emerald-500" />, 
          bg: 'bg-emerald-50/50', 
          border: 'border-emerald-100',
          text: 'text-emerald-700',
          label: 'Aprobada'
        };
      case 'rechazada': 
        return { 
          icon: <FiXCircle className="text-red-500" />, 
          bg: 'bg-red-50/50', 
          border: 'border-red-100',
          text: 'text-red-700',
          label: 'Denegada'
        };
      default: 
        return { 
          icon: <FiClock className="text-primary-500" />, 
          bg: 'bg-primary-50/50', 
          border: 'border-primary-100',
          text: 'text-primary-700',
          label: 'En Trámite'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium">Cargando tu historial...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Mis <span className="text-primary-600">Solicitudes</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Consulta y descarga el historial de tus permisos y su estado de validación.
          </p>
        </div>
        
        <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
          {(['todas', 'pendiente', 'aprobada', 'rechazada'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all
                ${filtro === f
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {f === 'todas' ? 'Todas' : f === 'pendiente' ? 'Trámite' : f === 'rechazada' ? 'Denegadas' : f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtradas.length === 0 ? (
          <div className="glass-card rounded-[32px] p-20 text-center border-dashed border-2 border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFilter className="text-slate-300 text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No se han encontrado registros</h3>
            <p className="text-slate-500">Intenta cambiar el filtro o realiza una nueva solicitud.</p>
          </div>
        ) : (
          filtradas.map((sol) => {
            const status = getStatusInfo(sol.estado);
            return (
              <div key={sol.id} className="glass-card rounded-[24px] border border-slate-200/60 hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 overflow-hidden group">
                <div className="flex flex-col lg:flex-row">
                  {/* Indicador de Estado Lateral */}
                  <div className={`lg:w-2 ${status.bg} border-r ${status.border}`} />
                  
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${status.bg} ${status.text} border ${status.border}`}>
                            {status.icon}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">
                              Ref: #{sol.id}
                            </span>
                            <h4 className="text-lg font-bold text-slate-800 leading-none">
                              {new Date(sol.diaSolicitado).toLocaleDateString('es-ES', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                              })}
                            </h4>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-1.5"><FiCalendar className="text-primary-500" /> {sol.turno}</span>
                          <span className="flex items-center gap-1.5"><FiClock className="text-primary-500" /> {sol.numHoras} horas</span>
                          <span className="flex items-center gap-1.5"><FiFileText className="text-primary-500" /> {sol.jornada}</span>
                        </div>

                        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Motivo de la solicitud</p>
                          <p className="text-sm text-slate-600 italic">"{sol.motivo || 'Sin especificar'}"</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${status.bg} ${status.text} ${status.border}`}>
                          {status.label}
                        </div>
                        
                        {sol.archivoAdjunto && (
                          <a
                            href={getFileUrl(sol.archivoAdjunto)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-primary-600 hover:bg-primary-50 hover:border-primary-200 transition-all shadow-sm"
                          >
                            <FiDownload />
                            Justificante
                          </a>
                        )}
                      </div>
                    </div>

                    {sol.motivoRechazo && (
                      <div className="mt-6 p-4 bg-red-50/50 border border-red-100 rounded-2xl flex gap-3 items-start">
                        <FiXCircle className="text-red-500 mt-1" />
                        <div>
                          <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">Nota de Denegación</span>
                          <p className="text-sm text-red-800">{sol.motivoRechazo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="px-8 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Registrado el {new Date(sol.createdAt).toLocaleDateString('es-ES')}
                  </span>
                  {sol.permisoNoRetribuido && (
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-black uppercase tracking-tighter">
                      No Retribuido
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MisSolicitudes;