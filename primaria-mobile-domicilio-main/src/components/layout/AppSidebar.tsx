import { Home, User, RefreshCw, Info, FileText, Bot } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLayout } from './AppLayout';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import AssistenteAvancado from '@/components/ui/AssistenteAvancado';

const menuItems = [
  { title: 'Início', url: '/', icon: Home },
  { title: 'Informações do usuário', url: '/user-info', icon: User },
  { title: 'Planejamento de Roteiro', url: '/planejamento-roteiro', icon: FileText },
  { title: 'Sincronização', url: '/sync', icon: RefreshCw, isBeta: true },
  { title: 'Atualização de dados', url: '/data-update', icon: RefreshCw, isBeta: true },
  { title: 'Configurações', url: '/config', icon: Info, isBeta: true },
  { title: 'Sobre o Projeto', url: '/about', icon: Info, isBeta: true },
  { title: 'Políticas de privacidade', url: '/privacy', icon: FileText },
  { title: 'I.A30', isIA: true, icon: Bot },
];

export function AppSidebar() {
  const [assistenteOpen, setAssistenteOpen] = useState(false);
  const { open, isMobile } = useSidebar();
  const layoutContext = useLayout();

  return (
    <Sidebar 
      className={`border-r transition-all duration-300`}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      <SidebarHeader className="p-4">
        {/* Header content if needed */}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.isIA ? (
                    <SidebarMenuButton
                      asChild={false}
                      onClick={() => setAssistenteOpen(true)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:scale-105 transition cursor-pointer"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                        {item.isBeta && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200">
                            BETA
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Assistente Avançado */}
        <AssistenteAvancado open={assistenteOpen} onOpenChange={setAssistenteOpen} />
      </SidebarContent>
    </Sidebar>
  );
}