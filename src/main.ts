import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { csrfInterceptor } from './app/auth/csrf.interceptor';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';

// ngx-translate imports
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

registerLocaleData(localeEs);

// Factory para crear el loader que carga JSONs de i18n
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/traducciones/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([csrfInterceptor])),
    { provide: LOCALE_ID, useValue: 'es-ES' },
    // Evitamos error si appConfig.providers es undefined
    ...(appConfig.providers ?? []),
    // Proveemos TranslateModule con loader
    ...TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }).providers ?? [],
  ],
}).catch((err) => console.error(err));
