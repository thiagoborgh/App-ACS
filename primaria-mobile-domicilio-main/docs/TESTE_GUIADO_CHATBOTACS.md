# Teste Guiado: ChatbotACS Plug-and-Play

Este roteiro permite validar a integração, embed, comunicação postMessage e suporte offline do ChatbotACS.

## 1. Embed do Chatbot

### a) Via iframe
```html
<iframe src="http://localhost:5173/?apiKey=TESTE123&lang=pt" style="width:100%;height:600px;border:none;" title="ChatbotACS"></iframe>
```

### b) Via script embed
```html
<script src="http://localhost:5173/embed.js" data-api-key="TESTE123" data-lang="pt"></script>
```

## 2. Comunicação postMessage

Abra o console do navegador na página host e execute:
```js
window.addEventListener('message', e => {
  if (e.data && e.data.source === 'ChatbotACS') {
    console.log('Evento do Chatbot:', e.data);
  }
});
// Para enviar comando ao chatbot:
document.querySelector('iframe').contentWindow.postMessage({ source: 'ChatbotACSHost', type: 'reset' }, '*');
```

## 3. Teste de Suporte Offline

1. Acesse o chatbot uma vez online.
2. Desconecte da internet.
3. Recarregue a página: o chatbot deve abrir normalmente (assets e workflows em cache).

## 4. Teste de Parâmetros Dinâmicos

- Altere `?theme=dark` ou `?lang=en` na URL do iframe/script e veja a UI mudar.

## 5. Teste de Fluxos

- Inicie um fluxo (ex: Cadastro de Cidadão).
- Ao concluir, verifique se o evento `flowComplete` é enviado via postMessage.

---

Dúvidas? Consulte o time de desenvolvimento.
