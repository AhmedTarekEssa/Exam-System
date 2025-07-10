import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth } from './auth';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const currentRole = this.auth.getRole();

    if (expectedRole.toLowerCase() !== currentRole?.toLowerCase().toLocaleLowerCase()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}
