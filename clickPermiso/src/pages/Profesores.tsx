import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import type { Perfil } from '../types';
import { FiSearch } from 'react-icons/fi';

const Profesores = () => {
  const [profesores, setProfesores] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchProfesores();
  }, []);

  const fetchProfesores = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('perfiles')
      .select('*')
      .order('apellidos', { ascending: true });

    if (!error && data) {
      setProfesores(data as Perfil[]);
    }
    setLoading(false);
  };

  const filtrados = profesores.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-slate-500 text-sm">Cargando directorio...</div>;
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Directorio del Claustro</h2>
          <p className="text-sm text-slate-500 mt-1">Listado de personal del centro.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:bg-white bg-slate-50"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
                <th className="px-6 py-3 font-medium">Nombre y Apellidos</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">DNI</th>
                <th className="px-6 py-3 font-medium">Situación</th>
                <th className="px-6 py-3 font-medium text-right">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((prof) => (
                <tr key={prof.id} className="hover:bg-slate-50 transition-none">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{prof.nombre} {prof.apellidos}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{prof.email}</td>
                  <td className="px-6 py-4 text-slate-600">{prof.dni || '—'}</td>
                  <td className="px-6 py-4 text-slate-600">{prof.rel_juridica || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase border
                      ${prof.rol === 'directivo' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}
                    `}>
                      {prof.rol}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtrados.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">
            No se han encontrado registros.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profesores;
