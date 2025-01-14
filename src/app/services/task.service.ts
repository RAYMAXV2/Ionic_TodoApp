import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Task } from '../models/task';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private collectionName = 'categories'; 

  constructor(private firestore: Firestore, private authService: AuthService) {}


  async getTasksByCategory(categoryId: string): Promise<Task[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const tasks: Task[] = [];
    const tasksQuery = query(
      collection(this.firestore, `${this.collectionName}/${categoryId}/tasks`),
      where('userId', '==', currentUser.uid)
    );

    const querySnapshot = await getDocs(tasksQuery);
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (
        typeof data === 'object' &&
        data !== null &&
        'name' in data &&
        'completed' in data &&
        'createdAt' in data &&
        'categoryId' in data 
      ) {
        tasks.push({
          id: doc.id,
          name: data['name'],
          completed: data['completed'],
          createdAt: new Date(data['createdAt']),
          categoryId: data['categoryId'], 
          userId: data['userId'], 
        } as Task);
      } else {
        console.warn(`Invalid task format for document ${doc.id}:`, data);
      }
    });

    console.log('Tasks loaded:', tasks);
    return tasks;
  }

  async addTask(categoryId: string, task: Task): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const newTaskId = uuidv4(); 

    await addDoc(collection(this.firestore, `${this.collectionName}/${categoryId}/tasks`), {
      id: newTaskId, 
      name: task.name,
      completed: task.completed,
      createdAt: task.createdAt.toISOString(),
      categoryId, 
      userId: currentUser.uid, 
    });

    console.log(`Task added with ID: ${newTaskId}`);
  }


  async updateTask(categoryId: string, task: Task): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const taskDoc = doc(this.firestore, `${this.collectionName}/${categoryId}/tasks/${task.id}`);
    await updateDoc(taskDoc, {
      name: task.name,
      completed: task.completed,
      userId: currentUser.uid,
      categoryId: task.categoryId, 
    });

    console.log(`Task updated: ${task.id}`);
  }

  async deleteTask(categoryId: string, taskId: string): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const taskDoc = doc(this.firestore, `${this.collectionName}/${categoryId}/tasks/${taskId}`);
    await deleteDoc(taskDoc);

    console.log(`Task deleted: ${taskId}`);
  }
}
