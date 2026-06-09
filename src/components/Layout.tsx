import { ReactNode, useState, useEffect, Suspense, lazy } from "react";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFooter(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className={`container mx-auto px-4 py-8 ${className}`}>
        {children}
      </main>
      
      {showFooter && (
        <footer className="border-t border-border/40 py-8 mt-16 animate-in fade-in duration-500">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p className="text-sm">
              © 2024 Vector Learn. Uma plataforma educacional para aprender vetores de forma visual e interativa.
            </p>
            <p className="text-xs mt-2">
              Desenvolvido com tecnologias modernas para uma experiência de aprendizado excepcional.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}