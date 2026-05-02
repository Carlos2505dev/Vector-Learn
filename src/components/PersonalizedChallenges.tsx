import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, Award, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export interface PersonalizedChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "básico" | "intermediário" | "avançado";
  duration: number; // minutes
  category: string;
  points: number;
  recommendedBecause: string;
  successRate?: number; // 0-100
  completedBy?: number;
}

interface PersonalizedChallengesProps {
  challenges: PersonalizedChallenge[];
  title?: string;
  onStartChallenge?: (id: string) => void;
}

export function PersonalizedChallenges({ 
  challenges, 
  title = "Desafios Personalizados Para Você",
  onStartChallenge 
}: PersonalizedChallengesProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  const filteredChallenges = selectedDifficulty 
    ? challenges.filter(c => c.difficulty === selectedDifficulty)
    : challenges;

  const difficulties = ["básico", "intermediário", "avançado"];
  const difficultyColors = {
    básico: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    intermediário: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    avançado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-vector-orange" />
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
        <p className="text-muted-foreground">
          Recomendações especialmente selecionadas com base no seu nível e progresso
        </p>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-8"
      >
        {difficulties.map(difficulty => (
          <Button
            key={difficulty}
            onClick={() => setSelectedDifficulty(
              selectedDifficulty === difficulty ? null : difficulty
            )}
            variant={selectedDifficulty === difficulty ? "default" : "outline"}
            size="sm"
            className={selectedDifficulty === difficulty ? difficultyColors[difficulty as keyof typeof difficultyColors] : ""}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Button>
        ))}
      </motion.div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge, index) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="interactive-surface h-full flex flex-col">
              <CardContent className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{challenge.title}</h3>
                    <p className={`text-xs font-bold px-2 py-1 rounded-full w-fit ${difficultyColors[challenge.difficulty]}`}>
                      {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-vector-orange">{challenge.points}</div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>

                {/* Why Recommended */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-3 bg-vector-blue/10 border border-vector-blue/30 rounded-lg mb-4"
                >
                  <p className="text-xs text-vector-blue font-semibold">
                    💡 {challenge.recommendedBecause}
                  </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
                  <div className="p-2 bg-muted rounded">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="font-semibold">{challenge.duration}m</p>
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <Award className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <p className="font-semibold">{challenge.points} pts</p>
                  </div>
                  {challenge.successRate !== undefined && (
                    <div className="p-2 bg-muted rounded">
                      <TrendingUp className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="font-semibold">{challenge.successRate}%</p>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-xs text-muted-foreground mb-4">
                  <p>📚 {challenge.category}</p>
                  {challenge.completedBy !== undefined && (
                    <p>✅ {challenge.completedBy} alunos completaram</p>
                  )}
                </div>

                {/* CTA */}
                <Button
                  onClick={() => onStartChallenge?.(challenge.id)}
                  className="w-full mt-auto bg-gradient-to-r from-vector-blue to-vector-teal hover:from-vector-blue/90 hover:to-vector-teal/90"
                >
                  Começar Desafio
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">Nenhum desafio encontrado nesta dificuldade.</p>
        </motion.div>
      )}
    </div>
  );
}
