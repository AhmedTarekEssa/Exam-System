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
        loadComponent: () => import('./../student/dashboard/dashboard-content/dashboard-content').then(m => m.DashboardContent),
        title: 'Dashboard'
      },
      {
        path: 'exams',
        loadComponent: () => import('./exams/exam-list/exam-list').then(m => m.ExamList),
        title: 'Exams'
      },


      {
        path: 'results',
        loadComponent: () => import('./results/view-results/view-results').then(m => m.ViewResults),
        title: 'Results'
      }
    ]
  },
  {
    path: 'exams/take/:resultId', // Add this route for taking a specific exam
    loadComponent: () => import('./exams/take-exam/take-exam').then(m => m.TakeExam),
    title: 'Take Exam'
  },
  {
    path: 'exams/submit',
    loadComponent: () => import('./exams/submit-exam/submit-exam').then(m => m.SubmitExam),
    title: 'Submit Exam'
  }
];
