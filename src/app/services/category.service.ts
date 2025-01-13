import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private collectionName = 'categories';

  constructor(private firestore: Firestore) {}

  async getCategories(): Promise<Category[]> {
    const categories: Category[] = [];
    const querySnapshot = await getDocs(collection(this.firestore, this.collectionName));

    querySnapshot.forEach((doc) => {
      const data = doc.data() as unknown; // Les données sont de type unknown

      // Vérification explicite des propriétés requises
      if (
        typeof data === 'object' &&
        data !== null &&
        'name' in data &&
        'listTasks' in data &&
        Array.isArray((data as any).listTasks)
      ) {
        categories.push({
          id: doc.id,
          name: (data as any).name,
          listTasks: (data as any).listTasks,
        });
      } else {
        console.warn(`Le document ${doc.id} ne correspond pas au type Category.`);
      }
    });

    return categories;
  }

  async addCategory(category: Category): Promise<void> {
    try {
      await addDoc(collection(this.firestore, this.collectionName), category);
    } catch (error) {
      console.error('Error adding a new categorie', error);
      throw error;
    }
  }

  deleteCategory(categoryId: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.collectionName}/${categoryId}`));
  }

  updateCategory(categoryId: string, category: Partial<Category>): Promise<void> {
    return updateDoc(doc(this.firestore, `${this.collectionName}/${categoryId}`), category);
  }
}
