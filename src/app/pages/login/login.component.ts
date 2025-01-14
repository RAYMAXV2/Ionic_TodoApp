import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Login in the app
   */
  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/todolist']);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Connexion problem');
    }
  }

  /**
   * Goes to register page
   */
  register() {
    this.router.navigate(['/register']);
  
  }
}
