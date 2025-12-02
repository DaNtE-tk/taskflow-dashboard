import { useState } from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Trash2, Check } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  index: number;
}

export function TaskItem({ task, onToggle, onDelete, index }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => onDelete(task.id), 200);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-4 p-4 rounded-lg glass transition-all duration-300",
        "hover:bg-secondary/50 hover:border-border",
        task.completed && "opacity-60",
        isDeleting && "scale-95 opacity-0"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Custom Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={cn(
          "relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card",
          task.completed
            ? "bg-primary border-primary"
            : "border-muted-foreground/40 hover:border-primary/60"
        )}
      >
        {task.completed && (
          <Check className="w-4 h-4 text-primary-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-scale-in" />
        )}
      </button>

      {/* Task Content */}
      <div className={cn("flex-1 min-w-0", task.completed && "task-completed")}>
        <p className={cn(
          "text-foreground font-medium truncate task-title transition-colors duration-300",
          task.completed && "text-muted-foreground"
        )}>
          {task.todo}
        </p>
      </div>

      {/* Status Badge */}
      <span
        className={cn(
          "hidden sm:inline-flex px-2.5 py-1 text-xs font-medium rounded-full transition-colors",
          task.completed
            ? "bg-success/20 text-success"
            : "bg-primary/20 text-primary"
        )}
      >
        {task.completed ? 'Completed' : 'Pending'}
      </span>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className={cn(
          "p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200",
          "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
          "focus:outline-none focus:opacity-100 focus:ring-2 focus:ring-destructive/50"
        )}
        aria-label="Delete task"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
