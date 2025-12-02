import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'success';
}

export function StatsCard({ title, value, icon: Icon, variant = 'default' }: StatsCardProps) {
  return (
    <div className="glass rounded-xl p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            variant === 'primary' && "bg-primary/20 text-primary",
            variant === 'success' && "bg-success/20 text-success",
            variant === 'default' && "bg-muted text-muted-foreground"
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </div>
    </div>
  );
}
