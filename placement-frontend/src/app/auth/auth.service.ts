import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../core/models/api-response.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../core/models/auth.model';
import { AuthStorageService } from '../core/services/auth-storage.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private authStorage: AuthStorageService,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/login`, credentials
    ).pipe(
      tap(response => {
        if (response.success) {
          // Save token and user info to localStorage
          this.authStorage.saveAuth(response.data);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.apiUrl}/register`, data
    ).pipe(
      tap(response => {
        if (response.success) {
          this.authStorage.saveAuth(response.data);
        }
      })
    );
  }

  logout(): void {
    this.authStorage.clearAuth();
    this.router.navigate(['/login']);
  }

  // After login, redirect user based on their role
  redirectByRole(): void {
    const role = this.authStorage.getRole();
    switch (role) {
      case 'ADMIN':             this.router.navigate(['/admin/dashboard']); break;
      case 'PLACEMENT_TEAM':    this.router.navigate(['/placement/dashboard']); break;
      case 'DEPARTMENT_COORDINATOR': this.router.navigate(['/coordinator/dashboard']); break;
      case 'STUDENT':           this.router.navigate(['/student/dashboard']); break;
      default:                  this.router.navigate(['/login']);
    }
  }
}