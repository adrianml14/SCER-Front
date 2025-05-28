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
        (response) => {
          console.log('Registro exitoso:', response);
          Swal.fire({
            title: `¡Bienvenido ${formData.username}!`,
            text: 'Tu cuenta fue creada correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
            didClose: () => {
              this.router.navigate(['/login']);
            }
          });
        },
        (error) => {
          console.error('Error en el registro:', error);
          Swal.fire({
            title: 'Error al registrar',
            text: error?.error || 'Ocurrió un problema inesperado.',
            icon: 'error',
          });
        }
      );
    } else {
      console.log('Formulario inválido');
      Swal.fire({
        title: 'Formulario inválido',
        text: 'Completa todos los campos correctamente.',
        icon: 'warning'
      });
    }
  }
}
