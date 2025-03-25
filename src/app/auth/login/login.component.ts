import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Definimos el formulario
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Inicializamos el formulario con validaciones
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Email requerido y con formato
      password: ['', [Validators.required, Validators.minLength(6)]] // Contraseña mínima de 6 caracteres
    });
  }

  // Método para acceder a los controles del formulario de manera más sencilla
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  // Método que se ejecuta al enviar el formulario
  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login Data:', this.loginForm.value);
      alert('Login exitoso');
    } else {
      console.log('Formulario inválido');
    }
  }
}
