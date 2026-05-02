"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface HintLevel {
  level: number; // 1-3
  text: string;
  xpPenalty: number;
  percentageRevealed: number;
}

interface ProgressiveHint {
  questionId: string;
  hints: HintLevel[];
  userHintsUsed: number;
  totalXpPenalty: number;
}

/**
 * Hook para gerenciar progressive hints
 */
export function useProgressiveHints(maxHints: number = 3) {
  const [hints, setHints] = useState<Map<string, ProgressiveHint>>(new Map());

  const getHints = (questionId: string): ProgressiveHint | undefined => {
    return hints.get(questionId);
  };

  const recordHintUsage = (questionId: string, hintLevel: number, xpPenalty: number) => {
    setHints((prev) => {
      const newHints = new Map(prev);
      const current = newHints.get(questionId) || {
        questionId,
        hints: [],
        userHintsUsed: 0,
        totalXpPenalty: 0,
      };

      current.userHintsUsed = hintLevel;
      current.totalXpPenalty = xpPenalty;

      newHints.set(questionId, current);
      return newHints;
    });
  };

  return {
    hints,
    getHints,
    recordHintUsage,
  };
}

interface ProgressiveHintUIProps {
  questionId: string;
  hints: HintLevel[];
  currentHintLevel: number;
  onHintRequested: (level: number) => void;
  maxHints?: number;
  totalXpPenalty?: number;
  currentXP?: number;
  streakLength?: number;
}

/**
 * Componente UI para mostrar Progressive Hints em cascata
 */
export function ProgressiveHintUI({
  questionId,
  hints,
  currentHintLevel,
  onHintRequested,
  maxHints = 3,
  totalXpPenalty = 0,
  currentXP = 0,
  streakLength = 0,
}: ProgressiveHintUIProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (currentHintLevel >= maxHints) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-200 text-sm">
              Dicas esgotadas! 😅
            </p>
            <p className="text-xs text-red-800 dark:text-red-300 mt-1">
              Você usou todos os {maxHints} hints. A solução completa causará -50 XP no seu streak.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="w-full gap-2"
      >
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <span>Dica {currentHintLevel + 1} de {maxHints}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {/* Mostrar dicas anteriores (reveladas) */}
            {hints.slice(0, currentHintLevel).map((hint) => (
              <motion.div
                key={hint.level}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: hint.level * 0.1 }}
                className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800"
              >
                <div className="flex items-start gap-2">
                  <Badge className="text-xs">Dica {hint.level}</Badge>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{hint.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {hint.level === 1
                        ? "🔍 Primeira dica (20% da solução)"
                        : hint.level === 2
                        ? "🔍🔍 Segunda dica (40% da solução)"
                        : "🔍🔍🔍 Terceira dica (60% da solução)"}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-amber-600">-{hint.xpPenalty} XP</span>
                </div>
              </motion.div>
            ))}

            {/* Próxima dica disponível */}
            {currentHintLevel < maxHints && currentHintLevel < hints.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <Card>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-vector-teal">
                          Próxima Dica Disponível
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {hints[currentHintLevel].percentageRevealed}% da solução será revelada
                        </p>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        -{hints[currentHintLevel].xpPenalty} XP
                      </Badge>
                    </div>

                    <Progress
                      value={hints[currentHintLevel].percentageRevealed}
                      className="h-2"
                    />

                    <Button
                      onClick={() => {
                        onHintRequested(currentHintLevel + 1);
                        setIsOpen(false);
                      }}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      size="sm"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Usar Dica ({hints[currentHintLevel].xpPenalty} XP)
                    </Button>
                  </CardContent>
                </Card>

                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    💡 <strong>Dica:</strong> Tente resolver sem dica primeiro! Você aprenderá mais.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Solução Completa (última opção) */}
            {currentHintLevel >= maxHints - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-1" />
                  <div className="flex-1">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-200 text-sm">
                      Última alternativa: Ver Solução Completa
                    </p>
                    <p className="text-xs text-yellow-800 dark:text-yellow-300 mt-1">
                      Isso custará <strong>-50 XP</strong> e quebrar seu streak de {streakLength || Math.floor(currentXP / 10)} acertos!
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                      onClick={() => onHintRequested(999)} // Signal para mostrar solução
                    >
                      Desistir e Ver Solução
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Sistema completo de Progressive Hints para questões
 */
interface ProgressiveHintSystemProps {
  questionId: string;
  baseHints: string[]; // ["dica 1", "dica 2", "dica 3"]
  onHintSelected: (level: number, xpCost: number) => void;
  currentXP?: number;
  streakLength?: number;
}

export function ProgressiveHintSystem({
  questionId,
  baseHints,
  onHintSelected,
  currentXP = 0,
  streakLength = 0,
}: ProgressiveHintSystemProps) {
  const [currentLevel, setCurrentLevel] = useState(0);

  const hints: HintLevel[] = [
    {
      level: 1,
      text: baseHints[0] || "Pense na definição principal...",
      xpPenalty: 10,
      percentageRevealed: 20,
    },
    {
      level: 2,
      text: baseHints[1] || "Revise os passos intermediários...",
      xpPenalty: 20,
      percentageRevealed: 40,
    },
    {
      level: 3,
      text: baseHints[2] || "Quase lá! Cuidado com detalhes...",
      xpPenalty: 30,
      percentageRevealed: 60,
    },
  ];

  const handleHintRequested = (level: number) => {
    if (level === 999) {
      // Solução completa
      onHintSelected(level, 50);
    } else {
      const hintData = hints[level - 1];
      if (hintData) {
        setCurrentLevel(level);
        onHintSelected(level, hintData.xpPenalty);
      }
    }
  };

  return (
    <ProgressiveHintUI
      questionId={questionId}
      hints={hints}
      currentHintLevel={currentLevel}
      onHintRequested={handleHintRequested}
      maxHints={3}
      totalXpPenalty={hints.slice(0, currentLevel).reduce((sum, h) => sum + h.xpPenalty, 0)}
      currentXP={currentXP}
      streakLength={streakLength}
    />
  );
}
