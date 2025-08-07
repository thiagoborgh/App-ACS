# BACKLOG TÉCNICO - IA ASSISTENTE ACS

**Versão:** 1.0  
**Data:** 07/08/2025  
**Tech Lead:** [Nome do Tech Lead]  
**Arquiteto:** [Nome do Arquiteto]

---

## 🏗️ ARQUITETURA TÉCNICA

### Stack Tecnológico Aprovado
```
Frontend: React 18 + TypeScript + Tailwind CSS + Shadcn/UI
Backend: Node.js + Express + TypeScript  
Database: PostgreSQL + Redis (cache)
Deploy: Docker + GitHub Actions + Vercel/AWS
```

### Componentes Principais
```
src/components/ui/AssistenteAvancado.tsx     # Componente principal
src/chatbot/workflows.ts                     # Lógica de workflows  
src/data/mockData.ts                         # Dados de teste
src/lib/cadastroValidation.ts                # Validações
src/hooks/use-mobile.tsx                     # Hook mobile
```

---

## 📋 BACKLOG DETALHADO

### EPIC 1: SISTEMA DE IA CONVERSACIONAL

#### US-001: Implementar Chat Inteligente Base
**Pontos:** 8 | **Prioridade:** Alta
- **Descrição:** Sistema de chat com interface limpa e responsiva
- **Critérios técnicos:**
  - Componente React TypeScript com estado gerenciado
  - Sistema de mensagens com timestamp
  - Interface mobile-first responsiva
  - Performance < 1s para renderização

**Tarefas técnicas:**
- [ ] Criar interface MensagemIA e BotaoRapido  
- [ ] Implementar useState para mensagens e estado
- [ ] Desenvolver componente de input e botões
- [ ] Adicionar scroll automático para novas mensagens
- [ ] Implementar loading states

**DoD (Definition of Done):**
- [ ] Chat funcional com envio/recebimento de mensagens
- [ ] Interface responsiva testada em mobile/desktop
- [ ] Testes unitários com cobertura > 80%
- [ ] Code review aprovado
- [ ] Documentação técnica atualizada

---

#### US-002: Sistema de Botões Dinâmicos
**Pontos:** 5 | **Prioridade:** Alta
- **Descrição:** Botões inteligentes que se adaptam ao contexto
- **Critérios técnicos:**
  - Auto-envio sem confirmação manual
  - Botões numerados para listas > 5 itens
  - Ocultação durante conversação ativa

**Tarefas técnicas:**
- [ ] Implementar função enviarMensagemDireta()
- [ ] Criar sistema de renderização condicional
- [ ] Desenvolver lógica de botões numerados
- [ ] Adicionar estado de conversação ativa
- [ ] Implementar feedback visual de clique

**DoD:**
- [ ] Botões enviam comandos automaticamente
- [ ] Sistema de numeração funcional para listas grandes
- [ ] Ocultação correta durante chat ativo
- [ ] Feedback visual adequado
- [ ] Testes de usabilidade aprovados

---

### EPIC 2: WORKFLOW DE VISITAS INTELIGENTE

#### US-003: Preparação Inteligente de Atendimento
**Pontos:** 13 | **Prioridade:** Crítica
- **Descrição:** Análise automática de dados do paciente com alertas
- **Critérios técnicos:**
  - Análise de dados críticos (PA, medicamentos, condições)
  - Pré-seleção de materiais por condição médica
  - Ativação automática de protocolos específicos

**Tarefas técnicas:**
- [ ] Criar função analisarPaciente()
- [ ] Implementar matriz de alertas críticos
- [ ] Desenvolver sistema de pré-seleção de materiais
- [ ] Criar mapeamento condição → protocolo
- [ ] Implementar cache para análises repetidas

**Acceptance Criteria:**
- [ ] Sistema identifica PA > 140/90 como crítico
- [ ] Materiais são pré-selecionados por condição
- [ ] Protocolos corretos são ativados automaticamente
- [ ] Análise completa < 2 segundos
- [ ] Cache evita reprocessamento desnecessário

---

#### US-004: Checklist Pré-Atendimento Interativo
**Pontos:** 8 | **Prioridade:** Alta
- **Descrição:** Checklist obrigatório com 5 categorias e toggles
- **Critérios técnicos:**
  - Estado persistente dos toggles
  - Validação obrigatória antes de prosseguir
  - Interface visual clara (✅/❌)

**Tarefas técnicas:**
- [ ] Criar estado checklistPre com 5 categorias
- [ ] Implementar funções toggle para cada categoria
- [ ] Desenvolver validação de completude
- [ ] Criar componente visual de status
- [ ] Adicionar persistência local (localStorage)

**DoD:**
- [ ] 5 categorias funcionais: Materiais, Protocolos, Medicamentos, Alertas, Ambiente
- [ ] Toggles persistem durante sessão
- [ ] Impossível prosseguir sem completar 100%
- [ ] Interface visual intuitiva
- [ ] Estado sincronizado em tempo real

---

### EPIC 3: INTEGRAÇÃO COM FORMULÁRIOS

#### US-005: Formulário AtendimentoVisita Integrado
**Pontos:** 21 | **Prioridade:** Crítica
- **Descrição:** Integração completa com formulário oficial e-SUS AB
- **Critérios técnicos:**
  - 7 seções estruturadas conforme e-SUS AB
  - Pré-preenchimento automático de dados
  - Switches expansíveis para Busca Ativa e Acompanhamento

**Tarefas técnicas:**
- [ ] Mapear estrutura oficial e-SUS AB
- [ ] Implementar pré-preenchimento automático
- [ ] Criar switches expansíveis para seções grandes
- [ ] Desenvolver validações em tempo real
- [ ] Integrar com sistema de sincronização

**Subtarefas por seção:**
- [ ] **Dados Básicos:** Paciente, data, motivos
- [ ] **Busca Ativa:** Consultas, exames, procedimentos  
- [ ] **Acompanhamento:** Condições por patologia
- [ ] **Antropometria:** Peso, altura com validações
- [ ] **Sinais Vitais:** PA, FC, temperatura, saturação
- [ ] **Profissional:** Visita acompanhada por equipe
- [ ] **Observações:** Registro detalhado do atendimento

**DoD:**
- [ ] Formulário espelha 100% a estrutura e-SUS AB
- [ ] Dados pré-preenchidos automaticamente
- [ ] Seções expansíveis funcionais
- [ ] Validações impedem envio incorreto
- [ ] Sincronização bidirecional com base de dados

---

#### US-006: Sistema de Próximas Visitas
**Pontos:** 8 | **Prioridade:** Média
- **Descrição:** Navegação entre visitas do roteiro com preparação automática
- **Critérios técnicos:**
  - Dados completos da próxima visita
  - Preparação inteligente por tipo de paciente
  - Opções de ação: Iniciar/Ausente/Reagendar

**Tarefas técnicas:**
- [ ] Implementar navegação sequencial no roteiro
- [ ] Criar preparação automática por perfil de paciente
- [ ] Desenvolver sistema de marcação (Ausente/Reagendado)
- [ ] Integrar com sistema de agendamento
- [ ] Adicionar estimativa de tempo por visita

**DoD:**
- [ ] Navegação fluida entre visitas do roteiro
- [ ] Preparação específica para cada tipo de paciente
- [ ] Registro correto de ausências e reagendamentos
- [ ] Integração com sistema de agendamento
- [ ] Estimativas de tempo precisas

---

## 🧪 ESTRATÉGIA DE TESTES

### Testes Unitários (Jest + Testing Library)
```typescript
// Exemplos de testes obrigatórios
describe('AssistenteAvancado', () => {
  test('deve enviar mensagem automaticamente via botão')
  test('deve ocultar sugestões durante conversação ativa')  
  test('deve pré-preencher dados do paciente corretamente')
  test('deve validar checklist antes de prosseguir')
  test('deve identificar alertas críticos automaticamente')
})
```

### Testes de Integração
- [ ] Integração com API e-SUS AB
- [ ] Sincronização de dados em tempo real
- [ ] Performance sob carga (50+ usuários)
- [ ] Compatibilidade mobile (iOS/Android)

### Testes E2E (Playwright)
- [ ] Jornada completa: Roteiro → Preparação → Checklist → Formulário
- [ ] Cenários de erro e recuperação
- [ ] Navegação entre múltiplas visitas
- [ ] Funcionamento offline/online

---

## 🚀 PIPELINE DE DEPLOY

### Ambientes
```
Development  → Feature branches + PR preview
Staging      → Branch main + Testes automatizados  
Production   → Tags + Deploy manual aprovado
```

### CI/CD (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy IA Assistente
on:
  push:
    branches: [main]
    tags: [v*]

jobs:
  test:
    - Testes unitários
    - Testes de integração  
    - Code quality (ESLint, Prettier)
    - Security scan
  
  build:
    - Build otimizado para produção
    - Análise de bundle size
    - Performance audit
  
  deploy:
    - Deploy para staging (automático)
    - Deploy para production (manual)
    - Rollback automático se falhar
```

---

## 📊 MONITORAMENTO E MÉTRICAS

### Métricas Técnicas
```typescript
// Exemplos de tracking obrigatório
analytics.track('ia_preparacao_iniciada', {
  paciente_id: string,
  tempo_preparacao: number,
  alertas_identificados: number
})

analytics.track('formulario_preenchido', {
  tempo_preenchimento: number,
  campos_preenchidos: number,
  validacoes_falharam: number
})

analytics.track('checklist_completado', {
  tempo_checklist: number,
  itens_marcados: number,
  tentativas_pular: number
})
```

### Alertas Críticos
- **Performance:** Resposta IA > 3s
- **Erro:** Taxa de erro > 1%  
- **Indisponibilidade:** Downtime > 30s
- **Uso:** Zero usage por > 1h

---

## 🔒 SEGURANÇA E COMPLIANCE

### Requisitos LGPD
- [ ] Criptografia de dados pessoais (AES-256)
- [ ] Auditoria de acessos e modificações
- [ ] Consentimento explícito para processamento
- [ ] Direito ao esquecimento implementado

### Segurança Técnica
- [ ] Input sanitization em todos os campos
- [ ] Rate limiting para APIs
- [ ] Autenticação JWT com refresh tokens
- [ ] HTTPS obrigatório em produção

---

## 📋 DEFINITION OF READY (DoR)

Antes de iniciar qualquer US, verificar:
- [ ] Critérios de aceite claramente definidos
- [ ] Mockups/wireframes aprovados pelo UX
- [ ] APIs necessárias documentadas
- [ ] Dependências técnicas identificadas
- [ ] Estimativa de pontos acordada pelo time

## 📋 DEFINITION OF DONE (DoD)

Para considerar qualquer US como concluída:
- [ ] Funcionalidade implementada conforme critérios
- [ ] Testes unitários com cobertura > 80%
- [ ] Testes de integração passando
- [ ] Code review aprovado por 2+ devs
- [ ] Documentação técnica atualizada
- [ ] Deploy realizado em staging
- [ ] Testes manuais aprovados pelo PO
- [ ] Performance validada (< 2s resposta)

---

**READY FOR DEVELOPMENT**  
Tech Lead: _________________ Data: 07/08/2025
