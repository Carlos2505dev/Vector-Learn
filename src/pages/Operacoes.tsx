import { motion } from "framer-motion";
import { ArrowRight, Plus, Minus, X, Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { MathFormula } from "@/components/MathFormula";
const operations = [{
  id: "soma",
  title: "Soma de Vetores",
  icon: Plus,
  color: "text-vector-blue",
  description: "A soma de vetores pode ser feita usando a regra do paralelogramo ou o método cabeça-cauda.",
  formulas: ["\\vec{c} = \\vec{a} + \\vec{b}", "c_x = a_x + b_x", "c_y = a_y + b_y"],
  geometricInterpretation: "Posicione o vetor b na ponta do vetor a. O vetor soma vai da origem até a ponta de b.",
  applications: ["Velocidades: barco atravessando rio com correnteza", "Forças: múltiplas forças atuando em um objeto", "Deslocamentos: caminhada com várias direções"]
}, {
  id: "subtracao",
  title: "Subtração de Vetores",
  icon: Minus,
  color: "text-vector-teal",
  description: "A subtração é equivalente à soma com o vetor oposto: a - b = a + (-b).",
  formulas: ["\\vec{c} = \\vec{a} - \\vec{b}", "c_x = a_x - b_x", "c_y = a_y - b_y"],
  geometricInterpretation: "Inverta o sentido do vetor b e depois some com a.",
  applications: ["Velocidade relativa: velocidade de A em relação a B", "Mudança de posição: deslocamento entre dois pontos", "Diferença de forças: força líquida"]
}, {
  id: "produto-escalar",
  title: "Produto Escalar",
  icon: Dot,
  color: "text-vector-orange",
  description: "O produto escalar mede o quanto dois vetores estão alinhados. Resultado é um escalar.",
  formulas: ["\\vec{a} \\cdot \\vec{b} = |\\vec{a}||\\vec{b}|\\cos(\\theta)", "\\vec{a} \\cdot \\vec{b} = a_x b_x + a_y b_y", "\\cos(\\theta) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}"],
  geometricInterpretation: "Projeta um vetor sobre o outro e multiplica pelas magnitudes.",
  applications: ["Trabalho em física: W = F⃗ · d⃗", "Ângulo entre vetores", "Projeção de um vetor sobre outro"]
}, {
  id: "produto-vetorial",
  title: "Produto Vetorial",
  icon: X,
  color: "text-vector-purple",
  description: "O produto vetorial cria um novo vetor perpendicular aos dois vetores originais.",
  formulas: ["\\vec{a} \\times \\vec{b} = |\\vec{a}||\\vec{b}|\\sin(\\theta)\\hat{n}", "\\vec{a} \\times \\vec{b} = (a_y b_z - a_z b_y, a_z b_x - a_x b_z, a_x b_y - a_y b_x)", "|\\vec{a} \\times \\vec{b}| = \\text{área do paralelogramo}"],
  geometricInterpretation: "Regra da mão direita determina a direção. Magnitude = área do paralelogramo.",
  applications: ["Torque em física: τ⃗ = r⃗ × F⃗", "Campo magnético: F⃗ = q(v⃗ × B⃗)", "Área de polígonos e superfícies"]
}, {
  id: "projecao",
  title: "Projeção de Vetores",
  icon: ArrowRight,
  color: "text-vector-blue",
  description: "A projeção de um vetor sobre outro mede a componente de um vetor na direção do outro.",
  formulas: ["\\text{proj}_{\\vec{b}}(\\vec{a}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\vec{b}", "\\text{comp}_{\\vec{b}}(\\vec{a}) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|}", "|\\text{proj}_{\\vec{b}}(\\vec{a})| = |\\vec{a}||\\cos(\\theta)|"],
  geometricInterpretation: "A projeção é a 'sombra' do vetor a⃗ na direção de b⃗. O componente escalar mede o comprimento dessa sombra.",
  applications: ["Trabalho em física: componente da força na direção do deslocamento", "Decomposição de forças em planos inclinados", "Análise de componentes vetoriais em engenharia"]
}];
const examples = [{
  title: "Exemplo: Soma de Velocidades",
  setup: "Um avião voa a 200 km/h para leste. O vento sopra a 50 km/h para norte.",
  vectors: {
    plane: "v⃗_avião = (200, 0) km/h",
    wind: "v⃗_vento = (0, 50) km/h"
  },
  solution: ["v⃗_resultante = v⃗_avião + v⃗_vento", "v⃗_resultante = (200, 0) + (0, 50) = (200, 50) km/h", "|v⃗_resultante| = √(200² + 50²) = √42500 = 206.2 km/h", "θ = arctan(50/200) = 14.04° norte do leste"]
}, {
  title: "Exemplo: Produto Escalar",
  setup: "Dois vetores: a⃗ = (3, 4) e b⃗ = (1, 2). Calcule o produto escalar e o ângulo.",
  solution: ["a⃗ · b⃗ = (3)(1) + (4)(2) = 3 + 8 = 11", "|a⃗| = √(3² + 4²) = √25 = 5", "|b⃗| = √(1² + 2²) = √5 = 2.24", "cos(θ) = 11/(5 × 2.24) = 0.982", "θ = arccos(0.982) = 11.31°"]
}, {
  title: "Exemplo: Projeção de Vetores",
  setup: "Calcule a projeção do vetor a⃗ = (4, 3) sobre o vetor b⃗ = (1, 0).",
  solution: ["a⃗ · b⃗ = (4)(1) + (3)(0) = 4", "|b⃗|² = 1² + 0² = 1", "proj_b(a⃗) = (a⃗·b⃗/|b⃗|²)b⃗ = (4/1)(1, 0) = (4, 0)", "|proj_b(a⃗)| = 4 (componente horizontal de a⃗)"]
}];
const properties = [{
  name: "Comutatividade da Soma",
  formula: "\\vec{a} + \\vec{b} = \\vec{b} + \\vec{a}",
  description: "A ordem não altera o resultado"
}, {
  name: "Associatividade da Soma",
  formula: "(\\vec{a} + \\vec{b}) + \\vec{c} = \\vec{a} + (\\vec{b} + \\vec{c})",
  description: "O agrupamento não importa"
}, {
  name: "Elemento Neutro",
  formula: "\\vec{a} + \\vec{0} = \\vec{a}",
  description: "O vetor zero não altera outros vetores"
}, {
  name: "Produto Escalar Comutativo",
  formula: "\\vec{a} \\cdot \\vec{b} = \\vec{b} \\cdot \\vec{a}",
  description: "O produto escalar é comutativo"
}, {
  name: "Distributividade do Produto Escalar",
  formula: "\\vec{a} \\cdot (\\vec{b} + \\vec{c}) = \\vec{a} \\cdot \\vec{b} + \\vec{a} \\cdot \\vec{c}",
  description: "O produto escalar distribui sobre a soma"
}];
export default function Operacoes() {
  return <Layout>
      {/* Header */}
      <motion.section initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Operações com <span className="text-gradient">Vetores</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Domine as operações fundamentais: soma, subtração, produto escalar, produto vetorial e projeção. Cada operação tem significado geométrico e aplicações práticas.</p>
      </motion.section>

      {/* Operations Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {operations.map((operation, index) => {
          const Icon = operation.icon;
          return <motion.div key={operation.id} initial={{
            opacity: 0,
            y: 50
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }} viewport={{
            once: true
          }}>
                <Card className="interactive-surface h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className={operation.color}>{operation.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {operation.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-primary">Fórmulas:</h4>
                      {operation.formulas.map((formula, i) => <MathFormula key={i} formula={formula} block />)}
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Interpretação Geométrica:</h4>
                      <p className="text-sm">{operation.geometricInterpretation}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">Aplicações:</h4>
                      <ul className="space-y-1">
                        {operation.applications.map((app, i) => <li key={i} className="text-sm text-muted-foreground">
                            • {app}
                          </li>)}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>;
        })}
        </div>
      </section>

      {/* Examples Section */}
      <motion.section initial={{
      opacity: 0,
      y: 50
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} viewport={{
      once: true
    }} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Exemplos Resolvidos
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {examples.map((example, index) => <motion.div key={example.title} initial={{
          opacity: 0,
          x: index % 2 === 0 ? -50 : 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: index * 0.2,
          duration: 0.6
        }} viewport={{
          once: true
        }}>
              <Card className="interactive-surface">
                <CardHeader>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-sm mb-2">Situação:</p>
                    <p className="text-sm mb-3">{example.setup}</p>
                    
                    {example.vectors && <div className="space-y-1">
                        <p className="text-sm font-mono">{example.vectors.plane}</p>
                        <p className="text-sm font-mono">{example.vectors.wind}</p>
                      </div>}
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm mb-2 text-primary">Solução:</p>
                    <ol className="space-y-2">
                      {example.solution.map((step, i) => <li key={i} className="text-sm flex">
                          <span className="text-vector-teal font-bold mr-2">{i + 1}.</span>
                          <span>{step}</span>
                        </li>)}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>
      </motion.section>

      {/* Properties Section */}
      <motion.section initial={{
      opacity: 0,
      y: 50
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} viewport={{
      once: true
    }} className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Propriedades Importantes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => <motion.div key={property.name} initial={{
          opacity: 0,
          scale: 0.9
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: index * 0.1,
          duration: 0.4
        }} viewport={{
          once: true
        }}>
              <Card className="interactive-surface text-center">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 text-primary">{property.name}</h3>
                  <MathFormula formula={property.formula} block />
                  <p className="text-sm text-muted-foreground mt-3">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>)}
        </div>
      </motion.section>

      {/* Special Cases */}
      <motion.section initial={{
      opacity: 0,
      y: 50
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} viewport={{
      once: true
    }} className="mb-16">
        <Card className="bg-gradient-secondary text-white">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Casos Especiais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vetores Paralelos</h3>
              <div className="space-y-2 text-sm">
                <p>• Mesmo sentido: |a⃗ + b⃗| = |a⃗| + |b⃗|</p>
                <p>• Sentidos opostos: |a⃗ - b⃗| = ||a⃗| - |b⃗||</p>
                <p>• Produto escalar: a⃗ · b⃗ = ±|a⃗||b⃗|</p>
                <p>• Produto vetorial: a⃗ × b⃗ = 0⃗</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vetores Perpendiculares</h3>
              <div className="space-y-2 text-sm">
                <p>• Soma: |a⃗ + b⃗| = √(|a⃗|² + |b⃗|²)</p>
                <p>• Produto escalar: a⃗ · b⃗ = 0</p>
                <p>• Produto vetorial: |a⃗ × b⃗| = |a⃗||b⃗|</p>
                <p>• Ângulo entre eles: θ = 90°</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Navigation */}
      <motion.section initial={{
      opacity: 0,
      y: 50
    }} whileInView={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.8
    }} viewport={{
      once: true
    }} className="text-center">
        <h2 className="text-2xl font-bold mb-4">Próximo Passo</h2>
        <p className="text-muted-foreground mb-8">
          Experimente as operações no simulador interativo e veja os conceitos ganharem vida
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="btn-hero">
            <Link to="/simulador">
              Usar Simulador
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/desafios">
              Fazer Exercícios
            </Link>
          </Button>
        </div>
      </motion.section>
    </Layout>;
}