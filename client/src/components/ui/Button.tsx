import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

    const variants = {
      primary: 'bg-accent text-bg-base rounded-lg hover:bg-accent-hover focus:ring-accent/40',
      ghost: 'bg-transparent border border-border text-text-secondary rounded-lg hover:border-border-strong hover:text-text-primary focus:ring-border',
      danger: 'bg-danger/10 border border-danger/30 text-danger rounded-lg hover:bg-danger/20 focus:ring-danger/30',
      subtle: 'bg-bg-overlay text-text-secondary rounded-lg hover:bg-bg-elevated hover:text-text-primary focus:ring-border',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';