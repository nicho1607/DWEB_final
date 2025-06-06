import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public email: string = '';
  public password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  login(): void {
    const url = "http://localhost:6542/api/login";
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email: this.email, password: this.password };

    this.http.post<{ token: string }>(url, body, { headers }).subscribe({
      next: (resp) => {
        sessionStorage.setItem('token', resp.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error en login:', err);
      }
    });
  }
}
