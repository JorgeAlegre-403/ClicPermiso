import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Solicitud } from '../types';

const CalendarioGlobal = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ day: number; solicitudes: Solicitud[] } | null>(null);

  useEffect(() => {
    fetchSolicitudes();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .from('solicitudes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'solicitudes',
          filter: `estado=in.(aprobada,pendiente)`,
        },
        () => {
          fetchSolicitudes();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [currentDate]);

  const fetchSolicitudes = async () => {
    setLoading(true);
    // Obtener primer y último día del mes actual
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const start = new Date(year, month, 1).toISOString();
    const end = new Date(year, month + 1, 0).toISOString();

    const { data, error } = await supabase
      .from('solicitudes')
      .select('*, perfiles(nombre, apellidos, email)')
      .in('estado', ['aprobada', 'pendiente'])
      .gte('dia_solicitado', start)
      .lte('dia_solicitado', end);

    if (!error && data) {
      setSolicitudes(data as Solicitud[]);
    }
    setLoading(false);
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  if (loading && solicitudes.length === 0) {
    return <div className="p-8 text-slate-500 text-sm">Cargando calendario...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Calendario de Ausencias</h2>
          <p className="text-sm text-slate-500 mt-1">Vista global para planificar coberturas.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 text-sm hover:bg-slate-50">&lt;</button>
          <span className="font-semibold text-slate-800 min-w-30 text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 text-sm hover:bg-slate-50">&gt;</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
              {weekDays.map(day => (
                <div key={day} className="py-3 text-center text-xs font-medium text-slate-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-fr">
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`blank-${i}`} className="min-h-35 p-2 border-b border-r border-slate-100 bg-slate-50/30" />
              ))}
              {days.map(day => {
                const dateStr = new Date(year, month, day).toISOString().split('T')[0];
                const daySolicitudes = solicitudes.filter(s => s.dia_solicitado.startsWith(dateStr));
                const isSelected = selectedDay?.day === day;
                
                return (
                  <div 
                    key={day} 
                    className={`min-h-35 p-2 border-b border-r border-slate-100 relative group hover:bg-blue-50/50 cursor-pointer transition-colors
                      ${isSelected ? 'bg-blue-100/30 border-blue-300' : ''}
                    `}
                    onClick={() => daySolicitudes.length > 0 && setSelectedDay({ day, solicitudes: daySolicitudes })}
                  >
                    <span className="text-sm font-medium text-slate-400 absolute top-2 right-3">{day}</span>
                    <div className="mt-6 space-y-1">
                      {daySolicitudes.map((sol, idx) => (
                        <div 
                          key={sol.id} 
                          className={`text-[10px] px-1.5 py-0.5 rounded truncate border ${
                            sol.estado === 'aprobada' 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                            : 'bg-amber-50 border-amber-100 text-amber-700'
                          }`}
                          title={`${sol.perfiles?.nombre} ${sol.perfiles?.apellidos}`}
                        >
                          {idx > 0 && idx === daySolicitudes.length - 1 && daySolicitudes.length > 2 
                            ? `+${daySolicitudes.length - 1}` 
                            : idx < 2 
                            ? `${sol.perfiles?.nombre?.charAt(0)}${sol.perfiles?.apellidos?.charAt(0)}`
                            : ''
                          }
                        </div>
                      ))}
                      {daySolicitudes.length > 2 && (
                        <div className="text-[9px] text-slate-400 mt-1">
                          +{daySolicitudes.length - 1} más
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel de detalles */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 h-fit">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            {selectedDay ? `${selectedDay.day} de ${monthNames[month]}` : 'Selecciona un día'}
          </h3>
          
          {selectedDay && selectedDay.solicitudes.length > 0 ? (
            <div className="space-y-3">
              {selectedDay.solicitudes.map((sol, idx) => (
                <div key={sol.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-800 mb-1">
                    {idx + 1}. {sol.perfiles?.nombre} {sol.perfiles?.apellidos}
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div><span className="font-medium">Email:</span> {sol.perfiles?.email}</div>
                    <div><span className="font-medium">Turno:</span> {sol.turno}</div>
                    <div><span className="font-medium">Jornada:</span> {sol.jornada}</div>
                    <div><span className="font-medium">Horas:</span> {sol.num_horas}h</div>
                    <div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold uppercase border
                        ${sol.estado === 'aprobada' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-amber-50 border-amber-200 text-amber-700'}
                      `}>
                        {sol.estado === 'aprobada' ? 'Aprobada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                  {sol.motivo && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-slate-600">
                      <span className="font-medium">Motivo:</span> {sol.motivo}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-400 text-xs text-center py-8">
              {selectedDay ? 'Sin ausencias registradas' : 'Haz clic en un día para ver detalles'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarioGlobal;
