import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rolGuard = (...roles: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }
  if (auth.tieneRol(...roles)) {
    return true;
  }
  return router.createUrlTree(['/home']);   // sin permiso: de vuelta al home
};