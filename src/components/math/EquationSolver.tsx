import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Info, Sparkles, AlertCircle, History, X, Trash2, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseVectorEquation, type ParsedEquation } from "@/lib/equation-parser";
import { MathFormula } from "./MathFormula";
import { 
  add3D, 
  subtract3D, 
  dot3D, 
  cross3D, 
  project3D, 
  mixed3D,
  magnitude3D,
  type Vector3D 
} from "@/lib/vector-math";

interface EquationSolverProps {
  onSolve: (result: ParsedEquation) => void;
}

const examples = [
  "(3, 2, 0) + (1, -1, 0)",
  "2i + 3j x 1i - 2k",
  "(1, 2, 3) · (4, 5, 6)",
  "3i - j + 2k",
];

const thoughtMessages = [
  "Entendi sua lógica!",
  "Isso parece interessante...",
  "Calculando vetores...",
  "Visualizando em 3D...",
  "Tudo pronto!",
];

export function EquationSolver({ onSolve }: EquationSolverProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const parsedResult = useMemo(() => {
    if (!input.trim()) return null;
    return parseVectorEquation(input);
  }, [input]);

  const calculation = useMemo(() => {
    if (!parsedResult) return null;
    
    const { vectorA, vectorB, vectorC, operation } = parsedResult;
    
    switch (operation) {
      case "add":
        return { type: "vector", value: add3D(vectorA, vectorB) };
      case "subtract":
        return { type: "vector", value: subtract3D(vectorA, vectorB) };
      case "dot":
        return { type: "scalar", value: dot3D(vectorA, vectorB) };
      case "cross":
        return { type: "vector", value: cross3D(vectorA, vectorB) };
      case "project":
        return { type: "vector", value: project3D(vectorA, vectorB) };
      case "mixed":
        return { type: "scalar", value: mixed3D(vectorA, vectorB, vectorC || { x: 0, y: 0, z: 0 }) };
      default:
        return { type: "vector", value: vectorA };
    }
  }, [parsedResult]);

  useEffect(() => {
    if (input.trim()) {
      setIsProcessing(true);
      setShowResult(false);
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setThoughtIndex(Math.floor(Math.random() * thoughtMessages.length));
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setIsProcessing(false);
      setShowResult(false);
    }
  }, [input]);

  const handleSolve = () => {
    if (!input.trim()) return;

    if (parsedResult) {
      onSolve(parsedResult);
      setError(null);
      setShowResult(true);
      if (!history.includes(input)) {
        setHistory(prev => [input, ...prev].slice(0, 5));
      }
      setThoughtIndex(thoughtMessages.length - 1);
    } else {
      setError("Não consegui entender essa equação. Tente o formato (x, y, z) ou xi + yj + zk.");
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    const result = parseVectorEquation(example);
    if (result) {
      onSolve(result);
      setShowResult(true);
    }
  };

  const formatVector = (v: Vector3D) => {
    return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`.replace(/\.00/g, "");
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-vector-blue via-vector-teal to-vector-purple rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${isProcessing ? 'animate-pulse' : ''}`} />
        
        <Card className="relative bg-background/40 backdrop-blur-xl border-2 border-white/10 hover:border-vector-blue/30 transition-all duration-500 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-vector-blue rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-vector-teal rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <CardContent className="p-6">
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Input
                  placeholder="Digite sua equação (ex: (2,3,0) + (1,-1,2) ou 3i + 2j)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSolve()}
                  className="pl-12 h-14 text-xl bg-white/5 border-white/10 focus-visible:ring-vector-blue/50 focus-visible:ring-offset-0 transition-all font-medium placeholder:text-muted-foreground/50"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground">
                  {isProcessing ? (
                    <Cpu className="h-6 w-6 text-vector-blue animate-spin-slow" />
                  ) : (
                    <Search className="h-6 w-6" />
                  )}
                </div>
                
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <AnimatePresence>
                    {input && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setInput("")}
                          className="h-10 w-10 text-muted-foreground hover:text-vector-red hover:bg-vector-red/10 rounded-full"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowHistory(!showHistory)}
                      className={`h-10 w-10 rounded-full transition-colors ${showHistory ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-white/10'}`}
                    >
                      <History className="h-5 w-5" />
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleSolve}
                    size="lg"
                    className="bg-gradient-to-r from-vector-blue to-vector-teal hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-vector-blue/20"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Resolver
                  </Button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 flex items-center gap-3 text-sm text-vector-red bg-vector-red/10 p-3 rounded-xl border border-vector-red/20"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{error}</span>
                </motion.div>
              ) : input.trim() ? (
                <motion.div
                  key="interpretation"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className={`h-4 w-4 text-vector-yellow ${isProcessing ? 'animate-pulse' : ''}`} />
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">
                        {isProcessing ? "Analisando..." : thoughtMessages[thoughtIndex]}
                      </span>
                    </div>
                    {parsedResult && !isProcessing && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-vector-teal bg-vector-teal/10 px-2 py-0.5 rounded-full border border-vector-teal/20">
                        <CheckCircle2 className="h-3 w-3" />
                        PRONTO
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-h-[60px] relative group/math gap-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-vector-blue/5 to-vector-teal/5 opacity-0 group-hover/math:opacity-100 transition-opacity" />
                    <MathFormula 
                      formula={input
                        .replace(/\b(x|X)\b/g, "\\times")
                        .replace(/vetorial/g, "\\times")
                        .replace(/escalar/g, "\\cdot")
                        .replace(/soma/g, "+")
                        .replace(/mais/g, "+")
                        .replace(/menos/g, "-")
                        .replace(/subtraia/g, "-")
                      } 
                    />

                    <AnimatePresence>
                      {showResult && calculation && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          className="w-full flex flex-col items-center gap-2 pt-4 border-t border-white/10"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-vector-teal uppercase tracking-widest">
                            <ArrowRight className="h-3 w-3" />
                            Resultado
                          </div>
                          <div className="text-2xl font-black text-gradient bg-gradient-to-r from-vector-blue to-vector-teal">
                            {calculation.type === "scalar" ? (
                              (calculation.value as number).toFixed(2).replace(/\.00/g, "")
                            ) : (
                              formatVector(calculation.value as Vector3D)
                            )}
                          </div>
                          
                          {calculation.type === "vector" && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              Magnitude: {magnitude3D(calculation.value as Vector3D).toFixed(2)}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {showHistory && history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 border-t border-white/10 pt-6"
              >
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Histórico Recente</span>
                  <Button variant="ghost" size="sm" onClick={() => setHistory([])} className="h-8 text-xs text-vector-red hover:bg-vector-red/10 rounded-full gap-2 px-3">
                    <Trash2 className="h-3.5 w-3.5" />
                    Limpar Tudo
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {history.map((item, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary" 
                      className="cursor-pointer bg-white/5 hover:bg-primary hover:text-white transition-all py-1.5 px-3 border border-white/10 hover:border-primary text-sm rounded-lg"
                      onClick={() => handleExampleClick(item)}
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4 px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <Sparkles className="h-3.5 w-3.5 text-vector-yellow" />
                <span>Sugestões</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => handleExampleClick(ex)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 hover:bg-vector-blue/20 hover:text-vector-blue transition-all border border-white/5 hover:border-vector-blue/30"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-4 p-4 rounded-2xl bg-vector-blue/5 border border-vector-blue/10 backdrop-blur-sm">
        <div className="bg-vector-blue/10 p-2 rounded-xl">
          <Info className="h-5 w-5 text-vector-blue" />
        </div>
        <div className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-vector-blue font-bold">Dica:</strong> O resolvedor inteligente entende componentes cartesianas, 
          notação de versores <code className="bg-vector-blue/10 px-1 rounded text-vector-blue">i, j, k</code> ou até comandos como 
          <span className="italic"> "soma (1,2) mais (3,4)"</span>. Use <code className="text-vector-blue">x</code> para produto vetorial e <code className="text-vector-blue">·</code> para produto escalar.
        </div>
      </div>
    </div>
  );
}


