import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  template: `
    <div style="text-align:center; padding: 80px 20px;">
      <h1 style="font-size: 4rem;">🚫</h1>
      <h2>Access Denied</h2>
      <p>You don't have permission to view this page.</p>
      <button mat-raised-button color="primary" routerLink="/login">
        Go to Login
      </button>
    </div>
  `
})
export class UnauthorizedComponent {}