import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/users/';

  constructor(private http: HttpClient) {}

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}register/`, user, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { email, password }, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  logout(): void {
    this.http.post(`${this.apiUrl}logout/`, {}, { withCredentials: true }).subscribe();
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}, Mensaje: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  getPerfil() {
    return this.http.get<any>(`${this.apiUrl}me/`, {
      withCredentials: true
    });
  }

  toggleRol(): Observable<any> {
    return this.http.post(`${this.apiUrl}cambiar-rol/`, {}, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }

  toggleAdmin(data: { clave?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}cambiar-admin/`, data, {
      withCredentials: true
    }).pipe(catchError(this.handleError));
  }


  
}
