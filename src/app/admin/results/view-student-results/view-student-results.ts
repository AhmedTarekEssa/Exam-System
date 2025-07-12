import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultService, IExamResult } from '../../../core/admin-serveces/result-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ShortenIdPipe } from "../../../shared/pipes/shorten-id-pipe";

@Component({
  selector: 'app-view-student-results',
  standalone: true,
  imports: [CommonModule, RouterModule, ShortenIdPipe],
  templateUrl: './view-student-results.html',
  styleUrls: ['./view-student-results.css']
})
export class ViewStudentResults implements OnInit {
  examId!: number;
  results: IExamResult[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private resultService: ResultService
  ) {}

  ngOnInit(): void {
    this.examId = +this.route.snapshot.params['examId'];
    this.loadResults();
  }

  loadResults(): void {
  this.isLoading = true;
  this.error = null;

  this.resultService.getResultsByExam(this.examId).subscribe({
    next: (results) => {
      this.results = results.map(result => ({
        ...result,
        // Calculate percentage here
        percentage: this.calculatePercentage(result.score, result.totalPoints)
      }));
      this.isLoading = false;
    },
    error: (err) => {
      this.error = 'Failed to load results. Please try again later.';
      this.isLoading = false;
      console.error('Error loading results:', err);
    }
  });
}

// Add this method to your component
private calculatePercentage(score: number, totalPoints: number): number {
  if (totalPoints <= 0) return 0; // Prevent division by zero
  return Math.round((score / totalPoints) * 100);
}

  // Optional: If you need to fetch student names
  private loadStudentNames(results: IExamResult[]): void {
    const requests = results.map(result =>
      this.resultService.getStudentName(result.userId)
    );

    forkJoin(requests).subscribe({
      next: (names) => {
        this.results = results.map((result, index) => ({
          ...result,
          studentName: names[index].name,
          percentage: Math.round((result.score / result.totalPoints) * 100)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        this.results = results.map(result => ({
          ...result,
          percentage: Math.round((result.score / result.totalPoints) * 100)
        }));
        this.isLoading = false;
        console.error('Error loading student names:', err);
      }
    });
  }

  getDuration(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const durationMs = endDate.getTime() - startDate.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }
}
