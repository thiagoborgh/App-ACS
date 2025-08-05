
# Integração do ChatbotACS como Produto Plug-and-Play

## 1. Estrutura Recomendada

### ChatbotACS como Produto Plug-and-Play
- Desenvolva o ChatbotACS como um SPA React hospedado em um domínio dedicado (ex.: chatbotacs.xai.com), com build otimizado para produção (Vite ou CRA).
- Sirva os workflows via API REST (ex.: endpoint Rails) em `https://api.chatbotacs.xai.com/api/v1/chatbot_workflows`, permitindo atualizações dinâmicas sem rebuild.
- Ofereça o Chatbot como iframe ou Web Component, com configuração via parâmetros de URL (ex.: `?apiKey=TOKEN&lang=pt`).

### Compatibilidade
- Suporte a embutimento em Ruby on Rails, PHP, Python/Django, ou qualquer sistema com suporte a HTML.
- Inclua um script JavaScript para inicialização automática (ex.: `<script src="https://chatbotacs.xai.com/embed.js"></script>`).

---

## 2. Exemplo de Endpoint Rails

### Implementação
Crie um endpoint seguro e genérico:

```ruby
# config/routes.rb
namespace :api do
  namespace :v1 do
    get '/chatbot_workflows', to: 'chatbot#workflows'
  end
end

# app/controllers/api/v1/chatbot_controller.rb
module Api
  module V1
    class ChatbotController < ApplicationController
      before_action :authenticate_api_request!

      def workflows
        workflows = [
          {
            id: 'cadastroCidadao',
            nome: 'Cadastro de Cidadão',
            descricao: 'Fluxo para cadastrar um novo cidadão',
            etapas: [
              { key: 'nome', pergunta: 'Qual o nome completo?', obrigatorio: true, validacao: 'min:3' },
              { key: 'cpf', pergunta: 'Qual o CPF?', obrigatorio: true, validacao: 'cpf' }
            ]
          },
          {
            id: 'registroVisita',
            nome: 'Registro de Visita',
            descricao: 'Fluxo para registrar visita ao cidadão',
            etapas: [
              { key: 'cidadao', pergunta: 'Selecionar cidadão?', obrigatorio: true },
              { key: 'motivo', pergunta: 'Motivo da visita?', obrigatorio: true }
            ]
          }
        ]
        render json: { data: workflows }, status: :ok
      rescue StandardError => e
        render json: { error: 'Acesso negado ou erro interno' }, status: :unauthorized
      end

      private

      def authenticate_api_request!
        api_key = request.headers['X-API-Key']
        raise 'Chave de API inválida' unless api_key && ApiKey.exists?(key: api_key)
      end
    end
  end
end
```

Gere chaves de API únicas para cada cliente no Rails (ex.: modelo ApiKey).

Melhoria: Adicione suporte a filtros (ex.: `?perfil=acs`) e caching com Redis para melhorar desempenho.

---

## 3. Exemplo de Embed em Rails (Plug-and-Play)

### Implementação
Forneça um script de embed simples:

```erb
<!-- app/views/layouts/application.html.erb -->
<%= tag.iframe src: "https://chatbotacs.xai.com?apiKey=#{@current_user.api_key}&lang=pt", 
               style: "width:100%;height:600px;border:none;", 
               title: "ChatbotACS" %>
```

Ou use um script JavaScript:

```erb
<script src="https://chatbotacs.xai.com/embed.js" 
        data-api-key="<%= @current_user.api_key %>" 
        data-lang="pt"></script>
```

No React, configure o embed:

```tsx
// public/embed.js
(function() {
  const script = document.currentScript;
  const apiKey = script.getAttribute('data-api-key');
  const lang = script.getAttribute('data-lang') || 'pt';
  const container = document.createElement('div');
  container.id = 'chatbotacs-container';
  document.body.appendChild(container);
  const scriptChat = document.createElement('script');
  scriptChat.src = `https://chatbotacs.xai.com/bundle.js?apiKey=${apiKey}&lang=${lang}`;
  document.body.appendChild(scriptChat);
})();
```

Melhoria: Adicione eventos postMessage para comunicação bidirecional (ex.: enviar dados de formulário ao host) e suporte a tamanhos dinâmicos (ex.: height: auto).

---

## 4. Funcionalidades Internas do ChatbotACS

### Consumo da API
Use axios com caching offline (IndexedDB):

```tsx
// src/components/ChatbotACS.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ChatbotACS() {
  const [workflows, setWorkflows] = useState([]);
  const [error, setError] = useState(null);
  const apiUrl = new URLSearchParams(window.location.search).get('apiKey')
    ? `https://api.chatbotacs.xai.com/api/v1/chatbot_workflows?apiKey=${new URLSearchParams(window.location.search).get('apiKey')}`
    : '';

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const cached = localStorage.getItem('chatbotWorkflows');
        if (cached) setWorkflows(JSON.parse(cached));
        const response = await axios.get(apiUrl);
        localStorage.setItem('chatbotWorkflows', JSON.stringify(response.data.data));
        setWorkflows(response.data.data);
      } catch (err) {
        setError('Falha ao carregar fluxos. Usando cache offline.');
        console.error(err);
      }
    };
    fetchWorkflows();
  }, [apiUrl]);

  if (error) return <div>{error}</div>;
  return (
    <div>
      <h2>Fluxos Disponíveis</h2>
      <ul>
        {workflows.map((wf) => (
          <li key={wf.id}>{wf.nome}</li>
        ))}
      </ul>
    </div>
  );
}
```

Offline Support: Armazene respostas e workflows localmente, sincronizando online com consentimento.

---

## 5. Observações

- **Autenticação:** Forneça uma dashboard no chatbotacs.xai.com/admin para gerenciar chaves de API e fluxos, acessível apenas por administradores.
- **Customização:** Permita que o host passe parâmetros (ex.: `?theme=dark`) para ajustar a UI.
- **Publicação/Admin:** Inclua um endpoint POST para salvar novos workflows (ex.: `/api/v1/chatbot_workflows`) com validação.
- **Segurança:** Use HTTPS, CSRF tokens e rate limiting (gem rack-attack).

---

## 6. Histórico de Alterações

- 30/07/2025: Documento inicial criado.
- 30/07/2025: Adicionados embed via script, caching offline e suporte a parâmetros dinâmicos.

---

## Melhorias Adicionais

### Facilidade de Uso
- Crie um guia de instalação (ex.: README no GitHub) com exemplos para Rails, PHP e outros.
- Ofereça um "Try Demo" no site com um iframe pré-configurado.

### Escalabilidade
- Use um CDN (ex.: Cloudflare) para o bundle React e API.
- Adicione versionamento (ex.: `/api/v2/`) para futuras atualizações.

### Integração com IA 30
- Inclua fluxos como roteiros de visita e resumos clínicos (inspirados na Luna).
- Exemplo: `{ id: 'roteiroVisita', nome: 'Planejamento de Visitas', etapas: [{ key: 'data', pergunta: 'Data da visita?' }] }`.

### Suporte Offline
- Implemente Service Workers para pré-carregar workflows e gerenciar sincronização.

---

Dúvidas ou sugestões, entre em contato com o time de desenvolvimento.
