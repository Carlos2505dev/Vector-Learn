import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy, Target, Brain, Sparkles, TrendingUp, Award, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";import { Layout } from "@/components/layout/Layout";
  import { MathFormula } from "@/components/math/MathFormula";
import { TestMode, type TestQuestion } from "@/components/TestMode";import { BadgeSystem, BADGE_DEFINITIONS } from "@/components/gamification/BadgeSystem";
  import { EasterEggBadgeGrid } from "@/components/gamification/EasterEggBadgeUI";
import { getEasterEggDetector } from "@/hooks/gamification/useEasterEggs";
import { SkillRadar } from "@/components/progress/SkillRadar";
import { useUserProgress } from "@/hooks/gamification/useUserProgress";
import { useSEO, generateBreadcrumbSchema, generateLearningResourceSchema } from "@/hooks/useSEO";
import { GamificationDashboard } from "@/components/gamification/GamificationDashboard";
import { enemVestibularQuestions, categoryMap, type QuestionCategory, getRandomQuestions } from "@/lib/questions-enem";

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

const rawQuestions: Question[] = [
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
    explanation: "\\text{Escalares possuem apenas magnitude (valor numérico), enquanto vetores possuem tanto magnitude quanto direção e sentido.}",
    hint: "Pense na diferença entre temperatura (escalar) e velocidade (vetor)."
  },
  {
    id: "q2",
    type: "calculation",
    difficulty: "básico",
    question: "\\text{Calcule a magnitude do vetor } \\vec{v} = (3, 4):",
    formula: "|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}",
    correctAnswer: 5,
    explanation: "\\text{Usando o teorema de Pitágoras: } |\\vec{v}| = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5",
    hint: "Use o teorema de Pitágoras!"
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
    explanation: "\\text{Um vetor é representado geometricamente como uma seta (segmento orientado) que possui ponto de origem, direção, sentido e magnitude (comprimento).}",
    hint: "Pense em como representamos uma força ou velocidade graficamente."
  },
  {
    id: "q7",
    type: "calculation",
    difficulty: "básico",
    question: "\\text{Se um vetor } \\vec{v} \\text{ faz um ângulo de } 30^\\circ \\text{ com o eixo x positivo e tem magnitude 10, qual é sua componente x?}",
    formula: "v_x = |\\vec{v}| \\cos(\\theta)",
    correctAnswer: 8.66,
    explanation: "v_x = |\\vec{v}|\\cos(\\theta) = 10 \\times \\cos(30^\\circ) = 10 \\times (\\sqrt{3}/2) = 10 \\times 0.866 \\approx 8.66",
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
    explanation: "\\text{Por definição, um vetor unitário sempre tem magnitude igual a 1, independentemente de sua direção.}",
    hint: "Lembre-se da definição de vetor unitário: \\hat{u} = \\vec{v}/|\\vec{v}|"
  },
  {
    id: "q17",
    type: "calculation",
    difficulty: "básico",
    question: "\\text{Calcule a projeção escalar do vetor } \\vec{a} = (6, 0) \\text{ sobre o vetor } \\vec{b} = (1, 0):",
    formula: "\\text{proj}_{\\vec{b}}(\\vec{a}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}",
    correctAnswer: 6,
    explanation: "\\vec{a} \\cdot \\vec{b} = 6\\times 1 + 0\\times 0 = 6; |\\vec{b}| = \\sqrt{1^2 + 0^2} = 1; \\text{proj}_{\\vec{b}}(\\vec{a}) = 6/1 = 6",
    hint: "Quando os vetores estão no mesmo eixo, a projeção é simplesmente o valor da componente nessa direção."
  },
  {
    id: "q20",
    type: "calculation",
    difficulty: "básico",
    question: "\\text{Se um vetor tem componentes (0, 5), qual sua magnitude?}",
    correctAnswer: 5,
    explanation: "\\text{Magnitude = } \\sqrt{0^2 + 5^2} = \\sqrt{25} = 5.",
    hint: "Use a fórmula da magnitude."
  },
  {
    id: "q21",
    type: "multiple-choice",
    difficulty: "básico",
    question: "Qual o resultado da soma dos vetores \\vec{a} = (2, 3) e \\vec{b} = (1, -1)?",
    options: ["(1, 4)", "(3, 2)", "(3, 4)", "(2, 2)"],
    correctAnswer: 1,
    explanation: "\\text{Soma: (2+1, 3-1) = (3, 2).}",
    hint: "Some as componentes x com x e y com y."
  },
  {
    id: "q22",
    type: "multiple-choice",
    difficulty: "básico",
    question: "Um vetor nulo tem magnitude de:",
    options: ["1", "Indefinida", "0", "-1"],
    correctAnswer: 2,
    explanation: "\\text{O vetor nulo (0,0) possui todas as componentes iguais a zero, logo sua magnitude é zero.}",
    hint: "Pense na origem do sistema de coordenadas."
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
    explanation: "\\text{Quando o produto escalar é zero, os vetores são perpendiculares } (\\theta = 90^\\circ), \\text{ pois } \\cos(90^\\circ) = 0.",
    hint: "Lembre-se da fórmula: \\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\theta)"
  },
  {
    id: "q4",
    type: "calculation",
    difficulty: "intermediário",
    question: "\\text{Dados os vetores } \\vec{a} = (2, 1) \\text{ e } \\vec{b} = (1, 3), \\text{ calcule } \\vec{a} \\cdot \\vec{b}:",
    formula: "\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y",
    correctAnswer: 5,
    explanation: "\\vec{a} \\cdot \\vec{b} = (2)(1) + (1)(3) = 2 + 3 = 5",
    hint: "Multiplique as componentes correspondentes e some os resultados."
  },
  {
    id: "q9",
    type: "calculation",
    difficulty: "intermediário",
    question: "\\text{Calcule o ângulo entre os vetores } \\vec{u} = (1, 2) \\text{ e } \\vec{v} = (3, 1). \\text{ Responda em graus:}",
    formula: "\\cos(\\theta) = \\frac{\\vec{u} \\cdot \\vec{v}}{|\\vec{u}||\\vec{v}|}",
    correctAnswer: 45,
    explanation: "\\vec{u} \\cdot \\vec{v} = 1 \\times 3 + 2 \\times 1 = 5; |\\vec{u}| = \\sqrt{5}; |\\vec{v}| = \\sqrt{10}; \\cos(\\theta) = 5/(\\sqrt{5}\\times\\sqrt{10}) = 5/\\sqrt{50} = 1/\\sqrt{2}; \\theta = 45^\\circ",
    hint: "Use a fórmula do produto escalar para encontrar o cosseno do ângulo."
  },
  {
    id: "q10",
    type: "multiple-choice",
    difficulty: "intermediário",
    question: "\\text{A projeção do vetor } \\vec{a} \\text{ sobre o vetor } \\vec{b} \\text{ é:}",
    options: [
      "\\text{Sempre menor que } |\\vec{a}|",
      "\\text{Um vetor na direção de } \\vec{b}",
      "\\text{Um escalar que pode ser negativo}",
      "\\text{Todas as alternativas anteriores estão corretas}"
    ],
    correctAnswer: 3,
    explanation: "\\text{A projeção de } \\vec{a} \\text{ sobre } \\vec{b} \\text{ é um vetor na direção de } \\vec{b}, \\text{ seu comprimento pode ser menor que } |\\vec{a}| \\text{ e pode ter valor negativo se o ângulo for obtuso.}",
    hint: "Considere a fórmula \\text{proj}_{\\vec{b}}(\\vec{a}) = (\\vec{a} \\cdot \\vec{b}/|\\vec{b}|^2)\\vec{b}"
  },
  {
    id: "q16",
    type: "calculation",
    difficulty: "intermediário",
    question: "\\text{Calcule a magnitude da projeção do vetor } \\vec{a} = (4, 3) \\text{ sobre o vetor } \\vec{b} = (1, 0):",
    formula: "|\\text{proj}_{\\vec{b}}(\\vec{a})| = \\frac{|\\vec{a} \\cdot \\vec{b}|}{|\\vec{b}|}",
    correctAnswer: 4,
    explanation: "\\vec{a} \\cdot \\vec{b} = 4\\times 1 + 3\\times 0 = 4; |\\vec{b}| = \\sqrt{1^2 + 0^2} = 1; |\\text{proj}_{\\vec{b}}(\\vec{a})| = |4|/1 = 4",
    hint: "A projeção sobre o eixo x é simplesmente a componente x do vetor."
  },
  {
    id: "q18",
    type: "calculation",
    difficulty: "intermediário",
    question: "\\text{Calcule o produto misto } \\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) \\text{ onde } \\vec{a} = (2,0,0), \\vec{b} = (0,3,0) \\text{ e } \\vec{c} = (0,0,4):",
    formula: "\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\det\\begin{pmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{pmatrix}",
    correctAnswer: 24,
    explanation: "\\text{Usando o determinante: det = } 2\\times(3\\times 4 - 0\\times 0) - 0\\times(0\\times 4 - 0\\times 0) + 0\\times(0\\times 0 - 3\\times 0) = 2\\times 12 = 24. \\text{ Este é o volume do paralelepípedo.}",
    hint: "Use a propriedade de que o produto misto é igual ao determinante da matriz 3×3. Vetores ortogonais simplificam muito o cálculo!"
  },
  {
    id: "q19",
    type: "calculation",
    difficulty: "intermediário",
    question: "\\text{Calcule o volume do paralelepípedo formado pelos vetores } \\vec{a} = (1,1,0), \\vec{b} = (0,1,1) \\text{ e } \\vec{c} = (1,0,1):",
    formula: "V = |\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})|",
    correctAnswer: 2,
    explanation: "det = 1\\times(1\\times 1 - 1\\times 0) - 1\\times(0\\times 1 - 1\\times 1) + 0\\times(0\\times 0 - 1\\times 1) = 1\\times 1 - 1\\times (-1) + 0 = 1 + 1 = 2. \\text{ Volume = } |2| = 2",
    hint: "O volume é o valor absoluto do produto misto. Calcule o determinante da matriz formada pelos três vetores."
  },
  {
    id: "q23",
    type: "calculation",
    difficulty: "intermediário",
    question: "\\text{Qual o valor do produto escalar entre (2, 2) e (-1, 1)?}",
    correctAnswer: 0,
    explanation: "\\text{2*(-1) + 2*1 = -2 + 2 = 0. Os vetores são perpendiculares.}",
    hint: "Multiplique as componentes e some."
  },
  {
    id: "q24",
    type: "calculation",
    difficulty: "intermediário",
    question: "\\text{Se } |\\vec{a}| = 3, |\\vec{b}| = 4 \\text{ e o ângulo entre eles é } 60^\\circ, \\text{ qual o produto escalar?}",
    formula: "\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\theta)",
    correctAnswer: 6,
    explanation: "3 * 4 * \\cos(60^\\circ) = 12 * 0.5 = 6.",
    hint: "Use a definição geométrica do produto escalar."
  },
  {
    id: "q25",
    type: "calculation",
    difficulty: "intermediário",
    question: "\\text{Qual a magnitude do vetor unitário na direção de (3, 0)?}",
    correctAnswer: 1,
    explanation: "\\text{Todo vetor unitário tem magnitude igual a 1 por definição.}",
    hint: "Pense na definição de 'unitário'."
  },
  {
    id: "q26",
    type: "multiple-choice",
    difficulty: "intermediário",
    question: "\\text{Se o produto escalar de dois vetores não nulos é positivo, o ângulo entre eles é:}",
    options: ["Agudo", "Reto", "Obtuso", "Raso"],
    correctAnswer: 0,
    explanation: "\\text{Se o produto escalar é positivo, } \\cos(\\theta) > 0, \\text{ o que ocorre para ângulos agudos (0° a 90°).}",
    hint: "Pense no sinal da função cosseno."
  },

  {
    id: "q5",
    type: "multiple-choice",
    difficulty: "avançado",
    question: "\\text{O produto vetorial } \\vec{a} \\times \\vec{b} \\text{ resulta em um vetor que é:}",
    options: [
      "\\text{Paralelo tanto a } \\vec{a} \\text{ quanto a } \\vec{b}",
      "\\text{Perpendicular tanto a } \\vec{a} \\text{ quanto a } \\vec{b}",
      "\\text{Na mesma direção de } \\vec{a}",
      "\\text{Na direção oposta a } \\vec{b}"
    ],
    correctAnswer: 1,
    explanation: "\\text{Por definição, o produto vetorial produz um vetor perpendicular aos dois vetores originais, seguindo a regra da mão direita.}",
    hint: "Pense na regra da mão direita e na definição do produto vetorial."
  },
  {
    id: "q11",
    type: "calculation",
    difficulty: "avançado",
    question: "\\text{Calcule a magnitude do produto vetorial } |\\vec{a} \\times \\vec{b}| \\text{ onde } \\vec{a} = (2, 1, 3) \\text{ e } \\vec{b} = (1, 2, 1):",
    formula: "|\\vec{a} \\times \\vec{b}| = \\sqrt{(a_y b_z - a_z b_y)^2 + (a_z b_x - a_x b_z)^2 + (a_x b_y - a_y b_x)^2}",
    correctAnswer: 7.07,
    explanation: "\\vec{a} \\times \\vec{b} = (1\\times 1-3\\times 2, 3\\times 1-2\\times 1, 2\\times 2-1\\times 1) = (-5, 1, 3); |\\vec{a} \\times \\vec{b}| = \\sqrt{25+1+9} = \\sqrt{35} \\approx 7.07",
    hint: "Use a definição do produto vetorial em coordenadas e depois calcule a magnitude."
  },
  {
    id: "q12",
    type: "multiple-choice",
    difficulty: "avançado",
    question: "\\text{Três vetores } \\vec{a}, \\vec{b} \\text{ e } \\vec{c} \\text{ são linearmente independentes se:}",
    options: [
      "Nenhum deles é combinação linear dos outros dois",
      "Todos têm a mesma magnitude",
      "São todos perpendiculares entre si",
      "Estão todos no mesmo plano"
    ],
    correctAnswer: 0,
    explanation: "\\text{Vetores são linearmente independentes quando nenhum pode ser escrito como combinação linear dos outros, garantindo que formem uma base do espaço.}",
    hint: "Pense na definição de independência linear em álgebra linear."
  },
  {
    id: "q13",
    type: "calculation",
    difficulty: "avançado",
    question: "\\text{Calcule o produto escalar triplo } \\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) \\text{ onde } \\vec{a} = (1,2,1), \\vec{b} = (2,1,0) \\text{ e } \\vec{c} = (1,1,2):",
    formula: "\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\det\\begin{pmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{pmatrix}",
    correctAnswer: -1,
    explanation: "\\text{Usando o determinante: } 1\\times(1\\times 2-0\\times 1) - 2\\times(2\\times 2-0\\times 1) + 1\\times(2\\times 1-1\\times 1) = 1\\times 2 - 2\\times 4 + 1\\times 1 = 2 - 8 + 1 = -1",
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
    explanation: "\\text{Em um espaço vetorial de dimensão n, são necessários exatamente n vetores linearmente independentes para formar uma base. Para R³, são necessários 3 vetores.}",
    hint: "A dimensão do espaço determina o número de vetores da base."
  },
  {
    id: "q15",
    type: "calculation",
    difficulty: "avançado",
    question: "\\text{Uma reta passa pelo ponto } P(1,2,3) \\text{ e tem direção do vetor } \\vec{d} = (2,1,-1). \\text{ Qual é a coordenada z do ponto na reta quando } x = 5?",
    formula: "\\vec{r}(t) = \\vec{P} + t\\vec{d}",
    correctAnswer: 1,
    explanation: "\\text{Equação da reta: } (x,y,z) = (1,2,3) + t(2,1,-1). \\text{ Para x=5: } 5=1+2t \\rightarrow t=2. \\text{ Logo } z = 3 + 2\\times(-1) = 3 - 2 = 1",
    hint: "Use a equação paramétrica da reta e encontre o parâmetro t primeiro."
  },
  {
    id: "q27",
    type: "multiple-choice",
    difficulty: "avançado",
    question: "\\text{Qual o resultado de } \\hat{i} \\times \\hat{j} \\text{ em um sistema de coordenadas dextrógiro?}",
    options: ["\\hat{k}", "-\\hat{k}", "\\vec{0}", "1"],
    correctAnswer: 0,
    explanation: "\\text{Pela regra da mão direita, o produto vetorial dos versores i e j resulta no versor k.}",
    hint: "Use a regra da mão direita."
  },
  {
    id: "q28",
    type: "calculation",
    difficulty: "avançado",
    question: "\\text{Calcule a área do paralelogramo formado por } (1, 0, 0) \\text{ e } (0, 1, 0):",
    formula: "\\text{Área} = |\\vec{a} \\times \\vec{b}|",
    correctAnswer: 1,
    explanation: "\\text{(1,0,0) x (0,1,0) = (0,0,1). A magnitude de (0,0,1) é 1.}",
    hint: "O produto vetorial de vetores unitários perpendiculares resulta em outro vetor unitário."
  },
  {
    id: "q29",
    type: "multiple-choice",
    difficulty: "avançado",
    question: "\\text{Se o produto misto de três vetores é zero, eles são:}",
    options: ["Perpendiculares", "Coplanares", "Colineares", "Unitários"],
    correctAnswer: 1,
    explanation: "\\text{O produto misto representa o volume do paralelepípedo. Se o volume é zero, os vetores estão no mesmo plano.}",
    hint: "Pense no volume de um sólido 'achatado'."
  }
];

const questions: Question[] = [...rawQuestions].sort((a, b) => {
  const diffOrder = { "básico": 1, "intermediário": 2, "avançado": 3 };
  return diffOrder[a.difficulty] - diffOrder[b.difficulty];
});


const testQuestions: TestQuestion[] = [
  {
    id: "test-1",
    question: "Qual é a principal diferença entre um escalar e um vetor?",
    options: [
      "Escalares são sempre positivos",
      "Escalares têm magnitude, vetores têm magnitude e direção",
      "Não há diferença",
      "Escalares são 2D, vetores são 3D"
    ],
    correctAnswer: 1,
    category: "Conceitos",
    difficulty: "básico"
  },
  {
    id: "test-2",
    question: "A magnitude do vetor (3, 4) é:",
    options: ["3", "4", "5", "7"],
    correctAnswer: 2,
    category: "Magnitude",
    difficulty: "básico"
  },
  {
    id: "test-3",
    question: "Um vetor unitário tem magnitude de:",
    options: ["0", "1", "Depende do vetor", "Infinito"],
    correctAnswer: 1,
    category: "Vetores Especiais",
    difficulty: "básico"
  },
  {
    id: "test-4",
    question: "O resultado do produto escalar entre (1,0) e (0,1) é:",
    options: ["0", "1", "-1", "Indefinido"],
    correctAnswer: 0,
    category: "Produto Escalar",
    difficulty: "intermediário"
  },
  {
    id: "test-5",
    question: "Dois vetores são ortogonais quando seu produto escalar é igual a:",
    options: ["1", "-1", "0", "Infinito"],
    correctAnswer: 2,
    category: "Produto Escalar",
    difficulty: "intermediário"
  },
  {
    id: "test-6",
    question: "A projeção do vetor a sobre o vetor b resulta em:",
    options: [
      "Um vetor",
      "Um escalar",
      "Tanto um vetor quanto um escalar",
      "Nada, é indefinido"
    ],
    correctAnswer: 2,
    category: "Projeções",
    difficulty: "intermediário"
  }
];

export default function Desafios() {
  useSEO({
    title: 'Desafios de Vetores - Exercícios e Quiz | Vector Learn',
    description: 'Teste seus conhecimentos de vetores com desafios interativos, quiz e questões de ENEM e vestibular. Aprenda com feedback instantâneo!',
    keywords: 'exercícios de vetores, quiz vetores, ENEM matemática, vestibular, desafios matemática, questões de vetores',
    canonicalUrl: 'https://vectorslearn.vercel.app/desafios',
    breadcrumbSchema: generateBreadcrumbSchema([
      { name: 'Home', url: 'https://vectorslearn.vercel.app' },
      { name: 'Desafios', url: 'https://vectorslearn.vercel.app/desafios' },
    ]),
    learningResourceSchema: generateLearningResourceSchema(
      'Desafios de Vetores',
      'Exercícios e quiz interativos para praticar vetores matemática e física',
      ['High School', 'Undergraduate']
    ),
  });
  const [tabValue, setTabValue] = useState("quiz");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<boolean[]>(new Array(questions.length).fill(false));
  const [showHint, setShowHint] = useState(false);
  const [answeredTime, setAnsweredTime] = useState(0);
  const [unlockedBadgeNotification, setUnlockedBadgeNotification] = useState<string | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | "todas">("todas");
  const [selectedDifficulty, setSelectedDifficulty] = useState<"todas" | "básico" | "intermediário" | "avançado">("todas");
  const [enemCurrentQuestion, setEnemCurrentQuestion] = useState(0);
  const [enemSelectedAnswer, setEnemSelectedAnswer] = useState<number | null>(null);
  const [enemShowResult, setEnemShowResult] = useState(false);
  const [enemScore, setEnemScore] = useState(0);
  const [enemCompletedQuestions, setEnemCompletedQuestions] = useState<boolean[]>([]);
  const [enemQuestionStartTime, setEnemQuestionStartTime] = useState(Date.now());
  
  const getFilteredEnemQuestions = () => {
    let filtered = enemVestibularQuestions;
    
    if (selectedCategory !== "todas") {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    if (selectedDifficulty !== "todas") {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }
    
    return filtered;
  };
  
  const filteredEnemQuestions = getFilteredEnemQuestions();
  
  useEffect(() => {
    setEnemCurrentQuestion(0);
    setEnemCompletedQuestions(new Array(filteredEnemQuestions.length).fill(false));
    setEnemScore(0);
  }, [selectedCategory, selectedDifficulty, filteredEnemQuestions.length]);

  const { stats, recordAnswer, recordTestCompletion, recordShare, isLoaded } = useUserProgress();

  // Detecta badges recém-desbloqueados ao responder questões e exibe a notificação
  const prevBadgesRef = useRef<string[] | null>(null);

  useEffect(() => {
    if (!isLoaded) return; // aguarda o carregamento inicial para não disparar notificações falsas
    const current = stats.unlockedBadges.map((b) => b.badgeId);
    if (prevBadgesRef.current === null) {
      prevBadgesRef.current = current;
      return;
    }
    const newBadges = current.filter((id) => !prevBadgesRef.current!.includes(id));
    if (newBadges.length > 0) {
      const names = newBadges.map((id) => {
        const definition = BADGE_DEFINITIONS[id as keyof typeof BADGE_DEFINITIONS];
        return definition ? definition.name : id;
      });
      setUnlockedBadgeNotification(names.join(" • "));
      setTimeout(() => setUnlockedBadgeNotification(null), 5000);
    }
    prevBadgesRef.current = current;
  }, [stats.unlockedBadges, isLoaded]);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);
  
  useEffect(() => {
    setEnemQuestionStartTime(Date.now());
  }, [enemCurrentQuestion]);

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isCorrect = selectedAnswer === question.correctAnswer ||
    (question.type === "calculation" && parseFloat(inputAnswer) === question.correctAnswer);

  const enemQuestion = filteredEnemQuestions[enemCurrentQuestion];
  const enemProgress = ((enemCurrentQuestion + 1) / filteredEnemQuestions.length) * 100;
  const enemIsCorrect = enemSelectedAnswer === enemQuestion?.correctAnswer;

  const handleEnemAnswer = () => {
    if (enemSelectedAnswer === null || !enemQuestion) return;

    setEnemShowResult(true);
    const timeSpent = (Date.now() - enemQuestionStartTime) / 1000;

    if (enemIsCorrect && !enemCompletedQuestions[enemCurrentQuestion]) {
      setEnemScore(prev => prev + 1);
      const newCompleted = [...enemCompletedQuestions];
      newCompleted[enemCurrentQuestion] = true;
      setEnemCompletedQuestions(newCompleted);
      recordAnswer(enemQuestion.id, true, timeSpent);
    } else {
      recordAnswer(enemQuestion.id, false, timeSpent);
    }
  };

  const nextEnemQuestion = () => {
    if (enemCurrentQuestion < filteredEnemQuestions.length - 1) {
      setEnemCurrentQuestion(prev => prev + 1);
      setEnemSelectedAnswer(null);
      setEnemShowResult(false);
    }
  };

  const prevEnemQuestion = () => {
    if (enemCurrentQuestion > 0) {
      setEnemCurrentQuestion(prev => prev - 1);
      setEnemSelectedAnswer(null);
      setEnemShowResult(false);
    }
  };

  const resetEnemQuiz = () => {
    setEnemCurrentQuestion(0);
    setEnemScore(0);
    setEnemCompletedQuestions(new Array(filteredEnemQuestions.length).fill(false));
    setEnemSelectedAnswer(null);
    setEnemShowResult(false);
  };

  const handleAnswer = () => {
    if (selectedAnswer === null && inputAnswer === "") return;

    setShowResult(true);
    const timeSpent = (Date.now() - questionStartTime) / 1000;
    setAnsweredTime(timeSpent);

    if (isCorrect && !completedQuestions[currentQuestion]) {
      setScore(prev => prev + 1);
      const newCompleted = [...completedQuestions];
      newCompleted[currentQuestion] = true;
      setCompletedQuestions(newCompleted);

      recordAnswer(question.id, true, timeSpent);
    } else {
      recordAnswer(question.id, false, timeSpent);
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
      case "básico": return "bg-green-500 hover:bg-green-600 text-white border-transparent";
      case "intermediário": return "bg-amber-500 hover:bg-amber-600 text-white border-transparent";
      case "avançado": return "bg-red-500 hover:bg-red-600 text-white border-transparent";
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
          Teste seus conhecimentos sobre vetores através de exercícios interativos
          ou participe de uma prova formal com certificado!
        </p>
      </motion.section>

      <Tabs value={tabValue} onValueChange={setTabValue} className="mb-8">
        <TabsList className="grid w-full grid-cols-6 mb-8">
          <TabsTrigger value="quiz">
            <Brain className="w-4 h-4 mr-2" />
            Quiz Livre
          </TabsTrigger>
          <TabsTrigger value="enem">
            <Target className="w-4 h-4 mr-2" />
            ENEM/Vestibular
          </TabsTrigger>
          <TabsTrigger value="test">
            <Trophy className="w-4 h-4 mr-2" />
            Modo Prova
          </TabsTrigger>
          <TabsTrigger value="analise">
            <TrendingUp className="w-4 h-4 mr-2" />
            Análise
          </TabsTrigger>
          <TabsTrigger value="badges">
            <Target className="w-4 h-4 mr-2" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="perfil">
            <Award className="w-4 h-4 mr-2" />
            Meu Perfil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quiz" className="space-y-8">
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
                  <div className="text-lg mb-4">
                    {question.question.includes('\\') || question.question.includes('_') || question.question.includes('^') ? (
                      <MathFormula formula={question.question} />
                    ) : (
                      <span>{question.question}</span>
                    )}
                  </div>
                  {question.formula && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <MathFormula formula={question.formula} block />
                    </div>
                  )}
                </div>

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
                            <span>
                              {option.toString().includes('\\') || option.toString().includes('_') || option.toString().includes('^') ? (
                                <MathFormula formula={option.toString()} />
                              ) : (
                                option
                              )}
                            </span>
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
                      <div className="text-sm text-foreground">
                        <strong>Explicação:</strong> {question.explanation.includes('\\') || question.explanation.includes('_') || question.explanation.includes('^') ? (
                          <MathFormula formula={question.explanation} />
                        ) : (
                          <span>{question.explanation}</span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.section>

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
        </TabsContent>

        <TabsContent value="enem" className="space-y-8">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card className="interactive-surface">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoria</label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedCategory === "todas" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory("todas")}
                      >
                        Todas
                      </Button>
                      {Object.entries(categoryMap).map(([key, label]) => (
                        <Button
                          key={key}
                          variant={selectedCategory === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(key as QuestionCategory)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Dificuldade</label>
                    <div className="flex flex-wrap gap-2">
                      {["todas", "básico", "intermediário", "avançado"].map((diff) => (
                        <Button
                          key={diff}
                          variant={selectedDifficulty === diff ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDifficulty(diff as typeof selectedDifficulty)}
                          className={
                            diff !== "todas"
                              ? getDifficultyColor(diff)
                              : ""
                          }
                        >
                          {diff === "todas" ? "Todas" : diff.charAt(0).toUpperCase() + diff.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {filteredEnemQuestions.length} questão{filteredEnemQuestions.length !== 1 ? 's' : ''} encontrada{filteredEnemQuestions.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {filteredEnemQuestions.length > 0 ? (
            <>
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
                            Questão {enemCurrentQuestion + 1} de {filteredEnemQuestions.length}
                          </span>
                          <Badge className={getDifficultyColor(enemQuestion?.difficulty || "básico")}>
                            {enemQuestion?.difficulty}
                          </Badge>
                        </div>
                        <Progress value={enemProgress} className="h-2" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{enemScore}</div>
                          <div className="text-sm text-muted-foreground">Acertos</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={resetEnemQuiz}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Recomeçar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.section>

              {enemQuestion && (
                <motion.section
                  key={enemCurrentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8"
                >
                  <Card className="interactive-surface">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <Target className="h-6 w-6 text-primary" />
                        <span>Questão {enemCurrentQuestion + 1}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex gap-2">
                        <Badge variant="secondary">{enemQuestion.category}</Badge>
                      </div>

                      <div>
                        <div className="text-lg mb-4">{enemQuestion.question}</div>
                      </div>

                      <div className="space-y-2">
                        {enemQuestion.options.map((option, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setEnemSelectedAnswer(index)}
                            disabled={enemShowResult}
                            className={`
                              w-full p-4 text-left rounded-lg border transition-all duration-300
                              ${enemSelectedAnswer === index
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50 hover:bg-primary/5'
                              }
                              ${enemShowResult && index === enemQuestion.correctAnswer
                                ? 'border-vector-green bg-vector-green/10'
                                : ''
                              }
                              ${enemShowResult && enemSelectedAnswer === index && enemSelectedAnswer !== enemQuestion.correctAnswer
                                ? 'border-vector-red bg-vector-red/10'
                                : ''
                              }
                              disabled:cursor-not-allowed
                            `}
                            whileHover={{ scale: enemShowResult ? 1 : 1.02 }}
                            whileTap={{ scale: enemShowResult ? 1 : 0.98 }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {enemShowResult && index === enemQuestion.correctAnswer && (
                                <CheckCircle className="h-5 w-5 text-vector-green" />
                              )}
                              {enemShowResult && enemSelectedAnswer === index && enemSelectedAnswer !== enemQuestion.correctAnswer && (
                                <XCircle className="h-5 w-5 text-vector-red" />
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {!enemShowResult ? (
                          <Button
                            onClick={handleEnemAnswer}
                            disabled={enemSelectedAnswer === null}
                            className="flex-1"
                          >
                            Verificar Resposta
                          </Button>
                        ) : (
                          <div className="flex gap-3 flex-1">
                            <Button
                              onClick={prevEnemQuestion}
                              disabled={enemCurrentQuestion === 0}
                              variant="outline"
                              className="flex-1"
                            >
                              Anterior
                            </Button>
                            <Button
                              onClick={nextEnemQuestion}
                              disabled={enemCurrentQuestion === filteredEnemQuestions.length - 1}
                              className="flex-1"
                            >
                              Próxima
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {enemShowResult && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`
                              p-4 rounded-lg border
                              ${enemIsCorrect
                                ? 'bg-vector-green/10 border-vector-green text-vector-green'
                                : 'bg-vector-red/10 border-vector-red text-vector-red'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              {enemIsCorrect ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <XCircle className="h-5 w-5" />
                              )}
                              <span className="font-semibold">
                                {enemIsCorrect ? "Correto!" : "Incorreto"}
                              </span>
                            </div>
                            {enemQuestion.explanation && (
                              <div className="mt-3 text-sm text-foreground bg-black/5 dark:bg-white/5 p-3 rounded-md border border-border">
                                <strong className="block mb-1">Resolução:</strong>
                                <div className="whitespace-pre-wrap opacity-90">
                                  {enemQuestion.explanation.includes('\\') || enemQuestion.explanation.includes('_') || enemQuestion.explanation.includes('^') ? (
                                    <MathFormula formula={enemQuestion.explanation} />
                                  ) : (
                                    <span>{enemQuestion.explanation}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.section>
              )}

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
                      {filteredEnemQuestions.map((_, index) => (
                        <Button
                          key={index}
                          onClick={() => {
                            setEnemCurrentQuestion(index);
                            setEnemSelectedAnswer(null);
                            setEnemShowResult(false);
                          }}
                          variant={enemCurrentQuestion === index ? "default" : "outline"}
                          size="sm"
                          className={`
                            w-10 h-10 p-0
                            ${enemCompletedQuestions[index]
                              ? 'bg-vector-green hover:bg-vector-green text-white'
                              : ''
                            }
                          `}
                        >
                          {enemCompletedQuestions[index] ? (
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

              {enemCurrentQuestion === filteredEnemQuestions.length - 1 && enemShowResult && (
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
                        Você acertou {enemScore} de {filteredEnemQuestions.length} questões
                      </p>
                      <div className="text-3xl font-bold mb-6">
                        {Math.round((enemScore / filteredEnemQuestions.length) * 100)}%
                      </div>
                      <Button variant="secondary" size="lg" onClick={resetEnemQuiz}>
                        <RotateCcw className="mr-2 h-5 w-5" />
                        Tentar Novamente
                      </Button>
                    </CardContent>
                  </Card>
                </motion.section>
              )}
            </>
          ) : (
            <Card className="text-center p-12">
              <p className="text-muted-foreground mb-4">
                Nenhuma questão encontrada com os filtros selecionados.
              </p>
              <Button onClick={() => {
                setSelectedCategory("todas");
                setSelectedDifficulty("todas");
              }}>
                Limpar Filtros
              </Button>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="test" className="space-y-8">
          <TestMode
            questions={testQuestions}
            timeLimit={15 * 60}
            title="Prova Certificada - Vetores"
            level="intermediário"
            onComplete={(session) => {
              if (session.score !== undefined) {
                recordTestCompletion(session.score, session.questions.length);
              }
            }}
            onShare={recordShare}
          />
        </TabsContent>

        <TabsContent value="analise" className="space-y-8">
          <SkillRadar />
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border-2 border-vector-teal/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-vector-teal" />
                  Insights de Aprendizado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.averageAccuracy < 60 ? (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                    <p className="text-sm font-semibold text-red-900 dark:text-red-200">
                      ⚠️ Acurácia abaixo da média
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                      Sugerimos revisar os fundamentos e usar os simuladores antes de tentar novos desafios.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <p className="text-sm font-semibold text-green-900 dark:text-green-200">
                      ✨ Excelente progresso!
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Você está dominando bem os conceitos. Tente o modo prova para obter seu certificado.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">Média de Tempo</p>
                    <p className="text-xl font-bold">{Math.round(stats.averageTime)}s</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <p className="text-xs text-muted-foreground mb-1">Total Respondidas</p>
                    <p className="text-xl font-bold">{stats.totalAnswers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </TabsContent>

        <TabsContent value="badges" className="space-y-8">
          <BadgeSystem unlockedBadges={stats.unlockedBadges} />
          <EasterEggBadgeGrid unlockedBadges={getEasterEggDetector().getUnlockedEasterEggs()} />
        </TabsContent>

        <TabsContent value="perfil" className="space-y-8">
          <GamificationDashboard />
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {unlockedBadgeNotification && (
          <motion.div
            initial={{ opacity: 0, bottom: -100, x: "-50%" }}
            animate={{ opacity: 1, bottom: 20, x: "-50%" }}
            exit={{ opacity: 0, bottom: -100, x: "-50%" }}
            className="fixed left-1/2 z-50 pointer-events-none"
          >
            <Card className="bg-gradient-primary text-white p-4 shadow-2xl flex items-center gap-4 min-w-[300px]">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Novo Badge Desbloqueado!</p>
                <p className="text-lg font-bold">{unlockedBadgeNotification}</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}