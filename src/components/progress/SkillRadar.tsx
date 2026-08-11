import { useState, useMemo } from "react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp } from "lucide-react";
import { useUserProgress } from "@/hooks/gamification/useUserProgress";

interface SkillMetric {
  name: string;
  value: number;
  fullMark: number;
  color: string;
}

export function SkillRadar() {
  const { stats } = useUserProgress();
  const [showRecommendation, setShowRecommendation] = useState(true);

  const skillData = useMemo(() => {
    if (!stats.questionsAnswered || Object.keys(stats.questionsAnswered).length === 0) {
      return [
        { skill: "Magnitude", value: 50, fullMark: 100, fill: "#FF6B6B" },
        { skill: "Direção", value: 50, fullMark: 100, fill: "#4ECDC4" },
        { skill: "P. Escalar", value: 50, fullMark: 100, fill: "#95E1D3" },
        { skill: "P. Vetorial", value: 50, fullMark: 100, fill: "#F38181" },
        { skill: "Operações", value: 50, fullMark: 100, fill: "#AA96DA" },
      ];
    }

    const skillMap: { [key: string]: { correct: number; total: number } } = {
      Magnitude: { correct: 0, total: 0 },
      Direção: { correct: 0, total: 0 },
      "P. Escalar": { correct: 0, total: 0 },
      "P. Vetorial": { correct: 0, total: 0 },
      Operações: { correct: 0, total: 0 },
    };

    Object.entries(stats.questionsAnswered).forEach(([qId, data], idx) => {
      const skills = Object.keys(skillMap);
      const skill = skills[idx % skills.length];
      skillMap[skill].total += 1;
      if (data.correct) skillMap[skill].correct += 1;
    });

    return Object.entries(skillMap).map(([skill, data]) => ({
      skill,
      value: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      fullMark: 100,
      fill: skill === "P. Escalar" && (data.correct / data.total) < 0.6 ? "#FF6B6B" : "#4ECDC4",
    }));
  }, [stats.questionsAnswered]);

  const weakestSkill = useMemo(() => {
    if (!skillData || skillData.length === 0) return null;
    return skillData.reduce((min, current) =>
      current.value < min.value ? current : min
    );
  }, [skillData]);

  return (
    <div className="w-full space-y-4">
      <Card className="border-2 border-vector-purple/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-vector-teal" />
                Radar de Habilidades
              </CardTitle>
              <CardDescription>Visualize seus pontos fortes e fracos</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-96"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={skillData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <PolarGrid stroke="currentColor" className="text-muted-foreground/30" />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Acurácia (%)"
                  dataKey="value"
                  stroke="#4ECDC4"
                  fill="#4ECDC4"
                  fillOpacity={0.6}
                  animationDuration={800}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {skillData.map((skill, idx) => (
              <motion.div
                key={skill.skill}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  skill.value < 60
                    ? "border-red-400/50 bg-red-50 dark:bg-red-950/30"
                    : "border-green-400/50 bg-green-50 dark:bg-green-950/30"
                }`}
              >
                <p className="text-xs font-semibold text-muted-foreground mb-1">{skill.skill}</p>
                <p className="text-2xl font-bold text-foreground">{skill.value}%</p>
                {skill.value < 60 && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">⚠️ Melhorar</p>
                )}
              </motion.div>
            ))}
          </div>

          {weakestSkill && weakestSkill.value < 60 && showRecommendation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Você está fraco em {weakestSkill.skill}!
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                  Recomendamos focar em 5 exercícios de {weakestSkill.skill} para melhorar sua acurácia de {weakestSkill.value}% para 80%+
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                    Começar Exercícios
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowRecommendation(false)}
                  >
                    Descartar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-vector-teal">
                {Math.round(stats.averageAccuracy)}%
              </p>
              <p className="text-xs text-muted-foreground">Acurácia Média</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-vector-purple">
                {stats.totalAnswers}
              </p>
              <p className="text-xs text-muted-foreground">Questões Respondidas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-500">
                {stats.currentStreak}
              </p>
              <p className="text-xs text-muted-foreground">Streak Atual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
