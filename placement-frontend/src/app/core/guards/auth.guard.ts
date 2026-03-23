import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/auth-storage.service';

export const authGuard: CanActivateFn = () => {
  const authStorage = inject(AuthStorageService);
  const router = inject(Router);

  if (authStorage.isLoggedIn()) {
    return true;
  }

  // Not logged in → redirect to login page
  router.navigate(['/login']);
  return false;
};