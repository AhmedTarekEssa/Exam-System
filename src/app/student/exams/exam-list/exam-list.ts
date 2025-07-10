import { Component, OnInit } from '@angular/core';
import { IExam } from '../../../shared/models/iexam';
import { ExamService } from '../../../core/exam-service';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-list.html',
  styleUrl: './exam-list.css'
})
export class ExamList implements OnInit {

  ExamLists: IExam[] = [];

  constructor(private examSer: ExamService, private router: Router) {
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
}
