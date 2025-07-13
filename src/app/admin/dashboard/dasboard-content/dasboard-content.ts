import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ExamService } from '../../../core/admin-serveces/exam-service';
import { QuestionService } from '../../../core/admin-serveces/question-service';
import { ResultService } from '../../../core/admin-serveces/result-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dasboard-content.html',
  styleUrls: ['./dasboard-content.css']
})
export class DashboardContent implements OnInit {
  // Exam Analytics
  totalExams: number = 0;
  examsThisMonth: number = 0;
  averageQuestionsPerExam: number = 0;

  // Question Analytics
  totalQuestions: number = 0;
  multipleChoiceQuestions: number = 0;
  trueFalseQuestions: number = 0;
  shortAnswerQuestions: number = 0;

  // Result Analytics
  averageScore: number = 0;
  completionRate: number = 0;
  totalAttempts: number = 0;
  topPerformingExam: string = 'N/A';
  topScore: number = 0;

  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private examService: ExamService,
    private questionService: QuestionService,
    private resultService: ResultService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    this.examService.getAllExams().subscribe({
      next: (exams) => {
        this.calculateExamAnalytics(exams);
        for (const exam of exams) {
          this.loadQuestionData(exam.id);
        }
      },
      error: (err) => {
        this.handleError('Failed to load exam data', err);
      }
    });
  }

  private calculateExamAnalytics(exams: any[]): void {
    this.totalExams = exams.length;

    const currentMonth = new Date().getMonth();
    this.examsThisMonth = exams.filter(exam =>
      new Date(exam.createdAt).getMonth() === currentMonth
    ).length;

    const totalQuestions = exams.reduce((sum, exam) => sum + (exam.questions?.length || 0), 0);
    this.averageQuestionsPerExam = this.totalExams > 0
      ? Math.round(totalQuestions / this.totalExams)
      : 0;
  }

  private loadQuestionData(exId: number): void {
    this.examService.getExamById(exId).subscribe({
      next: (exam) => {
        this.calculateQuestionAnalytics(exam.questions || []);
        this.loadResultData(exId);
        this.cdr.detectChanges(); // Ensure the UI is updated
      },
      error: (err) => {
        this.handleError('Failed to load exam detail', err);
      }
    });
  }

  private calculateQuestionAnalytics(questions: any[]): void {
    this.totalQuestions = questions.length;
    this.multipleChoiceQuestions = questions.filter(q => q.type === 'MultipleChoice').length;
    this.trueFalseQuestions = questions.filter(q => q.type === 'TrueFalse').length;
    this.shortAnswerQuestions = questions.filter(q => q.type === 'ShortAnswer').length;
  }

  private loadResultData(exId: number): void {
    this.resultService.getResultsByExam(exId).subscribe({
      next: (results) => {
        this.calculateResultAnalytics(results);
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger update if needed
      },
      error: (err) => {
        this.handleError('Failed to load result data', err);
      }
    });
  }

  private calculateResultAnalytics(results: any[]): void {
    if (results.length === 0) return;

    this.totalAttempts = results.length;

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    this.averageScore = Math.round(totalScore / results.length);

    const completedResults = results.filter(result => result.status === 'completed');
    this.completionRate = Math.round((completedResults.length / results.length) * 100);

    const examScores = results.reduce((acc: any, result: any) => {
      acc[result.examId] = (acc[result.examId] || 0) + result.score;
      return acc;
    }, {});

    const topExamId = Object.keys(examScores).reduce((a, b) =>
      examScores[a] > examScores[b] ? a : b
    );

    this.topScore = Math.max(...results.map(r => r.score));
    this.topPerformingExam = `Exam ${topExamId}`;
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.error = message;
    this.isLoading = false;
    this.cdr.detectChanges(); // Reflect error in UI
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
