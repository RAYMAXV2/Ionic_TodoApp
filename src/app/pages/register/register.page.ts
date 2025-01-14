import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
    imports: [IonicModule, FormsModule, CommonModule],
    standalone: true,
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      alert("The password doesn't match");
      return;
    }

    try {
      await this.authService.register(this.email, this.password);
      alert('Account created with success');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error :', error);
      alert('An error for making the account appeired');
    }
  }

  isFormValid(): boolean {
    return this.email.trim() !== '' && this.password.trim() !== '' && this.confirmPassword.trim() !== '';
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
