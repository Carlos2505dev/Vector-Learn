import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface SolutionStep {
  step: number;
  description: string;
  formula?: string;
  isCorrect: boolean;
  explanation?: string;
}

interface SolutionPath {
  steps: SolutionStep[];
  finalAnswer: string | number;
  totalSteps: number;
}

interface SolutionComparatorProps {
  userPath: SolutionPath;
  correctPath: SolutionPath;
  showDivergence?: boolean;
  highlightDifferences?: boolean;
}

/**
 * Componente para comparar solução do usuário com a correta
 * Mostra visualmente onde divergiram
 */
export function SolutionComparator({
  userPath,
  correctPath,
  showDivergence = true,
  highlightDifferences = true,
}: SolutionComparatorProps) {
  // Encontrar onde as soluções divergem
  const divergencePoint = userPath.steps.findIndex(
    (step, idx) =>
      !correctPath.steps[idx] ||
      step.formula !== correctPath.steps[idx].formula
  );

  const maxSteps = Math.max(userPath.totalSteps, correctPath.totalSteps);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-vector-teal" />
            Comparação de Estratégias
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Veja onde sua solução divergiu da resposta correta
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sua Solução */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="border-red-400 text-red-700 dark:text-red-300">
                  <XCircle className="w-3 h-3 mr-1" />
                  Sua Solução
                </Badge>
              </div>

              {/* Passos da solução do usuário */}
              {userPath.steps.map((step, idx) => {
                const isCorrectStep = correctPath.steps[idx]?.formula === step.formula;
                const isDivergence = showDivergence && divergencePoint === idx;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isDivergence
                        ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                        : isCorrectStep
                        ? "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20"
                        : "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {isCorrectStep ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          Passo {step.step}: {step.description}
                        </p>
                        {step.formula && (
                          <p className="text-xs font-mono text-muted-foreground mt-1 p-2 bg-background/50 rounded">
                            {step.formula}
                          </p>
                        )}

                        {isDivergence && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-red-700 dark:text-red-300 mt-2 font-semibold"
                          >
                            ⚠️ <strong>Aqui divergiu!</strong> A partir daqui a solução tomou um
                            rumo diferente.
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Resposta Final */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: userPath.steps.length * 0.1 }}
                className={`p-3 rounded-lg border-2 ${
                  userPath.finalAnswer === correctPath.finalAnswer
                    ? "border-green-400 bg-green-50 dark:bg-green-950/30"
                    : "border-red-500 bg-red-100 dark:bg-red-950/40"
                }`}
              >
                <p className="text-xs font-semibold text-muted-foreground mb-1">Resposta Final</p>
                <p className="text-lg font-bold">
                  {userPath.finalAnswer}{" "}
                  {userPath.finalAnswer === correctPath.finalAnswer ? "✓" : "✗"}
                </p>
              </motion.div>
            </motion.div>

            {/* Solução Correta */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Solução Correta
                </Badge>
              </div>

              {/* Passos da solução correta */}
              {correctPath.steps.map((step, idx) => {
                const userHasStep = userPath.steps[idx];
                const userIsCorrect = userHasStep?.formula === step.formula;
                const isDivergence = showDivergence && divergencePoint === idx;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isDivergence
                        ? "border-green-500 bg-green-100 dark:bg-green-950/40 shadow-lg"
                        : "border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />

                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          Passo {step.step}: {step.description}
                        </p>
                        {step.formula && (
                          <p className="text-xs font-mono text-muted-foreground mt-1 p-2 bg-background/50 rounded">
                            {step.formula}
                          </p>
                        )}

                        {step.explanation && !userIsCorrect && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 pt-2 border-t border-green-300 dark:border-green-700"
                          >
                            <p className="text-xs text-green-700 dark:text-green-300">
                              <strong>Por quê:</strong> {step.explanation}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Resposta Final Correta */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: correctPath.steps.length * 0.1 }}
                className="p-3 rounded-lg border-2 border-green-400 bg-green-50 dark:bg-green-950/30"
              >
                <p className="text-xs font-semibold text-muted-foreground mb-1">Resposta Correta</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {correctPath.finalAnswer} ✓
                </p>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Insight sobre o erro */}
      {divergencePoint >= 0 && divergencePoint < userPath.steps.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
        >
          <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
            🔍 Análise do Erro
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Sua solução divergiu no <strong>Passo {divergencePoint + 1}</strong>. Você fez:
            <br />
            <code className="text-xs bg-background/50 px-2 py-1 rounded mt-1 inline-block">
              {userPath.steps[divergencePoint]?.formula}
            </code>
            <br />
            Mas deveria ser:
            <br />
            <code className="text-xs bg-background/50 px-2 py-1 rounded mt-1 inline-block">
              {correctPath.steps[divergencePoint]?.formula}
            </code>
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
            {correctPath.steps[divergencePoint]?.explanation}
          </p>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Helper para criar soluções de exemplo
 */
export const EXAMPLE_SOLUTION_PATHS = {
  dotProduct: {
    correct: {
      steps: [
        {
          step: 1,
          description: "Identifique as componentes dos vetores",
          formula: "a = (2, 1), b = (3, 4)",
          isCorrect: true,
        },
        {
          step: 2,
          description: "Aplique a fórmula do produto escalar",
          formula: "a·b = a_x * b_x + a_y * b_y",
          isCorrect: true,
          explanation: "Produto escalar multiplica componentes correspondentes",
        },
        {
          step: 3,
          description: "Calcule os produtos",
          formula: "a·b = (2*3) + (1*4) = 6 + 4",
          isCorrect: true,
        },
        {
          step: 4,
          description: "Some os resultados",
          formula: "a·b = 10",
          isCorrect: true,
        },
      ],
      finalAnswer: 10,
      totalSteps: 4,
    },
    userError: {
      steps: [
        {
          step: 1,
          description: "Identifique as componentes dos vetores",
          formula: "a = (2, 1), b = (3, 4)",
          isCorrect: true,
        },
        {
          step: 2,
          description: "Aplique a fórmula do produto escalar",
          formula: "a·b = a_x * b_x + a_y * b_y", // Correct
          isCorrect: true,
        },
        {
          step: 3,
          description: "Calcule os produtos",
          formula: "a·b = (2*1) + (3*4) = 2 + 12", // ERRADO: uso componentes erradas
          isCorrect: false,
        },
        {
          step: 4,
          description: "Some os resultados",
          formula: "a·b = 14",
          isCorrect: false,
        },
      ],
      finalAnswer: 14,
      totalSteps: 4,
    },
  },
};
