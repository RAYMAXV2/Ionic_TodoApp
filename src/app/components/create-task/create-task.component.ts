import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,
})
export class CreateTaskComponent implements OnInit {
  categories: Category[] = [];
  taskName: string = '';
  selectedCategoryId: string | null = null;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private categoryService: CategoryService
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
  }

  /**
   * Crée une nouvelle tâche.
   */
  async createTask() {
    if (this.taskName.trim() && this.selectedCategoryId) {
      const newTask: Task = {
        id: '', 
        name: this.taskName.trim(),
        completed: false,
        createdAt: new Date(),
      };

      await this.taskService.addTask(this.selectedCategoryId, newTask);
      this.router.navigate(['menu']);
    } else {
      alert('Veuillez remplir tous les champs.');
    }
  }

  /**
   * Vérifie si le formulaire est valide.
   */
  isFormValid(): boolean {
    return !!(this.taskName.trim() && this.selectedCategoryId);
  }
}
