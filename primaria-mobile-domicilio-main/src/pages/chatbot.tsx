import React from 'react';
import ChatbotACS from '../components/ui/ChatbotACS';

export default function ChatbotPage() {
  return (
    <div style={{ maxWidth: 480, margin: '32px auto', padding: 16 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Chatbot ACS</h1>
      <ChatbotACS />
    </div>
  );
}
