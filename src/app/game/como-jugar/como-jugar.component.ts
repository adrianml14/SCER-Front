import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-como-jugar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './como-jugar.component.html',
  styleUrl: './como-jugar.component.css'
})
export class ComoJugarComponent {

  constructor(public translate: TranslateService) {
  }

scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
}
