import { motion } from "framer-motion";
import { ArrowRight, Book, Calculator, PlayCircle, Zap, Eye, Brain, Cog, Cpu, Building2, Plane, Car, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroVector } from "@/components/HeroVector";
import { Layout } from "@/components/Layout";

const features = [
  {
    icon: Eye,
    title: "Visualização Interativa",
    description: "Veja vetores ganharem vida com simuladores 2D e 3D em tempo real"
  },
  {
    icon: Brain,
    title: "Aprendizado Intuitivo",
    description: "Conceitos complexos explicados de forma clara e progressiva"
  },
  {
    icon: Zap,
    title: "Exercícios Dinâmicos",
    description: "Pratique com desafios interativos e feedback imediato"
  }
];

const quickAccess = [
  {
    title: "Fundamentos",
    description: "Aprenda os conceitos básicos",
    icon: Book,
    href: "/fundamentos",
    color: "text-vector-blue"
  },
  {
    title: "Operações",
    description: "Soma, produto escalar e mais",
    icon: Calculator,
    href: "/operacoes", 
    color: "text-vector-teal"
  },
  {
    title: "Simulador",
    description: "Explore vetores interativamente",
    icon: PlayCircle,
    href: "/simulador",
    color: "text-vector-orange"
  }
];

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Pensar em{" "}
              <span className="text-gradient">vetores</span>{" "}
              muda como você vê o mundo
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Descubra o poder dos vetores através de visualizações interativas, 
              simuladores 3D e exercícios práticos. Uma nova forma de aprender matemática.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button asChild className="btn-hero">
                <Link to="/fundamentos">
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="btn-ghost">
                <Link to="/simulador">
                  Explorar Simulador
                  <PlayCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Interactive Vector Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <div className="interactive-surface">
              <HeroVector className="w-full h-80" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Por que escolher <span className="text-gradient">Vector Learn</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma moderna que combina pedagogia eficaz com tecnologia avançada
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="interactive-surface h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comece sua jornada
          </h2>
          <p className="text-xl text-muted-foreground">
            Escolha por onde quer começar a explorar o mundo dos vetores
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickAccess.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Link to={item.href}>
                  <Card className="interactive-surface group cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Icon className={`h-8 w-8 ${item.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                      <ArrowRight className="h-4 w-4 mt-4 mx-auto text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Aplicações <span className="text-gradient">Práticas</span> na Engenharia
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Descubra como os vetores são fundamentais em diversas áreas da engenharia, 
            transformando teoria matemática em soluções reais que moldam nosso mundo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Engenharia Mecânica */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="interactive-surface h-full border-t-4 border-t-vector-blue">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-vector-blue to-vector-cyan rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
                  <Cog className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  Engenharia Mecânica
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Car className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Análise de Forças</p>
                      <p className="text-sm">Decomposição de forças em estruturas, cálculo de tensões e determinação de pontos de equilíbrio em sistemas mecânicos complexos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Plane className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Dinâmica de Rotação</p>
                      <p className="text-sm">Momento angular, torque e movimento rotacional em máquinas, turbinas e sistemas aeroespaciais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Cinemática de Mecanismos</p>
                      <p className="text-sm">Velocidade e aceleração em engrenagens, braços robóticos e sistemas de transmissão automotivos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Engenharia da Computação */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="interactive-surface h-full border-t-4 border-t-vector-teal">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-vector-teal to-vector-green rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
                  <Cpu className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  Engenharia da Computação
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Gamepad2 className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Computação Gráfica 3D</p>
                      <p className="text-sm">Transformações, rotações e projeções em jogos, realidade virtual e modelagem 3D de ambientes imersivos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Inteligência Artificial</p>
                      <p className="text-sm">Representação de dados em espaços vetoriais, machine learning, redes neurais e processamento de linguagem natural</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Eye className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Visão Computacional</p>
                      <p className="text-sm">Detecção de características, reconhecimento facial e processamento de imagens em carros autônomos e robótica</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Engenharia Civil */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="interactive-surface h-full border-t-4 border-t-vector-orange">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-vector-orange to-vector-red rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  Engenharia Civil
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Calculator className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Análise Estrutural</p>
                      <p className="text-sm">Distribuição de cargas em pontes, edifícios e torres, garantindo estabilidade e segurança das construções</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Mecânica dos Solos</p>
                      <p className="text-sm">Análise de tensões e deformações em fundações, contenções e estudos de estabilidade de taludes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PlayCircle className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Fluidodinâmica Aplicada</p>
                      <p className="text-sm">Escoamento em barragens, sistemas de drenagem e redes de distribuição de água e saneamento</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Highlight Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 md:p-12 border border-primary/20"
        >
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Do Conceito à Realização
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Os vetores são a linguagem universal da engenharia moderna. Desde a construção de arranha-céus 
              que desafiam a gravidade até algoritmos de IA que revolucionam a tecnologia, passando por 
              simulações que preveem o comportamento de estruturas antes mesmo de serem construídas.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Compreender vetores não é apenas aprender matemática — é desenvolver a capacidade de 
              modelar, analisar e resolver os desafios mais complexos do mundo real.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-primary rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para dominar os vetores?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já descobriram uma nova forma de aprender matemática
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-4">
            <Link to="/fundamentos">
              Iniciar Aprendizado Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
}