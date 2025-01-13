import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CategoryService } from '../services/category.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryGuard implements CanActivate {
  constructor(private categoryService: CategoryService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const categories = await this.categoryService.getCategories();
    if (categories.length > 0) {
      return true;
    } else {
      this.router.navigate(['/create-category']);
      return false;
    }
  }
}
