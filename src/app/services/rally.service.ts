import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // Obtener presupuesto del equipo fantasy (con token en encabezados)
  getPresupuesto(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`, // Autenticación usando el token
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(`${this.apiUrl}/presupuesto/`, { headers });
  }

  // Función para comprar un elemento (piloto, copiloto o coche)
  comprarElemento(tipo: string, id: number, token: string): Observable<any> {
    const url = `${this.apiUrl}/comprar/${tipo}/${id}/`;
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(url, {}, { headers });
  }
}
