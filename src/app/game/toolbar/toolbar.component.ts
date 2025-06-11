import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { RouterModule } from '@angular/router';

// Importa TranslateService
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-barra',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonToggleModule, RouterModule, TranslateModule],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  selectedLang = 'es'; // idioma por defecto

  constructor(private translate: TranslateService) {
    // Detecta idioma del navegador y lo usa si es 'es' o 'en'
    const browserLang = translate.getBrowserLang();
    this.selectedLang = browserLang && ['es', 'en'].includes(browserLang) ? browserLang : 'es';
    this.translate.use(this.selectedLang);
  }

  changeLanguage(lang: string) {
    this.selectedLang = lang;
    this.translate.use(lang);
  }
}
