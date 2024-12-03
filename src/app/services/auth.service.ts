import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly mockEmail = 'admin@example.com';
  private readonly mockPassword = 'admin';

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    if (email === this.mockEmail && password === this.mockPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}
