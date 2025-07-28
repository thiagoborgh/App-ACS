import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { RotateCcw, Smartphone } from 'lucide-react';
import { UserActionsModal } from './UserActionsModal';
import { useLayout } from './AppLayout';

export function AppHeader() {
  const [showUserActions, setShowUserActions] = useState(false);
  const { isHorizontalMode, setIsHorizontalMode } = useLayout();

  return (
    <>
      <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <Button
            variant="ghost"
            size="sm" 
            onClick={() => setIsHorizontalMode(!isHorizontalMode)}
            className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10"
          >
            {isHorizontalMode ? (
              <>
                <Smartphone className="w-4 h-4" />
                Vertical
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Horizontal
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium">Olá, JONATHAN</p>
            <p className="text-xs opacity-90">UBS MIRANTE DA MATA</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-0 h-auto hover:bg-primary-foreground/10"
            onClick={() => setShowUserActions(true)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground">J</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      <UserActionsModal 
        open={showUserActions} 
        onOpenChange={setShowUserActions} 
      />
    </>
  );
}