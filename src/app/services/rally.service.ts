import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RallyService {

  private apiUrl = 'http://127.0.0.1:8000/api/rally'; // Ajusta según tu configuración

  constructor(private http: HttpClient) {}

  // Obtener lista de pilotos
  getPilotos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pilotos/`, { withCredentials: true });
  }

  // Obtener lista de copilotos
  getCopilotos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/copilotos/`, { withCredentials: true });
  }

  // Obtener lista de coches
  getCoches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/coches/`, { withCredentials: true });
  }

  // Obtener presupuesto del equipo fantasy
  getPresupuesto(): Observable<any> {
    return this.http.get(`${this.apiUrl}/presupuesto/`, { withCredentials: true });
  }
  
  comprarElemento(tipo: string, id: number): Observable<any> {
    const url = `${this.apiUrl}/comprar/${tipo}/${id}/`;
    return this.http.post(url, {}, { withCredentials: true });
  }

  venderElemento(tipo: 'piloto' | 'copiloto' | 'coche', id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/vender/${tipo}/${id}/`, {});
  }

  //obtener mi equipo
  getMisPilotos() {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/rally/mis-pilotos/', { withCredentials: true });
  }
  
  getMisCopilotos() {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/rally/mis-copilotos/', { withCredentials: true });
  }
  
  getMisCoches() {
    return this.http.get<any[]>('http://127.0.0.1:8000/api/rally/mis-coches/', { withCredentials: true });
  }
} 
