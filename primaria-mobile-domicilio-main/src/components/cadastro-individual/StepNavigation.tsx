
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const StepNavigation = ({ currentStep, totalSteps, onPrevious, onNext, onSubmit }: StepNavigationProps) => {
  const handleNext = () => {
    if (currentStep === totalSteps) {
      onSubmit();
    } else {
      onNext();
    }
  };

  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex gap-4">
      {currentStep > 1 && (
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex-1 h-12 text-muted-foreground hover:text-foreground border-border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      )}
      
      <Button
        onClick={handleNext}
        className={`${currentStep > 1 ? 'flex-1' : 'w-full'} h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors`}
      >
        {isLastStep ? (
          <>
            <Check className="w-4 h-4 mr-2" />
            Finalizar
          </>
        ) : (
          <>
            Continuar
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default StepNavigation;
