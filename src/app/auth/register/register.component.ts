import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';  // Importa HttpClient para las peticiones HTTP
import { Router } from '@angular/router';  // Para redirigir después de un registro exitoso

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log('Register Data:', this.registerForm.value);

      const formData = new URLSearchParams(); // Creamos los parámetros de la URL
      formData.set('name', this.registerForm.value.username);
      formData.set('email', this.registerForm.value.email);
      formData.set('password', this.registerForm.value.password);

      // Hacemos la solicitud POST al backend con los datos como URLSearchParams
      this.http.post('http://127.0.0.1:8000/register/', formData.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), // Indicamos el tipo de contenido
        responseType: 'text' // Le indicamos que esperamos una respuesta de tipo texto
      })
      .subscribe(
        (response) => {
          console.log('Registro exitoso:', response);
          alert('Registro exitoso');
        },
        (error) => {
          console.error('Error en el registro:', error);
          alert('Error al registrar');
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }
}