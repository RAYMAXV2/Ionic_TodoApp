import { Todo } from "./todo";

export interface Category {
    id: number;
    name: string;
    listTasks : Todo[];
  }