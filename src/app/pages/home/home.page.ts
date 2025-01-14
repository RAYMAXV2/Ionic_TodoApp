import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html', 
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true,
})
export class HomePage {

  constructor(private router: Router) {}

  /**
   * Go to the login page
   */
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
