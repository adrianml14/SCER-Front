import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToolbarComponent } from './game/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SCER-Front';
  showToolbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.showToolbar = !this.router.url.startsWith('/login') && !this.router.url.startsWith('/register');
    });
  }
}
