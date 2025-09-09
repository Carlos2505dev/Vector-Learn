import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { magnitude2D, normalize2D } from "@/lib/vector-math";
import type { Vector2D } from "@/lib/vector-math";

interface HeroVectorProps {
  className?: string;
}

export function HeroVector({ className = "" }: HeroVectorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mouseVector, setMouseVector] = useState<Vector2D>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!svgRef.current) return;
      
      const rect = svgRef.current.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const x = e.clientX - rect.left - centerX;
      const y = centerY - (e.clientY - rect.top); // Flip Y for mathematical coordinate system
      
      setMouseVector({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener("mousemove", handleMouseMove);
      svg.addEventListener("mouseenter", handleMouseEnter);
      svg.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (svg) {
        svg.removeEventListener("mousemove", handleMouseMove);
        svg.removeEventListener("mouseenter", handleMouseEnter);
        svg.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const vectorMagnitude = magnitude2D(mouseVector);
  const normalizedVector = normalize2D(mouseVector);

  // Convert vector to SVG coordinates
  const svgVector = {
    x: mouseVector.x * 0.3, // Scale down for display
    y: -mouseVector.y * 0.3, // Flip Y back for SVG
  };

  const arrowLength = Math.min(vectorMagnitude * 0.3, 150);
  const arrowEndX = 250 + svgVector.x;
  const arrowEndY = 150 - svgVector.y;

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 500 300"
        className="w-full h-full cursor-crosshair"
        style={{ maxHeight: "300px" }}
      >
        {/* Grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="0.5"
              opacity="0.3"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Axes */}
        <line
          x1="50"
          y1="150"
          x2="450"
          y2="150"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
          opacity="0.6"
        />
        <line
          x1="250"
          y1="50"
          x2="250"
          y2="250"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1"
          opacity="0.6"
        />

        {/* Origin point */}
        <circle
          cx="250"
          cy="150"
          r="3"
          fill="hsl(var(--primary))"
          className="glow-effect"
        />

        {/* Vector */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <line
            x1="250"
            y1="150"
            x2={arrowEndX}
            y2={arrowEndY}
            stroke="hsl(var(--vector-blue))"
            strokeWidth="3"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />
          
          {/* Arrow head */}
          {arrowLength > 10 && (
            <polygon
              points={`${arrowEndX},${arrowEndY} ${arrowEndX - 8 * normalizedVector.x + 4 * normalizedVector.y},${arrowEndY + 8 * normalizedVector.y + 4 * normalizedVector.x} ${arrowEndX - 8 * normalizedVector.x - 4 * normalizedVector.y},${arrowEndY + 8 * normalizedVector.y - 4 * normalizedVector.x}`}
              fill="hsl(var(--vector-blue))"
              className="drop-shadow-sm"
            />
          )}
        </motion.g>

        {/* Component vectors */}
        {isHovering && arrowLength > 5 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.1 }}
          >
            {/* X component */}
            <line
              x1="250"
              y1="150"
              x2={arrowEndX}
              y2="150"
              stroke="hsl(var(--vector-orange))"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Y component */}
            <line
              x1={arrowEndX}
              y1="150"
              x2={arrowEndX}
              y2={arrowEndY}
              stroke="hsl(var(--vector-teal))"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            
            {/* Component labels */}
            <text
              x={250 + svgVector.x / 2}
              y="140"
              textAnchor="middle"
              className="fill-vector-orange text-sm font-medium"
            >
              x: {mouseVector.x.toFixed(0)}
            </text>
            <text
              x={arrowEndX + 15}
              y={150 + svgVector.y / 2}
              textAnchor="middle"
              className="fill-vector-teal text-sm font-medium"
            >
              y: {(-mouseVector.y).toFixed(0)}
            </text>
          </motion.g>
        )}

        {/* Magnitude indicator */}
        {isHovering && (
          <motion.text
            x="250"
            y="30"
            textAnchor="middle"
            className="fill-primary text-lg font-semibold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            |v| = {vectorMagnitude.toFixed(1)}
          </motion.text>
        )}
      </svg>

      {/* Instructions */}
      <motion.div
        className="absolute bottom-4 left-4 text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p>Mova o cursor para criar vetores interativos</p>
      </motion.div>
    </div>
  );
}