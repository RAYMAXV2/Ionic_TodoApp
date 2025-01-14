import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Category } from '../models/category';
import { v4 as uuidv4 } from 'uuid'; 

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private collectionName = 'categories';

  constructor(private firestore: Firestore, private authService: AuthService) {}

  async getCategories(): Promise<Category[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return [];

    const categories: Category[] = [];
    const categoriesQuery = query(
      collection(this.firestore, this.collectionName),
      where('userId', '==', currentUser.uid)
    );
    const querySnapshot = await getDocs(categoriesQuery);

    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() } as Category);
    });

    return categories;
  }

  async addCategory(category: Category): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const newCategoryId = uuidv4(); 

    await addDoc(collection(this.firestore, this.collectionName), {
      id: newCategoryId, 
      name: category.name,
      listTasks: category.listTasks,
      userId: currentUser.uid,
    });
  }

  async deleteCategory(categoryId: string): Promise<void> {
    await deleteDoc(doc(this.firestore, `${this.collectionName}/${categoryId}`));
  }
}
