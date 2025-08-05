# Passo a Passo Detalhado de Testes e Configuração do ChatbotACS Plug-and-Play

## 1. Pré-requisitos
- Node.js e npm instalados
- Projeto rodando localmente (`npm install && npm run dev`)
- Navegador Chrome, Firefox ou Edge

## 2. Configuração Inicial
### a) Build e execução local
```sh
npm install
npm run dev
```
Acesse: http://localhost:5173

### b) Configuração do endpoint da API
- Acesse a tela de configurações do Chatbot (`/config`)
- Preencha o endpoint da API (ex: `http://localhost:3000/api/v1/chatbot_workflows`)
- Insira a apiKey de teste (ex: `TESTE123`)
- Salve e publique

## 3. Teste de Embed
### a) Via iframe
Adicione ao HTML do sistema host:
```html
<iframe src="http://localhost:5173/?apiKey=TESTE123&lang=pt" style="width:100%;height:600px;border:none;" title="ChatbotACS"></iframe>
```
### b) Via script embed
```html
<script src="http://localhost:5173/embed.js" data-api-key="TESTE123" data-lang="pt"></script>
```

## 4. Teste de Parâmetros Dinâmicos
- Altere a URL do iframe/script para testar temas e idiomas:
  - `?theme=dark`
  - `?lang=en`
  - Exemplo: `http://localhost:5173/?apiKey=TESTE123&theme=dark&lang=en`

## 5. Teste de Comunicação postMessage
### a) Receber eventos do chatbot
Abra o console do navegador na página host e execute:
```js
window.addEventListener('message', e => {
  if (e.data && e.data.source === 'ChatbotACS') {
    console.log('Evento do Chatbot:', e.data);
  }
});
```
### b) Enviar comandos ao chatbot
```js
document.querySelector('iframe').contentWindow.postMessage({ source: 'ChatbotACSHost', type: 'reset' }, '*');
```

## 6. Teste de Suporte Offline
1. Acesse o chatbot online (http://localhost:5173)
2. Desconecte da internet
3. Recarregue a página: o chatbot deve abrir normalmente (assets e workflows em cache)

## 7. Teste de Fluxos
- Inicie um fluxo (ex: Cadastro de Cidadão)
- Ao concluir, verifique se o evento `flowComplete` é enviado via postMessage

## 8. Teste de Configuração/Admin
- Acesse `/config` e altere preferências globais (tema, fonte, idioma)
- Verifique se o app reflete as mudanças

## 9. Dicas de Debug
- Use o console do navegador para inspecionar eventos postMessage
- Limpe o cache do navegador para testar o comportamento offline do zero

---

Dúvidas ou problemas? Consulte o time de desenvolvimento ou o arquivo `INTEGRACAO_CHATBOT_API.md`.
