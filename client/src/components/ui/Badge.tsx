import { cn } from '@/utils/cn';
import type { Difficulty, ProgressStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'violet' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-bg-overlay text-text-secondary border border-border',
    success: 'bg-success/10 text-success border border-success/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
    violet: 'bg-violet-muted text-violet-accent border border-violet-accent/20',
    accent: 'bg-accent-muted text-accent border border-accent/20',
  };

  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const map: Record<Difficulty, 'success' | 'warning' | 'danger'> = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger',
  };
  return <Badge variant={map[difficulty]}>{difficulty}</Badge>;
}

export function StatusBadge({ status }: { status: ProgressStatus | 'unsolved' }) {
  const map = {
    SOLVED: { variant: 'success' as const, label: 'Solved' },
    ATTEMPTED: { variant: 'warning' as const, label: 'Attempted' },
    REVISIT: { variant: 'violet' as const, label: 'Revisit' },
    unsolved: { variant: 'default' as const, label: 'Unsolved' },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}