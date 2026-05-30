export interface Perfil {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  dni: string;
  rol: 'docente' | 'directivo';
  relJuridica: string;
  aniosServicio: number;
  haceSustitucion: boolean;
  consentimientoRgpd: boolean;
  createdAt: string;
}

export interface PerfilResumen {
  nombre: string;
  apellidos: string;
  email: string;
  dni?: string | null;
}

export interface Solicitud {
  id: number;
  usuarioId: string;
  diaSolicitado: string;
  telefono: string;
  turno: 'Diurno' | 'Vespertino';
  jornada: 'Completa' | 'Parcial';
  numHoras: number;
  numDias: number;
  permisoNoRetribuido: boolean;
  motivo: string;
  archivoAdjunto: string | null;
  estado: 'pendiente' | 'aprobada' | 'rechazada';
  motivoRechazo: string | null;
  createdAt: string;
  perfiles?: PerfilResumen;
}

export interface DashboardStats {
  total: number;
  pendientes: number;
  aprobadas: number;
  rechazadas: number;
  profesores: number;
}