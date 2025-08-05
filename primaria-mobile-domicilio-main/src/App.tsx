import ConfigScreen from "./components/ConfigScreen";
import { useEffect } from 'react';
import NotFound from "./pages/NotFound";
import { inicializarDadosMockados } from "./utils/dadosMockados";

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
import ExecutarRoteiro from "./pages/ExecutarRoteiro";
import AtendimentoVisita from "./pages/AtendimentoVisita";
import Sync from "./pages/Sync";
import ConfiguracaoSistema from "./pages/ConfiguracaoSistema";
import Inconsistencias from "./pages/Inconsistencias";
import Relatorios from "./pages/Relatorios";
import GestaoLogradouros from "./pages/GestaoLogradouros";
import Privacy from "./pages/Privacy";
import UserInfo from "./pages/UserInfo";
import DataUpdate from "./pages/DataUpdate";
import About from "./pages/About";
import PlanejamentoRoteiro from "./pages/PlanejamentoRoteiro";
import CadastroInteligente from "./pages/CadastroInteligente";

import ChatbotConfig from "./pages/ChatbotConfig";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Inicializar dados mockados para demonstração
    inicializarDadosMockados();
    
    try {
      const config = JSON.parse(localStorage.getItem('config') || '{}');
      // Tema
      if (config.tema === 'dark') {
        document.body.classList.add('dark');
        document.body.style.background = '#18181b';
        document.body.style.color = '#fff';
      } else {
        document.body.classList.remove('dark');
        document.body.style.background = '#fff';
        document.body.style.color = '#222';
      }
      // Fonte
      if (config.fonte) {
        document.body.style.fontSize = config.fonte + 'px';
      } else {
        document.body.style.fontSize = '';
      }
      // Idioma (apenas exemplo, para i18n real usar lib)
      if (config.idioma) {
        document.documentElement.lang = config.idioma;
      }
    } catch {}
  }, []);

  return (
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
              <Route path="/cadastro-inteligente" element={<CadastroInteligente />} />
              <Route path="/familia/:familiaId/novo-membro" element={<CadastroIndividual />} />
              <Route path="/pessoa/:id" element={<IndividualDetalhes />} />
              <Route path="/pessoa/:id/editar" element={<EditarIndividual />} />
              {/* Rotas do módulo Visitas Domiciliares */}
              <Route path="/visitas" element={<Visitas />} />
              <Route path="/visita/cidadao/nova" element={<VisitaCidadao />} />
              <Route path="/visita/familia/nova" element={<VisitaFamilia />} />
              <Route path="/visita/imovel/nova" element={<VisitaImovel />} />
              <Route path="/roteiro/:roteiroId/executar" element={<ExecutarRoteiro />} />
              <Route path="/visita/atendimento/:visitaId" element={<AtendimentoVisita />} />
              {/* Rota do Planejamento de Roteiro */}
              <Route path="/planejamento-roteiro" element={<PlanejamentoRoteiro />} />
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
              <Route path="/chatbot-config" element={<ChatbotConfig />} />
              <Route path="/config" element={<ConfigScreen />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};
export default App;
