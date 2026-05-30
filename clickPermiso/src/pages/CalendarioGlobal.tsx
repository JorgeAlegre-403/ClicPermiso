import { useEffect, useState } from 'react';
import { solicitudApi } from '../api/apiClient';
import type { Solicitud } from '../types';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiClock, FiUser, FiInfo } from 'react-icons/fi';

const CalendarioGlobal = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{ day: number; solicitudes: Solicitud[] } | null>(null);

  useEffect(() => {
    fetchSolicitudes();
  }, [currentDate]);

  const fetchSolicitudes = async () => {
    setLoading(true);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    try {
      const data = await solicitudApi.getCalendario(year, month);
      setSolicitudes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const nextMonth = () => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDay(null); };
  const prevMonth = () => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDay(null); };

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Calendario de <span className="text-primary-600">Ausencias</span>
          </h2>
          <p className="text-slate-500 font-medium">Control visual de permisos para la planificación de guardias.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500">
            <FiChevronLeft size={20} />
          </button>
          <span className="font-black text-slate-800 min-w-32 text-center uppercase tracking-widest text-sm">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-500">
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendario */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Cabecera días */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
              {weekDays.map((d) => (
                <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{d}</div>
              ))}
            </div>

            {/* Celdas */}
            <div className="grid grid-cols-7 auto-rows-fr">
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`blank-${i}`}
                  className="min-h-24 p-3 border-b border-r border-slate-100 bg-slate-50/20" />
              ))}

              {days.map((day) => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const daySols = solicitudes.filter((s) => s.diaSolicitado.startsWith(dateStr));
                const isSelected = selectedDay?.day === day;

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay({ day, solicitudes: daySols })}
                    className={`min-h-24 p-3 border-b border-r border-slate-100 relative cursor-pointer
                      hover:bg-primary-50/30 transition-all group
                      ${isSelected ? 'bg-primary-50 ring-2 ring-inset ring-primary-500/20' : 'bg-white'}`}
                  >
                    <span className={`text-xs font-black absolute top-3 right-3 transition-colors
                      ${isSelected ? 'text-primary-600' : 'text-slate-300 group-hover:text-slate-500'}`}>
                      {day}
                    </span>
                    <div className="mt-6 space-y-1">
                      {daySols.slice(0, 2).map((sol) => (
                        <div
                          key={sol.id}
                          className={`text-[9px] px-2 py-1 rounded-lg truncate font-bold border shadow-xs
                            ${sol.estado === 'aprobada'
                               ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                               : 'bg-amber-50 border-amber-100 text-amber-700'
                            }`}
                        >
                          {sol.perfiles?.nombre?.split(' ')[0]}
                        </div>
                      ))}
                      {daySols.length > 2 && (
                        <div className="text-[9px] font-black text-primary-500 text-center uppercase tracking-tighter">
                          +{daySols.length - 2} más
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
        <div className="space-y-6">
          <div className="glass-card rounded-[32px] border border-slate-200/60 shadow-sm p-8 h-fit min-h-[400px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                <FiInfo />
              </div>
              <h3 className="text-lg font-black text-slate-800">
                {selectedDay
                  ? `${selectedDay.day} de ${monthNames[month]}`
                  : 'Detalles del día'}
              </h3>
            </div>

            {!selectedDay ? (
              <div className="text-center py-20">
                <FiCalendar className="mx-auto text-slate-200 mb-4" size={48} />
                <p className="text-slate-400 text-sm font-medium">Selecciona un día para ver quién se ausenta.</p>
              </div>
            ) : selectedDay.solicitudes.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm font-medium px-4">No hay ausencias registradas para esta fecha.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedDay.solicitudes.map((sol) => (
                  <div key={sol.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-primary-600 group-hover:text-white transition-all">
                        {sol.perfiles?.nombre?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 leading-none mb-1">
                          {sol.perfiles?.nombre} {sol.perfiles?.apellidos}
                        </p>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border
                          ${sol.estado === 'aprobada' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                          {sol.estado}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[10px] font-bold text-slate-500">
                      <div className="flex items-center gap-1.5"><FiClock className="text-primary-500" /> {sol.turno}</div>
                      <div className="flex items-center gap-1.5"><FiInfo className="text-primary-500" /> {sol.numHoras}h</div>
                    </div>
                    {sol.motivo && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Motivo</p>
                        <p className="text-xs text-slate-600 italic">"{sol.motivo}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900 rounded-[32px] text-white">
             <div className="flex items-center gap-3 mb-4">
                <FiInfo className="text-primary-400" />
                <h4 className="text-sm font-bold">Leyenda</h4>
             </div>
             <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold">
                   <div className="w-3 h-3 rounded bg-emerald-500" /> <span>Aprobada / Confirmada</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                   <div className="w-3 h-3 rounded bg-amber-500" /> <span>Pendiente de validar</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarioGlobal;