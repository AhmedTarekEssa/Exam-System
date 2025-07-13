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
  TakenExamIds: Set<number> = new Set();

  constructor(private examSer: ExamService, private router: Router, private route: ActivatedRoute) {
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
    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    // Load all exams
    this.examSer.getAllExams().subscribe({
      next: (data) => {
        this.ExamLists = data;

        // Load taken exams after exam list
        this.examSer.getStudentResults().subscribe({
          next: (results) => {
            this.TakenExamIds = new Set(results.map(r => r.examId));
          },
          error: (err) => {
            console.error('Failed to load student results', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to load exams', err);
      }
    });
  }

  hasTakenExam(examId: number): boolean {
    return this.TakenExamIds.has(examId);
  }

  startExam(examId: number): void {
    if (this.hasTakenExam(examId)) {
      alert("You've already taken this exam.");
      return;
    }

    this.examSer.startExam(examId).subscribe({
      next: (res) => {
        this.router.navigate(['/student/exams/take', res.resultId]);
      },
      error: (err) => {
        console.error('Failed to start exam', err);
        alert('Could not start the exam. Please try again.');
      }
    });
  }
}

