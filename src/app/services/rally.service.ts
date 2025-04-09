import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // lo hace global para que puedas usarlo sin declararlo manualmente
})
export class RallyService {

  private apiUrl = 'http://localhost:8000/api/rally'; // tu backend de Django

  constructor(private http: HttpClient) {}

  getPilotos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pilotos/`);
  }

  getCopilotos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/copilotos/`);
  }

  getCoches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/coches/`);
  }
}
