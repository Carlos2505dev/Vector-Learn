"use client";

/**
 * Sistema de Haptic Feedback para respostas
 * Funciona em iOS 13+ e Android com Vibration API
 * Oferece feedback tátil para interações
 */

import React, { useCallback, useEffect, useMemo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

type HapticType = "light" | "medium" | "heavy" | "success" | "error" | "warning";

interface HapticPattern {
  duration: number;
  intensity: number;
}

class HapticFeedback {
  private supported: boolean;

  constructor() {
    // Verifica suporte a Vibration API
    this.supported =
      typeof navigator !== "undefined" &&
      ("vibrate" in navigator || "webkitVibrate" in navigator);
  }

  private vibrate(pattern: number | number[]): void {
    if (!this.supported) return;

    const vibrate = navigator.vibrate || (navigator as any).webkitVibrate;
    if (vibrate) {
      vibrate(pattern);
    }
  }

  /**
   * Feedback simples - padrões pré-configurados
   */
  public tap(): void {
    this.vibrate(10);
  }

  public light(): void {
    this.vibrate(15);
  }

  public medium(): void {
    this.vibrate(30);
  }

  public heavy(): void {
    this.vibrate(50);
  }

  /**
   * Feedback de sucesso - padrão duplo
   */
  public success(): void {
    this.vibrate([20, 10, 20]);
  }

  /**
   * Feedback de erro - vibração longa
   */
  public error(): void {
    this.vibrate([30, 20, 30, 20, 30]);
  }

  /**
   * Feedback de aviso - padrão triplo suave
   */
  public warning(): void {
    this.vibrate([15, 10, 15, 10, 15]);
  }

  /**
   * Feedback customizado com padrão
   */
  public custom(pattern: number[]): void {
    this.vibrate(pattern);
  }

  /**
   * Parar vibração
   */
  public stop(): void {
    this.vibrate(0);
  }

  /**
   * Verificar se suportado
   */
  public isSupported(): boolean {
    return this.supported;
  }
}

// Singleton
export const haptic = new HapticFeedback();

/**
 * Hook React para usar Haptic Feedback
 */
export function useHaptic() {
  const trigger = useCallback((type: HapticType) => {
    switch (type) {
      case "light":
        haptic.light();
        break;
      case "medium":
        haptic.medium();
        break;
      case "heavy":
        haptic.heavy();
        break;
      case "success":
        haptic.success();
        break;
      case "error":
        haptic.error();
        break;
      case "warning":
        haptic.warning();
        break;
    }
  }, []);

  return useMemo(() => ({
    trigger,
    light: () => haptic.light(),
    medium: () => haptic.medium(),
    heavy: () => haptic.heavy(),
    success: () => haptic.success(),
    error: () => haptic.error(),
    warning: () => haptic.warning(),
    isSupported: haptic.isSupported(),
    custom: (pattern: number[]) => haptic.custom(pattern),
  }), [trigger]);
}

/**
 * Componente Button com Haptic Feedback integrado
 */
interface HapticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  hapticFeedback?: HapticType;
  onClickWithHaptic?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function HapticButton({
  children,
  hapticFeedback = "light",
  onClickWithHaptic,
  onClick,
  ...props
}: HapticButtonProps) {
  const { trigger } = useHaptic();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trigger(hapticFeedback);
    onClickWithHaptic?.(e);
    onClick?.(e);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
}

/**
 * Componente para validação de resposta com Haptic
 */
interface HapticAnswerFeedbackProps {
  isCorrect: boolean;
  showFeedback: boolean;
  onAnimationComplete?: () => void;
}

export function HapticAnswerFeedback({
  isCorrect,
  showFeedback,
  onAnimationComplete,
}: HapticAnswerFeedbackProps) {
  const { trigger } = useHaptic();

  useEffect(() => {
    if (showFeedback) {
      if (isCorrect) {
        trigger("success");
      } else {
        trigger("error");
      }

      const timer = setTimeout(() => onAnimationComplete?.(), 1000);
      return () => clearTimeout(timer);
    }
  }, [showFeedback, isCorrect, trigger, onAnimationComplete]);

  if (!showFeedback) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none flex items-center justify-center ${
        isCorrect ? "bg-green-500/10" : "bg-red-500/10"
      }`}
    >
      <div
        className={`text-4xl font-bold ${
          isCorrect ? "text-green-500" : "text-red-500"
        }`}
      >
        {isCorrect ? "✓ Correto!" : "✗ Errado"}
      </div>
    </div>
  );
}

/**
 * Padrões de vibração customizados para diferentes cenários
 */
export const HAPTIC_PATTERNS = {
  // Navegação
  pageTransition: [10, 5, 10],
  menuOpen: [20],
  menuClose: [15],

  // Respostas
  answerCorrect: [20, 10, 20],
  answerWrong: [30, 20, 30, 20, 30],
  answerPartial: [15, 10, 15],

  // Notificações
  notificationNew: [30, 15, 30],
  notificationWarning: [40, 20, 40],
  notificationError: [50, 30, 50],

  // Achievements
  badgeUnlocked: [25, 10, 25, 10, 25],
  streakContinued: [10],
  streakBroken: [40, 10, 40],

  // Study Session
  pomodoroStart: [20, 10, 20],
  pomodoroBreak: [30, 15, 30, 15, 30],
  fatiguePulse: [15, 5, 15, 5, 15],
};

/**
 * Sequência de vibração para diferentes situações
 * Pode ser composta para criar padrões mais ricos
 */
export function triggerHapticPattern(patternName: keyof typeof HAPTIC_PATTERNS) {
  const pattern = HAPTIC_PATTERNS[patternName];
  haptic.custom(pattern);
}
