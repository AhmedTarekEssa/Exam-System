import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../core/admin-serveces/exam-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IExam } from '../../../shared/models/iexam';
import { IQuestion } from '../../../shared/models/iquestion';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, RouterModule], // Added RouterModule here
  templateUrl: './question-list.html',
  styleUrls: ['./question-list.css']
})
export class QuestionList implements OnInit {
  exams: IExam[] = [];
  selectedExamId: number | null = null;
  questions: IQuestion[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  selectedExam: IExam | null = null;

  constructor(
    private examService: ExamService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();

    // Watch for route changes
    this.route.params.subscribe(params => {
      this.selectedExamId = params['examId'] ? +params['examId'] : null;
      this.loadSelectedExamData();
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.examService.getAllExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.isLoading = false;
        this.loadSelectedExamData();
      },
      error: (err) => {
        this.error = 'Failed to load exams. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadSelectedExamData(): void {
    if (!this.selectedExamId) {
      this.questions = [];
      this.selectedExam = null;
      this.cdr.detectChanges();
      return;
    }

    this.isLoading = true;
    this.examService.getExamById(this.selectedExamId).subscribe({
      next: (exam) => {
        this.selectedExam = exam;
        this.questions = exam.questions || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load exam questions. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onExamSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const examId = select.value ? +select.value : null;
    this.selectedExamId = examId;
    this.loadSelectedExamData();
    // Navigate to the question list for the selected exa

    if (examId) {
      console.log('Navigating to exam:', examId);
      this.selectedExamId = examId;
      // this.router.navigate(['/admin/exams', examId, 'questions']);
    } else {
      console.log('No exam selected, navigating to question list');
      // this.router.navigate(['/admin/exams/questions']);
    }
  }
}
