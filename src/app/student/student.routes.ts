import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { ExamList } from './exams/exam-list/exam-list';
import { TakeExam } from './exams/take-exam/take-exam';
import { SubmitExam } from './exams/submit-exam/submit-exam';
import { ViewResults } from './results/view-results/view-results';

export const routes: Routes = [
{ path: '', component: Dashboard },
{ path: 'exams', component: ExamList },
{ path: 'exams/take/:id', component: TakeExam },
{ path: 'exams/submit', component: SubmitExam },
{ path: 'results', component: ViewResults },
];

