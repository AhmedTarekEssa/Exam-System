import { Component, OnInit } from '@angular/core';
import { IExam } from '../../../shared/models/iexam';

import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IStudentResponse } from '../../../shared/models/istudent-response';
import { ExamService } from '../../../core/ExamService/exam-service';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-list.html',
  styleUrl: './exam-list.css'
})
export class ExamList implements OnInit {

  ExamLists: IExam[] = [];

  constructor(private examSer: ExamService, private router: Router,private route: ActivatedRoute) {
    // Re-fetch data on route re-entry
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadExams();
      });
  }

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams() {
    this.examSer.getAllExams().subscribe({
      next: (data) => this.ExamLists = data,
      error: (err) => console.error('Failed to load exams', err)
    });
  }

startExam(examId: number): void {
  this.examSer.startExam(examId).subscribe({
    next: (res) => {
      console.log(examId);
      console.log('Started exam with resultId:', res.resultId);
this.router.navigate(['/student/exams/take', res.resultId]);
// ✅ Just this
    },
    error: (err: any) => {
      console.error('Failed to start exam', err);
      alert('Could not start the exam. Please try again.');
    }
  });
}




}
