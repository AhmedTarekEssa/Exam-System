import { ResultService } from './../../../core/result-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IResult } from '../../../core/result-service';

@Component({
  selector: 'app-view-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-results.html',
  styleUrls: ['./view-results.css']
})
export class ViewResults implements OnInit {
  results: IResult[] = [];

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {
    this.resultService.getAllResults().subscribe({
      next: (data:any) => {
        this.results = data;
        console.log('Fetched Results:', data);
      },
      error: (err:any) => {
        console.error('Error fetching results:', err);
      }
    });
  }

  getGrade(score: number, total: number): string {
    const percent = (score / total) * 100;
    if (percent >= 90) return 'A';
    if (percent >= 80) return 'B';
    if (percent >= 70) return 'C';
    if (percent >= 60) return 'D';
    return 'F';
  }

  getStatus(score: number, total: number): string {
    const percent = (score / total) * 100;
    if (percent >= 90) return 'Excellent';
    if (percent >= 70) return 'Good';
    if (percent >= 50) return 'Pass';
    return 'Fail';
  }
}
