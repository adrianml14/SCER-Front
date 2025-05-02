import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      console.log('Register Data:', this.registerForm.value);
  
      const formData = this.registerForm.value; // Directamente toma los datos del formulario
  
      // Hacemos la solicitud POST al backend con los datos como JSON
      this.http.post('http://127.0.0.1:8000/api/users/register/', formData, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }), // Indicamos que los datos son JSON
        responseType: 'text' // Esperamos una respuesta de tipo texto
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