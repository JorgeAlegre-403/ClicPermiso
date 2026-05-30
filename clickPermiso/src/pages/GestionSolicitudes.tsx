import { useEffect, useState } from 'react';
import { solicitudApi, getFileUrl } from '../api/apiClient';
import { useToastStore } from '../stores/toastStore';
import type { Solicitud } from '../types';
import { FiDownload, FiCheck, FiX, FiFilter, FiUser, FiCalendar, FiClock, FiCheckSquare, FiSquare } from 'react-icons/fi';

const GestionSolicitudes = () => {
  const { addToast } = useToastStore();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('pendiente');
  const [motivoRechazo, setMotivoRechazo] = useState<Record<number, string>>({});
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  useEffect(() => { fetchSolicitudes(); }, []);

  const fetchSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await solicitudApi.getAll();
      setSolicitudes(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const actualizarEstadoIndividual = async (id: number, estado: 'aprobada' | 'rechazada') => {
    try {
      await solicitudApi.updateEstado(id, estado, motivoRechazo[id]);
      addToast(`Solicitud ${estado} correctamente`, 'success');
      fetchSolicitudes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      addToast('Error al actualizar: ' + msg, 'error');
    }
  };

  const actualizarEstadoMasivo = async (estado: 'aprobada' | 'rechazada') => {
    if (seleccionadas.length === 0) return;
    try {
      await Promise.all(
        seleccionadas.map((id) =>
          solicitudApi.updateEstado(id, estado, motivoRechazo[id]),
        ),
      );
      addToast(`${seleccionadas.length} solicitudes procesadas`, 'success');
      setSeleccionadas([]);
      fetchSolicitudes();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      addToast('Error procesando solicitudes: ' + msg, 'error');
    }
  };

  const toggleSeleccion = (id: number) =>
    setSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const filtradas =
    filtro === 'todas' ? solicitudes : solicitudes.filter((s) => s.estado === filtro);

  const toggleTodas = () => {
    if (seleccionadas.length === filtradas.length && filtradas.length > 0) setSeleccionadas([]);
    else setSeleccionadas(filtradas.filter((s) => s.estado === 'pendiente').map((s) => s.id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-medium">Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Validar <span className="text-primary-600">Permisos</span>
          </h2>
          <p className="text-slate-500 font-medium">Revisa las peticiones del profesorado y gestiona los estados de ausencia.</p>
        </div>
        
        <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
          {(['pendiente', 'aprobada', 'rechazada', 'todas'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFiltro(f); setSeleccionadas([]); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all
                ${filtro === f
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              {f === 'todas' ? 'Todas' : f}
            </button>
          ))}
        </div>
      </div>

      {seleccionadas.length > 0 && (
        <div className="mb-6 p-4 bg-primary-600 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in shadow-lg shadow-primary-600/20">
          <div className="flex items-center gap-3 text-white">
            <FiCheckSquare className="text-xl" />
            <span className="text-sm font-bold">{seleccionadas.length} solicitudes seleccionadas</span>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => actualizarEstadoMasivo('aprobada')}
              className="flex-1 md:flex-none px-6 py-2 bg-white text-primary-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-50 transition-all"
            >
              Aprobar Todo
            </button>
            <button 
              onClick={() => actualizarEstadoMasivo('rechazada')}
              className="flex-1 md:flex-none px-6 py-2 bg-white/10 text-white border border-white/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Rechazar Todo
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filtradas.length === 0 ? (
          <div className="glass-card rounded-[32px] p-20 text-center border-dashed border-2 border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiFilter className="text-slate-300 text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">No hay solicitudes pendientes</h3>
            <p className="text-slate-500">Todo el trabajo está al día. ¡Buen trabajo!</p>
          </div>
        ) : (
          <>
            {filtro === 'pendiente' && (
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-100/50 rounded-xl w-fit cursor-pointer hover:bg-slate-100 transition-colors" onClick={toggleTodas}>
                {seleccionadas.length === filtradas.length ? <FiCheckSquare className="text-primary-600" /> : <FiSquare className="text-slate-400" />}
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Seleccionar todas</span>
              </div>
            )}

            {filtradas.map((sol) => (
              <div key={sol.id} className={`glass-card rounded-[32px] border transition-all duration-300 overflow-hidden
                ${seleccionadas.includes(sol.id) ? 'border-primary-500 shadow-xl shadow-primary-500/5 ring-1 ring-primary-500' : 'border-slate-200/60'}`}>
                
                <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
                  {/* Avatar y Datos Profe */}
                  <div className="flex items-start gap-4 lg:w-1/4">
                    {sol.estado === 'pendiente' && (
                      <div className="mt-1">
                         <input 
                          type="checkbox" 
                          checked={seleccionadas.includes(sol.id)}
                          onChange={() => toggleSeleccion(sol.id)}
                          className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </div>
                    )}
                    <div className="flex flex-col gap-3">
                      <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-black border border-slate-200">
                        {sol.perfiles?.nombre?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">
                          {sol.perfiles?.nombre} {sol.perfiles?.apellidos}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Profesor</p>
                      </div>
                    </div>
                  </div>

                  {/* Detalles de la Solicitud */}
                  <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <DetailBox icon={<FiCalendar />} label="Día" value={new Date(sol.diaSolicitado).toLocaleDateString('es-ES')} />
                      <DetailBox icon={<FiClock />} label="Turno" value={sol.turno} />
                      <DetailBox icon={<FiClock />} label="Horas" value={`${sol.numHoras}h / ${sol.numDias}d`} />
                      <DetailBox icon={<FiUser />} label="Retribuido" value={sol.permisoNoRetribuido ? 'No' : 'Sí'} />
                    </div>

                    <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Motivo del Docente</p>
                       <p className="text-sm text-slate-600 italic">"{sol.motivo || 'Sin motivo especificado'}"</p>
                       {sol.archivoAdjunto && (
                         <a href={getFileUrl(sol.archivoAdjunto)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-primary-600 hover:underline">
                            <FiDownload /> Ver Documento Adjunto
                         </a>
                       )}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="lg:w-1/4 shrink-0 flex flex-col justify-center">
                    {sol.estado === 'pendiente' ? (
                      <div className="space-y-4">
                         <textarea
                          placeholder="Motivo de rechazo (opcional)"
                          value={motivoRechazo[sol.id] || ''}
                          onChange={(e) => setMotivoRechazo({ ...motivoRechazo, [sol.id]: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs focus:ring-4 focus:ring-primary-500/5 focus:border-primary-500 outline-none transition-all resize-none"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={() => actualizarEstadoIndividual(sol.id, 'aprobada')}
                            className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1"
                          >
                            <FiCheck /> Aprobar
                          </button>
                          <button 
                            onClick={() => actualizarEstadoIndividual(sol.id, 'rechazada')}
                            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-1"
                          >
                            <FiX /> Denegar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-right flex flex-col items-end gap-2">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                          ${sol.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                          {sol.estado}
                        </span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          Procesado el {new Date(sol.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

const DetailBox = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-2">
    <div className="text-primary-500">{icon}</div>
    <div>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">{label}</p>
      <p className="text-xs font-bold text-slate-700 leading-none">{value}</p>
    </div>
  </div>
);

export default GestionSolicitudes;