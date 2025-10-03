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
  },
  {
    id: "q6",
    type: "multiple-choice",
    difficulty: "básico",
    question: "Como um vetor pode ser representado geometricamente?",
    options: [
      "Apenas como um ponto no espaço",
      "Como uma seta com origem, direção e magnitude",
      "Como uma linha reta sem direção definida",
      "Como um círculo com raio definido"
    ],
    correctAnswer: 1,
    explanation: "Um vetor é representado geometricamente como uma seta (segmento orientado) que possui ponto de origem, direção, sentido e magnitude (comprimento).",
    hint: "Pense em como representamos uma força ou velocidade graficamente."
  },
  {
    id: "q7",
    type: "calculation",
    difficulty: "básico",
    question: "Se um vetor v⃗ faz um ângulo de 30° com o eixo x positivo e tem magnitude 10, qual é sua componente x?",
    formula: "v_x = |\\vec{v}| \\cos(\\theta)",
    correctAnswer: 8.66,
    explanation: "vₓ = |v⃗|cos(θ) = 10 × cos(30°) = 10 × (√3/2) = 10 × 0,866 ≈ 8,66",
    hint: "Use a função cosseno para encontrar a componente horizontal."
  },
  {
    id: "q8",
    type: "multiple-choice",
    difficulty: "básico",
    question: "Um vetor unitário tem magnitude igual a:",
    options: [
      "Zero",
      "Um",
      "Infinito",
      "Depende da direção do vetor"
    ],
    correctAnswer: 1,
    explanation: "Por definição, um vetor unitário sempre tem magnitude igual a 1, independentemente de sua direção.",
    hint: "Lembre-se da definição de vetor unitário: û = v⃗/|v⃗|"
  },
  {
    id: "q9",
    type: "calculation",
    difficulty: "intermediário",
    question: "Calcule o ângulo entre os vetores u⃗ = (1, 2) e v⃗ = (3, 1). Responda em graus:",
    formula: "\\cos(\\theta) = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}||\\vec{v}|}",
    correctAnswer: 45,
    explanation: "u⃗·v⃗ = 1×3 + 2×1 = 5; |u⃗| = √5; |v⃗| = √10; cos(θ) = 5/(√5×√10) = 5/√50 = 1/√2; θ = 45°",
    hint: "Use a fórmula do produto escalar para encontrar o cosseno do ângulo."
  },
  {
    id: "q10",
    type: "multiple-choice",
    difficulty: "intermediário",
    question: "A projeção do vetor a⃗ sobre o vetor b⃗ é:",
    options: [
      "Sempre menor que |a⃗|",
      "Um vetor na direção de b⃗",
      "Um escalar que pode ser negativo",
      "Todas as alternativas anteriores estão corretas"
    ],
    correctAnswer: 3,
    explanation: "A projeção de a⃗ sobre b⃗ é um vetor na direção de b⃗, seu comprimento pode ser menor que |a⃗| e pode ter valor negativo se o ângulo for obtuso.",
    hint: "Considere a fórmula proj_b(a⃗) = (a⃗·b⃗/|b⃗|²)b⃗"
  },
  {
    id: "q11",
    type: "calculation",
    difficulty: "avançado",
    question: "Calcule a magnitude do produto vetorial |a⃗ × b⃗| onde a⃗ = (2, 1, 3) e b⃗ = (1, 2, 1):",
    formula: "|\\vec{a} \\times \\vec{b}| = \\sqrt{(a_y b_z - a_z b_y)^2 + (a_z b_x - a_x b_z)^2 + (a_x b_y - a_y b_x)^2}",
    correctAnswer: 7.07,
    explanation: "a⃗×b⃗ = (1×1-3×2, 3×1-2×1, 2×2-1×1) = (-5, 1, 3); |a⃗×b⃗| = √(25+1+9) = √35 ≈ 7,07",
    hint: "Use a definição do produto vetorial em coordenadas e depois calcule a magnitude."
  },
  {
    id: "q12",
    type: "multiple-choice",
    difficulty: "avançado",
    question: "Três vetores a⃗, b⃗ e c⃗ são linearmente independentes se:",
    options: [
      "Nenhum deles é combinação linear dos outros dois",
      "Todos têm a mesma magnitude",
      "São todos perpendiculares entre si",
      "Estão todos no mesmo plano"
    ],
    correctAnswer: 0,
    explanation: "Vetores são linearmente independentes quando nenhum pode ser escrito como combinação linear dos outros, garantindo que formem uma base do espaço.",
    hint: "Pense na definição de independência linear em álgebra linear."
  },
  {
    id: "q13",
    type: "calculation",
    difficulty: "avançado",
    question: "Calcule o produto escalar triplo a⃗·(b⃗ × c⃗) onde a⃗ = (1,2,1), b⃗ = (2,1,0) e c⃗ = (1,1,2):",
    formula: "\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = det\\begin{pmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{pmatrix}",
    correctAnswer: -1,
    explanation: "Usando o determinante: 1×(1×2-0×1) - 2×(2×2-0×1) + 1×(2×1-1×1) = 1×2 - 2×4 + 1×1 = 2 - 8 + 1 = -1",
    hint: "Use a propriedade de que o produto escalar triplo é igual ao determinante da matriz 3×3."
  },
  {
    id: "q14",
    type: "multiple-choice",
    difficulty: "avançado",
    question: "Em um espaço vetorial tridimensional, quantos vetores linearmente independentes são necessários para formar uma base?",
    options: [
      "2 vetores",
      "3 vetores",
      "4 vetores",
      "Depende dos vetores escolhidos"
    ],
    correctAnswer: 1,
    explanation: "Em um espaço vetorial de dimensão n, são necessários exatamente n vetores linearmente independentes para formar uma base. Para R³, são necessários 3 vetores.",
    hint: "A dimensão do espaço determina o número de vetores da base."
  },
  {
    id: "q15",
    type: "calculation",
    difficulty: "avançado",
    question: "Uma reta passa pelo ponto P(1,2,3) e tem direção do vetor d⃗ = (2,1,-1). Qual é a coordenada z do ponto na reta quando x = 5?",
    formula: "\\vec{r}(t) = \\vec{P} + t\\vec{d}",
    correctAnswer: 1,
    explanation: "Equação da reta: (x,y,z) = (1,2,3) + t(2,1,-1). Para x=5: 5=1+2t → t=2. Logo z = 3 + 2×(-1) = 3 - 2 = 1",
    hint: "Use a equação paramétrica da reta e encontre o parâmetro t primeiro."
  },
  {
    id: "q16",
    type: "calculation",
    difficulty: "intermediário",
    question: "Calcule a magnitude da projeção do vetor a⃗ = (4, 3) sobre o vetor b⃗ = (1, 0):",
    formula: "|\\text{proj}_{\\vec{b}}(\\vec{a})| = \\frac{|\\vec{a} \\cdot \\vec{b}|}{|\\vec{b}|}",
    correctAnswer: 4,
    explanation: "a⃗·b⃗ = 4×1 + 3×0 = 4; |b⃗| = √(1² + 0²) = 1; |proj_b(a⃗)| = |4|/1 = 4",
    hint: "A projeção sobre o eixo x é simplesmente a componente x do vetor."
  },
  {
    id: "q17",
    type: "calculation",
    difficulty: "básico",
    question: "Calcule a projeção escalar do vetor a⃗ = (6, 0) sobre o vetor b⃗ = (1, 0):",
    formula: "\\text{proj}_{\\vec{b}}(\\vec{a}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}",
    correctAnswer: 6,
    explanation: "a⃗·b⃗ = 6×1 + 0×0 = 6; |b⃗| = √(1² + 0²) = 1; proj_b(a⃗) = 6/1 = 6",
    hint: "Quando os vetores estão no mesmo eixo, a projeção é simplesmente o valor da componente nessa direção."
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
                      className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 text-foreground bg-background"
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