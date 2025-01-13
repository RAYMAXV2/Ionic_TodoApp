import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category';  // Importation du modèle Category
import { Task } from '../../models/task';  // Importation du modèle Task
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service'; // Service pour les catégories
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

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
    private router: Router, 
    private taskService: TaskService, 
    private categoryService: CategoryService  
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


  navigateToCreateTask() {
    this.router.navigate(['/create-task']);
  }


  navigateToCreateCategory() {
    this.router.navigate(['/categories']);
  }
}
