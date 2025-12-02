export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TasksResponse {
  todos: Task[];
  total: number;
  skip: number;
  limit: number;
}

export type TaskFilter = 'all' | 'pending' | 'completed';
