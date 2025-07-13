import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';


export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./../admin/dashboard/dasboard-content/dasboard-content').then(m => m.DashboardContent),
        title: 'Dashboard'
      },
      {
        path: 'exams',
        loadChildren: () => import('./manage-exams/exams.routes').then(m => m.routes),
        title: 'Exams'
      },
      {
        path: 'questions',
        loadChildren: () => import('./manage-questions/questions.routes').then(m => m.routes),
        title: 'Questions'
      },
      {
        path: 'results',
        loadComponent: () => import('./results/view-student-results/view-student-results').then(m => m.ViewStudentResults),
        title: 'Results'
      }
    ]
  }
];
