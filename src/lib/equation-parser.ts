import { Vector3D } from "./vector-math";

export interface ParsedEquation {
  vectorA: Vector3D;
  vectorB: Vector3D;
  vectorC?: Vector3D;
  operation: "none" | "add" | "subtract" | "dot" | "cross" | "mixed" | "project";
  is3D: boolean;
}

export function parseVectorEquation(input: string): ParsedEquation | null {
  // Normalize input: lowercase, keep spaces but reduce multiple to single
  const normalized = input.toLowerCase().trim().replace(/\s+/g, " ");
  const cleanInput = normalized.replace(/\s+/g, "");
  
  const extractVector = (str: string): Vector3D => {
    // Check for (x,y,z) format
    const parenMatch = str.match(/\(([-+]?\d*\.?\d*),([-+]?\d*\.?\d*),?([-+]?\d*\.?\d*)?\)/);
    if (parenMatch) {
      return { 
        x: parseFloat(parenMatch[1]) || 0, 
        y: parseFloat(parenMatch[2]) || 0, 
        z: parseFloat(parenMatch[3]) || 0 
      };
    }
    
    // Check for xi + yj + zk format
    let x = 0, y = 0, z = 0;
    const xMatch = str.match(/([-+]?\d*\.?\d*)i/);
    const yMatch = str.match(/([-+]?\d*\.?\d*)j/);
    const zMatch = str.match(/([-+]?\d*\.?\d*)k/);
    
    if (xMatch) x = parseFloat(xMatch[1] === "" || xMatch[1] === "+" ? "1" : xMatch[1] === "-" ? "-1" : xMatch[1]);
    if (yMatch) y = parseFloat(yMatch[1] === "" || yMatch[1] === "+" ? "1" : yMatch[1] === "-" ? "-1" : yMatch[1]);
    if (zMatch) z = parseFloat(zMatch[1] === "" || zMatch[1] === "+" ? "1" : zMatch[1] === "-" ? "-1" : zMatch[1]);
    
    return { x, y, z };
  };

  // Identify operations including Portuguese terms
  let operation: ParsedEquation["operation"] = "none";
  let opSymbol = "";

  if (normalized.includes(" x ") || normalized.includes("cross") || normalized.includes("vetorial")) {
    operation = "cross";
    opSymbol = normalized.includes("vetorial") ? "vetorial" : normalized.includes("cross") ? "cross" : "x";
  } else if (normalized.includes(".") || normalized.includes("dot") || normalized.includes("escalar")) {
    operation = "dot";
    opSymbol = normalized.includes("escalar") ? "escalar" : normalized.includes("dot") ? "dot" : ".";
  } else if (normalized.includes("+") || normalized.includes("soma") || normalized.includes("mais")) {
    operation = "add";
    opSymbol = normalized.includes("soma") ? "soma" : normalized.includes("mais") ? "mais" : "+";
  } else if (normalized.includes("-") || normalized.includes("subtraia") || normalized.includes("menos")) {
    operation = "subtract";
    opSymbol = normalized.includes("subtraia") ? "subtraia" : normalized.includes("menos") ? "menos" : "-";
  } else if (normalized.includes("proje") || normalized.includes("proj")) {
    operation = "project";
    opSymbol = normalized.includes("proje") ? "proje" : "proj";
  }

  if (operation === "none") {
    // Try to parse a single vector
    const v = extractVector(cleanInput);
    if (v.x === 0 && v.y === 0 && v.z === 0 && !cleanInput.includes("0")) return null;
    return { vectorA: v, vectorB: { x: 0, y: 0, z: 0 }, operation: "none", is3D: v.z !== 0 };
  }

  // Split by opSymbol or the normalized version of it
  const parts = normalized.split(opSymbol).map(p => p.trim().replace(/\s+/g, ""));
  if (parts.length < 2) {
    // If splitting failed, try with cleanInput if opSymbol is a character
    if (opSymbol.length === 1) {
      const cleanParts = cleanInput.split(opSymbol);
      if (cleanParts.length >= 2) {
        const vectorA = extractVector(cleanParts[0]);
        const vectorB = extractVector(cleanParts[1]);
        const is3D = vectorA.z !== 0 || vectorB.z !== 0;
        return { vectorA, vectorB, operation, is3D };
      }
    }
    return null;
  }

  const vectorA = extractVector(parts[0]);
  const vectorB = extractVector(parts[1]);
  let vectorC: Vector3D | undefined;

  if (parts.length > 2) {
    vectorC = extractVector(parts[2]);
    operation = "mixed";
  }

  const is3D = vectorA.z !== 0 || vectorB.z !== 0 || (vectorC?.z !== 0);

  return { vectorA, vectorB, vectorC, operation, is3D };
}

