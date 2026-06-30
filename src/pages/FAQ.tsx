import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search, MessageCircle, HelpCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSEO, generateBreadcrumbSchema, generateFAQSchema } from "@/hooks/useSEO";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}

const faqData: FAQItem[] = [
  {
    id: "q1",
    category: "Geral",
    question: "O que é Vector Learn?",
    answer: "Vector Learn é uma plataforma educacional inovadora criada para ajudar estudantes universitários a compreender vetores através de visualizações interativas, simuladores 3D e exercícios práticos. Desenvolvida como projeto de graduação em Engenharia da Computação.",
    tags: ["início", "sobre"]
  },
  {
    id: "q2",
    category: "Geral",
    question: "A plataforma é totalmente gratuita?",
    answer: "Sim! Vector Learn é 100% gratuita. Todos os conteúdos, simuladores e desafios estão disponíveis sem custo. Queremos democratizar o aprendizado de vetores para todos os estudantes.",
    tags: ["preço", "acesso"]
  },
  {
    id: "q3",
    category: "Geral",
    question: "Preciso ter conhecimentos prévios em matemática?",
    answer: "Não necessariamente! A plataforma foi desenvolvida pensando em diferentes níveis de conhecimento. Começamos com conceitos básicos e vamos progressivamente aumentando a dificuldade. Se tiver dúvidas, use as dicas contextuais disponíveis.",
    tags: ["requisitos", "pré-requisitos"]
  },
  {
    id: "q4",
    category: "Navegação",
    question: "Como começo a aprender?",
    answer: "Comece pela seção 'Fundamentos' para entender os conceitos básicos como notação, magnitude e componentes de um vetor. Depois, explore 'Operações' para aprender soma, subtração, produto escalar e mais. Use o simulador para visualizar na prática!",
    tags: ["como", "começar"]
  },
  {
    id: "q5",
    category: "Navegação",
    question: "Qual é a ordem recomendada para estudar?",
    answer: "A ordem recomendada é: 1) Fundamentos (entender o básico), 2) Operações (aprender operações vetoriais), 3) Simulador (visualizar na prática), 4) Desafios (testar seu conhecimento), 5) Aplicações (entender aplicações reais).",
    tags: ["ordem", "sequência"]
  },
  {
    id: "q6",
    category: "Simuladores",
    question: "Como usar o simulador 2D?",
    answer: "No simulador 2D, você pode ajustar as componentes dos vetores usando os controles deslizantes. Observe como o vetor muda em tempo real. Experimente diferentes valores e operações para entender como funcionam os vetores na prática.",
    tags: ["simulador", "2D"]
  },
  {
    id: "q7",
    category: "Simuladores",
    question: "O simulador 3D funciona em todos os navegadores?",
    answer: "O simulador 3D funciona melhor em navegadores modernos como Chrome, Firefox, Safari e Edge. Se experimentar lentidão, tente desabilitar efeitos visuais extras ou feche outras abas.",
    tags: ["simulador", "3D", "navegador"]
  },
  {
    id: "q8",
    category: "Desafios",
    question: "Como funcionam os desafios?",
    answer: "Os desafios são questões interativas que testam seu conhecimento. Você receberá feedback imediato e explicações detalhadas para cada resposta, acertada ou não. Eles ajudam a consolida o aprendizado e acompanhar seu progresso.",
    tags: ["desafios", "quiz"]
  },
  {
    id: "q9",
    category: "Desafios",
    question: "Posso tentar os desafios novamente?",
    answer: "Sim! Você pode fazer os desafios quantas vezes quiser. Cada tentativa oferece perguntas potencialmente diferentes e é uma ótima forma de revisar o conteúdo e melhorar suas pontuações.",
    tags: ["desafios", "repetir"]
  },
  {
    id: "q10",
    category: "Técnico",
    question: "Como resetar meu progresso?",
    answer: "Seu progresso é salvo localmente no seu navegador. Se quiser resetar, você pode limpar os dados do site nas configurações do navegador (localStorage). Isso apagará seu histórico de estudo da plataforma.",
    tags: ["progresso", "reset"]
  },
  {
    id: "q11",
    category: "Técnico",
    question: "Meu progresso é sincronizado em múltiplos dispositivos?",
    answer: "Atualmente, o progresso é salvo apenas no navegador local. Em uma versão futura, planejamos adicionar sincronização na nuvem para que você possa continuar em qualquer dispositivo.",
    tags: ["sincronização", "dispositivos"]
  },
  {
    id: "q12",
    category: "Técnico",
    question: "Como reportar um bug ou erro?",
    answer: "Se encontrar um erro ou bug, você pode nos contatar através da página 'Aplicações' ou enviar um email diretamente. Tentaremos responder o mais rápido possível!",
    tags: ["bug", "erro", "suporte"]
  },
  {
    id: "q13",
    category: "Conteúdo",
    question: "O conteúdo abrange tudo que preciso para minha disciplina?",
    answer: "O conteúdo cobre os fundamentos essenciais de vetores (2D e 3D), operações principais e aplicações práticas. Se sua disciplina tem tópicos específicos não cobertos, sugira-nos! Estamos sempre melhorando.",
    tags: ["conteúdo", "disciplina"]
  },
  {
    id: "q14",
    category: "Conteúdo",
    question: "Há fórmulas e derivações matemáticas detalhadas?",
    answer: "Sim! Cada operação e conceito possui fórmulas matemáticas renderizadas claramente usando notação padrão. Você também encontrará explicações passo-a-passo e exemplos práticos.",
    tags: ["fórmulas", "matemática"]
  },
  {
    id: "q15",
    category: "Acessibilidade",
    question: "A plataforma oferece modo escuro?",
    answer: "Sim! Clique no ícone de tema no canto superior para alternar entre modo claro e escuro. A plataforma se adapta automaticamente à sua preferência de sistema se você não marcar uma preferência explícita.",
    tags: ["dark mode", "tema"]
  },
  {
    id: "q16",
    category: "Conceitos",
    question: "Qual a diferença entre produto escalar e vetorial?",
    answer: "O produto escalar resulta em um número (escalar) e mede o quanto os vetores estão alinhados. O produto vetorial resulta em um novo vetor que é perpendicular a ambos os vetores originais.",
    tags: ["matemática", "operações"]
  },
  {
    id: "q17",
    category: "Conceitos",
    question: "O que é um vetor unitário?",
    answer: "É um vetor com magnitude (comprimento) igual a 1. Ele é usado principalmente para indicar uma direção sem alterar a magnitude de outros vetores em operações.",
    tags: ["vetores", "direção"]
  },
  {
    id: "q18",
    category: "Técnico",
    question: "O projeto é de código aberto?",
    answer: "Atualmente o projeto é mantido de forma privada para fins educacionais, mas planejamos abrir o código no futuro para que outros estudantes possam contribuir.",
    tags: ["projeto", "contribuição"]
  },
  {
    id: "q19",
    category: "Conteúdo",
    question: "Posso usar a plataforma offline?",
    answer: "Vector Learn requer uma conexão inicial com a internet para carregar os recursos 3D e simuladores, mas após carregados, a maioria das funcionalidades pode funcionar temporariamente sem rede dependendo do cache do navegador.",
    tags: ["offline", "acesso"]
  }
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useSEO({
    title: 'Perguntas Frequentes (FAQ) - Vector Learn',
    description: 'Encontre respostas para as perguntas mais comuns sobre vetores, nossa plataforma e como aproveitar ao máximo o aprendizado interativo.',
    keywords: 'FAQ vetores, perguntas frequentes, ajuda, suporte, Vector Learn',
    canonicalUrl: 'https://vectorslearn.vercel.app/faq',
    breadcrumbSchema: generateBreadcrumbSchema([
      { name: 'Home', url: 'https://vectorslearn.vercel.app' },
      { name: 'FAQ', url: 'https://vectorslearn.vercel.app/faq' },
    ]),
    faqSchema: generateFAQSchema(faqData.map(item => ({
      question: item.question,
      answer: item.answer
    })))
  });

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Breadcrumb items={[{ label: "Dúvidas Frequentes" }]} />

      <section className="py-12 text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="w-12 h-12 text-vector-blue" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Dúvidas <span className="text-gradient">Frequentes</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Encontre respostas para as perguntas mais comuns sobre Vector Learn. 
            Se não encontrar o que procura, não hesite em nos contactar!
          </p>
        </motion.div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="mb-8"
      >
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            placeholder="Pesquise suas dúvidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 h-12 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-vector-blue/50"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            Todas
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {filteredFAQ.length > 0 ? (
            filteredFAQ.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="interactive-surface overflow-hidden">
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full"
                  >
                    <CardContent className="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-vector-blue/10 text-vector-blue text-xs font-semibold rounded">
                            {item.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-left">{item.question}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex-shrink-0 ml-4"
                      >
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </CardContent>
                  </button>

                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ 
                      height: expandedId === item.id ? "auto" : 0, 
                      opacity: expandedId === item.id ? 1 : 0 
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-6 text-muted-foreground space-y-4">
                      <p>{item.answer}</p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                          {item.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-muted text-xs rounded-full text-muted-foreground cursor-pointer hover:bg-muted/80 transition-colors"
                              onClick={() => setSearchTerm(tag)}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Nenhuma pergunta encontrada.</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="text-vector-blue hover:underline mt-2"
              >
                Limpar filtros
              </button>
            </motion.div>
          )}
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-24 lg:h-fit"
        >
          <Card className="interactive-surface">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-vector-blue" />
                Ainda tem dúvidas?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Se não encontrou a resposta que procura, adoraríamos ajudar!
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-vector-blue to-vector-teal hover:from-vector-blue/90 hover:to-vector-teal/90">
                <a href="mailto:carlosbezerrajr2007@gmail.com">Entre em Contato</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="interactive-surface mt-6">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-vector-blue">{faqData.length}</p>
                  <p className="text-sm text-muted-foreground">Perguntas disponíveis</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-vector-teal">{categories.length}</p>
                  <p className="text-sm text-muted-foreground">Categorias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.aside>
      </div>
    </Layout>
  );
}