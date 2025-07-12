import { Routes } from '@angular/router';
import { AddEditQuestion } from './add-edit-question/add-edit-question';
import { QuestionList } from './question-list/question-list';

export const routes: Routes = [
  { path: '', component: QuestionList },
  // { path: 'add', component: AddEditQuestion },
  // { path: 'edit/:id', component: AddEditQuestion },
  { path: 'add-question/:examId',component: AddEditQuestion },
  { path: 'edit-question/exams/:examId/:questionId', component: AddEditQuestion }
];
