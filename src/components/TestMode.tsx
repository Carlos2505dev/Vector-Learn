import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, AlertCircle, Download, Share2 } from "lucide-react";
import { MathFormula } from "@/components/math/MathFormula";

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: "básico" | "intermediário" | "avançado";
  explanation?: string;
}

export interface TestResult {
  questionId: string;
  selectedAnswer: number;
  correct: boolean;
  timeSpent: number;
}

export interface TestSession {
  id: string;
  startTime: string;
  endTime?: string;
  totalTime?: number;
  questions: TestQuestion[];
  results: TestResult[];
  score?: number;
  level?: "básico" | "intermediário" | "avançado";
}

interface TestModeProps {
  questions: TestQuestion[];
  timeLimit?: number;
  onComplete?: (session: TestSession) => void;
  onShare?: () => void;
  title?: string;
  level?: "básico" | "intermediário" | "avançado";
}

export function TestMode({
  questions,
  timeLimit,
  onComplete,
  onShare,
  title = "Prova de Conhecimento",
  level = "intermediário"
}: TestModeProps) {
  const [testState, setTestState] = useState<"setup" | "taking" | "results">("setup");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<number | null>(null);

  useEffect(() => {
    if (testState !== "taking" || timeRemaining === undefined) return;

    if (timeRemaining <= 0) {
      handleFinish();
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining, testState]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (optionIndex: number) => {
    if (showExplanation) return;
    setCurrentSelection(optionIndex);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const newResult: TestResult = {
      questionId: currentQuestion.id,
      selectedAnswer: currentSelection!,
      correct: currentSelection === currentQuestion.correctAnswer,
      timeSpent
    };

    const updatedResults = [...results, newResult];
    setResults(updatedResults);
    setShowExplanation(false);
    setCurrentSelection(null);

    if (isLastQuestion) {
      handleFinish(updatedResults);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const handleFinish = (finalResults?: TestResult[]) => {
    const currentResults = finalResults || results;
    const correctAnswers = currentResults.filter(r => r.correct).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const totalTime = timeLimit !== undefined ? timeLimit - (timeRemaining || 0) : currentResults.reduce((acc, r) => acc + r.timeSpent, 0);

    const session: TestSession = {
      id: `test-${Date.now()}`,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      totalTime,
      questions,
      results: currentResults,
      score,
      level
    };

    setTestSession(session);
    setTestState("results");
    onComplete?.(session);
  };

  const formatTime = (seconds: number | undefined) => {
    if (seconds === undefined) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (testState === "setup") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="interactive-surface bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20">
          <CardHeader>
            <h2 className="text-3xl font-bold text-gradient mb-2">{title}</h2>
            <p className="text-muted-foreground">Prepare-se para testar seus conhecimentos</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-black/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Total de Questões</p>
                <p className="text-3xl font-black text-vector-blue">{questions.length}</p>
              </div>
              <div className="p-4 bg-white dark:bg-black/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Nível</p>
                <Badge className="text-lg py-1">
                  {level === "básico"
                    ? "Básico"
                    : level === "intermediário"
                    ? "Intermediário"
                    : "Avançado"}
                </Badge>
              </div>
              <div className="p-4 bg-white dark:bg-black/30 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-1">Tempo Limite</p>
                <p className="text-3xl font-black text-vector-teal">
                  {timeLimit ? `${Math.floor(timeLimit / 60)}m` : "∞"}
                </p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 rounded-lg">
              <h3 className="font-bold text-orange-900 dark:text-orange-200 mb-2">Instruções</h3>
              <ul className="text-sm text-orange-800 dark:text-orange-300 space-y-1">
                <li>✓ Você terá {questions.length} questões para responder</li>
                {timeLimit && <li>✓ Tempo limite: {Math.floor(timeLimit / 60)} minutos</li>}
                <li>✓ Não é possível voltar a questões anteriores</li>
                <li>✓ Receberá um certificado ao final se atingir 70% de acurácia</li>
              </ul>
            </div>

            <Button
              onClick={() => {
                setTestState("taking");
                setQuestionStartTime(Date.now());
              }}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-vector-blue to-vector-teal hover:opacity-90"
            >
              Iniciar Prova
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (testState === "taking" && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCorrect = results.filter(r => r.correct).length;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </span>
              {timeLimit && (
                <div className={`flex items-center gap-2 font-bold ${timeRemaining && timeRemaining < 60 ? "text-red-600" : "text-vector-teal"}`}>
                  <Clock className="w-4 h-4" />
                  {formatTime(timeRemaining)}
                </div>
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-vector-blue to-vector-teal"
              />
            </div>
          </div>
        </div>

        <Card className="interactive-surface">
          <CardContent className="p-8">
            <Badge className="mb-4" variant="outline">
              {currentQuestion.difficulty === "básico"
                ? "Básico"
                : currentQuestion.difficulty === "intermediário"
                ? "Intermediário"
                : "Avançado"}
            </Badge>

            <h2 className="text-2xl font-bold mb-6">
              {currentQuestion.question.includes('\\') || currentQuestion.question.includes('_') || currentQuestion.question.includes('^') ? (
                <MathFormula formula={currentQuestion.question} />
              ) : (
                currentQuestion.question
              )}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let btnClass = "w-full p-4 text-left rounded-lg border-2 transition-all ";
                if (showExplanation) {
                  if (index === currentQuestion.correctAnswer) {
                    btnClass += "border-green-500 bg-green-50 dark:bg-green-900/20";
                  } else if (index === currentSelection) {
                    btnClass += "border-red-500 bg-red-50 dark:bg-red-900/20";
                  } else {
                    btnClass += "border-border opacity-50";
                  }
                } else {
                  btnClass += "border-border hover:border-vector-blue hover:bg-muted/50";
                }

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={showExplanation ? {} : { scale: 1.02 }}
                    whileTap={showExplanation ? {} : { scale: 0.98 }}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border-2 border-border flex items-center justify-center">
                        <span className="text-sm font-bold">{String.fromCharCode(65 + index)}</span>
                      </div>
                      <span className="flex-1">
                        {option.includes('\\') || option.includes('_') || option.includes('^') ? (
                          <MathFormula formula={option} />
                        ) : (
                          option
                        )}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-muted rounded-lg border border-border"
              >
                <h3 className="font-bold mb-2">Resolução:</h3>
                <div className="text-muted-foreground whitespace-pre-wrap text-sm">
                  {currentQuestion.explanation || "Nenhuma resolução disponível."}
                </div>
                <Button onClick={handleNextQuestion} className="w-full mt-4 bg-gradient-to-r from-vector-blue to-vector-teal text-white">
                  {isLastQuestion ? "Finalizar Prova" : "Próxima Questão"}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Corretas</p>
            <p className="text-2xl font-black text-green-600">{answeredCorrect}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Incorretas</p>
            <p className="text-2xl font-black text-red-600">{results.length - answeredCorrect}</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">Restantes</p>
            <p className="text-2xl font-black text-vector-blue">{questions.length - results.length}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (testState === "results" && testSession) {
    const correctCount = testSession.results.filter(r => r.correct).length;
    const accuracy = testSession.score || 0;
    const isPassed = accuracy >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card
          className={`interactive-surface border-2 ${
            isPassed
              ? "bg-green-50 dark:bg-green-900/20 border-green-300"
              : "bg-orange-50 dark:bg-orange-900/20 border-orange-300"
          }`}
        >
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {isPassed ? (
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              ) : (
                <AlertCircle className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              )}
            </div>

            <h2 className="text-3xl font-black mb-2">
              {isPassed ? "Parabéns! 🎉" : "Quase lá! 💪"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isPassed
                ? "Você passou na prova com distinção!"
                : "Você não atingiu a pontuação mínima de 70%"}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <p className="text-sm text-muted-foreground">Pontuação</p>
                <p className={`text-4xl font-black ${isPassed ? "text-green-600" : "text-orange-600"}`}>
                  {accuracy}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Acertos</p>
                <p className="text-4xl font-black text-vector-blue">
                  {correctCount}/{testSession.questions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempo</p>
                <p className="text-4xl font-black text-vector-teal">
                  {testSession.totalTime ? `${Math.floor(testSession.totalTime / 60)}m` : "∞"}
                </p>
              </div>
            </div>

            {isPassed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="p-4 bg-green-100 dark:bg-green-900/50 rounded-lg mb-6"
              >
                <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                  ✓ Você desbloqueou o Certificado de Conclusão!
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card className="interactive-surface">
          <CardHeader>
            <h3 className="font-bold">Análise Detalhada de Performance</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {testSession.results.map((result, index) => {
              const question = testSession.questions.find(q => q.id === result.questionId);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-3 rounded-lg border border-border ${
                    result.correct ? "bg-green-50 dark:bg-green-900/30" : "bg-red-50 dark:bg-red-900/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.correct ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm mb-1">Questão {index + 1}</p>
                      <p className="text-sm text-muted-foreground mb-2">{question?.question}</p>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className={result.correct ? "text-green-600" : "text-red-600"}>
                          {result.correct ? "✓ Correta" : "✗ Incorreta"}
                        </span>
                        <span className="text-muted-foreground">{result.timeSpent}s</span>
                      </div>
                      {question?.explanation && (
                        <div className="mt-3 p-3 bg-black/5 dark:bg-white/5 rounded-md text-sm border border-border">
                          <p className="font-semibold mb-1 text-foreground">Resolução:</p>
                          <div className="text-muted-foreground whitespace-pre-wrap">
                            {question.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {isPassed && (
          <div className="flex gap-3 flex-wrap">
            <Button className="flex-1 gap-2 bg-vector-blue hover:bg-vector-blue/90">
              <Download className="w-4 h-4" />
              Baixar Certificado
            </Button>
            <Button className="flex-1 gap-2" variant="outline" onClick={onShare}>
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
          </div>
        )}

        <Button onClick={() => window.location.reload()} className="w-full" variant="outline">
          Fazer Nova Prova
        </Button>
      </motion.div>
    );
  }

  return null;
}
