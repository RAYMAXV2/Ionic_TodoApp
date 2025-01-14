import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service'; // Service pour gérer l'authentification
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CategoryManagerComponent } from 'src/app/components/category-manager/category-manager.component';
import { CreateTaskComponent } from 'src/app/components/create-task/create-task.component';

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,
})
export class TodolistComponent implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  selectedCategoryId: string | null = null;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController
  ) {}

  /**
   * init and refresh the data
   */
  async ngOnInit() {
    await this.refreshData();
  }

  /**
   * Lifecycle hook: triggers when the page is about to become active
   */
  async ionViewWillEnter() {
    await this.refreshData(); 
  }

  /**
   * Refreshes the categories and tasks
   */
  async refreshData() {
    try {
      await this.loadCategories();
      if (this.categories.length > 0) {
        this.selectedCategoryId = this.categories[0].id;
        await this.loadTasks();
      } else {
        this.tasks = [];
        this.selectedCategoryId = null;
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }

  /**
   * Loads all categories for the current user
   */
  async loadCategories() {
    try {
      this.categories = await this.categoryService.getCategories();
      console.log('Categories loaded:', this.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  /**
   * Loads tasks
   */
  async loadTasks() {
    if (this.selectedCategoryId) {
      try {
        this.tasks = await this.taskService.getTasksByCategory(this.selectedCategoryId);
        console.log('Tasks loaded for category:', this.selectedCategoryId, this.tasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }

  /**
   * Filters tasks
   */
  filteredTasks(): Task[] {
    if (this.selectedCategoryId) {
      return this.tasks.filter(task => task.categoryId === this.selectedCategoryId);
    }
    return [];
  }

  /**
   * Disconnects the current user
   */
  async disconnect() {
    try {
      await this.authService.logout();
      await this.presentToast('Successfully disconnected', 'success');
      this.router.navigate(['/login']); // Redirect to login page
    } catch (error) {
      console.error('Error during disconnect:', error);
      await this.presentToast('Error during disconnect', 'danger');
    }
  }

  /**
   * Opens the modal to create a new task
   */
  async openCreateTask() {
    const modal = await this.modalController.create({
      component: CreateTaskComponent,
    });

    modal.onDidDismiss().then(async () => {
      await this.loadTasks();
    });

    return await modal.present();
  }

  /**
   * Open the modal to manage categorie
   */
  async openCategoryManager() {
    const modal = await this.modalController.create({
      component: CategoryManagerComponent,
    });

    modal.onDidDismiss().then(async () => {
      await this.loadCategories();
      if (this.categories.length > 0 && !this.selectedCategoryId) {
        this.selectedCategoryId = this.categories[0].id;
      }
      await this.loadTasks();
    });

    return await modal.present();
  }

  /**
   * Delete a task by ID
   */
  async deleteTask(taskId: string) {
    if (this.selectedCategoryId) {
      try {
        await this.taskService.deleteTask(this.selectedCategoryId, taskId);
        await this.loadTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  }

/**
 * Toggles the completed status of a task
 */
async toggleCompleted(task: Task) {
  if (this.selectedCategoryId) {
    try {
      task.completed = !task.completed;

      await this.taskService.updateTask(this.selectedCategoryId, task);

      const taskIndex = this.tasks.findIndex((t) => t.id === task.id);
      if (taskIndex > -1) {
        this.tasks[taskIndex] = { ...task }; 
      }
    } catch (error) {
      task.completed = !task.completed;
      console.error('Error updating task:', error);
    }
  }
}



  /**
   * Notification for the user
   * @param message 
   * @param color
   */
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    toast.present();
  }
}
