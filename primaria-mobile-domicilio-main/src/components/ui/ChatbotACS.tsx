
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { X, MessageCircle, Bot } from 'lucide-react';

interface ChatbotACSProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Message = { 
  from: 'bot' | 'user'; 
  text: string; 
  timestamp: Date;
};

export default function ChatbotACS({ open, onOpenChange }: ChatbotACSProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: 'bot',
      text: 'Olá! Eu sou o Assistente ACS. Como posso ajudar você hoje?\n\nComandos disponíveis:\n• Meus atendimentos\n• Resumo de hoje\n• Agendar visita\n• Ver relatórios\n• Ajuda',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Respostas mockadas para demonstração
  const getResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();
    
    if (input.includes('atendimento')) {
      return 'Você possui 3 atendimentos hoje:\n• 09:00 - Maria Silva (Hipertensão)\n• 14:00 - João Santos (Diabetes)\n• 16:00 - Ana Costa (Consulta de rotina)';
    }
    
    if (input.includes('resumo')) {
      return 'Resumo do dia:\n• 3 atendimentos realizados\n• 2 visitas domiciliares\n• 1 cadastro novo\n• 0 pendências';
    }
    
    if (input.includes('agendar') || input.includes('visita')) {
      return 'Para agendar uma visita, preciso das seguintes informações:\n• Nome do paciente\n• Data preferida\n• Motivo da visita\n\nPosso ajudar com o agendamento?';
    }
    
    if (input.includes('relatório') || input.includes('relatorio')) {
      return 'Relatórios disponíveis:\n• Relatório mensal de atendimentos\n• Índice de cobertura familiar\n• Estatísticas de visitas\n• Dados epidemiológicos\n\nQual relatório você gostaria de visualizar?';
    }
    
    if (input.includes('ajuda') || input.includes('help')) {
      return 'Posso ajudar com:\n• Consultar atendimentos\n• Agendar visitas\n• Gerar relatórios\n• Verificar estatísticas\n• Orientações sobre procedimentos\n\nDigite sua dúvida específica!';
    }
    
    if (input.includes('maria silva')) {
      return 'Informações da Maria Silva:\n• Idade: 65 anos\n• Condições: Hipertensão, Diabetes tipo 2\n• Última visita: 15/07/2024\n• Medicações: Losartana, Metformina\n• Próxima consulta: 20/08/2024';
    }
    
    if (input.includes('joão santos') || input.includes('joao santos')) {
      return 'Informações do João Santos:\n• Idade: 52 anos\n• Condições: Diabetes tipo 2\n• Última visita: 10/07/2024\n• Medicações: Metformina, Insulina\n• Próxima consulta: 25/08/2024';
    }
    
    return 'Entendo sua solicitação. Como assistente ACS, posso ajudar com informações sobre pacientes, agendamentos e relatórios. Pode reformular sua pergunta ou escolher uma das opções do menu?';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      from: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    // Simula processamento
    setTimeout(() => {
      const response = getResponse(input);
      const botMessage: Message = {
        from: 'bot',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-lg">Assistente ACS</h3>
              <p className="text-sm opacity-90">Inteligência Artificial para Agentes Comunitários</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg ${
                  message.from === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-line">{message.text}</div>
                <div className={`text-xs mt-1 ${
                  message.from === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">Pensando...</div>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Meus atendimentos')}
              className="text-xs"
            >
              Meus atendimentos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Resumo de hoje')}
              className="text-xs"
            >
              Resumo de hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Agendar visita')}
              className="text-xs"
            >
              Agendar visita
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Ver relatórios')}
              className="text-xs"
            >
              Relatórios
            </Button>
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6"
            >
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
