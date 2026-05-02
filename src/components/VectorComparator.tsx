import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Copy, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export interface Vector {
  id: string;
  name: string;
  components: number[];
  color: string;
  magnitude?: number;
  angle?: number;
}

interface VectorComparatorProps {
  vectors: Vector[];
  showMagnitude?: boolean;
  showAngle?: boolean;
  onVectorSelect?: (id: string) => void;
}

export function VectorComparator({ 
  vectors, 
  showMagnitude = true,
  showAngle = true,
  onVectorSelect 
}: VectorComparatorProps) {
  const [comparisonMode, setComparisonMode] = useState<"side-by-side" | "overlay" | "difference">("side-by-side");
  const [selectedVectors, setSelectedVectors] = useState<string[]>(vectors.slice(0, 2).map(v => v.id));

  const filteredVectors = vectors.filter(v => selectedVectors.includes(v.id));

  const calculateMagnitude = (components: number[]) => {
    return Math.sqrt(components.reduce((sum, c) => sum + c * c, 0));
  };

  const calculateAngle = (components: number[]) => {
    if (components.length >= 2) {
      return Math.atan2(components[1], components[0]) * (180 / Math.PI);
    }
    return 0;
  };

  const toggleVectorSelection = (id: string) => {
    setSelectedVectors(prev => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter(v => v !== id) : prev;
      }
      return [...prev, id].slice(-3); // Max 3 vectors
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Mode Selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 flex-wrap"
      >
        {["side-by-side", "overlay", "difference"].map(mode => (
          <Button
            key={mode}
            onClick={() => setComparisonMode(mode as any)}
            variant={comparisonMode === mode ? "default" : "outline"}
            size="sm"
          >
            {mode === "side-by-side" && "Lado a Lado"}
            {mode === "overlay" && "Sobreposição"}
            {mode === "difference" && "Diferença"}
          </Button>
        ))}
      </motion.div>

      {/* Vector Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-2"
      >
        {vectors.map(vector => (
          <button
            key={vector.id}
            onClick={() => toggleVectorSelection(vector.id)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedVectors.includes(vector.id)
                ? "border-vector-blue bg-vector-blue/10"
                : "border-border hover:border-vector-blue/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: vector.color }}
              />
              <span className="font-semibold text-sm">{vector.name}</span>
            </div>
          </button>
        ))}
      </motion.div>

      {/* Comparison Display */}
      <div className={`grid gap-6 ${comparisonMode === "side-by-side" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
        {filteredVectors.map((vector, index) => (
          <motion.div
            key={vector.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="interactive-surface p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: vector.color }}
                />
                <h3 className="font-bold text-lg">{vector.name}</h3>
              </div>

              {/* Components */}
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <p className="text-xs text-muted-foreground mb-2 font-semibold">COMPONENTES</p>
                <div className="space-y-1">
                  {vector.components.map((component, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">
                        {i === 0 && "x:"}
                        {i === 1 && "y:"}
                        {i === 2 && "z:"}
                      </span>
                      <code className="font-bold text-vector-blue">{component.toFixed(2)}</code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Magnitude and Angle */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {showMagnitude && (
                  <div className="bg-vector-blue/10 border border-vector-blue/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">MAGNITUDE</p>
                    <p className="font-bold text-lg text-vector-blue">
                      {calculateMagnitude(vector.components).toFixed(2)}
                    </p>
                  </div>
                )}
                {showAngle && vector.components.length >= 2 && (
                  <div className="bg-vector-teal/10 border border-vector-teal/30 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">ÂNGULO</p>
                    <p className="font-bold text-lg text-vector-teal">
                      {calculateAngle(vector.components).toFixed(1)}°
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `(${vector.components.map(c => c.toFixed(2)).join(", ")})`
                    );
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copiar
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      {filteredVectors.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="interactive-surface p-6">
            <h4 className="font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Análise Comparativa
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left p-2">Propriedade</th>
                    {filteredVectors.map(v => (
                      <th key={v.id} className="text-center p-2 font-semibold">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: v.color }}
                          />
                          {v.name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {showMagnitude && (
                    <tr className="border-b border-border hover:bg-muted/50">
                      <td className="p-2 font-semibold">Magnitude</td>
                      {filteredVectors.map(v => (
                        <td key={v.id} className="text-center p-2">
                          {calculateMagnitude(v.components).toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  )}
                  {showAngle && filteredVectors[0].components.length >= 2 && (
                    <tr className="border-b border-border hover:bg-muted/50">
                      <td className="p-2 font-semibold">Ângulo</td>
                      {filteredVectors.map(v => (
                        <td key={v.id} className="text-center p-2">
                          {calculateAngle(v.components).toFixed(1)}°
                        </td>
                      ))}
                    </tr>
                  )}
                  {/* Dot Product */}
                  {filteredVectors.length === 2 && (
                    <tr className="border-b border-border hover:bg-muted/50 bg-vector-blue/5">
                      <td className="p-2 font-semibold">Produto Escalar</td>
                      <td colSpan={2} className="text-center p-2 font-bold text-vector-blue">
                        {(filteredVectors[0].components.reduce((sum, c, i) => sum + c * filteredVectors[1].components[i], 0)).toFixed(2)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
