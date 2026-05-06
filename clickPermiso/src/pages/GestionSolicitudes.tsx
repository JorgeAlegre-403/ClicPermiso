import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useToastStore } from '../stores/toastStore';
import type { Solicitud } from '../types';
import { FiPaperclip, FiDownload } from 'react-icons/fi';

const GestionSolicitudes = () => {
  const { addToast } = useToastStore();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('pendiente');
  const [motivoRechazo, setMotivoRechazo] = useState<Record<number, string>>({});
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*, perfiles(nombre, apellidos, email, dni)')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSolicitudes(data as Solicitud[]);
    }
    setLoading(false);
  };

  const actualizarEstadoMasivo = async (estado: 'aprobada' | 'rechazada') => {
    if (seleccionadas.length === 0) return;

    // Preparar actualizaciones
    const promises = seleccionadas.map(id => {
      const updateData: Record<string, string> = { estado };
      if (estado === 'rechazada' && motivoRechazo[id]) {
        updateData.motivo_rechazo = motivoRechazo[id];
      }
      return supabase.from('solicitudes').update(updateData).eq('id', id);
    });

    try {
      await Promise.all(promises);
      addToast(`${seleccionadas.length} solicitudes procesadas a ${estado}`, 'success');
      setSeleccionadas([]);
      fetchSolicitudes();
    } catch (error: any) {
      addToast('Error procesando solicitudes: ' + error.message, 'error');
    }
  };

  const actualizarEstadoIndividual = async (id: number, estado: 'aprobada' | 'rechazada') => {
    const updateData: Record<string, string> = { estado };
    if (estado === 'rechazada' && motivoRechazo[id]) {
      updateData.motivo_rechazo = motivoRechazo[id];
    }

    const { error } = await supabase
      .from('solicitudes')
      .update(updateData)
      .eq('id', id);

    if (error) {
      addToast('Error al actualizar: ' + error.message, 'error');
    } else {
      addToast(`Solicitud ${estado}`, 'success');
      fetchSolicitudes();
    }
  };

  const toggleSeleccion = (id: number) => {
    setSeleccionadas(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSeleccionTodas = () => {
    if (seleccionadas.length === filtradas.length) {
      setSeleccionadas([]);
    } else {
      setSeleccionadas(filtradas.filter(s => s.estado === 'pendiente').map(s => s.id));
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('documentos').getPublicUrl(path);
    return data.publicUrl;
  };

  const filtradas = filtro === 'todas'
    ? solicitudes
    : solicitudes.filter((s) => s.estado === filtro);

  if (loading) {
    return <div className="p-8 text-slate-500 text-sm">Cargando solicitudes...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800">Gestión de Solicitudes</h2>
        <p className="text-sm text-slate-500 mt-1">Revisa y tramita los permisos del personal.</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {(['pendiente', 'aprobada', 'rechazada', 'todas'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFiltro(f);
                setSeleccionadas([]); // Resetear selección al cambiar filtro
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize border transition-none
                ${filtro === f
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                }`}
            >
              {f === 'todas' ? 'Todas' : f}
            </button>
          ))}
        </div>

        {seleccionadas.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 mr-2">{seleccionadas.length} seleccionadas</span>
            <button
              onClick={() => actualizarEstadoMasivo('aprobada')}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600"
            >
              Aprobar selección
            </button>
            <button
              onClick={() => actualizarEstadoMasivo('rechazada')}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600"
            >
              Denegar selección
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filtradas.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No hay solicitudes en este estado.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtro === 'pendiente' && (
              <div className="p-3 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500 cursor-pointer ml-2"
                  checked={seleccionadas.length === filtradas.length && filtradas.length > 0}
                  onChange={toggleSeleccionTodas}
                />
                <span className="text-xs font-medium text-slate-500">Seleccionar todas las pendientes</span>
              </div>
            )}
            
            {filtradas.map((sol) => (
              <div key={sol.id} className="p-5 flex flex-col md:flex-row md:items-start gap-4 hover:bg-slate-50 transition-none">
                
                {sol.estado === 'pendiente' && (
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                      checked={seleccionadas.includes(sol.id)}
                      onChange={() => toggleSeleccion(sol.id)}
                    />
                  </div>
                )}

                <div className="flex-1 space-y-3 min-w-0">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {sol.perfiles ? `${sol.perfiles.nombre} ${sol.perfiles.apellidos}` : 'Docente'}
                    </h3>
                    <p className="text-xs text-slate-500">{sol.perfiles?.email}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                    <div>
                      <span className="font-semibold mr-1">Día:</span>
                      {new Date(sol.dia_solicitado).toLocaleDateString('es-ES')}
                    </div>
                    <div>
                      <span className="font-semibold mr-1">Turno:</span>
                      {sol.turno}
                    </div>
                    <div>
                      <span className="font-semibold mr-1">Jornada:</span>
                      {sol.jornada}
                    </div>
                    <div>
                      <span className="font-semibold mr-1">Horas:</span>
                      {sol.num_horas}h / {sol.num_dias}d
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">Motivo indicado:</span>
                    <p className="text-xs text-slate-600 wrap-break-word">{sol.motivo || 'Sin motivo especificado.'}</p>
                    
                    {sol.archivo_adjunto && (
                      <div className="mt-3 flex items-center gap-2">
                        <a 
                          href={getPublicUrl(sol.archivo_adjunto)} 
                          download
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <FiDownload className="text-sm" />
                          Descargar justificante
                        </a>
                      </div>
                    )}
                  </div>

                  {sol.permiso_no_retribuido && (
                    <div className="text-xs font-medium text-blue-600">
                      Permiso No Retribuido
                    </div>
                  )}
                </div>

                <div className="w-full md:w-64 shrink-0">
                  {sol.estado === 'pendiente' ? (
                    <div className="space-y-2">
                      <textarea
                        placeholder="Motivo (si se rechaza)"
                        value={motivoRechazo[sol.id] || ''}
                        onChange={(e) => setMotivoRechazo({ ...motivoRechazo, [sol.id]: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-400 focus:bg-white resize-none bg-slate-50"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => actualizarEstadoIndividual(sol.id, 'aprobada')}
                          className="flex-1 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-medium hover:bg-emerald-600"
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => actualizarEstadoIndividual(sol.id, 'rechazada')}
                          className="flex-1 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase border
                        ${sol.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}
                      `}>
                        {sol.estado}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionSolicitudes;
