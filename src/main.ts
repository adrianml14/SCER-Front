import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http'; // 👈 IMPORTA ESTO
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(), // ✅ ESTA ES LA CLAVE
    ...appConfig.providers,
  ],
}).catch((err) => console.error(err));
