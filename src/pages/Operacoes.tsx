import { motion } from "framer-motion";
import { ArrowRight, Plus, Minus, X, Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { MathFormula } from "@/components/MathFormula";
import { useSEO, generateBreadcrumbSchema, generateLearningResourceSchema } from "@/hooks/useSEO";

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
}, {
  id: "produto-misto",
  title: "Produto Misto",
  icon: X,
  color: "text-vector-red",
  description: "O produto misto combina produto escalar e vetorial: a⃗·(b⃗×c⃗). Seu valor representa o volume do paralelepípedo formado pelos três vetores.",
  formulas: ["\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\det\\begin{pmatrix} a_x & a_y & a_z \\\\ b_x & b_y & b_z \\\\ c_x & c_y & c_z \\end{pmatrix}", "|\\vec{a} \\cdot (\\vec{b} \\times \\vec{c})| = \\text{volume do paralelepípedo}", "\\vec{a} \\cdot (\\vec{b} \\times \\vec{c}) = \\vec{b} \\cdot (\\vec{c} \\times \\vec{a}) = \\vec{c} \\cdot (\\vec{a} \\times \\vec{b})"],
  geometricInterpretation: "O valor absoluto do produto misto é o volume do paralelepípedo formado pelos três vetores. Se é zero, os vetores são coplanares.",
  applications: ["Cálculo de volume de sólidos tridimensionais", "Teste de coplanaridade de três vetores", "Análise estrutural: verificação de rigidez espacial"]
}];

const examples = [{
  title: "Exemplo: Soma de Velocidades",
  setup: "Um avião voa a 200 km/h para leste. O vento sopra a 50 km/h para norte.",
  vectors: {
    plane: "\\vec{v}_{\\text{avião}} = (200, 0) \\text{ km/h}",
    wind: "\\vec{v}_{\\text{vento}} = (0, 50) \\text{ km/h}"
  },
  solution: [
    "\\vec{v}_{\\text{res}} = \\vec{v}_{\\text{avião}} + \\vec{v}_{\\text{vento}}",
    "\\vec{v}_{\\text{res}} = (200, 0) + (0, 50) = (200, 50) \\text{ km/h}",
    "|\\vec{v}_{\\text{res}}| = \\sqrt{200^2 + 50^2} = \\sqrt{42500} \\approx 206.2 \\text{ km/h}",
    "\\theta = \\arctan(50/200) \\approx 14.04^\\circ \\text{ norte do leste}"
  ]
}, {
  title: "Exemplo: Produto Escalar",
  setup: "Dados os vetores a e b, calcule o produto escalar e o ângulo entre eles.",
  vectors: [
    "\\vec{a} = (3, -4)",
    "\\vec{b} = (1, 2)"
  ],
  solution: [
    "\\vec{a} \\cdot \\vec{b} = (3)(1) + (-4)(2) = 3 - 8 = -5",
    "|\\vec{a}| = \\sqrt{3^2 + (-4)^2} = \\sqrt{25} = 5",
    "|\\vec{b}| = \\sqrt{1^2 + 2^2} = \\sqrt{5} \\approx 2.236",
    "\\cos(\\theta) = \\frac{-5}{5 \\times 2.236} = \\frac{-1}{2.236} \\approx -0.447",
    "\\theta = \\arccos(-0.447) \\approx 116.57^\\circ"
  ]
}, {
  title: "Exemplo: Projeção de Vetores",
  setup: "Determine a projeção ortogonal do vetor a sobre o vetor b.",
  vectors: [
    "\\vec{a} = (4, 3)",
    "\\vec{b} = (2, 0)"
  ],
  solution: [
    "\\vec{a} \\cdot \\vec{b} = (4)(2) + (3)(0) = 8",
    "|\\vec{b}|^2 = 2^2 + 0^2 = 4",
    "\\text{proj}_{\\vec{b}}(\\vec{a}) = \\left(\\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{b}|^2}\\right)\\vec{b} = \\frac{8}{4}(2, 0) = (4, 0)",
    "|\\text{proj}_{\\vec{b}}(\\vec{a})| = 4 \\text{ (magnitude da projeção)}"
  ]
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
  useSEO({
    title: 'Operações Vetoriais - Soma, Produto Escalar e Vetorial | Vector Learn',
    description: 'Domine operações vetoriais: soma, subtração, produto escalar, produto vetorial e projeção com exemplos práticos e visualizações.',
    keywords: 'operações vetoriais, produto escalar, produto vetorial, soma de vetores, física avançada',
    canonicalUrl: 'https://vectorlearn.com/operacoes',
    breadcrumbSchema: generateBreadcrumbSchema([
      { name: 'Home', url: 'https://vectorlearn.com' },
      { name: 'Operações', url: 'https://vectorlearn.com/operacoes' },
    ]),
    learningResourceSchema: generateLearningResourceSchema(
      'Operações Vetoriais',
      'Aprenda todas as operações vetoriais: soma, subtração, produtos escalar e vetorial',
      ['Undergraduate']
    ),
  });

  return (
    <Layout>
      {/* Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Operações com <span className="text-gradient">Vetores</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Domine as operações fundamentais: soma, subtração, produto escalar, produto vetorial, produto misto e projeção. 
          Cada operação tem significado geométrico e aplicações práticas.
        </p>
      </motion.section>

      {/* Operations Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {operations.map((operation, index) => {
            const Icon = operation.icon;
            return (
              <motion.div 
                key={operation.id} 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1, duration: 0.6 }} 
                viewport={{ once: true }}
              >
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
                      {operation.formulas.map((formula, i) => (
                        <MathFormula key={i} formula={formula} block />
                      ))}
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Interpretação Geométrica:</h4>
                      <p className="text-sm">{operation.geometricInterpretation}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm text-primary mb-2">Aplicações:</h4>
                      <ul className="space-y-1">
                        {operation.applications.map((app, i) => (
                          <li key={i} className="text-sm text-muted-foreground">• {app}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Examples Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true }} 
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Exemplos Resolvidos</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {examples.map((example, index) => (
            <motion.div 
              key={example.title} 
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.2, duration: 0.6 }} 
              viewport={{ once: true }}
            >
              <Card className="interactive-surface">
                <CardHeader>
                  <CardTitle className="text-lg">{example.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="font-medium text-sm mb-2">Situação:</p>
                    <p className="text-sm mb-3">{example.setup}</p>
                    
                    {example.vectors && Array.isArray(example.vectors) ? (
                      <div className="space-y-1">
                        {example.vectors.map((v, i) => (
                          <MathFormula key={i} formula={v} block />
                        ))}
                      </div>
                    ) : example.vectors && (
                      <div className="space-y-1">
                        {Object.values(example.vectors).map((v, i) => (
                          <MathFormula key={i} formula={v as string} block />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <p className="font-medium text-sm mb-2 text-primary">Solução:</p>
                    <ol className="space-y-2">
                      {example.solution.map((step, i) => (
                        <li key={i} className="text-sm flex items-center">
                          <span className="text-vector-teal font-bold mr-2">{i + 1}.</span>
                          <MathFormula formula={step} />
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Properties Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true }} 
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Propriedades Importantes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <motion.div 
              key={property.name} 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              transition={{ delay: index * 0.1, duration: 0.4 }} 
              viewport={{ once: true }}
            >
              <Card className="interactive-surface text-center">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 text-primary">{property.name}</h3>
                  <MathFormula formula={property.formula} block />
                  <p className="text-sm text-muted-foreground mt-3">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Special Cases Section */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true }} 
        className="mb-16"
      >
        <Card className="bg-gradient-to-br from-[#FF7A59] via-[#FF5733] to-[#8E44AD] text-white overflow-hidden border-none shadow-2xl relative group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-grid-white/[0.05] pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl font-bold text-center mb-2">Casos Especiais</CardTitle>
            <p className="text-center text-white/80 text-sm max-w-xl mx-auto">
              Configurações específicas entre vetores que simplificam as operações e são fundamentais para a resolução de problemas.
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 pt-4 relative z-10">
            {/* Vetores Paralelos */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/20 pb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Vetores Paralelos</h3>
              </div>
              
              <div className="grid gap-4">
                {[
                  { label: "Mesmo sentido", formula: "|\\vec{a} + \\vec{b}| = |\\vec{a}| + |\\vec{b}|" },
                  { label: "Sentidos opostos", formula: "|\\vec{a} + \\vec{b}| = ||\\vec{a}| - |\\vec{b}||" },
                  { label: "Produto escalar", formula: "\\vec{a} \\cdot \\vec{b} = - |\\vec{a}||\\vec{b}|" },
                  { label: "Produto vetorial", formula: "\\vec{a} \\times \\vec{b} = \\vec{0}" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">{item.label}</span>
                    <div className="text-lg font-medium overflow-x-auto no-scrollbar">
                      <MathFormula formula={item.formula} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Vetores Perpendiculares */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/20 pb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
                  <Plus className="h-5 w-5 text-white rotate-45" />
                </div>
                <h3 className="text-xl font-bold tracking-tight">Vetores Perpendiculares</h3>
              </div>
              
              <div className="grid gap-4">
                {[
                  { label: "Soma (Pitágoras)", formula: "|\\vec{a} + \\vec{b}| = \\sqrt{|\\vec{a}|^2 + |\\vec{b}|^2}" },
                  { label: "Produto escalar", formula: "\\vec{a} \\cdot \\vec{b} = 0" },
                  { label: "Produto vetorial", formula: "|\\vec{a} \\times \\vec{b}| = |\\vec{a}||\\vec{b}|" },
                  { label: "Ângulo entre eles", formula: "\\theta = 90^\\circ" }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 5 }}
                    className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-2">{item.label}</span>
                    <div className="text-lg font-medium overflow-x-auto no-scrollbar">
                      <MathFormula formula={item.formula} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Summary Highlight Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <Card className="bg-gradient-to-br from-[#5B8CFF] via-[#3B70F3] to-[#00D1B2] text-white shadow-2xl border-0 overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-10 text-center relative z-10">
            <h3 className="text-3xl font-bold mb-6">Por Que Operações Vetoriais São Essenciais?</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-95">
              Cada operação vetorial tem um propósito específico na engenharia: a soma combina efeitos, 
              o produto escalar mede alinhamento, o produto vetorial cria perpendiculares, a projeção decompõe 
              componentes e o produto misto calcula volumes. Dominar essas operações é dominar a linguagem da engenharia moderna.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Navigation */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        viewport={{ once: true }} 
        className="text-center"
      >
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
            <Link to="/desafios">Fazer Exercícios</Link>
          </Button>
        </div>
      </motion.section>
    </Layout>
  );
}