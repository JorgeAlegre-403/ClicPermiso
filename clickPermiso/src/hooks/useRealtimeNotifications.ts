import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useToastStore } from '../stores/toastStore';
import type { Solicitud } from '../types';

export const useRealtimeNotifications = (userId: string | undefined) => {
  const { addToast } = useToastStore();

  useEffect(() => {
    if (!userId) return;

    // Suscribirse a cambios en solicitudes del usuario
    const subscription = supabase
      .from(`solicitudes:usuario_id=eq.${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'solicitudes',
          filter: `usuario_id=eq.${userId}`,
        },
        (payload: any) => {
          const solicitud = payload.new as Solicitud;

          if (solicitud.estado === 'aprobada') {
            addToast('✅ Tu solicitud ha sido aprobada', 'success');
          } else if (solicitud.estado === 'rechazada') {
            addToast(
              `❌ Tu solicitud ha sido denegada${solicitud.motivo_rechazo ? ': ' + solicitud.motivo_rechazo : ''}`,
              'error'
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, addToast]);
};
