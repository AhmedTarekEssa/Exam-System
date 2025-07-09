// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { ViewStudentResults } from './results/view-student-results/view-student-results';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'exams', loadChildren: () => import('./manage-exams/exams.routes').then(m => m.routes) },
  { path: 'questions', loadChildren: () => import('./manage-questions/questions.routes').then(m => m.routes) },
  { path: 'results', component: ViewStudentResults }
];
