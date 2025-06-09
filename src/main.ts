import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { csrfInterceptor } from './app/auth/csrf.interceptor';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([csrfInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-ES' },
    ...appConfig.providers
  ],
}).catch((err) => console.error(err));
