import { motion } from "framer-motion";
import { Code, Cpu, Database, Network, Shield, Search, Terminal, Gamepad2, Brain, Eye, Calculator, Zap, PlayCircle, ArrowRight, Layers, Globe } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useSEO, generateBreadcrumbSchema } from "@/hooks/useSEO";
import { BoatSimulator } from "@/components/BoatSimulator";
import { InclinedPlaneSimulator } from "@/components/InclinedPlaneSimulator";

export default function Aplicacoes() {
  useSEO({
    title: 'Aplicações dos Vetores - Engenharia e Tecnologia | Vector Learn',
    description: 'Descubra como os vetores são aplicados na engenharia de software, ciência da computação e inteligência artificial.',
    keywords: 'aplicações de vetores, engenharia, computação gráfica, física aplicada, vetores na vida real',
    canonicalUrl: 'https://vectorlearn.com/aplicacoes',
    breadcrumbSchema: generateBreadcrumbSchema([
      { name: 'Home', url: 'https://vectorlearn.com' },
      { name: 'Aplicações', url: 'https://vectorlearn.com/aplicacoes' },
    ]),
  });

  return (
    <Layout>
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Aplicações <span className="text-gradient">Práticas</span> na Tecnologia
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Descubra como os vetores são fundamentais em diversas áreas da tecnologia, 
            transformando lógica matemática em soluções digitais que moldam nosso mundo
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="interactive-surface h-full border-t-4 border-t-vector-blue">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-vector-blue to-vector-cyan rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  Engenharia de Software
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Layers className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Arquitetura de Sistemas</p>
                      <p className="text-sm">Modelagem de dependências, escalabilidade de microsserviços e design de padrões estruturais complexos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Desenvolvimento Web e Mobile</p>
                      <p className="text-sm">Criação de layouts responsivos, animações fluidas e interfaces baseadas em coordenadas vetoriais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Terminal className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">DevOps e Automação</p>
                      <p className="text-sm">Pipeline de CI/CD, monitoramento de performance em tempo real e orquestração de containers</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

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

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="interactive-surface h-full border-t-4 border-t-vector-orange">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-vector-orange to-vector-red rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  Ciência da Computação
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Algoritmos e Otimização</p>
                      <p className="text-sm">Processamento de grandes volumes de dados, busca eficiente e algoritmos de ordenação complexos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Criptografia e Segurança</p>
                      <p className="text-sm">Protocolos de segurança, proteção de dados e integridade de sistemas distribuídos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Network className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">Redes e Sistemas</p>
                      <p className="text-sm">Comunicação entre sistemas, protocolos de rede e arquitetura de computadores de alto desempenho</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

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
              Os vetores são a linguagem universal da tecnologia moderna. Desde o desenvolvimento de 
              sistemas escaláveis até algoritmos de IA que revolucionam a sociedade, passando por 
              simulações que processam bilhões de dados em frações de segundo.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Compreender vetores não é apenas aprender matemática — é desenvolver a capacidade de 
              modelar, analisar e resolver os desafios mais complexos do mundo real.
            </p>
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Laboratório de <span className="text-gradient">Física Interativo</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experimente os cenários clássicos da física e veja como os vetores 
            são usados para modelar o movimento e as forças no mundo real.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <BoatSimulator />
          <InclinedPlaneSimulator />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Operações Vetoriais na <span className="text-gradient">Tecnologia</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Veja como cada operação vetorial resolve problemas específicos em diferentes áreas da tecnologia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full interactive-surface border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5B8CFF] via-[#3B70F3] to-[#00D1B2] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center text-primary mb-6">Engenharia de Software</h3>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Layers className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-blue mb-1">Soma de Vetores</h4>
                        <p className="text-sm text-muted-foreground">
                          Composição de estados em aplicações e balanceamento de carga distribuída
                        </p>
                      </div>
                    </div>
                  </div>
 
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Terminal className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-teal mb-1">Produto Escalar</h4>
                        <p className="text-sm text-muted-foreground">
                          Análise de similaridade em sistemas de recomendação e busca de código
                        </p>
                      </div>
                    </div>
                  </div>
 
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Globe className="h-5 w-5 text-vector-purple mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-purple mb-1">Produto Vetorial</h4>
                        <p className="text-sm text-muted-foreground">
                          Transformações de UI e renderização de elementos gráficos dinâmicos
                        </p>
                      </div>
                    </div>
                  </div>
 
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <ArrowRight className="h-5 w-5 text-vector-orange mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-orange mb-1">Projeção</h4>
                        <p className="text-sm text-muted-foreground">
                          Mapeamento de fluxos de dados e visualização de métricas de performance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
 
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <h5 className="font-semibold text-sm mb-2 text-primary">Exemplo Real:</h5>
                  <p className="text-sm text-muted-foreground">
                    Sistemas escaláveis: vetores de estado gerenciam a carga entre servidores de forma otimizada.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full interactive-surface border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00D1B2] via-[#00BFA5] to-[#FF7A59] rounded-2xl flex items-center justify-center mb-4 mx-auto">
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

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="h-full interactive-surface border-2 hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FF7A59] via-[#FF5733] to-[#8E44AD] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-center text-primary mb-6">Ciência da Computação</h3>
                
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Search className="h-5 w-5 text-vector-blue mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-blue mb-1">Soma Vetorial</h4>
                        <p className="text-sm text-muted-foreground">
                          Agregação de dados em espaços multidimensionais para Big Data
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Shield className="h-5 w-5 text-vector-teal mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-teal mb-1">Produto Escalar</h4>
                        <p className="text-sm text-muted-foreground">
                          Mecanismos de busca e ranqueamento de documentos por similaridade de cosseno
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-3 mb-2">
                      <Network className="h-5 w-5 text-vector-purple mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-vector-purple mb-1">Produto Vetorial</h4>
                        <p className="text-sm text-muted-foreground">
                          Geometria computacional para detecção de colisões e física de objetos
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
                          Verificação de consistência em volumes de dados e modelagem espacial
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <h5 className="font-semibold text-sm mb-2 text-primary">Exemplo Real:</h5>
                  <p className="text-sm text-muted-foreground">
                    Motores de busca: vetores de palavras (embeddings) usam o produto escalar para encontrar resultados relevantes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-[#5B8CFF] via-[#3B70F3] to-[#00D1B2] text-white shadow-2xl border-0 overflow-hidden relative group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className="p-10 text-center relative z-10">
              <h3 className="text-3xl font-bold mb-6">Por Que Operações Vetoriais São Essenciais?</h3>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-95">
                Cada operação vetorial tem um propósito específico na tecnologia: a soma combina estados, 
                o produto escalar mede similaridade, o produto vetorial cria transformações visuais, a projeção 
                reduz dimensionalidade e o produto misto valida dados espaciais. Dominar essas operações é dominar a base da computação moderna.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>
    </Layout>
  );
}
