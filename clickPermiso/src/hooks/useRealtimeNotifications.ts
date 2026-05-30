import { useEffect, useRef } from 'react';
import { solicitudApi } from '../api/apiClient';
import { useToastStore } from '../stores/toastStore';

export const useRealtimeNotifications = (userId: string | undefined) => {
  const { addToast } = useToastStore();
  const prevStatesRef = useRef<Record<number, string>>({});

  useEffect(() => {
    if (!userId) return;

    const checkUpdates = async () => {
      try {
        const solicitudes = await solicitudApi.getMias();
        solicitudes.forEach((sol) => {
          const prev = prevStatesRef.current[sol.id];
          if (prev && prev !== sol.estado) {
            if (sol.estado === 'aprobada') {
              addToast('✅ Tu solicitud ha sido aprobada', 'success');
            } else if (sol.estado === 'rechazada') {
              addToast(
                `❌ Tu solicitud ha sido denegada${sol.motivoRechazo ? ': ' + sol.motivoRechazo : ''}`,
                'error',
              );
            }
          }
          prevStatesRef.current[sol.id] = sol.estado;
        });
      } catch {
        // silencioso
      }
    };

    const interval = setInterval(checkUpdates, 30_000);
    return () => clearInterval(interval);
  }, [userId, addToast]);
};