import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {

  private readonly TOKEN_KEY = 'placement_token';
  private readonly USER_KEY  = 'placement_user';

  // Save token and user info after login
  saveAuth(auth: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, auth.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(auth));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthResponse | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  getUserId(): number | null {
    return this.getUser()?.userId ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Call this on logout
  clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}