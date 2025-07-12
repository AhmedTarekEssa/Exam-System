import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewResults } from './results/view-results/view-results';
import { SubmitExam } from './exams/submit-exam/submit-exam';
import { TakeExam } from './exams/take-exam/take-exam';
import { ExamList } from './exams/exam-list/exam-list';
import { Dashboard } from './dashboard/dashboard';
import { AuthGuard } from '../core/auth-guard';


const routes: Routes = [
  {
    path: '',
    component: Dashboard, // ✅ this acts as the layout
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'results', pathMatch: 'full' },
      { path: 'exams', component: ExamList },
      { path: 'exams/take/:resultId', component: TakeExam },
      { path: 'exams/submit', component: SubmitExam },
      { path: 'results', component: ViewResults },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
