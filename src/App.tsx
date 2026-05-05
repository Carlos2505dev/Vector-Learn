import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Fundamentos = lazy(() => import("./pages/Fundamentos"));
const Operacoes = lazy(() => import("./pages/Operacoes"));
const Simulador = lazy(() => import("./pages/Simulador"));
const Desafios = lazy(() => import("./pages/Desafios"));
const Aplicacoes = lazy(() => import("./pages/Aplicacoes"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Simple loading fallback
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fundamentos" element={<Fundamentos />} />
            <Route path="/operacoes" element={<Operacoes />} />
            <Route path="/simulador" element={<Simulador />} />
            <Route path="/desafios" element={<Desafios />} />
            <Route path="/aplicacoes" element={<Aplicacoes />} />
            <Route path="/faq" element={<FAQ />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
