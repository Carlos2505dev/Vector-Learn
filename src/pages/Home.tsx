import { motion } from "framer-motion";
import { ArrowRight, Book, Calculator, PlayCircle, Zap, Eye, Brain, Lightbulb, CheckCircle2, Rocket, Trophy, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroVector } from "@/components/HeroVector";
import { Layout } from "@/components/Layout";
import { OnboardingTutorial, type TutorialStep } from "@/components/OnboardingTutorial";
import { BadgeSystem } from "@/components/BadgeSystem";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useSEO, generateEducationalAppSchema } from "@/hooks/useSEO";

const tutorialSteps: TutorialStep[] = [
  {
    id: "step1",
    title: "Bem-vindo ao Vector Learn!",
    description: "Uma plataforma revolucionária para aprender vetores de forma visual e interativa. Vamos te mostrar como começar.",
    hint: "Este é o primeiro passo do seu aprendizado!"
  },
  {
    id: "step2",
    title: "Seção Fundamentos",
    description: "Comece aqui para entender os conceitos básicos: notação, componentes e magnitude de um vetor.",
    hint: "Recomendamos: 30-45 minutos"
  },
  {
    id: "step3",
    title: "Operações Vetoriais",
    description: "Aprenda soma, subtração, produto escalar, produto vetorial e muito mais com fórmulas e visualizações.",
    hint: "Intermediário: para quem já entende o básico"
  },
  {
    id: "step4",
    title: "Simuladores Interativos",
    description: "Veja vetores ganharem vida em 2D e 3D. Manipule, explore e entenda geometricamente como eles funcionam.",
    hint: "Visual + Prático = Aprendizado rápido"
  },
  {
    id: "step5",
    title: "Teste seu Conhecimento",
    description: "Resolve desafios, obtenha feedback imediato e acompanhe seu progresso com um sistema de pontuação.",
    hint: "Pratique para consolidar o aprendizado"
  },
  {
    id: "step6",
    title: "Dúvidas Frequentes",
    description: "Temos respostas para as perguntas mais comuns. Visite nossa seção de FAQ para mais informações.",
    hint: "Acesse pelo link no footer ou clique aqui"
  }
];

const features = [
  {
    icon: Eye,
    title: "Visualização em Tempo Real",
    description: "Veja vetores ganharem vida com simuladores 2D e 3D interativos. Manipule, explore e entenda na prática.",
    highlight: "Entende melhor o que vê",
    gradient: "from-[#5B8CFF] to-[#00D1B2]"
  },
  {
    icon: Brain,
    title: "Aprendizado Intuitivo",
    description: "Conceitos complexos traduzidos em linguagem clara. Progressão natural do básico ao avançado.",
    highlight: "Sem frustrações com teoria pura",
    gradient: "from-[#00D1B2] to-[#FF7A59]"
  },
  {
    icon: Zap,
    title: "Exercícios com Feedback",
    description: "Pratique com desafios variados e receba feedback instantâneo. Aprenda pelos erros.",
    highlight: "Consolida o aprendizado",
    gradient: "from-[#FF7A59] to-[#5B8CFF]"
  }
];

const quickAccess = [
  {
    title: "Fundamentos",
    description: "Aprenda os conceitos básicos",
    icon: Book,
    href: "/fundamentos",
    color: "text-vector-blue",
    badge: "Comece aqui",
    stats: "12 aulas",
    badgeBg: "bg-blue-500/10 text-blue-700 dark:text-blue-400"
  },
  {
    title: "Operações",
    description: "Soma, produto escalar e mais",
    icon: Calculator,
    href: "/operacoes",
    color: "text-vector-teal",
    badge: "Intermediário",
    stats: "8 módulos",
    badgeBg: "bg-teal-500/10 text-teal-700 dark:text-teal-400"
  },
  {
    title: "Simulador",
    description: "Explore vetores interativamente",
    icon: PlayCircle,
    href: "/simulador",
    color: "text-vector-orange",
    badge: "Prático",
    stats: "Ilimitado",
    badgeBg: "bg-orange-500/10 text-orange-700 dark:text-orange-400"
  }
];

export default function Home() {
  const { stats } = useUserProgress();

  useSEO({
    title: 'Vector Learn - Aprenda Vetores de Forma Visual e Interativa',
    description: 'Plataforma educacional revolucionária com simuladores 3D interativos, desafios e tutoriais para dominar vetores em matemática e física.',
    keywords: 'aprenda vetores, simulador vetores, física interativa, matemática visual, educação online, vetores 3D',
    canonicalUrl: 'https://vectorlearn.com/',
    learningResourceSchema: generateEducationalAppSchema(),
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-visible">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4 py-8">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Pensar em{" "}
              <span className="text-gradient">vetores</span>{" "}
              muda como você vê o mundo
            </h1>

            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Descubra o poder dos vetores através de visualizações interativas,
              simuladores 3D e exercícios práticos. Uma nova forma de aprender matemática.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
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

      {/* Features Section - "Por que escolher VectorLen?" */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 to-transparent opacity-30" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4 px-4 py-2 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-[#5B8CFF] dark:text-[#5B8CFF] font-semibold text-sm">POR QUE SOMOS DIFERENTES</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 px-4 max-w-4xl mx-auto leading-tight">
            Por que escolher
            <span className="block text-gradient pb-1">Vector Learn</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Uma plataforma criada especificamente para universitários que querem dominar vetores sem dor de cabeça
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="group"
              >
                <Card className="interactive-surface h-full relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-full -mr-20 -mt-20`} />

                  <CardContent className="p-8 relative z-10">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 10 }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{feature.description}</p>

                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm font-semibold text-vector-teal flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {feature.highlight}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Quick Access Section - "Comece sua Jornada" */}
      <section className="py-24 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4 px-4 py-2 rounded-full bg-[#00D1B2]/10 border border-[#00D1B2]/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-[#00D1B2] dark:text-[#00D1B2] font-semibold text-sm">SEU PONTO DE PARTIDA</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 px-4 max-w-4xl mx-auto leading-tight">
            Comece sua
            <span className="block text-gradient pb-1">Jornada Agora</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Escolha o caminho que combina com você. Cada trilha é cuidadosamente desenhada para máximo aprendizado
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {quickAccess.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group h-full"
              >
                <Link to={item.href} className="block h-full">
                  <Card className="interactive-surface group cursor-pointer h-full relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00D1B2] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <CardContent className="p-8 flex flex-col h-full">
                      {/* Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <span className={`px-3 py-1 ${item.badgeBg} rounded-full text-xs font-bold`}>
                          {item.badge}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{item.stats}</span>
                      </div>

                      {/* Icon */}
                      <motion.div
                        className={`text-4xl ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 5 }}
                      >
                        <Icon className="w-12 h-12" />
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground mb-6">{item.description}</p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <span className="text-sm font-semibold text-primary">Explorar</span>
                        <motion.div
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ x: -10 }}
                          whileHover={{ x: 5 }}
                        >
                          <ArrowRight className="h-5 w-5 text-primary" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Achievements Section */}
      <section className="py-24 relative bg-gradient-to-b from-muted/50 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4 px-4 py-2 rounded-full bg-[#00D1B2]/10 border border-[#00D1B2]/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-[#00D1B2] font-semibold text-sm">SUAS CONQUISTAS</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 px-4 max-w-4xl mx-auto leading-tight">
            Desbloqueie
            <span className="text-gradient block pb-1">Badges & Achievements</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ganhe badges exclusivos conforme você estuda e domina novos conceitos em vetores
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-2xl font-bold text-primary">{stats.unlockedBadges.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Badges Desbloqueados</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-2xl font-bold text-blue-500">{stats.totalCorrectAnswers}</p>
              <p className="text-xs text-muted-foreground mt-1">Respostas Corretas</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-2xl font-bold text-vector-orange">{Math.round(stats.averageAccuracy)}%</p>
              <p className="text-xs text-muted-foreground mt-1">Acurácia Média</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 border border-border">
              <p className="text-2xl font-bold text-vector-green">{stats.currentStreak}</p>
              <p className="text-xs text-muted-foreground mt-1">Sequência Atual</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <BadgeSystem
            unlockedBadges={stats.unlockedBadges}
            layout="grid"
            showLocked={true}
          />
        </motion.div>

        <div className="text-center mt-12">
          <Button asChild className="gap-2 bg-gradient-to-r from-vector-blue to-vector-teal hover:opacity-90">
            <Link to="/desafios">
              Ver Mais Badges <Trophy className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Help & FAQ Section */}
      <section className="py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-block mb-4 px-4 py-2 rounded-full bg-[#5B8CFF]/10 border border-[#5B8CFF]/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-[#5B8CFF] dark:text-[#5B8CFF] font-semibold text-sm">DÚVIDAS?</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Respostas para
            <span className="block text-gradient"> Suas Dúvidas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Temos respostas para as perguntas mais comuns sobre Vector Learn. Se não encontrar o que procura, não hesite em nos contactar!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: HelpCircle,
              question: "Como começar?",
              answer: "Visite a seção Fundamentos para aprender os conceitos básicos de vetores.",
              href: "/faq"
            },
            {
              icon: Zap,
              question: "Posso usar no mobile?",
              answer: "Sim! Vector Learn é totalmente responsivo e funciona em qualquer dispositivo.",
              href: "/faq"
            },
            {
              icon: CheckCircle2,
              question: "Temos suporte?",
              answer: "Sim! Confira nossa página de FAQ completa com 15+ respostas úteis.",
              href: "/faq"
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={item.href}>
                  <Card className="interactive-surface h-full hover:shadow-lg hover:border-[#5B8CFF]/50 transition-all duration-300 cursor-pointer group">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-[#5B8CFF]/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-[#5B8CFF]/20 transition-colors">
                        <Icon className="w-6 h-6 text-[#5B8CFF]" />
                      </div>
                      <h3 className="font-semibold mb-2">{item.question}</h3>
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button asChild className="bg-[#5B8CFF] hover:bg-[#5B8CFF]/90">
            <Link to="/faq" className="flex items-center justify-center">
              Ver Todas as Perguntas Frequentes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Call to Action - "Pronto para dominar vetores?" */}
      <section className="py-24 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF7A59]/20 via-[#5B8CFF]/20 to-[#00D1B2]/20 rounded-3xl blur-3xl -z-10" />
          <div className="absolute top-0 right-10 w-72 h-72 bg-[#FF7A59] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#5B8CFF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }} />

          <div className="relative z-10 bg-gradient-to-br from-[#FF7A59] via-[#FF5733] to-[#8E44AD] rounded-3xl p-12 md:p-16 text-white overflow-hidden shadow-2xl border border-white/10 group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-0 right-0 opacity-10">
              <Rocket className="w-48 h-48" />
            </div>

            <motion.div
              className="relative z-10 max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6" />
                <span className="text-lg font-bold">TRANSFORME SEU APRENDIZADO</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Pronto para dominar os vetores?
              </h2>

              <p className="text-lg opacity-95 mb-8 max-w-2xl leading-relaxed">
                Junte-se a milhares de estudantes que descobriram uma nova forma de aprender matemática. Comece hoje, veja resultados em uma semana. Garantido ou seu dinheiro de volta.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-[#FF7A59] hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-xl group">
                  <Link to="/fundamentos" className="flex items-center">
                    Iniciar Jornada Agora
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 font-bold text-lg px-8 py-6 rounded-xl">
                  <Link to="/simulador" className="flex items-center">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Explorar Demo
                  </Link>
                </Button>
              </div>

              {/* Trust Elements */}
              <div className="mt-12 pt-8 border-t border-white/30">
                <p className="text-sm opacity-90 mb-4">Confiado por:</p>
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">2,000+</p>
                    <p className="text-sm opacity-90">Alunos ativos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-sm opacity-90">Taxa de aprovação</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">7 dias</p>
                    <p className="text-sm opacity-90">Resultado visível</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm opacity-90">Da plataforma grátis</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <OnboardingTutorial steps={tutorialSteps} />
    </Layout>
  );
}