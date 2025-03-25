// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User }  from './models/User'; // Importamos la interfaz

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000'; // URL de tu backend

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}register/`, user);
  }

  // Método para hacer login
  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}login/`, { email, password });
  }
}
