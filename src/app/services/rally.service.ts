import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RallyService {

  private apiUrl = 'http://127.0.0.1:8000/api/rally'; // Asegúrate de que esta URL sea correcta para tu backend

  constructor(private http: HttpClient) {}

  // Obtener lista de pilotos
  getPilotos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pilotos/`);
  }

  // Obtener lista de copilotos
  getCopilotos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/copilotos/`);
  }

  // Obtener lista de coches
  getCoches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/coches/`);
  }

  // Obtener presupuesto del equipo fantasy
  getPresupuesto(): Observable<any> {
    this.logSessionCookie();
    return this.http.get(`${this.apiUrl}/presupuesto/`, { withCredentials: true });
  }

  // Función para comprar un elemento (piloto, copiloto o coche)
  comprarElemento(tipoSeleccionado: string, id: any): Observable<any> {
    // Hacer una petición POST al backend para comprar el elemento
    return this.http.post<any>(`${this.apiUrl}/${tipoSeleccionado}/${id}/comprar/`, {}, { withCredentials: true });
  }

  // Función para obtener la cookie de la sesión
  getSessionCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  // Verificar la cookie de sesión
  logSessionCookie() {
    const sessionCookie = this.getSessionCookie('sessionid');  // Usualmente Django usa 'sessionid' como nombre de la cookie
    if (sessionCookie) {
      console.log('Cookie de sesión:', sessionCookie);
    } else {
      console.log('No se encontró la cookie de sesión');
    }
  }
}
