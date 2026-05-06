import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Solicitud } from '../types';
import { FiTrendingUp, FiClock, FiCheckCircle, FiXCircle, FiUsers } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0, profesores: 0 });
  const [recientes, setRecientes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);

    const [solRes, profRes] = await Promise.all([
      supabase.from('solicitudes').select('*, perfiles(nombre, apellidos)'),
      supabase.from('perfiles').select('id', { count: 'exact' }),
    ]);

    const solicitudes = (solRes.data || []) as Solicitud[];

    setStats({
      total: solicitudes.length,
      pendientes: solicitudes.filter((s) => s.estado === 'pendiente').length,
      aprobadas: solicitudes.filter((s) => s.estado === 'aprobada').length,
      rechazadas: solicitudes.filter((s) => s.estado === 'rechazada').length,
      profesores: profRes.count || 0,
    });

    setRecientes(
      solicitudes
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
    );

    setLoading(false);
  };

  if (loading) {
    return <div className="p-8 text-slate-500 text-sm">Cargando panel...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Panel General
        </h2>
        <p className="text-slate-600 mt-2">Resumen de actividad del centro educativo.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {/* Total */}
        <div className="bg-linear-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total</p>
            <FiTrendingUp className="text-2xl text-slate-600" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-2">Solicitudes</p>
        </div>

        {/* Pendientes */}
        <div className="bg-linear-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Pendientes</p>
            <FiClock className="text-2xl text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.pendientes}</p>
          <p className="text-xs text-blue-600 mt-2">En revisión</p>
        </div>

        {/* Aprobadas */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Aprobadas</p>
            <FiCheckCircle className="text-2xl text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.aprobadas}</p>
          <p className="text-xs text-green-600 mt-2">Validadas</p>
        </div>

        {/* Rechazadas */}
        <div className="bg-linear-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Rechazadas</p>
            <FiXCircle className="text-2xl text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.rechazadas}</p>
          <p className="text-xs text-red-600 mt-2">Denegadas</p>
        </div>

        {/* Profesores */}
        <div className="bg-linear-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Profesores</p>
            <FiUsers className="text-2xl text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.profesores}</p>
          <p className="text-xs text-purple-600 mt-2">Activos</p>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Últimas solicitudes</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {recientes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No hay actividad reciente.
            </div>
          ) : (
            recientes.map((sol) => (
              <div key={sol.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 hover:bg-slate-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {sol.perfiles?.nombre} {sol.perfiles?.apellidos}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(sol.created_at).toLocaleDateString('es-ES')} • {sol.motivo || 'Sin motivo'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                    sol.estado === 'pendiente' ? 'bg-blue-100 text-blue-700' :
                    sol.estado === 'aprobada' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {sol.estado === 'pendiente' ? '⏳ Pendiente' :
                     sol.estado === 'aprobada' ? '✓ Aprobada' :
                     '✕ Rechazada'}
                  </span>
                  <span className="text-sm font-medium text-slate-600">{sol.num_dias}d</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
