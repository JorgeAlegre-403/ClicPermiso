import type { Perfil, Solicitud, DashboardStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


function getToken(): string | null {
    return localStorage.getItem('token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> || {}),
    };

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!res.ok) {
        const msg = await res.text().catch(() => `Error ${res.status}`);
        throw new Error(msg || `Error ${res.status}`);
    }

    if (res.status === 204) return null as T;
    return res.json();
}

async function requestMultipart<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
    });

    if (!res.ok) {
        const msg = await res.text().catch(() => `Error ${res.status}`);
        throw new Error(msg || `Error ${res.status}`);
    }

    return res.json();
}


export function getFileUrl(filename: string | null): string {
    if (!filename) return '';
    return `${API_BASE_URL}/uploads/${filename}`;
}


export interface LoginResponse {
    token: string;
    id: string;
    rol: string;
    nombre: string;
    apellidos: string;
    email: string;
}

export const authApi = {
    login: (email: string, password: string) =>
        request<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),
};


export const perfilApi = {
    getMe: () =>
        request<Perfil>('/perfiles/me'),

    updateMe: (data: Partial<Perfil>) =>
        request<Perfil>('/perfiles/me', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    getAll: () =>
        request<Perfil[]>('/perfiles'),
};


export interface SolicitudCreateInput {
    diaSolicitado: string;
    telefono: string;
    turno: string;
    jornada: string;
    numHoras: number;
    numDias: number;
    permisoNoRetribuido: boolean;
    motivo: string;
}

export const solicitudApi = {
    getMias: () =>
        request<Solicitud[]>('/solicitudes/mis-solicitudes'),

    getAll: () =>
        request<Solicitud[]>('/solicitudes'),

    // month es 1-12 (JavaScript usa 0-11, así que suma +1 antes de llamar aquí)
    getCalendario: (year: number, month: number) =>
        request<Solicitud[]>(`/solicitudes/calendario?year=${year}&month=${month}`),

    create: (data: SolicitudCreateInput, archivo?: File | null) => {
        const formData = new FormData();
        formData.append(
            'solicitud',
            new Blob([JSON.stringify(data)], { type: 'application/json' }),
        );
        if (archivo) formData.append('archivo', archivo);
        return requestMultipart<Solicitud>('/solicitudes/crear', formData);
    },

    updateEstado: (id: number, estado: string, motivoRechazo?: string) =>
        request<Solicitud>(`/solicitudes/${id}/estado`, {
            method: 'PATCH',
            body: JSON.stringify({ estado, motivoRechazo }),
        }),
};


export const dashboardApi = {
    getStats: () =>
        request<DashboardStats>('/dashboard/stats'),

    getRecientes: () =>
        request<Solicitud[]>('/dashboard/recientes'),
};