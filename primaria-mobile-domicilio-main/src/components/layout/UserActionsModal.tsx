import { User, Building, LogOut } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UserActionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserActionsModal({ open, onOpenChange }: UserActionsModalProps) {
  const actions = [
    { 
      title: 'Informações do usuário', 
      icon: User,
      onClick: () => {
        console.log('Informações do usuário');
        onOpenChange(false);
      }
    },
    { 
      title: 'Trocar de unidade de saúde', 
      icon: Building,
      onClick: () => {
        console.log('Trocar de unidade');
        onOpenChange(false);
      }
    },
    { 
      title: 'Sair', 
      icon: LogOut,
      onClick: () => {
        console.log('Sair');
        onOpenChange(false);
      }
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Selecione uma ação</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className="w-full justify-start gap-3 h-12"
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5 text-primary" />
              <span className="text-left">{action.title}</span>
            </Button>
          ))}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
          >
            FECHAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}