import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private collectionName = 'tasks'; 

  constructor(private firestore: Firestore) {}

  async getTasksByCategory(categoryId: string): Promise<Task[]> {
    const tasks: Task[] = [];
    const querySnapshot = await getDocs(collection(this.firestore, `${this.collectionName}/${categoryId}/tasks`));
  
    querySnapshot.forEach((doc) => {
      const data = doc.data() as unknown;
  
      if (typeof data === 'object' && data !== null && 'name' in data && 'completed' in data && 'createdAt' in data) {
        tasks.push({
          id: doc.id,
          name: (data as any).name,
          completed: (data as any).completed,
          createdAt: new Date((data as any).createdAt),
        });
      } else {
        console.warn(`Le document ${doc.id} a un format incorrect :`, data);
      }
    });
  
    return tasks;
  }

  async addTask(categoryId: string, task: Task): Promise<void> {
    await addDoc(collection(this.firestore, `${this.collectionName}/${categoryId}/tasks`), {
      name: task.name,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
    });
  }

  async updateTask(categoryId: string, task: Task): Promise<void> {
    const taskDoc = doc(this.firestore, `${this.collectionName}/${categoryId}/tasks/${task.id}`);
    await updateDoc(taskDoc, {
      name: task.name,
      completed: task.completed,
    });
  }

  async deleteTask(categoryId: string, taskId: string): Promise<void> {
    const taskDoc = doc(this.firestore, `${this.collectionName}/${categoryId}/tasks/${taskId}`);
    await deleteDoc(taskDoc);
  }
}
