
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  value: string;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ icon, value, label, trend, className }: StatCardProps) => {
  return (
    <div
      className={cn(
        'police-card p-6 flex flex-col space-y-2',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-md text-police-navy bg-blue-50">{icon}</div>
        
        {trend && (
          <div className={cn(
            'flex items-center text-xs font-medium',
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          )}>
            <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold text-police-navy">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
};

interface StatsGridProps {
  stats: StatCardProps[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export const StatsGrid = ({ stats, columns = 4, className }: StatsGridProps) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatCard;
