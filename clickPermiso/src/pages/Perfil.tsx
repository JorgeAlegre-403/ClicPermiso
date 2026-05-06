import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { supabase } from '../supabaseClient';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const Perfil = () => {
  const { perfil, fetchPerfil } = useAuthStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: perfil?.nombre || '',
    apellidos: perfil?.apellidos || '',
    email: perfil?.email || '',
    dni: perfil?.dni || '',
    rel_juridica: perfil?.rel_juridica || '',
    anios_servicio: perfil?.anios_servicio?.toString() || '',
    hace_sustitucion: perfil?.hace_sustitucion || false,
  });

  // Actualizar formData cuando perfil cambia
  useEffect(() => {
    if (perfil) {
      setFormData({
        nombre: perfil.nombre || '',
        apellidos: perfil.apellidos || '',
        email: perfil.email || '',
        dni: perfil.dni || '',
        rel_juridica: perfil.rel_juridica || '',
        anios_servicio: perfil.anios_servicio?.toString() || '',
        hace_sustitucion: perfil.hace_sustitucion || false,
      });
    }
  }, [perfil, editing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('perfiles')
        .update({
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          dni: formData.dni,
          rel_juridica: formData.rel_juridica,
          anios_servicio: parseInt(formData.anios_servicio) || 0,
          hace_sustitucion: formData.hace_sustitucion,
        })
        .eq('id', perfil.id);

      if (error) throw error;

      addToast('Perfil guardado', 'success');
      await fetchPerfil();
      setEditing(false);
    } catch (err: any) {
      addToast('Error: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Mi Perfil</h2>
          <p className="text-sm text-slate-500 mt-1">Información corporativa y laboral.</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
          >
            Editar datos
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {!editing && perfil ? (
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
              <div className="text-sm font-medium text-slate-500">Nombre completo</div>
              <div className="sm:col-span-2 text-sm text-slate-800">{perfil.nombre} {perfil.apellidos}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
              <div className="text-sm font-medium text-slate-500">Correo corporativo</div>
              <div className="sm:col-span-2 text-sm text-slate-800">{perfil.email}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
              <div className="text-sm font-medium text-slate-500">DNI / Identificación</div>
              <div className="sm:col-span-2 text-sm text-slate-800">{perfil.dni || '—'}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
              <div className="text-sm font-medium text-slate-500">Relación jurídica</div>
              <div className="sm:col-span-2 text-sm text-slate-800">{perfil.rel_juridica || '—'}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
              <div className="text-sm font-medium text-slate-500">Años de servicio</div>
              <div className="sm:col-span-2 text-sm text-slate-800">{perfil.anios_servicio || 0} años</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-5">
              <div className="text-sm font-medium text-slate-500">Rol en el sistema</div>
              <div className="sm:col-span-2 text-sm text-slate-800 capitalize">{perfil.rol}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-5 bg-slate-50/50">
              <div className="text-sm font-medium text-slate-500">Sustituciones</div>
              <div className="sm:col-span-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border
                  ${perfil.hace_sustitucion ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}
                `}>
                  {perfil.hace_sustitucion ? 'Habilitado' : 'Deshabilitado'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
               <Input label="Apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
               <Input label="Correo (Lectura)" name="email" value={formData.email} onChange={handleChange} disabled />
               <Input label="DNI" name="dni" value={formData.dni} onChange={handleChange} />
               
               <Select
                  label="Relación jurídica"
                  name="rel_juridica"
                  value={formData.rel_juridica}
                  onChange={handleChange}
                  options={[
                    { label: 'Funcionario Carrera', value: 'Funcionario Carrera' },
                    { label: 'Funcionario Prácticas', value: 'Funcionario Prácticas' },
                    { label: 'Interino', value: 'Interino' },
                    { label: 'Otro', value: 'Otro' },
                  ]}
                />
               <Input label="Años de servicio" type="number" name="anios_servicio" value={formData.anios_servicio} onChange={handleChange} />
            </div>

            <div className="py-4 border-t border-b border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hace_sustitucion}
                  onChange={(e) => setFormData({ ...formData, hace_sustitucion: e.target.checked })}
                  className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">
                  Habilitar realización de sustituciones lectivas
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar perfil'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Perfil;