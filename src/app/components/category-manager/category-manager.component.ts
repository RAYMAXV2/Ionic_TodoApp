import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Category } from '../../models/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,
})
export class CategoryManagerComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';

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

  saveCategories() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  addCategory() {
    if (this.newCategoryName.trim()) {
      const newCategory: Category = {
        id: Date.now(), 
        name: this.newCategoryName.trim(),
        listTasks: [],
      };
  
      this.categories.push(newCategory);
  
      this.newCategoryName = '';
      this.saveCategories();
    } else {
      alert('Le nom de la catégorie ne peut pas être vide.');
    }
  }

  deleteCategory(id: number) {
    this.categories = this.categories.filter((category) => category.id !== id);
    this.saveCategories();
  }

  backToList(){
    this.router.navigate(['menu']);
  }
}
