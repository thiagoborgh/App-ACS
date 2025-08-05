// Dados mockados para demonstração do Assistente ACS
export function inicializarDadosMockados() {
  // Verifica se já existem dados, se não, cria dados de exemplo
  if (!localStorage.getItem('cadastrosCidadao')) {
    const pacientesExemplo = [
      {
        id: '1',
        nome: 'Maria Silva Santos',
        nomeCompleto: 'Maria Silva Santos',
        idade: 67,
        endereco: 'Rua das Flores, 123',
        telefone: '(11) 99999-1234',
        condicoes: 'hipertensao, diabetes',
        medicamentos: 'Losartana 50mg, Metformina 850mg',
        ultimaVisita: '2025-08-01',
        gestante: false
      },
      {
        id: '2',
        nome: 'João Carlos Oliveira',
        nomeCompleto: 'João Carlos Oliveira',
        idade: 45,
        endereco: 'Rua das Palmeiras, 456',
        telefone: '(11) 99999-5678',
        condicoes: 'hipertensao',
        medicamentos: 'Enalapril 10mg, AAS 100mg',
        ultimaVisita: '2025-07-28',
        gestante: false
      },
      {
        id: '3',
        nome: 'Ana Paula Costa',
        nomeCompleto: 'Ana Paula Costa',
        idade: 28,
        endereco: 'Rua dos Girassóis, 789',
        telefone: '(11) 99999-9012',
        condicoes: 'gestacao',
        medicamentos: 'Ácido Fólico, Sulfato Ferroso',
        ultimaVisita: '2025-08-03',
        gestante: true
      },
      {
        id: '4',
        nome: 'José Santos',
        nomeCompleto: 'José Santos da Silva',
        idade: 72,
        endereco: 'Rua das Acácias, 321',
        telefone: '(11) 99999-3456',
        condicoes: 'diabetes, hipertensao',
        medicamentos: 'Glibenclamida 5mg, Losartana 50mg',
        ultimaVisita: '2025-07-30',
        gestante: false
      },
      {
        id: '5',
        nome: 'Fernanda Lima',
        nomeCompleto: 'Fernanda Lima Rodrigues',
        idade: 52,
        endereco: 'Rua dos Ipês, 654',
        telefone: '(11) 99999-7890',
        condicoes: 'diabetes',
        medicamentos: 'Metformina 850mg',
        ultimaVisita: '2025-08-02',
        gestante: false
      },
      {
        id: '6',
        nome: 'Carlos Eduardo',
        nomeCompleto: 'Carlos Eduardo Souza',
        idade: 38,
        endereco: 'Rua das Violetas, 987',
        telefone: '(11) 99999-2468',
        condicoes: '',
        medicamentos: '',
        ultimaVisita: '2025-08-01',
        gestante: false
      },
      {
        id: '7',
        nome: 'Rosa Maria',
        nomeCompleto: 'Rosa Maria dos Santos',
        idade: 69,
        endereco: 'Rua das Margaridas, 147',
        telefone: '(11) 99999-1357',
        condicoes: 'hipertensao',
        medicamentos: 'Losartana 50mg',
        ultimaVisita: '2025-07-29',
        gestante: false
      },
      {
        id: '8',
        nome: 'Pedro Henrique',
        nomeCompleto: 'Pedro Henrique Silva',
        idade: 15,
        endereco: 'Rua dos Cravos, 258',
        telefone: '(11) 99999-8024',
        condicoes: '',
        medicamentos: '',
        ultimaVisita: '2025-08-04',
        gestante: false
      }
    ];

    localStorage.setItem('cadastrosCidadao', JSON.stringify(pacientesExemplo));
  }

  if (!localStorage.getItem('visitas')) {
    const visitasExemplo = [
      {
        id: '1',
        pacienteId: '1',
        data: '2025-08-05',
        timestamp: new Date().toISOString(),
        tipo: 'domiciliar',
        observacoes: 'Pressão arterial controlada, paciente aderindo ao tratamento'
      },
      {
        id: '2',
        pacienteId: '3',
        data: '2025-08-05',
        timestamp: new Date().toISOString(),
        tipo: 'pre-natal',
        observacoes: 'Gestação evoluindo bem, orientada sobre sinais de alerta'
      },
      {
        id: '3',
        pacienteId: '2',
        data: '2025-08-04',
        timestamp: new Date().toISOString(),
        tipo: 'seguimento',
        observacoes: 'Verificação de pressão arterial, medicação em uso regular'
      }
    ];

    localStorage.setItem('visitas', JSON.stringify(visitasExemplo));
  }

  if (!localStorage.getItem('cadastrosRua')) {
    const ruasExemplo = [
      {
        id: '1',
        nome: 'Rua das Flores',
        bairro: 'Centro',
        cep: '12345-678',
        numeroFamilias: 45
      },
      {
        id: '2',
        nome: 'Rua das Palmeiras',
        bairro: 'Jardim Primavera',
        cep: '12345-679',
        numeroFamilias: 32
      },
      {
        id: '3',
        nome: 'Rua dos Girassóis',
        bairro: 'Vila Nova',
        cep: '12345-680',
        numeroFamilias: 28
      },
      {
        id: '4',
        nome: 'Rua das Acácias',
        bairro: 'Centro',
        cep: '12345-681',
        numeroFamilias: 38
      },
      {
        id: '5',
        nome: 'Rua dos Ipês',
        bairro: 'Jardim das Flores',
        cep: '12345-682',
        numeroFamilias: 25
      }
    ];

    localStorage.setItem('cadastrosRua', JSON.stringify(ruasExemplo));
  }

  console.log('✅ Dados mockados inicializados com sucesso!');
}

// Função para resetar dados (útil para testes)
export function resetarDadosMockados() {
  localStorage.removeItem('cadastrosCidadao');
  localStorage.removeItem('visitas');
  localStorage.removeItem('cadastrosRua');
  inicializarDadosMockados();
  console.log('🔄 Dados mockados resetados!');
}
