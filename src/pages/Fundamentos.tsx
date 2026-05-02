import { motion } from "framer-motion";
import { ArrowRight, Move, Ruler, Navigation, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { MathFormula } from "@/components/MathFormula";
import { useSEO, generateBreadcrumbSchema, generateLearningResourceSchema } from "@/hooks/useSEO";

const concepts = [
  {
    id: "definicao",
    title: "O que é um Vetor?",
    icon: Move,
    content: {
      text: "Um vetor é uma grandeza que possui tanto magnitude (tamanho) quanto direção. Diferente de escalares que têm apenas magnitude, vetores nos permitem representar quantidades como velocidade, força e deslocamento.",
      examples: [
        "Velocidade: 50 km/h para o norte",
        "Força: 10 N na direção horizontal",
        "Deslocamento: 5 metros para a direita"
      ],
      visual: "arrow-right"
    }
  },
  {
    id: "notacao",
    title: "Notação Matemática",
    icon: Target,
    content: {
      text: "Vetores são representados por letras com setas ou em negrito. Seus componentes são escritos entre parênteses ou colchetes.",
      formulas: [
        "\\vec{v} = (v_x, v_y)",
        "\\vec{a} = a_x\\hat{i} + a_y\\hat{j}",
        "|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}"
      ]
    }
  },
  {
    id: "componentes",
    title: "Componentes de um Vetor",
    icon: Navigation,
    content: {
      text: "Todo vetor pode ser decomposto em componentes perpendiculares. Em 2D, usamos componentes x e y. Em 3D, adicionamos a componente z.",
      formulas: [
        "v_x = |\\vec{v}| \\cos(\\theta)",
        "v_y = |\\vec{v}| \\sin(\\theta)",
        "\\theta = \\arctan\\left(\\frac{v_y}{v_x}\\right)"
      ]
    }
  },
  {
    id: "magnitude",
    title: "Magnitude (Módulo)",
    icon: Ruler,
    content: {
      text: "A magnitude é o 'tamanho' do vetor, calculada usando o teorema de Pitágoras. Representa a intensidade da grandeza vetorial.",
      formulas: [
        "|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}",
        "|\\vec{v}| = \\sqrt{v_x^2 + v_y^2 + v_z^2}",
        "\\hat{v} = \\frac{\\vec{v}}{|\\vec{v}|}"
      ]
    }
  }
];

const examples = [
  {
    title: "Exemplo 1: Velocidade de um Carro",
    problem: "Um carro se move a 60 km/h em direção ao nordeste (45°). Quais são as componentes da velocidade?",
    solution: [
      "\\text{Dados: } |\\vec{v}| = 60 \\text{ km/h}, \\theta = 45^\\circ",
      "v_x = 60 \\times \\cos(45^\\circ) = 60 \\times 0.707 = 42.4 \\text{ km/h}",
      "v_y = 60 \\times \\sin(45^\\circ) = 60 \\times 0.707 = 42.4 \\text{ km/h}",
      "\\text{Portanto: } \\vec{v} = (42.4, 42.4) \\text{ km/h}"
    ]
  },
  {
    title: "Exemplo 2: Força Resultante",
    problem: "Duas forças atuam sobre um objeto: F₁ = (3, 4) N e F₂ = (1, -2) N. Qual a força resultante?",
    solution: [
      "\\vec{F}_{\\text{resultante}} = \\vec{F}_1 + \\vec{F}_2",
      "\\vec{F}_{\\text{resultante}} = (3, 4) + (1, -2) = (4, 2) \\text{ N}",
      "|\\vec{F}_{\\text{resultante}}| = \\sqrt{4^2 + 2^2} = \\sqrt{20} \\approx 4.47 \\text{ N}"
    ]
  }
];

export default function Fundamentos() {
  useSEO({
    title: 'Fundamentos de Vetores - Conceitos Básicos | Vector Learn',
    description: 'Aprenda os fundamentos de vetores: notação, componentes, magnitude e operações básicas com exemplos práticos e visualizações.',
    keywords: 'fundamentos vetores, notação vetorial, magnitude, componentes, física básica',
    canonicalUrl: 'https://vectorlearn.com/fundamentos',
    breadcrumbSchema: generateBreadcrumbSchema([
      { name: 'Home', url: 'https://vectorlearn.com' },
      { name: 'Fundamentos', url: 'https://vectorlearn.com/fundamentos' },
    ]),
    learningResourceSchema: generateLearningResourceSchema(
      'Fundamentos de Vetores',
      'Conceitos básicos de vetores: notação, componentes e magnitude'
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
          Fundamentos dos <span className="text-gradient">Vetores</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Construa uma base sólida entendendo os conceitos essenciais dos vetores: 
          definição, notação, componentes e magnitude.
        </p>
      </motion.section>

      {/* Concepts Grid */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {concepts.map((concept, index) => {
            const Icon = concept.icon;
            return (
              <motion.div
                key={concept.id}
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
                      {concept.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {concept.content.text}
                    </p>
                    
                    {concept.content.formulas && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-primary">Fórmulas:</h4>
                        {concept.content.formulas.map((formula, i) => (
                          <MathFormula key={i} formula={formula} block />
                        ))}
                      </div>
                    )}
                    
                    {concept.content.examples && (
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm text-primary">Exemplos:</h4>
                        <ul className="space-y-1">
                          {concept.content.examples.map((example, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Scalar vs Vector Comparison */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Escalares vs Vetores
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="interactive-surface">
            <CardHeader>
              <CardTitle className="text-vector-orange">Grandezas Escalares</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Possuem apenas magnitude (valor numérico)
              </p>
              <ul className="space-y-2">
                <li>• Temperatura: 25°C</li>
                <li>• Massa: 5 kg</li>
                <li>• Tempo: 10 segundos</li>
                <li>• Energia: 100 J</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="interactive-surface">
            <CardHeader>
              <CardTitle className="text-vector-blue">Grandezas Vetoriais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Possuem magnitude e direção
              </p>
              <ul className="space-y-2">
                <li>• Velocidade: 50 km/h para norte</li>
                <li>• Força: 10 N para baixo</li>
                <li>• Deslocamento: 5 m para direita</li>
                <li>• Aceleração: 2 m/s² para cima</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Examples Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold text-center mb-8">
          Exemplos Práticos
        </h2>
        
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
                    <p className="font-medium text-sm mb-2">Problema:</p>
                    <p className="text-sm">{example.problem}</p>
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

      {/* Key Formulas Summary */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <Card className="bg-gradient-to-br from-[#5B8CFF] via-[#3B70F3] to-[#00D1B2] text-white shadow-2xl border-0 overflow-hidden relative group">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader>
            <CardTitle className="text-2xl text-center">Fórmulas Essenciais</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Magnitude 2D</h3>
                <MathFormula formula="|\\vec{v}| = \\sqrt{v_x^2 + v_y^2}" block />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vetor Unitário</h3>
                <MathFormula formula="\\hat{v} = \\frac{\\vec{v}}{|\\vec{v}|}" block />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Componentes</h3>
                <MathFormula formula="\\vec{v} = v_x\\hat{i} + v_y\\hat{j}" block />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

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
          Agora que você domina os fundamentos, vamos aprender as operações com vetores
        </p>
        <Button asChild size="lg" className="btn-hero">
          <Link to="/operacoes">
            Aprender Operações
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </motion.section>
    </Layout>
  );
}