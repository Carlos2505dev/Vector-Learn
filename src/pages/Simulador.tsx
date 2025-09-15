import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { Vector2DSimulator } from "@/components/Vector2DSimulator";
import { Vector3DSimulator } from "@/components/Vector3DSimulator";
import { Monitor, Box, Info, Lightbulb } from "lucide-react";

const instructions = [
  {
    icon: Monitor,
    title: "Simulador 2D",
    description: "Use os controles deslizantes para ajustar as componentes dos vetores e observe como eles mudam em tempo real."
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
    description: "Configure a⃗ = (3, 0) e b⃗ = (0, 3) para ver vetores perpendiculares",
    settings: { a: "(3, 0)", b: "(0, 3)" }
  },
  {
    title: "Vetores Opostos",
    description: "Use a⃗ = (2, 1) e b⃗ = (-2, -1) para explorar vetores opostos",
    settings: { a: "(2, 1)", b: "(-2, -1)" }
  },
  {
    title: "Soma Clássica",
    description: "Experimente a⃗ = (1, 2) e b⃗ = (3, -1) para ver a regra do paralelogramo",
    settings: { a: "(1, 2)", b: "(3, -1)" }
  }
];

export default function Simulador() {
  const [activeTab, setActiveTab] = useState("2d");

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
          Simulador <span className="text-gradient">Interativo</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Experimente com vetores em tempo real! Ajuste componentes, execute operações 
          e veja os conceitos matemáticos ganharem vida através de visualizações dinâmicas.
        </p>
      </motion.section>

      {/* Instructions */}
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

      {/* Main Simulator */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="2d" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Simulador 2D
            </TabsTrigger>
            <TabsTrigger value="3d" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              Visualização 3D
            </TabsTrigger>
          </TabsList>

          <TabsContent value="2d">
            <Vector2DSimulator />
          </TabsContent>

          <TabsContent value="3d">
            <Vector3DSimulator />
          </TabsContent>
        </Tabs>
      </motion.section>

      {/* Example Configurations */}
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
                      <div>a⃗ = {example.settings.a}</div>
                      <div>b⃗ = {example.settings.b}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tips */}
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