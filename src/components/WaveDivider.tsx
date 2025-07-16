interface WaveDividerProps {
  className?: string;
  variant?: 'primary' | 'gold' | 'subtle';
  flip?: boolean;
}

export const WaveDivider = ({ 
  className = "", 
  variant = 'primary',
  flip = false 
}: WaveDividerProps) => {
  const getWaveColor = () => {
    switch (variant) {
      case 'gold': return '#FDBB3B';
      case 'subtle': return 'rgba(0, 108, 255, 0.1)';
      default: return '#006CFF';
    }
  };

  return (
    <div className={`relative w-full h-16 overflow-hidden ${className}`}>
      <svg 
        className={`absolute inset-0 w-full h-full ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" 
          fill={getWaveColor()}
          fillOpacity={variant === 'subtle' ? 0.1 : 0.15}
        />
        <path 
          d="M0,80 C400,140 800,20 1200,80 L1200,120 L0,120 Z" 
          fill={getWaveColor()}
          fillOpacity={variant === 'subtle' ? 0.05 : 0.08}
        />
      </svg>
    </div>
  );
};