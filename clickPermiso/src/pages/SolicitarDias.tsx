import { useState, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import { supabase } from '../supabaseClient';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { FiCalendar, FiSend, FiPaperclip } from 'react-icons/fi';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validaciones
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
      addToast('El archivo no debe superar 5MB', 'error');
      return;
    }

    setLoading(true);
    try {
      let archivoUrl = null;

      if (archivo) {
        const fileExt = archivo.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('documentos')
          .upload(fileName, archivo);

        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          addToast('No se pudo subir el archivo. Continúa sin él o intenta después.', 'warning');
        } else {
          archivoUrl = data?.path;
        }
      }

      const { error } = await supabase.from('solicitudes').insert([
        {
          usuario_id: user.id,
          dia_solicitado: formData.diaSolicitado,
          telefono: formData.telefono,
          turno: formData.turno,
          jornada: formData.jornada,
          num_horas: numHoras,
          num_dias: numDias,
          permiso_no_retribuido: formData.permisoNoRetribuido,
          motivo: formData.motivo.trim(),
          archivo_adjunto: archivoUrl,
          estado: 'pendiente',
        },
      ]);

      if (error) throw error;

      addToast('Solicitud enviada con éxito 📩', 'success');
      handleReset();
    } catch (err: any) {
      addToast('Error al enviar: ' + (err.message || 'Intenta de nuevo'), 'error');
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
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800">Solicitar día de permiso</h2>
        <p className="text-sm text-slate-500 mt-1">Cumplimenta los datos para registrar tu ausencia en Jefatura.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Día solicitado"
              type="date"
              name="diaSolicitado"
              value={formData.diaSolicitado}
              onChange={handleChange}
              required
            />

            <Select
              label="Turno"
              name="turno"
              value={formData.turno}
              onChange={handleChange}
              required
              options={[
                { label: 'Diurno', value: 'Diurno' },
                { label: 'Vespertino', value: 'Vespertino' },
              ]}
            />

            <Select
              label="Jornada"
              name="jornada"
              value={formData.jornada}
              onChange={handleChange}
              required
              options={[
                { label: 'Completa', value: 'Completa' },
                { label: 'Parcial', value: 'Parcial' },
              ]}
            />

            <Input
              label="Teléfono de contacto"
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="600000000"
              required
            />

            <Input
              label="Horas lectivas afectadas"
              type="number"
              name="numHoras"
              value={formData.numHoras}
              onChange={handleChange}
              required
            />

            <Input
              label="Días totales solicitados"
              type="number"
              name="numDias"
              value={formData.numDias}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Motivo de la ausencia *
              </label>
              <textarea
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:bg-white bg-slate-50 resize-none"
                placeholder="Explica brevemente el motivo de tu solicitud..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Documentación justificativa (Opcional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <FiPaperclip />
                  Seleccionar archivo
                </button>
                <span className="text-sm text-slate-500">
                  {archivo ? archivo.name : 'Ningún archivo seleccionado'}
                </span>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={formData.permisoNoRetribuido}
                onChange={(e) => setFormData({ ...formData, permisoNoRetribuido: e.target.checked })}
                className="w-4 h-4 text-blue-500 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">
                El permiso solicitado es no retribuido
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Borrar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              <FiSend />
              {loading ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitarDias;
