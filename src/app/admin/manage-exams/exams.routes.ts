
import { Routes } from '@angular/router';
import { AddEditExam } from './add-edit-exam/add-edit-exam';
import { ExamList } from './exam-list/exam-list';

export const routes: Routes = [
  { path: '', component: ExamList },
  { path: 'add', component: AddEditExam },
  { path: 'edit/:id', component: AddEditExam },


];
