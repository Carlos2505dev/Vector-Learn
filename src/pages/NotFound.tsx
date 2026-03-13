import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search, AlertCircle, Book, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const suggestions = [
    {
      icon: Book,
      title: "Fundamentos",
      description: "Aprenda os conceitos básicos de vetores",
      href: "/fundamentos",
      color: "text-vector-blue"
    },
    {
      icon: Zap,
      title: "Desafios",
      description: "Teste seus conhecimentos com exercícios",
      href: "/desafios",
      color: "text-vector-orange"
    },
    {
      icon: Search,
      title: "Simulador",
      description: "Explore vetores interativamente",
      href: "/simulador",
      color: "text-vector-teal"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-3xl"
        >
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center relative">
              <AlertCircle className="h-32 w-32 text-vector-orange opacity-20 absolute" />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <span className="text-8xl md:text-9xl font-bold text-gradient">404</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Página Não <span className="text-gradient">Encontrada</span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Desculpas! A página que você estava procurando não existe. 
            A rota <span className="font-semibold text-foreground">{location.pathname}</span> não foi encontrada em nosso sistema.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button asChild size="lg" className="btn-hero">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Voltar ao Início
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="btn-ghost">
              <a onClick={() => window.history.back()} className="cursor-pointer">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Página Anterior
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Suggestions Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Explore Nosso Conteúdo
          </h2>
          <p className="text-muted-foreground">
            Talvez você esteja procurando por uma dessas páginas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {suggestions.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="interactive-surface h-full border-t-4 border-t-vector-blue/30 hover:border-t-vector-blue/60 transition-colors">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-vector-blue/10 to-vector-teal/10 flex items-center justify-center ${item.color}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="h-8 w-8" />
                    </motion.div>

                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      {item.description}
                    </p>

                    <Button asChild variant="outline" className="w-full">
                      <Link to={item.href} className="flex items-center justify-center">
                        Explorar
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Tips Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="py-8"
      >
        <Card className="bg-gradient-to-r from-vector-blue/5 via-vector-teal/5 to-vector-orange/5 border-border/50">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-vector-orange mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2">Dica</h3>
                <p className="text-muted-foreground">
                  Verifique se a URL está correta ou navegue usando o menu principal. 
                  Todas as páginas disponíveis podem ser acessadas através da barra de navegação no topo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </Layout>
  );
};

export default NotFound;
