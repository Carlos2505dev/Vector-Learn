import { motion } from "framer-motion";
import { ArrowRight, Cog, Cpu, Building2, Plane, Car, Gamepad2, Brain, Eye, Calculator, Zap, PlayCircle, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";

export default function Sobre() {
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
          Sobre o <span className="text-gradient">Projeto</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Descubra como os vetores transformam teoria matemática em soluções reais que moldam nosso mundo
        </p>
      </motion.section>

      {/* Sobre o Projeto */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <Card className="bg-gradient-secondary text-white overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Nossa Missão
            </h2>
            <div className="space-y-6 text-lg">
              <p className="leading-relaxed">
                Este projeto foi desenvolvido como material de apoio para o ensino de vetores, 
                combinando teoria matemática rigorosa com visualizações interativas e aplicações práticas.
              </p>
              <p className="leading-relaxed">
                Nossa missão é tornar conceitos vetoriais acessíveis e interessantes para estudantes 
                de diversas áreas, especialmente engenharias, física e matemática aplicada.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      {/* Aplicações Práticas nas Engenharias */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Aplicações Práticas nas <span className="text-gradient">Engenharias</span>
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
                      <Target className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
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
                      <Calculator className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
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

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl font-bold mb-4">Pronto para aplicar esses conceitos?</h2>
        <p className="text-muted-foreground mb-8">
          Explore nosso simulador interativo e pratique com exercícios reais
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="btn-hero">
            <Link to="/simulador">
              Explorar Simulador
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
    </Layout>
  );
}
