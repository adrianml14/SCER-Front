import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { csrfInterceptor } from './app/auth/csrf.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([csrfInterceptor])  // Aquí simplemente pasas la clase del interceptor
    ),
    ...appConfig.providers
  ],
}).catch((err) => console.error(err));
