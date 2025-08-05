import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Switch, FormControlLabel, TextField, Button, Checkbox, FormGroup, Slider, Snackbar, Alert } from '@mui/material';

const defaultConfig = {
  idioma: 'pt-BR',
  tema: 'light',
  fonte: 16,
  notificacoes: {
    visitas: true,
    atrasos: false,
    cadastros: true,
    canal: 'chat',
    frequencia: 'diario',
  },
  apiUrl: '',
  apiKey: '',
  offlineMode: false,
  permissoes: 'restrito',
  feedback: '',
};

export default function ConfigScreen() {
  const [tab, setTab] = useState(0);
  const [config, setConfig] = useState(() => {
    try {
      return { ...defaultConfig, ...JSON.parse(localStorage.getItem('config') || '{}') };
    } catch {
      return defaultConfig;
    }
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(() => localStorage.getItem('lastSync') || 'Nunca');

  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  const syncNow = async () => {
    setSyncing(true);
    // Simula envio dos dados locais para a API (pode ser customizado)
    await new Promise(r => setTimeout(r, 1200));
    const now = new Date().toLocaleString();
    localStorage.setItem('lastSync', now);
    setLastSync(now);
    setSyncing(false);
    setOpen(true);
  };

  const saveConfig = () => {
    try {
      localStorage.setItem('config', JSON.stringify(config));
      setOpen(true);
    } catch (e) {
      setError('Erro ao salvar configurações.');
    }
  };

  const limparDados = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados offline?')) {
      localStorage.clear();
      setConfig(defaultConfig);
      setOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 480, margin: '0 auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>Configurações</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
        <Tab label="Geral" />
        <Tab label="Notificações" />
        <Tab label="Integração" />
        <Tab label="Segurança" />
        <Tab label="Feedback" />
      </Tabs>
      {/* Geral */}
      {tab === 0 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color={isOnline ? 'success.main' : 'error.main'} sx={{ mr: 2 }}>
              Status: {isOnline ? 'Online' : 'Offline'}
            </Typography>
            <Button size="small" variant="outlined" onClick={syncNow} disabled={!isOnline || syncing} sx={{ ml: 1 }}>
              {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </Button>
            <Typography variant="caption" sx={{ ml: 2 }}>
              Última sincronização: {lastSync}
            </Typography>
          </Box>
          <TextField
            label="Idioma"
            value={config.idioma}
            onChange={e => setConfig(c => ({ ...c, idioma: e.target.value }))}
            select
            fullWidth
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="pt-BR">Português (BR)</option>
            <option value="en">English</option>
            <option value="es">Español</option>
          </TextField>
          <TextField
            label="Tema"
            value={config.tema}
            onChange={e => setConfig(c => ({ ...c, tema: e.target.value }))}
            select
            fullWidth
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
          >
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </TextField>
          <Typography gutterBottom>Tamanho da Fonte</Typography>
          <Slider
            value={config.fonte}
            min={12}
            max={24}
            step={1}
            onChange={(_, v) => setConfig(c => ({ ...c, fonte: v as number }))}
            valueLabelDisplay="auto"
            sx={{ mb: 2 }}
          />
        </Box>
      )}
      {/* Notificações */}
      {tab === 1 && (
        <Box sx={{ mt: 2 }}>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={config.notificacoes.visitas} onChange={e => setConfig(c => ({ ...c, notificacoes: { ...c.notificacoes, visitas: e.target.checked } }))} />}
              label="Alertas de visitas"
            />
            <FormControlLabel
              control={<Checkbox checked={config.notificacoes.atrasos} onChange={e => setConfig(c => ({ ...c, notificacoes: { ...c.notificacoes, atrasos: e.target.checked } }))} />}
              label="Alertas de atrasos"
            />
            <FormControlLabel
              control={<Checkbox checked={config.notificacoes.cadastros} onChange={e => setConfig(c => ({ ...c, notificacoes: { ...c.notificacoes, cadastros: e.target.checked } }))} />}
              label="Alertas de cadastros incompletos"
            />
          </FormGroup>
          <TextField
            label="Canal"
            value={config.notificacoes.canal}
            onChange={e => setConfig(c => ({ ...c, notificacoes: { ...c.notificacoes, canal: e.target.value } }))}
            select
            fullWidth
            SelectProps={{ native: true }}
            sx={{ mt: 2 }}
          >
            <option value="chat">Chat Interno</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">E-mail</option>
          </TextField>
          <TextField
            label="Frequência"
            value={config.notificacoes.frequencia}
            onChange={e => setConfig(c => ({ ...c, notificacoes: { ...c.notificacoes, frequencia: e.target.value } }))}
            select
            fullWidth
            SelectProps={{ native: true }}
            sx={{ mt: 2 }}
          >
            <option value="diario">Diariamente às 8h</option>
            <option value="atrasos">Apenas em atrasos</option>
          </TextField>
        </Box>
      )}
      {/* Integração */}
      {tab === 2 && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" color={isOnline ? 'success.main' : 'error.main'} sx={{ mr: 2 }}>
              Status: {isOnline ? 'Online' : 'Offline'}
            </Typography>
            <Button size="small" variant="outlined" onClick={syncNow} disabled={!isOnline || syncing} sx={{ ml: 1 }}>
              {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </Button>
            <Typography variant="caption" sx={{ ml: 2 }}>
              Última sincronização: {lastSync}
            </Typography>
          </Box>
          <TextField
            label="URL da API do Chatbot"
            value={config.apiUrl}
            onChange={e => setConfig(c => ({ ...c, apiUrl: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Chave de API"
            type="password"
            value={config.apiKey}
            onChange={e => setConfig(c => ({ ...c, apiKey: e.target.value }))}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="outlined" onClick={() => setOpen(true)} sx={{ mb: 2 }}>Atualizar Fluxos</Button>
        </Box>
      )}
      {/* Segurança */}
      {tab === 3 && (
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Permissões atuais: {config.permissoes}</Typography>
          <Button variant="outlined" color="warning" onClick={() => alert('Funcionalidade de redefinir token em breve.')}>Redefinir Token</Button>
          <Button variant="outlined" color="error" onClick={limparDados} sx={{ ml: 2 }}>Limpar Dados Offline</Button>
        </Box>
      )}
      {/* Feedback */}
      {tab === 4 && (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Enviar Feedback"
            value={config.feedback}
            onChange={e => setConfig(c => ({ ...c, feedback: e.target.value }))}
            fullWidth
            multiline
            minRows={3}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={saveConfig}>Enviar</Button>
        </Box>
      )}
      {/* Botão Salvar geral */}
      {tab !== 4 && (
        <Button variant="contained" onClick={saveConfig} sx={{ mt: 3 }}>Salvar</Button>
      )}
      <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center' }}>
        v1.0 - Offline
      </Typography>
      <Snackbar open={open} autoHideDuration={2000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
          Configurações salvas!
        </Alert>
      </Snackbar>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
