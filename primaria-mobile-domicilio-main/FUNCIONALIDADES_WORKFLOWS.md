# Documentação Completa: Funcionalidades e Workflows

## Sumário
- [Execução de Roteiro](#execucao-de-roteiro)
- [Tela de Atendimento](#tela-de-atendimento)
- [Workflows e Steps](#workflows-e-steps)
- [Funcionalidades Detalhadas](#funcionalidades-detalhadas)
- [Cenários de Uso](#cenarios-de-uso)
- [Rotas e Navegação](#rotas-e-navegacao)

---

## <a name="execucao-de-roteiro"></a>Execução de Roteiro

Permite ao ACS executar visitas sequenciais, mostrando apenas a próxima visita e oferecendo três ações principais:

### Steps do Workflow
1. **Iniciar Roteiro**
   - Botão "Executar Roteiro" na tela de visitas
   - Navegação automática para `/roteiro/{id}/executar`
   - Carrega a primeira visita pendente
2. **Execução de Visita**
   - Exibe apenas a próxima visita
   - Barra de progresso (X/Y visitas)
   - Informações completas do paciente
3. **Ações por Visita**
   - Iniciar Atendimento
   - Marcar como Ausente
   - Reagendar para mais tarde
   - Avança automaticamente após cada ação

---

## <a name="tela-de-atendimento"></a>Tela de Atendimento

Tela completa para registrar todos os dados clínicos e operacionais da visita.

### Steps do Workflow
1. **Preenchimento de Sinais Vitais**
   - Pressão arterial
   - Temperatura
   - Peso
2. **Procedimentos Realizados**
   - Checkboxes para cada procedimento
   - Ex: Verificação de sinais vitais, curativo, orientação, encaminhamento
3. **Observações e Orientações**
   - Campo para observações detalhadas
   - Orientações dadas ao paciente
4. **Próxima Visita**
   - Seletor de data para agendar próxima visita
5. **Finalização**
   - Salva dados e retorna para o roteiro

---

## <a name="workflows-e-steps"></a>Workflows e Steps

### Workflow: Execução de Roteiro
- Iniciar roteiro
- Exibir próxima visita
- Realizar ação (atender, ausente, reagendar)
- Avançar para próxima visita
- Finalizar roteiro

### Workflow: Atendimento Completo
- Preencher sinais vitais
- Selecionar procedimentos
- Registrar observações
- Salvar atendimento
- Retornar ao roteiro

---

## <a name="funcionalidades-detalhadas"></a>Funcionalidades Detalhadas

- **Sinais Vitais:** PA, temperatura, peso
- **Procedimentos:** Checkboxes para cada ação clínica
- **Observações:** Campo livre para registro
- **Orientações:** Campo para orientações ao paciente
- **Próxima Visita:** Agendamento
- **Persistência:** Dados salvos localmente
- **Progresso:** Barra visual de progresso
- **Status das Visitas:** pendente, realizada, ausente, reagendada
- **Cores e Indicadores:** Verde (realizada), Amarelo (ausente), Azul (reagendada), Branco (pendente)

---

## <a name="cenarios-de-uso"></a>Cenários de Uso

### Cenário 1: Atendimento Completo
1. Executar roteiro
2. Iniciar atendimento
3. Preencher dados clínicos
4. Finalizar atendimento
5. Avançar para próxima visita

### Cenário 2: Munícipe Ausente
1. Executar roteiro
2. Marcar visita como ausente
3. Avançar para próxima visita

### Cenário 3: Reagendar Visita
1. Executar roteiro
2. Reagendar visita
3. Adicionar observação
4. Avançar para próxima visita

---

## <a name="rotas-e-navegacao"></a>Rotas e Navegação

- `/roteiro/:roteiroId/executar` — Execução do roteiro
- `/visita/atendimento/:visitaId` — Tela de atendimento

---

**Esta documentação cobre todos os fluxos, funcionalidades e cenários implementados no sistema, detalhando cada etapa para uso e referência.**
