// =============================================================================
// COMPONENTE REGISTER BUTTON - Module 4: Event Pass
// =============================================================================
// Botón para registrarse en un evento con actualización optimista.
//
// ## useOptimistic (React 19)
// Este hook permite actualizar la UI inmediatamente antes de que
// la operación del servidor complete. Si falla, React revierte
// automáticamente al estado anterior.
//
// ## Patrón de Actualización Optimista
// 1. Usuario hace clic
// 2. UI se actualiza inmediatamente (optimistic)
// 3. Server Action se ejecuta
// 4. Si falla, UI se revierte automáticamente
// 5. Si éxito, estado se confirma
// =============================================================================

'use client';

// Agregamos useState para manejar los mensajes de feedback
import { useOptimistic, useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import { registerForEventAction } from '@/actions/eventActions';
// Agregamos AlertCircle para los mensajes de error
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegisterButtonProps {
  eventId: string;
  availableSpots: number;
  isAvailable: boolean;
}

/**
 * Botón de registro con actualización optimista.
 *
 * ## Flujo
 * 1. Al hacer clic, `addOptimistic` actualiza spots inmediatamente (-1)
 * 2. `startTransition` inicia la Server Action
 * 3. Mientras pending=true, mostramos spinner
 * 4. Si falla, React revierte automáticamente
 */
export function RegisterButton({
  eventId,
  availableSpots,
  isAvailable,
}: RegisterButtonProps): React.ReactElement {
  /**
   * useTransition permite marcar actualizaciones como no urgentes.
   * isPending indica si hay una transición en progreso.
   */
  const [isPending, startTransition] = useTransition();
  
  // Estado local para capturar el feedback del servidor
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  /**
   * useOptimistic crea un estado optimista.
   *
   * @param initialValue - Valor inicial (plazas disponibles)
   * @param reducer - Función que calcula el nuevo valor optimista
   */
  const [optimisticSpots, addOptimistic] = useOptimistic(
    availableSpots,
    // Reducer: cuando se registra, restamos 1
    (currentSpots: number, _action: 'register') => Math.max(0, currentSpots - 1)
  );

  // Estado derivado
  // Modificamos lógica derivada para considerar el feedback de éxito del servidor
  const showRegistered = optimisticSpots < availableSpots || feedback?.type === 'success';
  const canRegister = isAvailable && optimisticSpots > 0 && !showRegistered;

  /**
   * Handler del registro.
   */
  async function handleRegister(): Promise<void> {
    // Limpiamos feedback anterior al hacer clic
    setFeedback(null);
    
    // 1. Actualización optimista inmediata
    addOptimistic('register');

    // 2. Ejecutar Server Action en una transición
    startTransition(async () => {
      // Capturamos el resultado real del servidor
      const result = await registerForEventAction(eventId);

      if (!result.success) {
        // Si falla, podríamos mostrar un toast de error
        // El estado optimista se revierte automáticamente
        //console.error('Error al registrar:', result.message); <-- Reemplazamos console por estado visual
        setFeedback({ type: 'error', message: result.message || 'Error al registrarse' });
      } else {
        // Confirmación de éxito real
        setFeedback({ type: 'success', message: result.message || '¡Registro exitoso!' });
      }
    });
  }

  // Si ya se registró (optimísticamente)
  if (showRegistered) {
    return (
      <div className="w-full space-y-2">
        <Button variant="secondary" disabled className="w-full gap-2 text-green-700 bg-green-50 hover:bg-green-50">
          <CheckCircle className="h-4 w-4" />
          ¡Registrado!
        </Button>
        {/* Mostramos el mensaje de éxito real si existe */}
        {feedback?.type === 'success' && (
           <p className="text-xs text-green-600 text-center font-medium">{feedback.message}</p>
        )}
      </div>
    );
  }

  // Si no hay plazas
  if (!canRegister) {
    return (
      <Button variant="secondary" disabled className="w-full">
        {optimisticSpots === 0 ? 'Evento Agotado' : 'No disponible'}
      </Button>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Button
        onClick={handleRegister}
        disabled={isPending}
        className={cn('w-full gap-2 transition-all', isPending && 'cursor-wait opacity-80')}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Registrando...
          </>
        ) : (
          `Registrarme (${optimisticSpots} plazas)`
        )}
      </Button>
      
      {/* Mostramos mensaje de error si la acción falló y useOptimistic revirtió */}
      {feedback?.type === 'error' && (
        <p className="text-xs text-destructive text-center flex items-center justify-center gap-1.5 font-medium">
          <AlertCircle className="h-3.5 w-3.5" />
          {feedback.message}
        </p>
      )}
    </div>
  );
}