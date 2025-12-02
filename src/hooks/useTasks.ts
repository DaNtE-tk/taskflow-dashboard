import { useState, useEffect, useMemo } from 'react';
import { Task, TaskFilter, TasksResponse } from '@/types/task';

const API_BASE = 'https://dummyjson.com/todos';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');

  // Fetch initial tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE}?limit=20`);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        const data: TasksResponse = await response.json();
        setTasks(data.todos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async (todo: string) => {
    try {
      const response = await fetch(`${API_BASE}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo,
          completed: false,
          userId: 1,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to add task');
      const newTask: Task = await response.json();
      
      // Since dummyjson doesn't actually persist, we add with a unique ID
      setTasks(prev => [{
        ...newTask,
        id: Date.now(),
      }, ...prev]);
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add task');
      return false;
    }
  };

  // Toggle task completion
  const toggleTask = async (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      // Optimistic update
      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        )
      );

      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      // If the API call fails for IDs we created locally, that's fine
      // dummyjson only has IDs up to 150
      if (!response.ok && id <= 150) {
        // Revert on failure
        setTasks(prev =>
          prev.map(t =>
            t.id === id ? { ...t, completed: task.completed } : t
          )
        );
      }
    } catch (err) {
      // Only revert for original API tasks
      if (id <= 150) {
        setTasks(prev =>
          prev.map(t =>
            t.id === id ? { ...t, completed: task.completed } : t
          )
        );
      }
    }
  };

  // Delete task
  const deleteTask = async (id: number) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    const task = tasks[taskIndex];
    
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== id));

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok && id <= 150) {
        // Revert on failure
        setTasks(prev => {
          const newTasks = [...prev];
          newTasks.splice(taskIndex, 0, task);
          return newTasks;
        });
      }
    } catch (err) {
      if (id <= 150) {
        setTasks(prev => {
          const newTasks = [...prev];
          newTasks.splice(taskIndex, 0, task);
          return newTasks;
        });
      }
    }
  };

  // Filtered and searched tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.todo
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesFilter =
        filter === 'all' ||
        (filter === 'completed' && task.completed) ||
        (filter === 'pending' && !task.completed);
      
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchQuery, filter]);

  // Task counts
  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  }), [tasks]);

  return {
    tasks: filteredTasks,
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
  };
}
