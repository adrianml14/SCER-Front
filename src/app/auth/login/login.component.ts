import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
    console.log("LoginComponent constructor llamado");
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    document.body.classList.add('auth-background');
    this.http.get('http://127.0.0.1:8000/api/users/csrf/', {
      withCredentials: true
    }).subscribe({
      next: () => console.log('✅ CSRF cookie establecida correctamente.'),
      error: err => {
        console.error('❌ Error al obtener CSRF cookie:', err);
        this.errorMessage = 'Error al obtener token CSRF';
      }
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
    console.log(`Cookie no encontrada: ${name}`);
    return null;
  }

  onSubmit() {
    console.log("Formulario enviado");
    if (this.loginForm.valid) {
      console.log("Formulario válido");
      const { username, password } = this.loginForm.value;

      const csrfToken = this.getCookie('csrftoken');
      if (!csrfToken) {
        console.error('No se pudo obtener el token CSRF');
        this.errorMessage = 'No se pudo obtener el token CSRF. Intenta recargar la página.';
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      });

      console.log('Realizando petición POST para login');
      this.http.post(
        'http://127.0.0.1:8000/api/users/login/',
        { username, password },
        {
          headers,
          withCredentials: true,
          responseType: 'json'
        }
      ).subscribe({
        next: (response: any) => {
          console.log('Respuesta del servidor:', response);
          if (response && response.message === 'Login exitoso') {
            console.log('✅ Login exitoso');
            Swal.fire({
              title: "Login correcto",
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
              draggable: true,
                didClose: () => {
                  this.router.navigate(['/game/mi-equipo']);
                }
            });
          } else {
            console.log('Error en la respuesta del servidor:', response.message);
            this.errorMessage = response.message || 'Error desconocido';
          }
        },
        error: (err) => {
          console.error('❌ Error en el login:', err);
          this.errorMessage = err.error?.message || 'Error desconocido';
        }
      });
    } else {
      console.log("Formulario inválido");
      this.errorMessage = 'Por favor, completa los campos correctamente.';
    }
  }
}
