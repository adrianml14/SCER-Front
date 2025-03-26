import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Importamos el módulo HttpClientModule
import { HttpClientModule } from '@angular/common/http'; 

// Configuración de la aplicación
bootstrapApplication(AppComponent, {
  providers: [
    HttpClientModule,  // Asegúrate de importar HttpClientModule
    ...appConfig.providers,  // Asegúrate de incluir los proveedores de appConfig
  ]
}).catch((err) => console.error(err));