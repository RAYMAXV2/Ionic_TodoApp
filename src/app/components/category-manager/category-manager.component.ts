import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service'; // Service pour les catégories
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

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

  constructor(private router: Router, private categoryService: CategoryService) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  /**
   * Charge les catégories depuis le service.
   */
  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  /**
   * Ajoute une nouvelle catégorie.
   */
  async addCategory() {
    if (this.newCategoryName.trim()) {
      const newCategory: Category = {
        id: '', // Firestore générera un ID
        name: this.newCategoryName.trim(),
        listTasks: [],
      };

      await this.categoryService.addCategory(newCategory);
      this.newCategoryName = '';
      await this.loadCategories();
    } else {
      alert('Le nom de la catégorie ne peut pas être vide.');
    }
  }

  /**
   * Supprime une catégorie.
   */
  async deleteCategory(id: string) {
    await this.categoryService.deleteCategory(id);
    await this.loadCategories();
  }

  /**
   * Retour à la liste principale.
   */
  backToList() {
    this.router.navigate(['menu']);
  }
}
