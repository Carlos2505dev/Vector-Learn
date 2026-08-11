
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { MathFormula } from "./math/MathFormula";
import { LineIntegralSimulator } from "./simulators/LineIntegralSimulator";
import { VectorFieldVisualizer } from "./simulators/VectorFieldVisualizer";
import { ParametricCurve, VectorField2D, VectorField3D, IntegralChallenge } from "@/lib/calculus-types";

const PARAMETRIC_CURVES: ParametricCurve[] = [
  {
    id: "circle",
    x: (t) => Math.cos(t),
    y: (t) => Math.sin(t),
    description: "Círculo Unitário",
    tMin: 0,
    tMax: 2 * Math.PI
  },
  {
    id: "helix",
    x: (t) => Math.cos(t),
    y: (t) => Math.sin(t),
    z: (t) => t / (2 * Math.PI),
    description: "Hélice",
    tMin: 0,
    tMax: 4 * Math.PI
  },
  {
    id: "parabola",
    x: (t) => t,
    y: (t) => t * t,
    description: "Parábola",
    tMin: -2,
    tMax: 2
  },
  {
    id: "lissajous",
    x: (t) => 2 * Math.sin(2 * t),
    y: (t) => 2 * Math.sin(3 * t),
    description: "Curva de Lissajous",
    tMin: 0,
    tMax: 2 * Math.PI
  }
];

const VECTOR_FIELDS_2D: VectorField2D[] = [
  {
    fx: (x, y) => -y,
    fy: (x, y) => x,
    description: "Rotação F = (-y, x)",
    isConservative: false
  },
  {
    fx: (x, y) => x,
    fy: (x, y) => y,
    description: "Radial F = (x, y)",
    isConservative: true
  },
  {
    fx: (x, y) => -x / (x * x + y * y),
    fy: (x, y) => -y / (x * x + y * y),
    description: "Fonte Negativa",
    isConservative: true
  },
  {
    fx: (x, y) => x * Math.sin(y),
    fy: (x, y) => x * Math.cos(y),
    description: "Onda Parametrizada",
    isConservative: false
  }
];

const VECTOR_FIELDS_3D: VectorField3D[] = [
  {
    fx: (x, y, z) => y,
    fy: (x, y, z) => -x,
    fz: (x, y, z) => 0,
    description: "Rotação Planar",
    isConservative: false,
    formula: "F(x, y, z) = (y, −x, 0)"
  },
  {
    fx: (x, y, z) => x,
    fy: (x, y, z) => y,
    fz: (x, y, z) => z,
    description: "Campo Radial 3D",
    isConservative: true,
    formula: "F(x, y, z) = (x, y, z)"
  },
  {
    fx: (x, y, z) => y - z,
    fy: (x, y, z) => z - x,
    fz: (x, y, z) => x - y,
    description: "Campo de Circulação",
    isConservative: false,
    formula: "F(x, y, z) = (y − z, z − x, x − y)"
  },
  {
    fx: (x, y, z) => 2 * x,
    fy: (x, y, z) => -y,
    fz: (x, y, z) => 3 * z,
    description: "Gradiente Anisotrópico",
    isConservative: true,
    formula: "F(x, y, z) = (2x, −y, 3z)"
  }
];

const CHALLENGES: IntegralChallenge[] = [
  {
    id: "ch1",
    title: "Trabalho em Círculo",
    description: "Calcule o trabalho realizado pelo campo F = (-y, x) ao longo do círculo unitário.",
    field: VECTOR_FIELDS_2D[0],
    curve: PARAMETRIC_CURVES[0],
    expectedResult: 2 * Math.PI,
    tolerance: 0.1,
    hint: "Para um campo de rotação puro, a integral ao longo de um círculo é sempre positiva. Use parametrização em coordenadas polares!",
    difficulty: "easy"
  },
  {
    id: "ch2",
    title: "Teorema de Green - Verificação",
    description: "Compare a integral de linha do campo radial F = (x, y) com a integral dupla sobre a região.",
    field: VECTOR_FIELDS_2D[1],
    curve: PARAMETRIC_CURVES[0],
    expectedResult: 0,
    tolerance: 0.1,
    hint: "Para um campo conservativo derivado de um potencial, a integral ao longo de uma curva fechada é zero.",
    difficulty: "medium"
  },
  {
    id: "ch3",
    title: "Lissajous Complexa",
    description: "Integre o campo F = (x, y) ao longo da curva de Lissajous. Qual é o trabalho total realizado?",
    field: VECTOR_FIELDS_2D[1],
    curve: PARAMETRIC_CURVES[3],
    expectedResult: 0,
    tolerance: 0.1,
    hint: "Como a curva de Lissajous volta ao ponto de partida e o campo é conservativo, o trabalho total é zero.",
    difficulty: "hard"
  }
];

export function CalculusIIModule() {
  const [activeTab, setActiveTab] = useState("content");
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const toggleChallenge = (id: string) => {
    if (completedChallenges.includes(id)) {
      setCompletedChallenges(completedChallenges.filter(c => c !== id));
    } else {
      setCompletedChallenges([...completedChallenges, id]);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-3">
          <div className="text-4xl">📐</div>
          <div>
            <h1 className="text-4xl font-bold">Cálculo II</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Integrais de Linha e Campos Vetoriais
            </p>
          </div>
        </div>
        <Badge className="w-fit">
          ✓ Módulo Avançado | Progresso:{" "}
          {Math.round((completedChallenges.length / CHALLENGES.length) * 100)}%
        </Badge>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span className="hidden sm:inline">Conteúdo</span>
          </TabsTrigger>
          <TabsTrigger value="integrals" className="flex items-center gap-2">
            <Zap size={16} />
            <span className="hidden sm:inline">Integrais</span>
          </TabsTrigger>
          <TabsTrigger value="fields" className="flex items-center gap-2">
            <Zap size={16} />
            <span className="hidden sm:inline">Campos</span>
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span className="hidden sm:inline">Desafios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📚 Fundamentos Teóricos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">1. Integrais de Linha</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Uma integral de linha é uma generalização da integral definida para funções
                  definidas ao longo de uma curva. É fundamental em física para calcular trabalho,
                  fluxo e circulação de campos vetoriais.
                </p>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold">Definição Geral:</h4>
                  <MathFormula
                    formula={`\\int_C \\vec{F} \\cdot d\\vec{r} = \\int_a^b \\vec{F}(\\vec{r}(t)) \\cdot \\vec{r}'(t) \\, dt`}
                  />
                </div>

                <div className="space-y-2">
                  <p className="font-semibold">Onde:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    <li>C é a curva de integração</li>
                    <li>
                      <strong>F</strong> é um campo vetorial
                    </li>
                    <li>
                      <strong>r</strong>(t) é uma parametrização da curva
                    </li>
                    <li>
                      <strong>r</strong>'(t) é o vetor tangente (velocidade)
                    </li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">2. Campos Vetoriais</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Um campo vetorial associa um vetor a cada ponto no espaço. Exemplos incluem
                  campos elétricos, magnéticos, de velocidade em fluidos e forças conservativas.
                </p>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold">Campo Vetorial 2D:</h4>
                  <MathFormula formula={`\\vec{F}(x, y) = P(x, y)\\hat{i} + Q(x, y)\\hat{j}`} />
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold">Campo Vetorial 3D:</h4>
                  <MathFormula
                    formula={`\\vec{F}(x, y, z) = P(x, y, z)\\hat{i} + Q(x, y, z)\\hat{j} + R(x, y, z)\\hat{k}`}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">3. Campos Conservativos</h3>
                <p className="text-slate-700 dark:text-slate-300">
                  Um campo é conservativo se pode ser escrito como o gradiente de uma função
                  escalar (potencial). Para campos conservativos, a integral depende apenas dos
                  pontos inicial e final, não do caminho.
                </p>

                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold">Teste em 2D:</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Um campo F = (P, Q) é conservativo se:
                  </p>
                  <MathFormula formula={`\\frac{\\partial Q}{\\partial x} = \\frac{\\partial P}{\\partial y}`} />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Equivalentemente: ∇ × F = 0 (rotacional nulo)
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold">Propriedade Fundamental:</h4>
                  <MathFormula
                    formula={`\\oint_C \\vec{F} \\cdot d\\vec{r} = 0 \\text{ (curva fechada)}`}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">4. Aplicações Práticas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-50 dark:bg-slate-900">
                    <CardContent className="pt-6 space-y-2">
                      <h4 className="font-semibold">⚙️ Trabalho em Física</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        W = ∫ F·dr mede o trabalho realizado por uma força ao longo de um caminho
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-900">
                    <CardContent className="pt-6 space-y-2">
                      <h4 className="font-semibold">💧 Fluxo em Fluidos</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        A circulação de um campo de velocidade ao longo de uma curva fechada
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-900">
                    <CardContent className="pt-6 space-y-2">
                      <h4 className="font-semibold">🧲 Campos Eletromagnéticos</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Lei de Faraday: ∮ E·dl descreve a indução eletromagnética
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-50 dark:bg-slate-900">
                    <CardContent className="pt-6 space-y-2">
                      <h4 className="font-semibold">📐 Área e Volume</h4>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Teorema de Green relaciona integrais de linha com integrais duplas
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrals" className="space-y-6">
          <LineIntegralSimulator
            curves={PARAMETRIC_CURVES}
            fields={VECTOR_FIELDS_2D}
            challenges={CHALLENGES}
          />
        </TabsContent>

        <TabsContent value="fields" className="space-y-6">
          <VectorFieldVisualizer fields={VECTOR_FIELDS_3D} />
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid gap-4">
            {CHALLENGES.map((challenge) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    completedChallenges.includes(challenge.id)
                      ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700"
                      : ""
                  }`}
                  onClick={() => toggleChallenge(challenge.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{challenge.title}</CardTitle>
                          <Badge
                            variant={
                              challenge.difficulty === "easy"
                                ? "secondary"
                                : challenge.difficulty === "medium"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {challenge.difficulty.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          {challenge.description}
                        </p>
                      </div>
                      {completedChallenges.includes(challenge.id) && (
                        <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 ml-4" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded text-sm space-y-2">
                      <div>
                        <strong>Dica:</strong>
                        <p className="text-slate-700 dark:text-slate-300 mt-1">{challenge.hint}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChallenge(challenge.id);
                        }}
                      >
                        {completedChallenges.includes(challenge.id) ? "✓ Completo" : "Marcar como Completo"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Progresso do Módulo</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {completedChallenges.length} de {CHALLENGES.length} desafios completos
              </p>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((completedChallenges.length / CHALLENGES.length) * 100)}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
