export interface Task {
  id: string;
  name: string;
  completed: boolean;
  createdAt: Date;
  categoryId: string; 
  userId?: string; 
}
