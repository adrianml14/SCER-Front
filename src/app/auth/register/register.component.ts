import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router // ✅ Aseguramos que Router esté disponible
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    document.body.classList.add('auth-background');
  }

onSubmit() {
  if (this.registerForm.valid) {
    const formData = this.registerForm.value;

    this.http.post('http://127.0.0.1:8000/api/users/register/', formData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text'
    })
    .subscribe(
      () => {
        // Registro exitoso
        Swal.fire({
          title: `¡Bienvenido ${formData.username}!`,
          text: 'Tu cuenta fue creada correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });

        // 1. Obtener CSRF
        this.http.get('http://127.0.0.1:8000/api/users/csrf/', {
          withCredentials: true
        }).subscribe({
          next: () => {
            const csrfToken = this.getCookie('csrftoken');
            if (!csrfToken) {
              Swal.fire({
                title: 'Error',
                text: 'No se pudo obtener el token CSRF.',
                icon: 'error'
              });
              return;
            }

            // 2. Login automático
            const headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken
            });

            this.http.post('http://127.0.0.1:8000/api/users/login/', {
              username: formData.username,
              password: formData.password
            }, {
              headers,
              withCredentials: true
            }).subscribe({
              next: () => {
                // 3. Redirigir a /game/como-jugar
                this.router.navigate(['/game/como-jugar']);
              },
              error: (loginErr) => {
                console.error('❌ Error en login automático:', loginErr);
                Swal.fire({
                  title: 'Login automático fallido',
                  text: 'Tu cuenta fue creada pero debes iniciar sesión manualmente.',
                  icon: 'warning'
                });
              }
            });
          },
          error: (csrfErr) => {
            console.error('❌ Error al obtener CSRF:', csrfErr);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo obtener CSRF. Intenta recargar la página.',
              icon: 'error'
            });
          }
        });
      },
      (error) => {
        console.error('❌ Error en el registro:', error);
        Swal.fire({
          title: 'Error al registrar',
          text: error?.error || 'Ocurrió un problema inesperado.',
          icon: 'error',
        });
      }
    );
  } else {
    Swal.fire({
      title: 'Formulario inválido',
      text: 'Completa todos los campos correctamente.',
      icon: 'warning'
    });
  }
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

}
