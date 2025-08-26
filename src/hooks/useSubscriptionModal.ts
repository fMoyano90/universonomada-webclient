import { useState, useEffect, useCallback } from "react";

interface UseSubscriptionModalOptions {
  delayMs?: number; // Tiempo en ms antes de mostrar el modal automáticamente
  enableExitIntent?: boolean; // Habilitar detección de salida del mouse
  storageKey?: string; // Clave para localStorage
}

const useSubscriptionModal = ({
  delayMs = 30000, // 30 segundos por defecto
  enableExitIntent = true,
  storageKey = "subscription_modal_shown",
}: UseSubscriptionModalOptions = {}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  // Verificar si el modal ya se mostró en esta sesión
  useEffect(() => {
    const wasShown = sessionStorage.getItem(storageKey);
    if (wasShown) {
      setHasBeenShown(true);
    }
  }, [storageKey]);

  // Mostrar modal después del tiempo especificado
  useEffect(() => {
    if (hasBeenShown) return;

    const timer = setTimeout(() => {
      setIsModalOpen(true);
      setHasBeenShown(true);
      sessionStorage.setItem(storageKey, "true");
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, hasBeenShown, storageKey]);

  // Detección de salida del mouse (exit intent)
  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      // Solo activar si el mouse sale por la parte superior de la ventana
      if (e.clientY <= 0 && !hasBeenShown) {
        setIsModalOpen(true);
        setHasBeenShown(true);
        sessionStorage.setItem(storageKey, "true");
      }
    },
    [hasBeenShown, storageKey]
  );

  useEffect(() => {
    if (!enableExitIntent || hasBeenShown) return;

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [enableExitIntent, handleMouseLeave, hasBeenShown]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const resetModal = useCallback(() => {
    setHasBeenShown(false);
    sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    isModalOpen,
    closeModal,
    resetModal, // Útil para testing o resetear el estado
  };
};

export default useSubscriptionModal;