import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewResults } from './results/view-results/view-results';
import { SubmitExam } from './exams/submit-exam/submit-exam';
import { TakeExam } from './exams/take-exam/take-exam';
import { ExamList } from './exams/exam-list/exam-list';
import { Dashboard } from './dashboard/dashboard';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {

}
export const studentRoutes: Routes = [
  { path: '', component: Dashboard },
  { path: 'exams', component: ExamList },
  { path: 'exams/take/:id', component: TakeExam },
  { path: 'exams/submit', component: SubmitExam },
  { path: 'results', component: ViewResults },
];
