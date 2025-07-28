import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { ReactNode } from 'react';

interface ExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const ExpandableSection = ({ title, isExpanded, onToggle, children }: ExpandableSectionProps) => {
  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-start"
        onClick={onToggle}
      >
        <FileText className="w-4 h-4 mr-2" />
        {title}
        {isExpanded && <span className="ml-auto">▼</span>}
        {!isExpanded && <span className="ml-auto">▶</span>}
      </Button>
      
      {isExpanded && children}
    </div>
  );
};

export default ExpandableSection;