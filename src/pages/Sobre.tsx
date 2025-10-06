import { motion } from "framer-motion";
import { Cog, Cpu, Building2, Plane, Car, Gamepad2, Brain, Eye, Calculator, Zap, PlayCircle, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

export default function Sobre() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Aplicações <span className="text-gradient">Práticas</span> na Engenharia
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Descubra como os vetores são fundamentais em diversas áreas da engenharia, 
            transformando teoria matemática em soluções reais que moldam nosso mundo
          </p>
        </motion.div>
      </section>

      {/* Applications Section */}
      <section className="py-12">
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

      {/* Como Operações Vetoriais São Aplicadas */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Operações Vetoriais nas <span className="text-gradient">Engenharias</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja como cada operação vetorial resolve problemas específicos em diferentes áreas da engenharia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Engenharia Mecânica */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full interactive-surface border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Cog className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center text-primary mb-6">Engenharia Mecânica</h3>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Plane className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-blue mb-1">Soma de Vetores</h4>
                        <p className="text-sm text-muted-foreground">
                          Calcular força resultante em estruturas e mecanismos, composição de velocidades
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Car className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-teal mb-1">Produto Vetorial</h4>
                        <p className="text-sm text-muted-foreground">
                          Calcular momento e torque em eixos rotativos, velocidade angular
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Zap className="h-5 w-5 text-vector-purple mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-purple mb-1">Produto Escalar</h4>
                        <p className="text-sm text-muted-foreground">
                          Determinar trabalho mecânico, potência e projeções de forças
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <ArrowRight className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-orange mb-1">Produto Misto</h4>
                        <p className="text-sm text-muted-foreground">
                          Verificar rigidez espacial de estruturas tridimensionais
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <h5 className="font-semibold text-sm mb-2 text-primary">Exemplo Real:</h5>
                  <p className="text-sm text-muted-foreground">
                    Braço robótico: produto vetorial calcula torques nas juntas, produto escalar determina o trabalho realizado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Engenharia da Computação */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full interactive-surface border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Cpu className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center text-primary mb-6">Engenharia da Computação</h3>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Gamepad2 className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-blue mb-1">Produto Vetorial</h4>
                        <p className="text-sm text-muted-foreground">
                          Calcular normais de superfícies para iluminação 3D realista em jogos
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Eye className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-teal mb-1">Produto Escalar</h4>
                        <p className="text-sm text-muted-foreground">
                          Medida de similaridade em IA, ângulos de visão, detecção de bordas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Brain className="h-5 w-5 text-vector-purple mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-purple mb-1">Projeção</h4>
                        <p className="text-sm text-muted-foreground">
                          PCA para redução de dimensionalidade, embeddings em redes neurais
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Calculator className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-orange mb-1">Soma Vetorial</h4>
                        <p className="text-sm text-muted-foreground">
                          Transformações de coordenadas, translações e composição de movimentos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <h5 className="font-semibold text-sm mb-2 text-primary">Exemplo Real:</h5>
                  <p className="text-sm text-muted-foreground">
                    Renderização 3D: produto vetorial para normais, produto escalar para iluminação e projeção para perspectiva.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Engenharia Civil */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full interactive-surface border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center text-primary mb-6">Engenharia Civil</h3>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-blue mb-1">Soma de Vetores</h4>
                        <p className="text-sm text-muted-foreground">
                          Equilíbrio de forças em treliças, análise de cargas distribuídas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Calculator className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-teal mb-1">Projeção</h4>
                        <p className="text-sm text-muted-foreground">
                          Calcular tensões normais e cisalhantes em planos de ruptura
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Zap className="h-5 w-5 text-vector-purple mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-purple mb-1">Produto Vetorial</h4>
                        <p className="text-sm text-muted-foreground">
                          Calcular áreas de terrenos e orientação de superfícies topográficas
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <PlayCircle className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-orange mb-1">Produto Misto</h4>
                        <p className="text-sm text-muted-foreground">
                          Determinar volumes de escavação e aterro em obras de terraplanagem
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <h5 className="font-semibold text-sm mb-2 text-primary">Exemplo Real:</h5>
                  <p className="text-sm text-muted-foreground">
                    Ponte: soma de forças para equilíbrio, projeção para tensões e produto misto para calcular volumes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Seção de destaque final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Por Que Operações Vetoriais São Essenciais?</h3>
              <p className="text-lg leading-relaxed max-w-4xl mx-auto">
                Cada operação vetorial tem um propósito específico na engenharia: a soma combina efeitos, 
                o produto escalar mede alinhamento, o produto vetorial cria perpendiculares, a projeção decompõe 
                componentes e o produto misto calcula volumes. Dominar essas operações é dominar a linguagem da engenharia moderna.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
    </Layout>
  );
}
