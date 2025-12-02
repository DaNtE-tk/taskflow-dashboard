import { Search } from 'lucide-react';
import { TaskFilter } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

const filterOptions: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

export function TaskFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  counts,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className={cn(
            "w-full h-10 pl-10 pr-4 rounded-lg",
            "bg-card border border-border",
            "text-foreground placeholder:text-muted-foreground text-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
            "transition-all duration-200"
          )}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-card rounded-lg p-1 border border-border">
        {filterOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              filter === value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            <span
              className={cn(
                "ml-1.5 text-xs",
                filter === value
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              ({counts[value]})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
