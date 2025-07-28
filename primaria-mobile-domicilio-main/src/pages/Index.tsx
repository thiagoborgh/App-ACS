
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, User, FileHeart, Users, Building, Activity, Calendar, Plus, Bell, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const mainModules = [
    {
      title: 'Domicílios',
      subtitle: 'Gestão de endereços',
      icon: Home,
      gradient: 'gradient-primary',
      action: () => navigate('/logradouros')
    },
    {
      title: 'Indivíduos',
      subtitle: 'Cadastro pessoal',
      icon: User,
      gradient: 'bg-gradient-to-br from-accent to-accent/80',
      action: () => navigate('/cadastro-individual')
    },
    {
      title: 'Visitas',
      subtitle: 'Acompanhamento',
      icon: FileHeart,
      gradient: 'bg-gradient-to-br from-success to-success/80',
      action: () => navigate('/visitas')
    },
    {
      title: 'Relatórios',
      subtitle: 'Análises e dados',
      icon: Activity,
      gradient: 'bg-gradient-to-br from-warning to-warning/80',
      action: () => navigate('/relatorios')
    }
  ];

  const dashboardStats = [
    {
      title: 'Domicílios',
      value: '85',
      icon: Building,
      change: '+12%'
    },
    {
      title: 'Famílias',
      value: '247',
      icon: Users,
      change: '+8%'
    },
    {
      title: 'Indivíduos',
      value: '892',
      icon: User,
      change: '+15%'
    },
    {
      title: 'Visitas',
      value: '156',
      icon: Calendar,
      change: '+23%'
    }
  ];

  if (!isMobile) {
    // Desktop layout (existing functionality)
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Painel Principal</h1>
            <p className="text-muted-foreground">Gestão de atenção primária à saúde</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-success font-medium">{stat.change}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainModules.map((module, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-elegant transition-all duration-300 hover:-translate-y-1" onClick={module.action}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${module.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft`}>
                    <module.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="bg-primary gradient-primary text-primary-foreground p-4 pt-12 pb-6 shadow-elegant">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Atenção Primária</h1>
            <p className="text-primary-foreground/80 text-sm">Domicílio e Saúde</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
              <Bell className="w-5 h-5" />
            </Button>
            <Button size="sm" variant="ghost" className="text-primary-foreground hover:bg-primary-foreground/20">
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {dashboardStats.slice(0, 2).map((stat, index) => (
            <div key={index} className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-primary-foreground" />
                <span className="text-xs text-primary-foreground/80">{stat.title}</span>
              </div>
              <p className="text-lg font-bold text-primary-foreground mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {mainModules.map((module, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-soft transition-all duration-200 active:scale-95" onClick={module.action}>
                <CardContent className="p-4">
                  <div className={`w-12 h-12 ${module.gradient} rounded-xl flex items-center justify-center mb-3 shadow-subtle`}>
                    <module.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-foreground text-sm mb-1">{module.title}</h3>
                  <p className="text-xs text-muted-foreground">{module.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Extended Stats */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Estatísticas</h2>
          <div className="grid grid-cols-2 gap-3">
            {dashboardStats.slice(2).map((stat, index) => (
              <Card key={index} className="shadow-subtle">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-success">{stat.change}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 safe-area-inset-bottom">
        <div className="flex justify-around">
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2">
            <Home className="w-5 h-5 mb-1" />
            <span className="text-xs">Início</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2" onClick={() => navigate('/cadastro-individual')}>
            <Plus className="w-5 h-5 mb-1" />
            <span className="text-xs">Cadastrar</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2" onClick={() => navigate('/visitas')}>
            <FileHeart className="w-5 h-5 mb-1" />
            <span className="text-xs">Visitas</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col h-auto py-2" onClick={() => navigate('/relatorios')}>
            <Activity className="w-5 h-5 mb-1" />
            <span className="text-xs">Relatórios</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
