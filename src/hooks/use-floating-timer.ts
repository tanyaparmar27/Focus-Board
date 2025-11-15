import { useRef, useCallback, useEffect } from "react";

interface FloatingWindowState {
  isOpen: boolean;
  timeLeft: number;
  isRunning: boolean;
  mode: "focus" | "break" | "water";
}

export const useFloatingTimerWindow = () => {
  const popupWindowRef = useRef<Window | null>(null);

  // Open floating timer window
  const openFloatingWindow = useCallback(
    (initialState: FloatingWindowState) => {
      // Check if window is already open
      if (popupWindowRef.current && !popupWindowRef.current.closed) {
        popupWindowRef.current.focus();
        return;
      }

      // Open a new floating window (600x300, floating position)
      const left = window.screenX + window.outerWidth - 650;
      const top = window.screenY + 50;

      popupWindowRef.current = window.open(
        `${window.location.origin}/timer-popup`,
        "focus-timer-popup",
        `width=600,height=300,left=${left},top=${top},resizable=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`
      );

      if (popupWindowRef.current) {
        // Store initial state in sessionStorage for popup to access
        sessionStorage.setItem(
          "timerPopupState",
          JSON.stringify(initialState)
        );
      }
    },
    []
  );

  // Close floating window
  const closeFloatingWindow = useCallback(() => {
    if (popupWindowRef.current && !popupWindowRef.current.closed) {
      popupWindowRef.current.close();
    }
    popupWindowRef.current = null;
  }, []);

  // Update floating window with timer state (via sessionStorage)
  const updateFloatingWindow = useCallback((state: FloatingWindowState) => {
    if (popupWindowRef.current && !popupWindowRef.current.closed) {
      sessionStorage.setItem("timerPopupState", JSON.stringify(state));
      // Send message to popup window to update
      popupWindowRef.current.postMessage(
        { type: "TIMER_UPDATE", state },
        window.location.origin
      );
    }
  }, []);

  // Check if popup is still open
  const isPopupOpen = useCallback(() => {
    return popupWindowRef.current && !popupWindowRef.current.closed;
  }, []);

  // Listen for popup close
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (popupWindowRef.current && popupWindowRef.current.closed) {
        popupWindowRef.current = null;
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  return {
    openFloatingWindow,
    closeFloatingWindow,
    updateFloatingWindow,
    isPopupOpen,
  };
};
