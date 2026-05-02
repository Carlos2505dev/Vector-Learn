import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";

export interface RelatedContent {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: any;
  difficulty?: "básico" | "intermediário" | "avançado";
  completed?: boolean;
  locked?: boolean;
  badge?: string;
}

interface RelatedContentProps {
  title?: string;
  content: RelatedContent[];
  maxItems?: number;
}

const difficultyColors = {
  básico: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  intermediário: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  avançado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
};

export function RelatedContent({ 
  title = "Próximos Passos", 
  content, 
  maxItems = 3 
}: RelatedContentProps) {
  const displayContent = content.slice(0, maxItems);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full lg:w-80 flex-shrink-0"
    >
      <div className="sticky top-24">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-vector-blue rounded-full" />
          {title}
        </h3>

        <div className="space-y-3">
          {displayContent.map((item, index) => {
            const Icon = item.icon;
            const isLocked = item.locked;
            const isCompleted = item.completed;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link
                  to={isLocked ? "#" : item.href}
                  onClick={(e) => isLocked && e.preventDefault()}
                  className={`block ${isLocked && "cursor-not-allowed"}`}
                >
                  <Card className={`interactive-surface overflow-hidden transition-all duration-300 ${isLocked ? "opacity-60 grayscale" : "hover:shadow-lg hover:border-vector-blue/50"}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${isCompleted ? "bg-vector-teal/20 text-vector-teal" : "bg-vector-blue/20 text-vector-blue group-hover:bg-vector-blue/30"}`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isLocked ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold leading-tight truncate">
                            {item.title}
                          </h4>
                          {item.difficulty && (
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${difficultyColors[item.difficulty]}`}>
                              {item.difficulty}
                            </span>
                          )}
                        </div>

                        {!isLocked && (
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-vector-blue transition-colors flex-shrink-0 mt-1" />
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      {item.badge && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <span className="inline-block px-2 py-1 bg-vector-orange/10 text-vector-orange text-xs font-semibold rounded">
                            {item.badge}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {content.length > maxItems && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 pt-4 border-t border-border text-center"
          >
            <p className="text-xs text-muted-foreground">
              +{content.length - maxItems} tópicos relacionados
            </p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );
}
