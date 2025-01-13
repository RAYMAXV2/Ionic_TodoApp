import { Task } from "./task";

export interface Category {
    id: string;
    name: string;
    listTasks : Task[];
  }