import React from 'react';
import AssistenteAvancado from '../components/ui/AssistenteAvancado';

export default function ChatbotPage() {
  return (
    <div style={{ maxWidth: 480, margin: '32px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>I.A30 Assistente Avançado</h1>
      <AssistenteAvancado open={true} onOpenChange={() => {}} />
    </div>
  );
}
