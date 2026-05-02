"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ZenModeContextType {
  isActive: boolean;
  toggleZenMode: () => void;
  hideNavbar: boolean;
  hideBadges: boolean;
  hideStats: boolean;
  onToggle: (key: "navbar" | "badges" | "stats") => void;
}

export function useZenMode() {
  const [isActive, setIsActive] = useState(false);
  const [hideNavbar, setHideNavbar] = useState(true);
  const [hideBadges, setHideBadges] = useState(true);
  const [hideStats, setHideStats] = useState(true);

  const toggleZenMode = () => {
    setIsActive(!isActive);
  };

  const onToggle = (key: "navbar" | "badges" | "stats") => {
    if (key === "navbar") setHideNavbar(prev => !prev);
    if (key === "badges") setHideBadges(prev => !prev);
    if (key === "stats") setHideStats(prev => !prev);
  };

  return {
    isActive,
    toggleZenMode,
    hideNavbar,
    hideBadges,
    hideStats,
    onToggle,
  };
}

interface ZenModeToggleProps {
  isActive: boolean;
  onToggle: () => void;
  showLabel?: boolean;
}

/**
 * Botão flutuante para ativar/desativar Zen Mode
 */
export function ZenModeToggle({ isActive, onToggle, showLabel = true }: ZenModeToggleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all ${
        isActive
          ? "bg-vector-teal text-white"
          : "bg-background border-2 border-vector-teal/20 text-vector-teal hover:border-vector-teal"
      }`}
      title={isActive ? "Sair do Zen Mode" : "Entrar no Zen Mode"}
    >
      {isActive ? (
        <Maximize2 className="w-5 h-5" />
      ) : (
        <Minimize2 className="w-5 h-5" />
      )}

      {showLabel && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-14 bg-vector-teal text-white px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap"
        >
          {isActive ? "Zen Ativo" : "Zen Mode"}
        </motion.div>
      )}
    </motion.button>
  );
}

interface ZenModeWrapperProps {
  isActive: boolean;
  children: React.ReactNode;
  hideNavbar?: boolean;
  hideBadges?: boolean;
  hideStats?: boolean;
}

/**
 * Wrapper que aplica Zen Mode ao conteúdo
 * Oculta elementos visuais que distraem
 */
export function ZenModeWrapper({
  isActive,
  children,
  hideNavbar = true,
  hideBadges = true,
  hideStats = true,
}: ZenModeWrapperProps) {
  return (
    <motion.div
      animate={{
        filter: isActive ? "brightness(1.05)" : "brightness(1)",
      }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-full"
    >
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 pointer-events-none"
        />
      )}

      {/* Aplicar estilos de Zen Mode */}
      <style dangerouslySetInnerHTML={{ __html: `
        ${isActive ? `
          /* Remover animações extra */
          * {
            animation-duration: 0s !important;
            transition: none !important;
          }

          /* Remover barras de desempenho/badges */
          ${hideBadges ? `
          [class*="badge-section"], .badge, .icon-animate {
            display: none !important;
          }
          ` : ''}

          ${hideNavbar ? `
          nav, [role="navigation"], .navbar {
            display: none !important;
          }
          ` : ''}

          /* Focar no conteúdo principal */
          body {
            background: #000000 !important;
            color: #F5F5F5 !important;
          }
        ` : ''}
      ` }} />

      {children}
    </motion.div>
  );
}

/**
 * Painel de controle de Zen Mode
 */
interface ZenModeControlsProps {
  isActive: boolean;
  hideNavbar: boolean;
  hideBadges: boolean;
  hideStats: boolean;
  onToggle: (key: "navbar" | "badges" | "stats") => void;
  onClose: () => void;
}

export function ZenModeControls({
  isActive,
  hideNavbar,
  hideBadges,
  hideStats,
  onToggle,
  onClose,
}: ZenModeControlsProps) {
  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <Card className="p-4 bg-background/95 backdrop-blur border-2 border-vector-teal/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-vector-teal text-white animate-pulse">🧘 Zen Mode Ativo</Badge>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={hideNavbar ? "default" : "outline"}
                onClick={() => onToggle("navbar")}
                className="gap-1 text-xs"
              >
                {hideNavbar ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                Menu
              </Button>

              <Button
                size="sm"
                variant={hideBadges ? "default" : "outline"}
                onClick={() => onToggle("badges")}
                className="gap-1 text-xs"
              >
                {hideBadges ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                Badges
              </Button>

              <Button
                size="sm"
                variant={hideStats ? "default" : "outline"}
                onClick={() => onToggle("stats")}
                className="gap-1 text-xs"
              >
                {hideStats ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                Stats
              </Button>

              <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
                Sair
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-2 text-center">
            💡 Zen Mode remove distrações. Foque 100% no aprendizado.
          </p>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
