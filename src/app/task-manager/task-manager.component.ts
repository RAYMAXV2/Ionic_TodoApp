import { Component, OnInit } from '@angular/core';
import { Category } from '../modele/category';
import { Todo } from '../modele/todo';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-create-task',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,
})
export class CreateTaskComponent implements OnInit {
  categories: Category[] = [];
  taskName: string = '';
  selectedCategoryId: number | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    }
  }

  createTask() {
    if (this.taskName.trim() && this.selectedCategoryId !== null) {
      const category = this.categories.find(
        (cat) => cat.id === this.selectedCategoryId
      );
      if (category) {
        const newTask: Todo = {
          id: Date.now(),
          name: this.taskName.trim(),
          completed: false,
          createdAt: new Date(),
        };
        category.listTasks.push(newTask);
        localStorage.setItem('categories', JSON.stringify(this.categories));
        this.router.navigate(['menu']); 
      }
    }
  }

  isFormValid(): boolean {
    return !!(this.taskName.trim() && this.selectedCategoryId !== null);
  }
}
