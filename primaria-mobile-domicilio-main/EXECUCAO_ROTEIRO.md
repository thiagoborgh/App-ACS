# 🎯 Execução de Roteiro - Fluxo de Visitas Sequenciais

## 🚀 Nova Funcionalidade Implementada

A **execução de roteiro** permite ao ACS Jonathan executar suas visitas de forma **sequencial e organizada**, mostrando apenas a **próxima visita** e oferecendo **3 ações principais** para cada atendimento.

## 📱 Fluxo da Funcionalidade

### **1. Iniciar Roteiro (na tela de Visitas)**
- ✅ **Botão "Executar Roteiro"** no card do roteiro
- ✅ **Navegação:** `/roteiro/{id}/executar`
- ✅ **Carrega:** Primeira visita pendente automaticamente

### **2. Tela de Execução - Uma Visita por Vez**
- ✅ **Foco único:** Apenas a próxima visita é exibida
- ✅ **Progresso visual:** X/Y visitas com barra de progresso
- ✅ **Informações completas:** Paciente, endereço, condição, tempo estimado

### **3. Três Ações Disponíveis por Visita**

#### **🩺 Iniciar Atendimento** (Botão Principal)
- **Função:** Registrar visita completa com detalhes clínicos
- **Navegação:** Tela de atendimento completa
- **Campos:** Sinais vitais, procedimentos, observações

#### **❌ Munícipe Ausente**
- **Função:** Marcar visita como ausente
- **Ação:** Auto-avança para próxima visita
- **Status:** Visita marcada como "ausente"

#### **🔄 Voltar Mais Tarde**
- **Função:** Reagendar visita para depois
- **Ação:** Permite adicionar observação opcional
- **Status:** Visita marcada como "reagendada"

## 🎯 Dados Mock do Jonathan

### **Roteiro Ativo - 5 Visitas Pendentes:**

#### **Visita 1: Carlos Mendonça (45 anos)** 🔴
- **Endereço:** Conjunto Vila União, 123
- **Condição:** Hipertensão grave + AVC recente
- **Tempo:** 50 minutos
- **Detalhes:** Losartana, AAS, Clopidogrel | Esposa: Maria

#### **Visita 2: Dona Rosa (85 anos)** 🟠
- **Endereço:** Conjunto Vila União, 145  
- **Condição:** Idosa acamada + úlcera de pressão
- **Tempo:** 45 minutos
- **Detalhes:** Omeprazol, Dipirona | Filho: João | Alergia: Penicilina

#### **Visita 3: Família Costa** 🟡
- **Endereço:** Rua da Esperança, 401
- **Condição:** Acompanhamento puericultura
- **Tempo:** 25 minutos
- **Detalhes:** Pedro Costa (6 meses) | Peso: 7.2kg | Vacinas em dia

## 🩺 Tela de Atendimento Completa

### **Funcionalidades Implementadas:**

#### **📊 Sinais Vitais:**
- ✅ **Pressão arterial** (formato: 120/80)
- ✅ **Temperatura** em °C
- ✅ **Peso** em kg

#### **📋 Procedimentos (Checkboxes):**
- ✅ Verificação de sinais vitais
- ✅ Orientações sobre medicamentos  
- ✅ Avaliação nutricional
- ✅ Verificação de cartão de vacina
- ✅ Curativo simples
- ✅ Orientações de higiene
- ✅ Encaminhamento para UBS
- ✅ Acompanhamento de gestante
- ✅ Acompanhamento de crônico
- ✅ Educação em saúde

#### **📝 Registros Detalhados:**
- ✅ **Observações** do atendimento (textarea)
- ✅ **Orientações** dadas ao paciente
- ✅ **Próxima visita** (seletor de data)

#### **✅ Verificações Importantes:**
- ✅ Medicamentos verificados e orientados
- ✅ Cartão de vacina verificado (se aplicável)

## 🎪 Interface e Experiência

### **📱 Design Mobile-First:**
- ✅ **Cards informativos** com todas as informações
- ✅ **Botões grandes** para fácil toque
- ✅ **Cores intuitivas** (verde=atender, amarelo=ausente, azul=reagendar)
- ✅ **Progresso visual** com barra animada

### **🔄 Fluxo Sequencial:**
- ✅ **Uma visita por vez** - foco total
- ✅ **Avança automaticamente** após cada ação
- ✅ **Preview das próximas** (2 visitas seguintes)
- ✅ **Finalização automática** quando termina o roteiro

### **💾 Persistência de Dados:**
- ✅ **Estados salvos** durante navegação
- ✅ **Observações preservadas** entre telas
- ✅ **Progresso mantido** na sessão

## 🎯 Cenários de Demonstração

### **Cenário 1: Atendimento Completo**
```
1. Jonathan clica "Executar Roteiro"
2. Vê Carlos Mendonça (1/5 visitas)
3. Clica "Iniciar Atendimento"
4. Registra: PA 150/90, Temp 36.8°C, orientações sobre medicação
5. Finaliza atendimento
6. Retorna automaticamente para próxima visita (Dona Rosa)
```

### **Cenário 2: Munícipe Ausente**
```
1. Jonathan está na visita da Dona Rosa (2/5)
2. Chega no endereço e não há ninguém
3. Clica "Ausente"
4. Sistema marca como ausente automaticamente
5. Avança para Família Costa (3/5)
```

### **Cenário 3: Reagendar Visita**
```
1. Jonathan está na Família Costa (3/5)
2. Família pede para voltar mais tarde
3. Clica "Mais Tarde"
4. Adiciona observação: "Família solicitou retorno à tarde"
5. Sistema reagenda e avança para próxima visita
```

## 🔄 Estados das Visitas

### **Status Possíveis:**
- ✅ **pendente** - Ainda não visitada
- ✅ **realizada** - Atendimento completo registrado
- ✅ **ausente** - Munícipe não estava presente
- ✅ **reagendada** - Marcada para voltar mais tarde

### **Cores e Indicadores:**
- 🟢 **Verde** - Atendimento realizado com sucesso
- 🟡 **Amarelo** - Munícipe ausente  
- 🔵 **Azul** - Reagendada para mais tarde
- ⚪ **Branco** - Pendente de atendimento

## 🚀 Benefícios da Implementação

### **Para o ACS Jonathan:**
- 🎯 **Foco total** em uma visita por vez
- 📱 **Interface simples** e intuitiva
- ⚡ **Fluxo rápido** para situações comuns
- 📊 **Registro completo** quando necessário

### **Para a Gestão:**
- 📈 **Acompanhamento real** do progresso
- 📊 **Dados estruturados** de cada visita
- 🕐 **Tempos reais** vs estimados
- 📋 **Relatórios detalhados** de atendimento

### **Para a Comunidade:**
- 🏥 **Atendimento organizado** e profissional
- 📝 **Registros completos** para continuidade
- 📅 **Reagendamentos** quando necessário
- 🎯 **Qualidade** no acompanhamento

## 🛠️ Rotas Implementadas

```typescript
/roteiro/:roteiroId/executar     // Execução do roteiro
/visita/atendimento/:visitaId    // Tela de atendimento completo
```

## 📱 Demonstração Passo a Passo

### **1. Acesso Inicial:**
- Ir para: http://localhost:8081/visitas
- Clicar em "Executar Roteiro" no card do Jonathan

### **2. Execução:**
- Ver progresso: 1/5 visitas
- Informações completas de Carlos Mendonça
- Testar as 3 ações disponíveis

### **3. Atendimento:**
- Clicar "Iniciar Atendimento"
- Preencher sinais vitais e procedimentos
- Finalizar e voltar para próxima visita

---

**🎯 Esta implementação transforma o roteiro em uma ferramenta prática e eficiente para execução sequencial das visitas, mantendo o foco e organizando o trabalho do ACS!**
