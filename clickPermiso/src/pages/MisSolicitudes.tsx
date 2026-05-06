import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../supabaseClient';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import type { Solicitud } from '../types';

const MisSolicitudes = () => {
  const { user } = useAuthStore();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('todas');

  // Habilitar notificaciones en tiempo real
  useRealtimeNotifications(user?.id);

  useEffect(() => {
    if (user) fetchSolicitudes();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Suscribirse a cambios en solicitudes en tiempo real
    const subscription = supabase
      .from('solicitudes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solicitudes',
          filter: `usuario_id=eq.${user.id}`,
        },
        () => {
          fetchSolicitudes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchSolicitudes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('usuario_id', user!.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSolicitudes(data as Solicitud[]);
    }
    setLoading(false);
  };

  const filtradas = filtro === 'todas'
    ? solicitudes
    : solicitudes.filter((s) => s.estado === filtro);

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'aprobada': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rechazada': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('documentos').getPublicUrl(path);
    return data.publicUrl;
  };

  const traducirEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'Recibida';
      case 'rechazada': return 'Denegada';
      default: return estado;
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500 text-sm">Cargando datos...</div>;
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800">Historial de Solicitudes</h2>
        <p className="text-sm text-slate-500 mt-1">Historial completo de tus permisos solicitados y su estado actual.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(['todas', 'pendiente', 'aprobada', 'rechazada'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize border transition-none
              ${filtro === f
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
          >
            {f === 'todas' ? 'Todas' : f === 'pendiente' ? 'Recibidas' : f === 'rechazada' ? 'Denegadas' : f}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {filtradas.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            No se han encontrado registros.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtradas.map((sol) => (
              <div key={sol.id} className="p-5 hover:bg-slate-50 transition-none">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-800 font-semibold text-sm">
                        {new Date(sol.dia_solicitado).toLocaleDateString('es-ES', {
                          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border ${getBadgeColor(sol.estado)}`}>
                        {traducirEstado(sol.estado)}
                      </span>
                      {sol.permiso_no_retribuido && (
                        <span className="text-[10px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                          No retribuido
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Ref: #{sol.id}</span>
                      <span>Turno: {sol.turno}</span>
                      <span>Jornada: {sol.jornada}</span>
                      <span>{sol.num_horas}h lectivas / {sol.num_dias}d</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700 block mb-1">Motivo:</span>
                      <p className="text-slate-600">{sol.motivo || 'Sin especificar'}</p>
                      
                      {sol.archivo_adjunto && (
                        <a 
                          href={getPublicUrl(sol.archivo_adjunto)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-2 text-blue-600 hover:underline"
                        >
                          Ver justificante adjunto
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400">
                    Registrado el {new Date(sol.created_at).toLocaleDateString('es-ES')}
                  </div>
                </div>

                {sol.motivo_rechazo && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
                    <span className="font-semibold text-xs uppercase mr-2">Motivo denegación:</span>
                    {sol.motivo_rechazo}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisSolicitudes;
