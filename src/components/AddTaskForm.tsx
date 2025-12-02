import { useState } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddTaskFormProps {
  onAdd: (todo: string) => Promise<boolean>;
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [todo, setTodo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedTodo = todo.trim();
    if (!trimmedTodo || isSubmitting) return;

    setIsSubmitting(true);
    const success = await onAdd(trimmedTodo);
    
    if (success) {
      setTodo('');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Add a new task..."
            className={cn(
              "w-full h-12 px-4 rounded-lg",
              "bg-card border border-border",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
              "transition-all duration-200"
            )}
            disabled={isSubmitting}
          />
        </div>
        <button
          type="submit"
          disabled={!todo.trim() || isSubmitting}
          className={cn(
            "h-12 px-6 rounded-lg font-medium",
            "gradient-primary text-primary-foreground",
            "flex items-center gap-2",
            "hover:opacity-90 active:scale-[0.98]",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
            "transition-all duration-200"
          )}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>
    </form>
  );
}
