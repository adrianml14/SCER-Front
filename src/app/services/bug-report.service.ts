import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BugReport {
  descripcion: string;
  resuelto?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BugReportService {

  private apiUrl = 'http://127.0.0.1:8000/api/bug_reports/report/';

  constructor(private http: HttpClient) { }

  enviarReporte(bug: BugReport): Observable<any> {
    return this.http.post(this.apiUrl, bug);
  }
}
