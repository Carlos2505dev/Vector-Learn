import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";import { Layout } from "@/components/layout/Layout";
  import { Vector2DSimulator } from "@/components/simulators/Vector2DSimulator";
  import { Vector3DSimulator } from "@/components/simulators/Vector3DSimulator";
  import { FluidDynamicsSimulator } from "@/components/simulators/FluidDynamicsSimulator";
import { Monitor, Box, Info, Lightbulb, Sparkles, Wind } from "lucide-react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Badge } from "@/components/ui/badge";
import { BADGE_DEFINITIONS } from "@/components/gamification/BadgeSystem";
import { useSEO, generateBreadcrumbSchema, generateLearningResourceSchema } from "@/hooks/useSEO";import { MathFormula } from "@/components/math/MathFormula";
  import { EquationSolver } from "@/components/math/EquationSolver";
import { type ParsedEquation } from "@/lib/equation-parser";

const instructions = [
  {
    icon: Monitor,
    title: "Simulador 2D",
    description: "Ajuste as componentes dos vetores e observe as mudanças em tempo real."
  },
  {
    icon: Box,
    title: "Visualização 3D",
    description: "Explore vetores no espaço tridimensional com controles de rotação e zoom interativos."
  },
  {
    icon: Lightbulb,
    title: "Dicas de Uso",
    description: "Experimente diferentes operações e observe como a geometria reflete os conceitos matemáticos."
  }
];

const examples = [
  {
    title: "Velocidades Perpendiculares",
    description: <>Configure <MathFormula formula="\vec{a}" /> = (3, 0) e <MathFormula formula="\vec{b}" /> = (0, 3) para ver vetores perpendiculares</>,
    settings: { a: "(3, 0)", b: "(0, 3)" }
  },
  {
    title: "Vetores Opostos",
    description: <>Use <MathFormula formula="\vec{a}" /> = (2, 1) e <MathFormula formula="\vec{b}" /> = (-2, -1) para explorar vetores opostos</>,
    settings: { a: "(2, 1)", b: "(-2, -1)" }
  },
  {
    title: "Soma Clássica",
    description: <>Experimente <MathFormula formula="\vec{a}" /> = (1, 2) e <MathFormula formula="\vec{b}" /> = (3, -1) para ver a regra do paralelogramo</>,
    settings: { a: "(1, 2)", b: "(3, -1)" }
  }
];

export default function Simulador() {
  const [activeTab, setActiveTab] = useState("2d");
  const [solverResult, setSolverResult] = useState<Partial<ParsedEquation> | null>(null);
  const { stats, unlockBadgeManually, isUnlocked, recordSimulatorVisit, isLoaded } = useUserProgress();

  const [isSolving, setIsSolving] = useState(false);
  const [badgeNotification, setBadgeNotification] = useState<{ name: string } | null>(null);
  const prevBadgesRef = useRef<string[] | null>(null);

  // Detecta badges recém-desbloqueados e exibe a notificação com o nome correto
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
      setBadgeNotification({ name: names.join(" • ") });
      setTimeout(() => setBadgeNotification(null), 5000);
    }
    prevBadgesRef.current = current;
  }, [stats.unlockedBadges, isLoaded]);

  // Registra a visita a cada simulador (2D, 3D e Fluidos) para o badge Explorador do Simulador
  useEffect(() => {
    if (activeTab === "2d" || activeTab === "3d" || activeTab === "fluidos") {
      recordSimulatorVisit(activeTab);
    }
  }, [activeTab, recordSimulatorVisit]);

  const handleSolve = (result: ParsedEquation) => {
    setIsSolving(true);
    setSolverResult(result);
    setActiveTab(result.is3D ? "3d" : "2d");

    setTimeout(() => setIsSolving(false), 2000);

    if (!isUnlocked("smart-solver")) {
      unlockBadgeManually("smart-solver");
    }
  };

  useSEO({
    title: 'Simulador de Vetores 2D e 3D Interativo | Vector Learn',
    description: 'Explore vetores matemática com simulador 2D/3D interativo em tempo real! Manipule componentes, visualize soma, produto escalar e veja a geometria dos vetores.',
    keywords: 'simulador de vetores, vetores 2D, vetores 3D, visualização vetorial, matemática interativa, soma de vetores, produto escalar',
    canonicalUrl: 'https://vectorslearn.vercel.app/simulador',
    breadcrumbSchema: generateBreadcrumbSchema([
      { name: 'Home', url: 'https://vectorslearn.vercel.app' },
      { name: 'Simulador', url: 'https://vectorslearn.vercel.app/simulador' },
    ]),
    learningResourceSchema: generateLearningResourceSchema(
      'Simulador de Vetores 2D e 3D',
      'Simulador interativo de vetores matemática para explorar visualizações 2D e 3D.',
      ['High School', 'Undergraduate'],
      ['Simulation', 'Interactive']
    ),
  });

  return (
    <Layout>
      {badgeNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Card className="bg-gradient-primary text-white shadow-2xl">
            <CardContent className="p-6 flex items-center gap-4">
              <Sparkles className="h-8 w-8 animate-spin" />
              <div>
                <p className="font-bold text-lg">🎉 Novo Badge Desbloqueado!</p>
                <p className="text-sm opacity-90">{badgeNotification.name}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Simulador <span className="text-gradient">Interativo</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experimente com vetores em tempo real! Ajuste componentes, execute operações 
          e veja os conceitos matemáticos ganharem vida através de visualizações dinâmicas.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 max-w-5xl mx-auto relative px-4"
        >
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-vector-blue/40 to-transparent" />
          
          <div className="flex flex-col items-center justify-center gap-2 mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="p-3 bg-vector-blue/10 rounded-2xl border border-vector-blue/20"
            >
              <Sparkles className="h-8 w-8 text-vector-blue" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight">Resolvedor <span className="text-gradient">Inteligente</span></h2>
            <p className="text-muted-foreground text-sm max-w-md text-center">
              Fale com o simulador. Digite equações, use termos como "soma" ou "vetorial" 
              e deixe a mágica acontecer.
            </p>
          </div>
          <EquationSolver onSolve={handleSolve} />
        </motion.div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {instructions.map((instruction, index) => {
            const Icon = instruction.icon;
            return (
              <motion.div
                key={instruction.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="interactive-surface text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{instruction.title}</h3>
                    <p className="text-sm text-muted-foreground">{instruction.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative"
      >
        <AnimatePresence>
          {isSolving && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 pointer-events-none z-10 rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-vector-blue/5 backdrop-blur-[2px]" />
              <div className="absolute inset-0 border-4 border-vector-blue/30 animate-pulse rounded-3xl" />
            </motion.div>
          )}
        </AnimatePresence>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="2d" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Simulador 2D
            </TabsTrigger>
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              Visualização 3D
            </TabsTrigger>
            <TabsTrigger value="fluidos" className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              Dinâmica de Fluidos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="2d">
            <Vector2DSimulator data={activeTab === "2d" && solverResult ? {
              vectorA: solverResult.vectorA,
              vectorB: solverResult.vectorB,
              operation: (solverResult.operation === "cross" || solverResult.operation === "mixed") 
                ? "none" 
                : solverResult.operation as any
            } : undefined} />
          </TabsContent>

          <TabsContent value="3d">
            <Vector3DSimulator data={activeTab === "3d" && solverResult ? {
              vectorA: solverResult.vectorA,
              vectorB: solverResult.vectorB,
              vectorC: solverResult.vectorC,
              operation: solverResult.operation as any
            } : undefined} />
          </TabsContent>

          <TabsContent value="fluidos">
            <FluidDynamicsSimulator />
          </TabsContent>
        </Tabs>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          Configurações de Exemplo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="interactive-surface">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2 text-primary">{example.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{example.description}</p>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1"><MathFormula formula={`\\vec{a} = ${example.settings.a}`} /></div>
                      <div className="flex items-center gap-1"><MathFormula formula={`\\vec{b} = ${example.settings.b}`} /></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-16"
      >
        <Card className="bg-gradient-interactive border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Dicas para Usar o Simulador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">Explorando Operações</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use a soma para ver a regra do paralelogramo</li>
                  <li>• Teste a subtração com vetores paralelos</li>
                  <li>• Observe quando o produto escalar é zero</li>
                  <li>• Experimente a projeção com ângulos diferentes</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-primary mb-2">Interpretação Visual</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Linhas tracejadas mostram componentes</li>
                  <li>• Cores diferentes identificam cada operação</li>
                  <li>• Magnitudes são calculadas em tempo real</li>
                  <li>• Ângulos ajudam na interpretação geométrica</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </Layout>
  );
}