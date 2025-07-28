
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Logradouros from "./pages/Logradouros";
import LogradouroDetalhes from "./pages/LogradouroDetalhes";
import DomicilioDetalhes from "./pages/DomicilioDetalhes";
import CadastroDomicilio from "./pages/CadastroDomicilio";
import FamiliasDomicilio from "./pages/FamiliasDomicilio";
import CadastroFamilia from "./pages/CadastroFamilia";
import FamiliaDetalhes from "./pages/FamiliaDetalhes";
import EditarFamilia from "./pages/EditarFamilia";
import CadastroIndividual from "./pages/CadastroIndividual";
import IndividualDetalhes from "./pages/IndividualDetalhes";
import EditarIndividual from "./pages/EditarIndividual";
import Visitas from "./pages/Visitas";
import VisitaCidadao from "./pages/VisitaCidadao";
import VisitaFamilia from "./pages/VisitaFamilia";
import VisitaImovel from "./pages/VisitaImovel";
import Sync from "./pages/Sync";
import ConfiguracaoSistema from "./pages/ConfiguracaoSistema";
import Inconsistencias from "./pages/Inconsistencias";
import Relatorios from "./pages/Relatorios";
import GestaoLogradouros from "./pages/GestaoLogradouros";
import Privacy from "./pages/Privacy";
import UserInfo from "./pages/UserInfo";
import DataUpdate from "./pages/DataUpdate";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/logradouros" element={<Logradouros />} />
            <Route path="/logradouro/:id" element={<LogradouroDetalhes />} />
            <Route path="/logradouro/:logradouroId/novo-domicilio" element={<CadastroDomicilio />} />
            <Route path="/domicilio/:id" element={<DomicilioDetalhes />} />
            
            {/* Rotas do módulo Cadastro Familiar */}
            <Route path="/domicilio/:domicilioId/familias" element={<FamiliasDomicilio />} />
            <Route path="/domicilio/:domicilioId/nova-familia" element={<CadastroFamilia />} />
            <Route path="/familia/:id" element={<FamiliaDetalhes />} />
            <Route path="/familia/:id/editar" element={<EditarFamilia />} />
            
            {/* Rotas do módulo Cadastro Individual */}
            <Route path="/cadastro-individual" element={<CadastroIndividual />} />
            <Route path="/familia/:familiaId/novo-membro" element={<CadastroIndividual />} />
            <Route path="/pessoa/:id" element={<IndividualDetalhes />} />
            <Route path="/pessoa/:id/editar" element={<EditarIndividual />} />
            
            {/* Rotas do módulo Visitas Domiciliares */}
            <Route path="/visitas" element={<Visitas />} />
            <Route path="/visita/cidadao/nova" element={<VisitaCidadao />} />
            <Route path="/visita/familia/nova" element={<VisitaFamilia />} />
            <Route path="/visita/imovel/nova" element={<VisitaImovel />} />
            
            {/* Rotas do Sistema de Sincronização e Relatórios */}
            <Route path="/sync" element={<Sync />} />
            <Route path="/configuracao-sistema" element={<ConfiguracaoSistema />} />
            <Route path="/inconsistencias" element={<Inconsistencias />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/gestao-logradouros" element={<GestaoLogradouros />} />
            
            {/* Rotas de Sistema */}
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="/data-update" element={<DataUpdate />} />
            <Route path="/about" element={<About />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
