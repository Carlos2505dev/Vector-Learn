import { useEffect, useRef, useCallback } from "react";

interface GestureCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

const SWIPE_THRESHOLD = 50; // pixels
const SWIPE_TIME_THRESHOLD = 500; // milliseconds

/**
 * Hook para detectar gestos de swipe em dispositivos mobile
 * Ideal para navegação entre questões, slides, etc.
 *
 * @param callbacks - Funções para executar em cada direção
 * @param enabled - Desabilitar gestos quando necessário
 * @returns ref para anexar ao elemento
 */
export function useSwipeGesture(
  callbacks: GestureCallbacks,
  enabled = true
) {
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  }, [enabled]);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const distX = touchEnd.x - touchStartRef.current.x;
      const distY = touchEnd.y - touchStartRef.current.y;
      const timeDiff = touchEnd.time - touchStartRef.current.time;

      // Validar se foi um swipe válido
      if (timeDiff > SWIPE_TIME_THRESHOLD) return;

      // Swipe Horizontal
      if (Math.abs(distX) > Math.abs(distY)) {
        if (Math.abs(distX) > SWIPE_THRESHOLD) {
          if (distX > 0) {
            callbacks.onSwipeRight?.();
          } else {
            callbacks.onSwipeLeft?.();
          }
        }
      }
      // Swipe Vertical
      else {
        if (Math.abs(distY) > SWIPE_THRESHOLD) {
          if (distY > 0) {
            callbacks.onSwipeDown?.();
          } else {
            callbacks.onSwipeUp?.();
          }
        }
      }
    },
    [callbacks, enabled]
  );

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return touchStartRef;
}

/**
 * Hook alternativo que retorna funções instead de window listeners
 * Melhor para controlar quando gestos são ativos
 */
export function useSwipeGestureAdvanced(
  callbacks: GestureCallbacks,
  enabled = true
) {
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || !elementRef.current?.contains(e.target as Node)) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  }, [enabled]);

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!enabled || !elementRef.current?.contains(e.target as Node)) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const distX = touchEnd.x - touchStartRef.current.x;
      const distY = touchEnd.y - touchStartRef.current.y;
      const timeDiff = touchEnd.time - touchStartRef.current.time;

      // Validar se foi um swipe válido
      if (timeDiff > SWIPE_TIME_THRESHOLD) return;

      // Swipe Horizontal
      if (Math.abs(distX) > Math.abs(distY)) {
        if (Math.abs(distX) > SWIPE_THRESHOLD) {
          if (distX > 0) {
            callbacks.onSwipeRight?.();
          } else {
            callbacks.onSwipeLeft?.();
          }
        }
      }
      // Swipe Vertical
      else {
        if (Math.abs(distY) > SWIPE_THRESHOLD) {
          if (distY > 0) {
            callbacks.onSwipeDown?.();
          } else {
            callbacks.onSwipeUp?.();
          }
        }
      }
    },
    [callbacks, enabled]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);

  return elementRef;
}

/**
 * Hook para navegação entre elementos (lista, slides, etc)
 * Automaticamente incrementa/decrementa índice
 */
export function useSwipeNavigation(
  maxIndex: number,
  initialIndex = 0,
  onIndexChange?: (index: number) => void
) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      if (newIndex >= 0 && newIndex < maxIndex) {
        setCurrentIndex(newIndex);
        onIndexChange?.(newIndex);
      }
    },
    [maxIndex, onIndexChange]
  );

  const swipeRef = useSwipeGesture({
    onSwipeLeft: () => handleIndexChange(currentIndex + 1),
    onSwipeRight: () => handleIndexChange(currentIndex - 1),
  });

  return {
    currentIndex,
    setCurrentIndex: handleIndexChange,
    swipeRef,
    canGoNext: currentIndex < maxIndex - 1,
    canGoPrev: currentIndex > 0,
  };
}

import * as React from "react";
