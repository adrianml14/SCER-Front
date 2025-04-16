import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export const csrfInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const csrfToken = getCookie('csrftoken');
  if (csrfToken) {
    const cloned = req.clone({
      headers: req.headers.set('X-CSRFToken', csrfToken),
      withCredentials: true
    });
    return next(cloned);
  }
  return next(req);
};

function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (const c of ca) {
    const trimmed = c.trim();
    if (trimmed.indexOf(nameEQ) === 0) {
      return trimmed.substring(nameEQ.length);
    }
  }
  return null;
}
