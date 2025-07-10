import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing-module';
import { ExamList } from './exams/exam-list/exam-list';
import { ViewResults } from './results/view-results/view-results';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StudentRoutingModule,
    ExamList,
    ViewResults,
  ]
})
export class StudentModule { }
