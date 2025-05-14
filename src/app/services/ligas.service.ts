import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LigasService {
  private baseUrl = 'http://127.0.0.1:8000/api/ligas/';

  constructor(private http: HttpClient) {}

  crearLiga(nombre: string): Observable<any> {
    return this.http.post(`${this.baseUrl}`, { nombre }, {
      withCredentials: true
    });
  }

  obtenerMisLigas(): Observable<any> {
    return this.http.get(`${this.baseUrl}mis-ligas/`, {
      withCredentials: true
    });
  }

  agregarParticipante(ligaId: number, username: string): Observable<any> {
    return this.http.post(`${this.baseUrl}${ligaId}/participantes/`, { username }, {
      withCredentials: true
    });
  }

  eliminarParticipante(ligaId: number, username: string): Observable<any> {
    return this.http.request('delete', `${this.baseUrl}${ligaId}/participantes/`, {
      body: { username },
      withCredentials: true
    });
  }

  obtenerParticipantes(ligaId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${ligaId}/participantes-lista/`, {
      withCredentials: true
    });
  }

  unirsePorCodigo(codigo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}unirse-codigo/`, { codigo }, {
      withCredentials: true
    });
  }
  
  obtenerTodasLigas() {
    return this.http.get<any[]>(this.baseUrl);
  }

}
