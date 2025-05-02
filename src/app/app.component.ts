import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ToolbarComponent } from './game/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'SCER-Front';
  showToolbar = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const isAuthRoute = event.urlAfterRedirects.startsWith('/login') || event.urlAfterRedirects.startsWith('/register');

        this.showToolbar = !isAuthRoute;

        if (isAuthRoute) {
          document.body.classList.add('auth-background');
        } else {
          document.body.classList.remove('auth-background');
          
        }
      });
  }
}
