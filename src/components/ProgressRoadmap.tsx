import { motion } from "framer-motion";
import { CheckCircle2, Lock, Circle, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked" | "available";
  difficulty: "básico" | "intermediário" | "avançado";
  duration: string;
  href: string;
  progress?: number; // 0-100
  prerequisites?: string[];
  skills?: string[];
}

interface ProgressRoadmapProps {
  nodes: RoadmapNode[];
  orientation?: "vertical" | "horizontal";
}

export function ProgressRoadmap({ nodes, orientation = "vertical" }: ProgressRoadmapProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-6 h-6 text-vector-teal" />;
      case "in-progress":
        return <Zap className="w-6 h-6 text-vector-orange animate-pulse" />;
      case "locked":
        return <Lock className="w-6 h-6 text-muted-foreground" />;
      default:
        return <Circle className="w-6 h-6 text-vector-blue" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-vector-teal/20 border-vector-teal/50";
      case "in-progress":
        return "bg-vector-orange/20 border-vector-orange/50";
      case "locked":
        return "bg-muted/50 border-border";
      default:
        return "bg-vector-blue/20 border-vector-blue/50";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "básico":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "intermediário":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "avançado":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    }
  };

  if (orientation === "horizontal") {
    return (
      <div className="flex overflow-x-auto gap-4 pb-4">
        {nodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-80"
          >
            <Link to={node.status === "locked" ? "#" : node.href} className="block">
              <Card className={`interactive-surface overflow-hidden transition-all h-full cursor-pointer ${node.status === "locked" ? "opacity-60 grayscale" : "hover:shadow-lg"} border-2 ${getStatusColor(node.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    {getStatusIcon(node.status)}
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyColor(node.difficulty)}`}>
                      {node.difficulty.charAt(0).toUpperCase() + node.difficulty.slice(1)}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-2">{node.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{node.description}</p>

                  <div className="mb-4 text-xs text-muted-foreground">
                    <p>⏱️ {node.duration}</p>
                  </div>

                  {node.progress !== undefined && (
                    <div className="mb-4">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-vector-blue to-vector-teal"
                          initial={{ width: 0 }}
                          animate={{ width: `${node.progress}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{node.progress}%</p>
                    </div>
                  )}

                  {node.skills && node.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {node.skills.slice(0, 2).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-muted text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {node.skills.length > 2 && (
                        <span className="px-2 py-1 bg-muted text-xs rounded-full">
                          +{node.skills.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {nodes.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex gap-6"
        >
          {/* Timeline indicator */}
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getStatusColor(node.status)} flex-shrink-0`}>
              {getStatusIcon(node.status)}
            </div>
            {index < nodes.length - 1 && (
              <div className={`w-1 h-16 my-2 ${node.status === "completed" ? "bg-vector-teal" : "bg-border"}`} />
            )}
          </div>

          {/* Content */}
          <Link to={node.status === "locked" ? "#" : node.href} className="flex-1 block">
            <Card className={`interactive-surface p-6 transition-all cursor-pointer ${node.status === "locked" ? "opacity-60 grayscale" : "hover:shadow-lg hover:border-vector-blue/50"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{node.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{node.description}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold flex-shrink-0 ml-4 ${getDifficultyColor(node.difficulty)}`}>
                  {node.difficulty.charAt(0).toUpperCase() + node.difficulty.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span>⏱️ {node.duration}</span>
                {node.status === "in-progress" && <span className="text-vector-orange font-semibold">Em Progresso</span>}
              </div>

              {node.progress !== undefined && (
                <div className="mb-3">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-vector-blue to-vector-teal"
                      initial={{ width: 0 }}
                      animate={{ width: `${node.progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{node.progress}%</p>
                </div>
              )}

              {node.skills && node.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {node.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-muted text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
