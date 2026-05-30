import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { perfilApi } from '../api/apiClient';
import { FiUser, FiMail, FiCreditCard, FiBriefcase, FiAward, FiEdit3, FiSave, FiX, FiCheckCircle } from 'react-icons/fi';

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
    relJuridica: perfil?.relJuridica || '',
    aniosServicio: perfil?.aniosServicio?.toString() || '',
    haceSustitucion: perfil?.haceSustitucion || false,
  });

  useEffect(() => {
    if (perfil) {
      setFormData({
        nombre: perfil.nombre || '',
        apellidos: perfil.apellidos || '',
        email: perfil.email || '',
        dni: perfil.dni || '',
        relJuridica: perfil.relJuridica || '',
        aniosServicio: perfil.aniosServicio?.toString() || '',
        haceSustitucion: perfil.haceSustitucion || false,
      });
    }
  }, [perfil, editing]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perfil) return;

    setLoading(true);
    try {
      await perfilApi.updateMe({
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        dni: formData.dni,
        relJuridica: formData.relJuridica,
        aniosServicio: parseInt(formData.aniosServicio) || 0,
        haceSustitucion: formData.haceSustitucion,
      });

      addToast('Perfil actualizado correctamente', 'success');
      await fetchPerfil();
      setEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      addToast('Error: ' + msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!perfil) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mi Perfil</h1>
          <p className="text-slate-500 text-sm">Información personal y profesional.</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <FiEdit3 size={16} /> Editar Datos
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-slate-900 rounded-xl p-8 text-white flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold border border-white/20">
            {perfil.nombre.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <span className="inline-block px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider mb-2 border border-white/10">
              {perfil.rol}
            </span>
            <h2 className="text-2xl font-bold leading-none mb-1">{perfil.nombre} {perfil.apellidos}</h2>
            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-2">
              <FiMail size={14} /> {perfil.email}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {!editing ? (
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <InfoItem icon={<FiCreditCard />} label="DNI" value={perfil.dni} />
                <InfoItem icon={<FiBriefcase />} label="Relación Jurídica" value={perfil.relJuridica} />
                <InfoItem icon={<FiAward />} label="Años de Servicio" value={`${perfil.aniosServicio} años`} />
                <InfoItem 
                  icon={<FiCheckCircle />} 
                  label="Sustituciones" 
                  value={perfil.haceSustitucion ? 'Activo' : 'Inactivo'} 
                  isBadge
                  badgeColor={perfil.haceSustitucion ? 'emerald' : 'slate'}
                />
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-4 flex gap-3 border border-slate-100">
                  <FiUser className="text-slate-400 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mantén tus datos actualizados para una correcta gestión de tus solicitudes por parte de Jefatura.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} required />
                <FormInput label="Apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
                <FormInput label="Email" name="email" value={formData.email} disabled />
                <FormInput label="DNI" name="dni" value={formData.dni} onChange={handleChange} />
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Relación Jurídica</label>
                  <select 
                    name="relJuridica" value={formData.relJuridica} onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none"
                  >
                    <option value="Funcionario Carrera">Funcionario Carrera</option>
                    <option value="Funcionario Prácticas">Funcionario Prácticas</option>
                    <option value="Interino">Interino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <FormInput label="Años de Servicio" type="number" name="aniosServicio" value={formData.aniosServicio} onChange={handleChange} />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sustituciones</h4>
                  <p className="text-[11px] text-slate-500">¿Deseas realizar sustituciones lectivas?</p>
                </div>
                <input 
                  type="checkbox" checked={formData.haceSustitucion} 
                  onChange={(e) => setFormData({ ...formData, haceSustitucion: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-0"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-sm px-6"
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value, isBadge, badgeColor }: any) => (
  <div className="flex items-start gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      {isBadge ? (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border mt-1 inline-block
          ${badgeColor === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
          {value || '—'}
        </span>
      ) : (
        <p className="text-sm font-semibold text-slate-800">{value || '—'}</p>
      )}
    </div>
  </div>
);

const FormInput = ({ label, ...props }: any) => (
  <div className="space-y-1">
    <label className="text-[11px] font-bold text-slate-500 uppercase">{label}</label>
    <input 
      {...props}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-400 transition-all disabled:opacity-50"
    />
  </div>
);

export default Perfil;