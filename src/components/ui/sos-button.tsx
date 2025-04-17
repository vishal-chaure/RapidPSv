
import { Phone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SOSButtonProps {
  fixed?: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SOSButton = ({ 
  fixed = false, 
  text = "Emergency SOS", 
  size = "md", 
  className 
}: SOSButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => {
      setIsPressed(false);
      navigate('/sos');
    }, 300);
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const baseClasses = `police-button-sos rounded-full flex items-center transition-transform ${
    isPressed ? 'scale-95' : 'hover:scale-105'
  } ${sizeClasses[size]} ${className || ''}`;

  const fixedClasses = fixed ? 
    'fixed bottom-6 right-6 z-40 shadow-lg' : '';

  return (
    <Button 
      className={`${baseClasses} ${fixedClasses}`}
      onClick={handleClick}
    >
      <Phone className="w-4 h-4 mr-2" />
      {text}
    </Button>
  );
};

export default SOSButton;
