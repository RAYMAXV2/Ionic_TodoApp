import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category';  
import { Task } from '../../models/task';  
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
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
  newTaskName: string = '';

  constructor(
    private taskService: TaskService, 
    private categoryService: CategoryService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
    if (this.selectedCategoryId) {
      this.tasks = await this.taskService.getTasksByCategory(this.selectedCategoryId);
    }
  }

  /**
   * Méthode pour filtrer les tâches en fonction de la catégorie sélectionnée.
   */
  filteredTasks(): Task[] {
    if (this.selectedCategoryId) {
      return this.tasks.filter(task => task.id === this.selectedCategoryId);
    }
    return this.tasks;
  }

  /**
   * Ajoute une nouvelle tâche.
   */
  async addTask() {
    if (this.newTaskName.trim() && this.selectedCategoryId) {
      const newTask: Task = {
        id: '', // Firestore générera un ID
        name: this.newTaskName.trim(),
        completed: false,
        createdAt: new Date(),
      };

      await this.taskService.addTask(this.selectedCategoryId, newTask);
      this.newTaskName = '';
      await this.loadTasks();
    } else {
      alert('Veuillez entrer un nom de tâche et sélectionner une catégorie.');
    }
  }

  /**
   * Supprime une tâche.
   */
  async deleteTask(taskId: string) {
    if (this.selectedCategoryId) {
      await this.taskService.deleteTask(this.selectedCategoryId, taskId);
      await this.loadTasks();
    }
  }

  /**
   * Bascule le statut de complétion d'une tâche.
   */
  async toggleCompleted(task: Task) {
    if (this.selectedCategoryId) {
      task.completed = !task.completed;
      await this.taskService.updateTask(this.selectedCategoryId, task);
      await this.loadTasks();
    }
  }

  /**
   * Charge les tâches pour la catégorie sélectionnée.
   */
  async loadTasks() {
    if (this.selectedCategoryId) {
      this.tasks = await this.taskService.getTasksByCategory(this.selectedCategoryId);
    }
  }


  async openCreateTask() {
    const modal = await this.modalController.create({
      component: CreateTaskComponent,
    });
    return await modal.present();
  }


  async openCategoryManager() {
    const modal = await this.modalController.create({
      component: CategoryManagerComponent,
    });
    return await modal.present();
  }
}
