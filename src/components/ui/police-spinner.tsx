
import { Shield } from 'lucide-react';

interface PoliceSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const PoliceSpinner = ({ size = 'md', message = 'Loading...' }: PoliceSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const spinnerSize = sizeClasses[size];
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className={`${spinnerSize} rounded-full animate-pulse-saffron-green flex items-center justify-center`}>
          <Shield className={`text-white ${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}`} />
        </div>
        <div className={`absolute inset-0 border-t-2 border-white rounded-full animate-spin opacity-25`}></div>
      </div>
      {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default PoliceSpinner;
