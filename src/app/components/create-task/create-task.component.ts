import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category';
import { Task } from '../../models/task';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    private modalController: ModalController,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private toastController: ToastController
  ) {}

  /**
   * Load the categorie on init
   */
  async ngOnInit() {
    try {
      this.categories = await this.categoryService.getCategories();
      if (this.categories.length === 0) {
        await this.presentToast('No categories available. Please create one first.', 'danger');
        this.modalController.dismiss();
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      await this.presentToast('Failed to load categories', 'danger');
      this.modalController.dismiss();
    }
  }

  /**
   * Create a new task with a categorie linked
   */
  async createTask() {
    if (!this.isFormValid()) {
      await this.presentToast('Please fill out all fields', 'danger');
      return;
    }

    const newTask: Task = {
      id: '', 
      name: this.taskName.trim(),
      completed: false,
      createdAt: new Date(),
      categoryId: this.selectedCategoryId!, 
    };

    try {
      await this.taskService.addTask(this.selectedCategoryId!, newTask);
      await this.presentToast('Task successfully added!', 'success');
      this.modalController.dismiss(); 
    } catch (error) {
      console.error('Error while adding task:', error);
      await this.presentToast('Error while adding task', 'danger');
    }
  }

  /**
   * Validating the form
   * @returns true if form is correct, false otherwise
   */
  isFormValid(): boolean {
    return this.taskName.trim().length > 0 && this.selectedCategoryId !== null && this.selectedCategoryId.trim().length > 0;
  }

  /**
   * close the modal
   */
  closeModal() {
    this.modalController.dismiss();
  }

  /**
   * Notification for the user
   * @param message 
   * @param color
   */
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    toast.present();
  }
}
