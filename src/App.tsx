import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Fundamentos from "./pages/Fundamentos";
import Operacoes from "./pages/Operacoes";
import Simulador from "./pages/Simulador";
import Desafios from "./pages/Desafios";
import Aplicacoes from "./pages/Aplicacoes";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
