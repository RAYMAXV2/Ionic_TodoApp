import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { CategoryService } from '../../services/category.service';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
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
    private modalController: ModalController,
    private taskService: TaskService,
    private categoryService: CategoryService,
    private toastController: ToastController 
  ) {}

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories();
  }

  async createTask() {
    if (this.taskName.trim() && this.selectedCategoryId) {
      const newTask: Task = {
        id: '', 
        name: this.taskName.trim(),
        completed: false,
        createdAt: new Date(),
      };

      await this.taskService.addTask(this.selectedCategoryId, newTask);

      await this.presentToast('Task added succesfully !');

      this.modalController.dismiss(); 
    } else {
      alert('Please fill everything');
    }
  }

  isFormValid(): boolean {
    return !!(this.taskName.trim() && this.selectedCategoryId);
  }

  closeModal() {
    this.modalController.dismiss();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'success',
    });
    toast.present();
  }
}
