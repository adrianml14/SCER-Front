import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BugReport {
  id?: number;
  descripcion: string;
  fecha?: string;
  resuelto?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BugReportService {

  private apiBaseUrl = 'http://127.0.0.1:8000/api/bug_reports/';

  constructor(private http: HttpClient) { }

  enviarReporte(bug: BugReport): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}report/`, bug);
  }

  obtenerTodos(): Observable<BugReport[]> {
    return this.http.get<BugReport[]>(`${this.apiBaseUrl}bugs/`);
  }

  eliminarBug(id: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}bugs/${id}/`);
  }

  cambiarEstadoResuelto(id: number, resuelto: boolean): Observable<any> {
    return this.http.patch(`${this.apiBaseUrl}bugs/${id}/`, { resuelto });
  }
}
