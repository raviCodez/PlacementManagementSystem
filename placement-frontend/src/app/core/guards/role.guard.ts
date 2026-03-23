import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStorageService } from '../services/auth-storage.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authStorage = inject(AuthStorageService);
    const router = inject(Router);
    const role = authStorage.getRole();

    if (role && allowedRoles.includes(role)) {
      return true;
    }

    // Logged in but wrong role → redirect to their dashboard
    router.navigate(['/unauthorized']);
    return false;
  };
};