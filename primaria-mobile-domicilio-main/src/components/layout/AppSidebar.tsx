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
import ChatbotIA from '@/components/ui/ChatbotIA';

const menuItems = [
  { title: 'Início', url: '/', icon: Home },
  { title: 'Informações do usuário', url: '/user-info', icon: User },
  { title: 'Planejamento de Roteiro', url: '/planejamento-roteiro', icon: FileText },
  { title: 'Sincronização', url: '/sync', icon: RefreshCw },
  { title: 'Atualização de dados', url: '/data-update', icon: RefreshCw },
  { title: 'Sobre', url: '/about', icon: Info },
  { title: 'Políticas de privacidade', url: '/privacy', icon: FileText },
  { title: 'I.A30', isIA: true, icon: Bot },
];

export function AppSidebar() {
  const [chatOpen, setChatOpen] = useState(false);
  const { open } = useSidebar();
  const layoutContext = useLayout();

  return (
    <Sidebar 
      className={`border-r transition-all duration-300 ${
        layoutContext.isHorizontalMode ? (open ? 'w-64' : 'w-16') : 'w-64'
      }`}
      collapsible={layoutContext.isHorizontalMode ? "icon" : "none"}
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
                      onClick={() => setChatOpen(true)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:scale-105 transition cursor-pointer"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {(!layoutContext.isHorizontalMode || open) && <span>{item.title}</span>}
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <item.icon className="h-5 w-5 shrink-0" />
                        {(!layoutContext.isHorizontalMode || open) && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
  <ChatbotIA open={chatOpen} onOpenChange={setChatOpen} />
      </SidebarContent>
    </Sidebar>
  );
}