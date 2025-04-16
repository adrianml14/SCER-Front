import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Obtener CSRF cookie al cargar el componente
    this.http.get('http://127.0.0.1:8000/api/users/csrf/', {
      withCredentials: true
    }).subscribe({
      next: () => console.log('✅ CSRF cookie establecida correctamente.'),
      error: err => console.error('❌ Error al obtener CSRF cookie:', err)
    });
  }

  getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const csrfToken = this.getCookie('csrftoken'); // Obtenemos el token de la cookie

      this.http.post(
        'http://127.0.0.1:8000/api/users/login/',
        { email, password },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || ''
          }),
          withCredentials: true,
          responseType: 'text'
        }
      ).subscribe({
        next: (response: string) => {
          if (response === 'Login exitoso') {
            console.log('✅ Login exitoso');
            alert('Login exitoso');
            this.router.navigate(['/game']);
          } else {
            this.errorMessage = response;
          }
        },
        error: (err) => {
          console.error('❌ Error en el login:', err);
          this.errorMessage = err.error || 'Error desconocido';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa los campos correctamente.';
    }
  }
}