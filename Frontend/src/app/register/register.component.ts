import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
public firstName: string = "";
  public lastName: string = "";
  public email: string = "";
  public password: string = "";
  public confirmPassword: string = "";
  public message: string = "";

  constructor(private http: HttpClient, private router: Router) {}

  goBack() {
    this.router.navigate(['/login']);
  }

  register() {
    if (this.password !== this.confirmPassword) {
      this.message = "Las contraseñas no coinciden.";
      return;
    }

    const url = "http://localhost:6542/api/register";
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const body = {
      name: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: "User",
    };

    this.http.post(url, body, { headers }).subscribe({
      next: (resp: any) => {
        this.message = resp.message || "Usuario registrado satisfactoriamente.";
        this.firstName = "";
        this.lastName = "";
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
      },
      error: err => {
        console.error(err);
        this.message = "Error al registrar el usuario.";
      }
    });
  }
}
