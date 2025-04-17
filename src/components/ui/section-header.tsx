
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  withAccent?: boolean;
}

const SectionHeader = ({
  title,
  description,
  align = 'left',
  className,
  titleClassName,
  descriptionClassName,
  withAccent = true,
}: SectionHeaderProps) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  return (
    <div className={cn('mb-8 max-w-2xl', alignmentClasses[align], className)}>
      <h2 
        className={cn(
          'text-3xl font-bold tracking-tight text-police-navy',
          titleClassName
        )}
      >
        {withAccent && (
          <span 
            className="inline-block w-3 h-12 bg-police-saffron mr-3 align-middle rounded-sm"
            aria-hidden="true"
          />
        )}
        {title}
      </h2>
      
      {description && (
        <p 
          className={cn(
            'mt-3 text-lg text-muted-foreground',
            descriptionClassName
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
