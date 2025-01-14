import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  isLoading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private modalController: ModalController
  ) {}

  /**
   * init
   */
  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.isLoading = true;
    this.categories = await this.categoryService.getCategories();
    this.isLoading = false;
  }

  /**
   * Add a new categorie
   */
  async addCategory() {
    if (this.newCategoryName.trim()) {
      const newCategory: Category = {
        id: '',
        name: this.newCategoryName.trim(),
        listTasks: [],
      };
      await this.categoryService.addCategory(newCategory);
      this.newCategoryName = '';
      await this.loadCategories();
    } else {
      alert('The category name as to be written');
    }
  }

  /**
   * Delete a category by using id
   */
  async deleteCategory(id: string) {
    await this.categoryService.deleteCategory(id);
    await this.loadCategories();
  }

  /**
   * Close modal
   */
  closeModal() {
    this.modalController.dismiss(); 
  }
}
