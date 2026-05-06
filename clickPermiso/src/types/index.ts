export interface Perfil {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  dni: string;
  rol: 'docente' | 'directivo';
  rel_juridica: string;
  anios_servicio: number;
  hace_sustitucion: boolean;
  consentimiento_rgpd: boolean;
  created_at: string;
}

export interface Solicitud {
  id: number;
  usuario_id: string;
  dia_solicitado: string;
  telefono: string;
  turno: 'Diurno' | 'Vespertino';
  jornada: 'Completa' | 'Parcial';
  num_horas: number;
  num_dias: number;
  permiso_no_retribuido: boolean;
  motivo: string;
  archivo_adjunto: string | null;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  motivo_rechazo: string | null;
  created_at: string;
  perfiles?: Perfil;
}
