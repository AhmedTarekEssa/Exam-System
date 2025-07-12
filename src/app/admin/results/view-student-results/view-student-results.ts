import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ResultService, IExamResult } from '../../../core/admin-serveces/result-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { ShortenIdPipe } from "../../../shared/pipes/shorten-id-pipe";
import { IExam } from '../../../shared/models/iexam';
import { ExamService } from '../../../core/admin-serveces/exam-service';

@Component({
  selector: 'app-view-student-results',
  standalone: true,
  imports: [CommonModule, RouterModule, ShortenIdPipe],
  templateUrl: './view-student-results.html',
  styleUrls: ['./view-student-results.css']
})
export class ViewStudentResults implements OnInit {
  exams: IExam[] = [];
  selectedExamId: number | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  selectedExam: IExam | null = null;
  results: IExamResult[] = [];

  constructor(
    private resultService: ResultService,
    private examService: ExamService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.error = null;

    this.examService.getAllExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load exams. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error loading exams:', err);
      }
    });
  }

  onExamChange(examId: number): void {
    this.selectedExamId = +examId;
    this.selectedExam = this.exams.find(e => e.id === this.selectedExamId) || null;
    this.loadResults();
  }

  loadResults(): void {
    if (!this.selectedExamId) {
      this.results = [];
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.resultService.getResultsByExam(this.selectedExamId).subscribe({
      next: (results) => {
        this.results = this.processResults(results);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load results. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Error loading results:', err);
      }
    });
  }

  private processResults(results: IExamResult[]): IExamResult[] {
    return results.map(result => ({
      ...result,
      studentName: result.user?.userName || result.user?.email || 'Unknown',
      percentage: this.calculatePercentage(result.score, result.totalPoints),
      duration: this.getDuration(result.startTime, result.endTime),
      status: this.getStatus(result.score, result.totalPoints)
    }));
  }

  private calculatePercentage(score: number, totalPoints: number): number {
    return totalPoints <= 0 ? 0 : Math.round((score / totalPoints) * 100);
  }

  private getStatus(score: number, totalPoints: number): 'completed' | 'incomplete' | 'failed' {
    const percentage = this.calculatePercentage(score, totalPoints);
    if (percentage >= 70) return 'completed';
    if (percentage >= 50) return 'incomplete';
    return 'failed';
  }

  getDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate.getTime() - startDate.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  countPassed(): number {
    return this.results.filter(r => (r.percentage ?? 0) >= 70).length;
  }

  countAverage(): number {
    return this.results.filter(r => (r.percentage ?? 0) >= 50 && (r.percentage ?? 0) < 70).length;
  }

  countFailed(): number {
    return this.results.filter(r => (r.percentage ?? 0) < 50).length;
  }
}
