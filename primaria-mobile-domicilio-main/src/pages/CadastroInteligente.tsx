import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import FormularioInteligentePessoa from '@/components/ia/FormularioInteligentePessoa';
import { Pessoa } from '@/data/mockData';

const CadastroInteligente: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSalvar = (pessoa: Pessoa) => {
    // Simular salvamento
    console.log('Salvando pessoa:', pessoa);
    
    toast({
      title: "Sucesso!",
      description: "Pessoa cadastrada com sucesso. IA detectou e validou todos os dados.",
    });

    // Redirecionar após salvar
    navigate('/cadastro-individual');
  };

  const handleCancelar = () => {
    navigate('/cadastro-individual');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <FormularioInteligentePessoa 
        onSalvar={handleSalvar}
        onCancelar={handleCancelar}
      />
    </div>
  );
};

export default CadastroInteligente;
