import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface StressBadgeProps {
  level: 'low' | 'moderate' | 'high' | 'critical';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StressBadge = ({ level, size = 'md', showIcon = true }: StressBadgeProps) => {
  const config = {
    critical: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: AlertTriangle,
      label: 'Critical',
    },
    high: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-300',
      icon: AlertCircle,
      label: 'High Stress',
    },
    moderate: {
      bg: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-300',
      icon: Info,
      label: 'Moderate',
    },
    low: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      icon: CheckCircle,
      label: 'Low Stress',
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const { bg, text, border, icon: Icon, label } = config[level];

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${bg} ${text} ${border} border rounded-full ${sizeClasses[size]} font-medium`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {label}
    </span>
  );
};
