import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy, Target, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/Layout";
import { MathFormula } from "@/components/MathFormula";

interface Question {
  id: string;
  type: "multiple-choice" | "calculation" | "concept";
  difficulty: "básico" | "intermediário" | "avançado";
  question: string;
  formula?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  hint?: string;
}

const questions: Question[] = [
  {
    id: "q1",
    type: "multiple-choice",
    difficulty: "básico",
    question: "Qual é a principal diferença entre um escalar e um vetor?",
    options: [
      "Escalares são sempre positivos, vetores podem ser negativos",
      "Escalares têm apenas magnitude, vetores têm magnitude e direção",
      "Escalares são bidimensionais, vetores são tridimensionais",
      "Não há diferença, são sinônimos"
    ],
    correctAnswer: 1,
    explanation: "Escalares possuem apenas magnitude (valor numérico), enquanto vetores possuem tanto magnitude quanto direção e sentido.",
    hint: "Pense na diferença entre temperatura (escalar) e velocidade (vetor)."
  },
  {
    id: "q2",
    type: "calculation",
    difficulty: "básico",
    question: "Calcule a magnitude do vetor v⃗ = (3, 4):",
    formula: "|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}",
    correctAnswer: 5,
    explanation: "Usando o teorema de Pitágoras: |v⃗| = √(3² + 4²) = √(9 + 16) = √25 = 5",
    hint: "Use o teorema de Pitágoras!"
  },
  {
    id: "q3",
    type: "multiple-choice",
    difficulty: "intermediário",
    question: "Se dois vetores têm produto escalar igual a zero, isso significa que:",
    options: [
      "Um dos vetores é o vetor nulo",
      "Os vetores são paralelos",
      "Os vetores são perpendiculares",
      "Os vetores têm a mesma magnitude"
    ],
    correctAnswer: 2,
    explanation: "Quando o produto escalar é zero, os vetores são perpendiculares (θ = 90°), pois cos(90°) = 0.",
    hint: "Lembre-se da fórmula: a⃗ · b⃗ = |a⃗||b⃗|cos(θ)"
  },
  {
    id: "q4",
    type: "calculation",
    difficulty: "intermediário",
    question: "Dados os vetores a⃗ = (2, 1) e b⃗ = (1, 3), calcule a⃗ · b⃗:",
    formula: "\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y",
    correctAnswer: 5,
    explanation: "a⃗ · b⃗ = (2)(1) + (1)(3) = 2 + 3 = 5",
    hint: "Multiplique as componentes correspondentes e some os resultados."
  },
  {
    id: "q5",
    type: "multiple-choice",
    difficulty: "avançado",
    question: "O produto vetorial a⃗ × b⃗ resulta em um vetor que é:",
    options: [
      "Paralelo tanto a a⃗ quanto a b⃗",
      "Perpendicular tanto a a⃗ quanto a b⃗", 
      "Na mesma direção de a⃗",
      "Na direção oposta a b⃗"
    ],
    correctAnswer: 1,
    explanation: "Por definição, o produto vetorial produz um vetor perpendicular aos dois vetores originais, seguindo a regra da mão direita.",
    hint: "Pense na regra da mão direita e na definição do produto vetorial."
  }
];

export default function Desafios() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [showHint, setShowHint] = useState(false);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === question.correctAnswer || 
                   (question.type === "calculation" && parseFloat(inputAnswer) === question.correctAnswer);

  const handleAnswer = () => {
    if (selectedAnswer === null && inputAnswer === "") return;
    
    setShowResult(true);
    if (isCorrect && !completedQuestions[currentQuestion]) {
      setScore(prev => prev + 1);
      const newCompleted = [...completedQuestions];
      newCompleted[currentQuestion] = true;
      setCompletedQuestions(newCompleted);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      resetQuestion();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      resetQuestion();
    }
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setInputAnswer("");
    setShowResult(false);
    setShowHint(false);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setCompletedQuestions(new Array(questions.length).fill(false));
    resetQuestion();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "básico": return "bg-vector-green text-white";
      case "intermediário": return "bg-vector-orange text-white";
      case "avançado": return "bg-vector-red text-white";
      default: return "bg-muted";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "multiple-choice": return Target;
      case "calculation": return Brain;
      case "concept": return Trophy;
      default: return Target;
    }
  };

  return (
    <Layout>
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Desafios e <span className="text-gradient">Exercícios</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Teste seus conhecimentos sobre vetores com exercícios interativos. 
          Receba feedback imediato e explicações detalhadas para cada resposta.
        </p>
      </motion.section>

      {/* Progress and Score */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-8"
      >
        <Card className="interactive-surface">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Questão {currentQuestion + 1} de {questions.length}
                  </span>
                  <Badge className={getDifficultyColor(question.difficulty)}>
                    {question.difficulty}
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{score}</div>
                  <div className="text-sm text-muted-foreground">Acertos</div>
                </div>
                <Button variant="outline" size="sm" onClick={resetQuiz}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Recomeçar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Question Card */}
      <motion.section
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Card className="interactive-surface">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {(() => {
                const Icon = getTypeIcon(question.type);
                return <Icon className="h-6 w-6 text-primary" />;
              })()}
              <span>Questão {currentQuestion + 1}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-lg mb-4">{question.question}</p>
              {question.formula && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <MathFormula formula={question.formula} block />
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {question.type === "multiple-choice" && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedAnswer(index)}
                      disabled={showResult}
                      className={`
                        w-full p-4 text-left rounded-lg border transition-all duration-300
                        ${selectedAnswer === index 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }
                        ${showResult && index === question.correctAnswer 
                          ? 'border-vector-green bg-vector-green/10' 
                          : ''
                        }
                        ${showResult && selectedAnswer === index && selectedAnswer !== question.correctAnswer
                          ? 'border-vector-red bg-vector-red/10'
                          : ''
                        }
                        disabled:cursor-not-allowed
                      `}
                      whileHover={{ scale: showResult ? 1 : 1.02 }}
                      whileTap={{ scale: showResult ? 1 : 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && index === question.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-vector-green" />
                        )}
                        {showResult && selectedAnswer === index && selectedAnswer !== question.correctAnswer && (
                          <XCircle className="h-5 w-5 text-vector-red" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {question.type === "calculation" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sua resposta:
                    </label>
                    <input
                      type="number"
                      value={inputAnswer}
                      onChange={(e) => setInputAnswer(e.target.value)}
                      disabled={showResult}
                      className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Digite sua resposta numérica..."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hint */}
            {question.hint && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-vector-orange"
                >
                  {showHint ? "Ocultar" : "Mostrar"} Dica
                </Button>
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-vector-orange/10 border border-vector-orange/20 p-4 rounded-lg"
                    >
                      <p className="text-sm text-vector-orange">💡 {question.hint}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {!showResult ? (
                <Button
                  onClick={handleAnswer}
                  disabled={selectedAnswer === null && inputAnswer === ""}
                  className="flex-1"
                >
                  Verificar Resposta
                </Button>
              ) : (
                <div className="flex gap-3 flex-1">
                  <Button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    Anterior
                  </Button>
                  <Button
                    onClick={nextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                    className="flex-1"
                  >
                    Próxima
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Result and Explanation */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`
                    p-4 rounded-lg border
                    ${isCorrect 
                      ? 'bg-vector-green/10 border-vector-green text-vector-green' 
                      : 'bg-vector-red/10 border-vector-red text-vector-red'
                    }
                  `}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span className="font-semibold">
                      {isCorrect ? "Correto!" : "Incorreto"}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    <strong>Explicação:</strong> {question.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.section>

      {/* Question Navigation */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Card className="interactive-surface">
          <CardHeader>
            <CardTitle>Navegação das Questões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index);
                    resetQuestion();
                  }}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  className={`
                    w-10 h-10 p-0
                    ${completedQuestions[index] 
                      ? 'bg-vector-green hover:bg-vector-green text-white' 
                      : ''
                    }
                  `}
                >
                  {completedQuestions[index] ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Final Results */}
      {currentQuestion === questions.length - 1 && showResult && (
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-primary text-white text-center">
            <CardContent className="p-8">
              <Trophy className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quiz Finalizado!</h2>
              <p className="text-lg mb-4">
                Você acertou {score} de {questions.length} questões
              </p>
              <div className="text-3xl font-bold mb-6">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <Button variant="secondary" size="lg" onClick={resetQuiz}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </Layout>
  );
}