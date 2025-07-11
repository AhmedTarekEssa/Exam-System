import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth-guard';
import { RoleGuard } from './core/role-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.routes),
  },
  {
    path: 'student',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'student' },
    loadChildren: () => import('./student/student.routes').then(m => m.routes),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./admin/admin.routes').then(m => m.routes),
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: '#',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'Admin',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];
