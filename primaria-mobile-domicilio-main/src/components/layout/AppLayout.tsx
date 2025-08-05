import { ReactNode, useState, createContext, useContext } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: ReactNode;
}

interface LayoutContextType {
  isHorizontalMode: boolean;
  setIsHorizontalMode: (value: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within AppLayout');
  }
  return context;
};

export function AppLayout({ children }: AppLayoutProps) {
  const [isHorizontalMode, setIsHorizontalMode] = useState(false);
  const isMobile = useIsMobile();

  return (
    <LayoutContext.Provider value={{ isHorizontalMode, setIsHorizontalMode }}>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <AppHeader />
            <main className="flex-1 p-0 safe-area-inset">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </LayoutContext.Provider>
  );
}