import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ExamService } from '../../../core/ExamService/exam-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-content',
  templateUrl: './dashboard-content.html',
  styleUrl: './dashboard-content.css',
  standalone: true,
  imports: [CommonModule]
})
export class DashboardContent implements OnInit {
  @ViewChild('performanceChart') performanceChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('distributionChart') distributionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('analysisChart') analysisChartRef!: ElementRef<HTMLCanvasElement>;

  UserInfo: any;
  UserName!: string | null;

  analysis: {
    totalExams: number;
    averageScore: number;
    bestScore: number;
    lowestScore: number;
    successRate: number;
  } | null = null;

  performanceChart: Chart | null = null;
  distributionChart: Chart | null = null;
  trendChart: Chart | null = null;
  analysisChart: Chart | null = null;

  constructor(private examService: ExamService) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      this.UserInfo = JSON.parse(storedUser);
      this.UserName = this.UserInfo.username;
    }

    this.loadStudentAnalysis();
  }

  loadStudentAnalysis() {
    this.examService.getStudentResults().subscribe({
      next: (results) => {
        if (results.length === 0) {
          this.analysis = {
            totalExams: 0,
            averageScore: 0,
            bestScore: 0,
            lowestScore: 0,
            successRate: 0
          };
          return;
        }

        const totalExams = results.length;
        const percentages = results.map(r => (r.score / r.totalPoints) * 100);
        const totalScore = percentages.reduce((a, b) => a + b, 0);
        const bestScore = Math.max(...percentages);
        const lowestScore = Math.min(...percentages);
        const successCount = percentages.filter(p => p >= 50).length;

        this.analysis = {
          totalExams,
          averageScore: +(totalScore / totalExams).toFixed(2),
          bestScore: +bestScore.toFixed(2),
          lowestScore: +lowestScore.toFixed(2),
          successRate: +(successCount / totalExams * 100).toFixed(2)
        };

        setTimeout(() => {
          if (
            this.performanceChartRef &&
            this.distributionChartRef &&
            this.trendChartRef &&
            this.analysisChartRef
          ) {
            this.renderCharts(percentages);
          }
        }, 100);
      },
      error: (err) => {
        console.error('Failed to load student results for analysis', err);
      }
    });
  }

  renderCharts(percentages: number[]) {
    const data = this.analysis!;
    const consistency = 100 - (data.bestScore - data.lowestScore);
    const chartOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } }
    };

    this.performanceChart?.destroy();
    this.distributionChart?.destroy();
    this.trendChart?.destroy();
    this.analysisChart?.destroy();

    this.performanceChart = new Chart(this.performanceChartRef.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: ['Total Exams', 'Average Score', 'Best Score', 'Success Rate', 'Consistency'],
        datasets: [{
          label: 'Performance Metrics',
          data: [
            (data.totalExams / 30) * 100,
            data.averageScore,
            data.bestScore,
            data.successRate,
            consistency
          ],
          backgroundColor: 'rgba(102, 126, 234, 0.7)',
          borderRadius: 5
        }]
      },
      options: {
        ...chartOptions,
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    });

    const scoreGroups = [0, 0, 0, 0];
    for (const score of percentages) {
      if (score >= 90) scoreGroups[0]++;
      else if (score >= 70) scoreGroups[1]++;
      else if (score >= 50) scoreGroups[2]++;
      else scoreGroups[3]++;
    }

    this.distributionChart = new Chart(this.distributionChartRef.nativeElement.getContext('2d')!, {
      type: 'pie',
      data: {
        labels: ['Excellent (90-100%)', 'Good (70-89%)', 'Average (50-69%)', 'Poor (<50%)'],
        datasets: [{
          data: scoreGroups,
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#f44336']
        }]
      },
      options: chartOptions
    });

    this.trendChart = new Chart(this.trendChartRef.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: percentages.map((_, i) => `Exam ${i + 1}`),
        datasets: [{
          label: 'Score %',
          data: percentages,
          backgroundColor: 'rgba(102, 126, 234, 0.7)',
          borderRadius: 5
        }]
      },
      options: {
        ...chartOptions,
        scales: {
          y: { beginAtZero: true, max: 100 }
        }
      }
    });

    this.analysisChart = new Chart(this.analysisChartRef.nativeElement.getContext('2d')!, {
      type: 'polarArea',
      data: {
        labels: ['Average Score', 'Best Score', 'Target Score', 'Success Rate'],
        datasets: [{
          label: 'Performance',
          data: [data.averageScore, data.bestScore, 85, data.successRate],
          backgroundColor: [
            'rgba(102, 126, 234, 0.7)',
            'rgba(76, 175, 80, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(33, 150, 243, 0.7)'
          ]
        }]
      },
      options: chartOptions
    });
  }
}
