import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    TranslateModule,
    MatButtonToggleModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  verPassword: boolean = false;
  selectedLang = 'es'; // idioma por defecto
  submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private translate: TranslateService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Detectar idioma del navegador
    const browserLang = translate.getBrowserLang();
    this.selectedLang = browserLang && ['es', 'en'].includes(browserLang) ? browserLang : 'es';
    this.translate.use(this.selectedLang);
  }

  ngOnInit(): void {
    document.body.classList.add('auth-background');
  }

  changeLanguage(lang: string) {
    this.selectedLang = lang;
    this.translate.use(lang);
  }

  isInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    if (!control) return false;
    return control.invalid && (control.touched || control.dirty || this.submitted);
  }

  onSubmit() {
    this.submitted = true;

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
            title: this.translate.instant('register.successTitle', { username: formData.username }),
            text: this.translate.instant('register.successText'),
            icon: 'success',
            timer: 1000,
            showConfirmButton: false
          });

          // Obtener CSRF y login automático
          this.http.get('http://127.0.0.1:8000/api/users/csrf/', {
            withCredentials: true
          }).subscribe({
            next: () => {
              const csrfToken = this.getCookie('csrftoken');
              if (!csrfToken) {
                Swal.fire({
                  title: this.translate.instant('errors.csrf.title'),
                  text: this.translate.instant('errors.csrf.text'),
                  icon: 'error'
                });
                return;
              }

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
                  this.router.navigate(['/game/como-jugar']);
                },
                error: (loginErr) => {
                  console.error('❌ Error en login automático:', loginErr);
                  Swal.fire({
                    title: this.translate.instant('register.autoLoginFailed.title'),
                    text: this.translate.instant('register.autoLoginFailed.text'),
                    icon: 'warning'
                  });
                }
              });
            },
            error: (csrfErr) => {
              console.error('❌ Error al obtener CSRF:', csrfErr);
              Swal.fire({
                title: this.translate.instant('errors.csrf.title'),
                text: this.translate.instant('errors.csrf.text'),
                icon: 'error'
              });
            }
          });
        },
        (error) => {
          console.error('❌ Error en el registro:', error);
          Swal.fire({
            title: this.translate.instant('register.errorTitle'),
            text: error?.error || this.translate.instant('errors.unknown'),
            icon: 'error',
          });
        }
      );
    } else {
      Swal.fire({
        title: this.translate.instant('register.invalidForm.title'),
        text: this.translate.instant('register.invalidForm.text'),
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
