import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {

  showNavbar = false;

  // Pages where navbar should NOT appear
  private hideNavbarRoutes = ['/login', '/register', '/unauthorized'];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !this.hideNavbarRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}