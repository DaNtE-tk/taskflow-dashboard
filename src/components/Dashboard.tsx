import { useTasks } from '@/hooks/useTasks';
import { TaskList } from './TaskList';
import { AddTaskForm } from './AddTaskForm';
import { TaskFilters } from './TaskFilters';
import { StatsCard } from './StatsCard';
import { ListTodo, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard() {
  const {
    tasks,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    counts,
  } = useTasks();

  const handleAddTask = async (todo: string) => {
    const success = await addTask(todo);
    if (success) {
      toast.success('Task added successfully');
    } else {
      toast.error('Failed to add task');
    }
    return success;
  };

  const handleToggle = (id: number) => {
    toggleTask(id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.success(task.completed ? 'Task marked as pending' : 'Task completed!');
    }
  };

  const handleDelete = (id: number) => {
    deleteTask(id);
    toast.success('Task deleted');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Something went wrong</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <ListTodo className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">TaskFlow</h1>
          </div>
          <p className="text-muted-foreground">Manage your tasks with ease</p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatsCard
            title="Total Tasks"
            value={counts.all}
            icon={ListTodo}
            variant="default"
          />
          <StatsCard
            title="Pending"
            value={counts.pending}
            icon={Clock}
            variant="primary"
          />
          <StatsCard
            title="Completed"
            value={counts.completed}
            icon={CheckCircle2}
            variant="success"
          />
        </div>

        {/* Add Task Form */}
        <div className="mb-6">
          <AddTaskForm onAdd={handleAddTask} />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <TaskFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />
        </div>

        {/* Task List */}
        <main>
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </main>
      </div>
    </div>
  );
}
