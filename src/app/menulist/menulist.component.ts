import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Todo } from '../modele/todo';
import { Category } from '../modele/category';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menulist',
  templateUrl: './menulist.component.html',
  styleUrls: ['./menulist.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,
})
export class MenulistComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: number | null = null;
  newTodoName: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadCategories();
      }
    });
  }

  ngOnInit() {
    this.loadCategories();
  }
  loadCategories() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    }
  }

  saveCategories() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  filteredTodos() {
  if (this.selectedCategory) {
    const category = this.categories.find(cat => cat.id === this.selectedCategory);
    return category?.listTasks || [];
  }

  return this.categories
    .map(cat => cat.listTasks)
    .reduce((acc, tasks) => acc.concat(tasks), []);
}

  addTodo() {
    if (this.newTodoName.trim() && this.selectedCategory) {
      const category = this.categories.find(
        (cat) => cat.id === this.selectedCategory
      );
      if (category) {
        const newTodo: Todo = {
          id: Date.now(),
          name: this.newTodoName.trim(),
          completed: false,
          createdAt: new Date(),
        };
        category.listTasks.push(newTodo);
        this.newTodoName = ''; 
        this.saveCategories(); 
      }
    }
  }

  deleteTodo(todoId: number) {
    const category = this.categories.find(
      (cat) => cat.id === this.selectedCategory
    );
    if (category) {
      category.listTasks = category.listTasks.filter((task) => task.id !== todoId);
      this.saveCategories(); 
    }
  }

  toggleCompleted(todo: Todo) {
    todo.completed = !todo.completed;
    this.saveCategories(); 
  }

  navigateToCreateTask() {
    this.router.navigate(['/create-task']);
  }

  navigateToCreateCategory() {
    this.router.navigate(['/categories']);
  }
}
