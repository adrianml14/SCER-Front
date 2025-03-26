import { Component } from '@angular/core';
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
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ''; // Mensaje de error si ocurre uno

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // Definir la estructura del formulario
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Creamos los parámetros de la URL para enviar como x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.set('email', email);
      formData.set('password', password);

      // Hacemos la solicitud POST al backend con los datos como URLSearchParams
      this.http.post('http://127.0.0.1:8000/login/', formData.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }), // Configuramos el tipo de contenido
        responseType: 'text' // Esperamos una respuesta de tipo texto
      })
      .subscribe({
        next: (response) => {
          if (response === 'Login exitoso') {
            console.log('Login exitoso:', response);
            alert('Login exitoso');
            this.router.navigate(['/game']); // Redirigir al juego o a otra página
          } else {
            this.errorMessage = response; // Mostrar el mensaje de error
          }
        },
        error: (err) => {
          console.error('Error en el login:', err);
          this.errorMessage = err.error || 'Error desconocido';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa los campos correctamente.';
    }
  }
}
