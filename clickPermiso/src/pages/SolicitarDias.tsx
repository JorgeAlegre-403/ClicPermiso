import { useState, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { solicitudApi } from '../api/apiClient';
import { FiSend, FiPaperclip, FiCalendar, FiClock, FiPhone, FiInfo, FiTrash2, FiDownload, FiCheckCircle } from 'react-icons/fi';

const SolicitarDias = () => {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    diaSolicitado: '',
    telefono: '',
    turno: '',
    jornada: '',
    numHoras: '',
    numDias: '',
    permisoNoRetribuido: false,
    motivo: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.diaSolicitado) {
      addToast('Debes seleccionar una fecha', 'error');
      return;
    }

    const selectedDate = new Date(formData.diaSolicitado);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      addToast('No puedes solicitar permisos para fechas pasadas', 'error');
      return;
    }

    if (!formData.turno || !formData.jornada) {
      addToast('Debes seleccionar turno y jornada', 'error');
      return;
    }

    const numHoras = parseInt(formData.numHoras);
    const numDias = parseInt(formData.numDias);
    if (numHoras <= 0 || numDias <= 0) {
      addToast('El número de horas y días debe ser mayor a 0', 'error');
      return;
    }

    if (!/^\d{9}$/.test(formData.telefono)) {
      addToast('El teléfono debe tener 9 dígitos', 'error');
      return;
    }

    if (!formData.motivo.trim()) {
      addToast('Debes indicar el motivo de la solicitud', 'error');
      return;
    }

    if (archivo && archivo.size > 5 * 1024 * 1024) {
      addToast('El archivo no debe superar 5 MB', 'error');
      return;
    }

    setLoading(true);
    try {
      await solicitudApi.create(
        {
          diaSolicitado: formData.diaSolicitado,
          telefono: formData.telefono,
          turno: formData.turno,
          jornada: formData.jornada,
          numHoras: numHoras,
          numDias: numDias,
          permisoNoRetribuido: formData.permisoNoRetribuido,
          motivo: formData.motivo.trim(),
        },
        archivo,
      );

      addToast('Solicitud enviada con éxito', 'success');
      handleReset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Intenta de nuevo';
      addToast('Error al enviar: ' + msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      diaSolicitado: '',
      telefono: '',
      turno: '',
      jornada: '',
      numHoras: '',
      numDias: '',
      permisoNoRetribuido: false,
      motivo: '',
    });
    setArchivo(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Nueva Solicitud</h1>
        <p className="text-slate-500 text-sm">Completa los datos para registrar tu ausencia.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FiCalendar className="text-slate-400" />
              Datos del Permiso
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Fecha</label>
                <input
                  type="date" name="diaSolicitado" required
                  value={formData.diaSolicitado} onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-slate-400 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Teléfono</label>
                <input
                  type="tel" name="telefono" required placeholder="600000000"
                  value={formData.telefono} onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-slate-400 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Turno</label>
                <select
                  name="turno" required value={formData.turno} onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-slate-400 outline-none transition-all"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Diurno">Diurno</option>
                  <option value="Vespertino">Vespertino</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Jornada</label>
                <select
                  name="jornada" required value={formData.jornada} onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-slate-400 outline-none transition-all"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Completa">Completa</option>
                  <option value="Parcial">Parcial</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Horas</label>
                <input
                  type="number" name="numHoras" required placeholder="0"
                  value={formData.numHoras} onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-slate-400 outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">Días</label>
                <input
                  type="number" name="numDias" required placeholder="0"
                  value={formData.numDias} onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-slate-400 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FiInfo className="text-slate-400" />
              Motivo
            </h2>
            <textarea
              name="motivo" required rows={3}
              value={formData.motivo} onChange={handleChange}
              placeholder="Explica brevemente el motivo..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-slate-400 outline-none transition-all resize-none"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FiPaperclip className="text-slate-400" />
              Adjuntos
            </h2>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                ${archivo ? 'border-slate-800 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}
            >
              <input
                type="file" ref={fileInputRef} className="hidden"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {archivo ? (
                <div className="text-xs">
                  <FiCheckCircle size={24} className="mx-auto text-slate-800 mb-2" />
                  <p className="font-semibold truncate">{archivo.name}</p>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setArchivo(null); }}
                    className="mt-2 text-red-500 font-bold hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  <FiDownload size={24} className="mx-auto mb-2" />
                  <p>Subir justificante</p>
                  <p className="mt-1">(PDF, JPG, PNG)</p>
                </div>
              )}
            </div>

            <label className="mt-6 flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.permisoNoRetribuido}
                onChange={(e) => setFormData({ ...formData, permisoNoRetribuido: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700">Permiso no retribuido</span>
            </label>
          </div>

          <div className="space-y-3">
            <button
              type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? 'Enviando...' : <><FiSend size={16} /> Enviar Solicitud</>}
            </button>
            <button
              type="button" onClick={handleReset}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Limpiar formulario
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SolicitarDias;