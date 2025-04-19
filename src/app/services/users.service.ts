import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/User'; // Importamos la interfaz

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}register/`, user).pipe(
      catchError(this.handleError)
    );
  }

  // Método para hacer login
  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { email, password }).pipe(
      catchError(this.handleError)
    );
  }

  // Método para guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para hacer logout
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Manejo de errores en las peticiones HTTP
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  // Método para obtener los encabezados con el token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Token ${token}` : ''
    });
  }
}
