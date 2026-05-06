import { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../supabaseClient';
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications';
import type { Solicitud } from '../types';

const DashboardDocente = () => {
  const { user } = useAuthStore();
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  // Habilitar notificaciones en tiempo real
  useRealtimeNotifications(user?.id);

  // Consideramos un máximo de 6 días de asuntos propios por curso escolar
  const DIAS_TOTALES = 6;

  useEffect(() => {
    if (user) fetchDatos();
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
          // Refrescar datos cuando haya cambios
          fetchDatos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchDatos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('usuario_id', user!.id);

    if (!error && data) {
      setSolicitudes(data as Solicitud[]);
    }
    setLoading(false);
  };

  // Calcular días consumidos (solo aprobadas y que consumen días, es decir, no son permisos no retribuidos especiales que no gasten asuntos propios, aunque por simplificar contaremos todas las aprobadas)
  const diasConsumidos = solicitudes
    .filter(s => s.estado === 'aprobada' && !s.permiso_no_retribuido)
    .reduce((acc, curr) => acc + curr.num_dias, 0);
  
  const diasPendientes = solicitudes
    .filter(s => s.estado === 'pendiente' && !s.permiso_no_retribuido)
    .reduce((acc, curr) => acc + curr.num_dias, 0);

  const diasDisponibles = Math.max(0, DIAS_TOTALES - diasConsumidos);

  if (loading) {
    return <div className="p-8 text-slate-500 text-sm">Cargando panel principal...</div>;
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Mi Panel
        </h2>
        <p className="text-slate-600 mt-2">Resumen de tus días de asuntos personales para el curso escolar.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {/* Disponibles */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-green-700">Días Disponibles</p>
            <FiCheckCircle className="text-2xl text-green-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-green-600">{diasDisponibles}</span>
            <span className="text-sm text-green-600 font-medium">/ {DIAS_TOTALES}</span>
          </div>
          <p className="text-xs text-green-600 mt-3">Listos para usar</p>
        </div>

        {/* Consumidos */}
        <div className="bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-blue-700">Días Consumidos</p>
            <FiCheckCircle className="text-2xl text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-blue-600">{diasConsumidos}</span>
            <span className="text-sm text-blue-600 font-medium">aprobados</span>
          </div>
          <p className="text-xs text-blue-600 mt-3">Utilizados este curso</p>
        </div>

        {/* Pendientes */}
        <div className="bg-linear-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-amber-700">En Tramitación</p>
            <FiClock className="text-2xl text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-amber-600">{diasPendientes}</span>
            <span className="text-sm text-amber-600 font-medium">pendiente</span>
          </div>
          <p className="text-xs text-amber-600 mt-3">Esperando validación</p>
        </div>
      </div>

      <div className="bg-linear-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="text-2xl text-indigo-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-indigo-900 mb-3">Información importante</h3>
            <ul className="text-sm text-indigo-800 space-y-2">
              <li className="flex gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Los permisos no retribuidos no descuentan de tus días de asuntos propios.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Las solicitudes deben realizarse con la antelación marcada por Jefatura.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span>Consulta el historial completo en <strong>Mis solicitudes</strong>.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDocente;
