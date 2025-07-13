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

        const allQuestions: any[] = [];

        let examsProcessed = 0;
        const totalExams = exams.length;

        if (totalExams === 0) {
          this.isLoading = false;
          return;
        }

        for (const exam of exams) {
          this.examService.getExamById(exam.id).subscribe({
            next: (examDetails) => {
              const questions = examDetails.questions || [];
              allQuestions.push(...questions);

              // Load result data for each exam
              this.loadResultData(exam.id);

              examsProcessed++;
              if (examsProcessed === totalExams) {
                // Once all exams have been processed
                this.calculateQuestionAnalytics(allQuestions);
                this.isLoading = false;
                this.cdr.detectChanges();
              }
            },
            error: (err) => {
              this.handleError('Failed to load exam detail', err);
            }
          });
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

  private calculateQuestionAnalytics(questions: any[]): void {
    this.totalQuestions = questions.length;
    this.multipleChoiceQuestions = questions.filter(q => q.type === 'MultipleChoice').length;
    this.trueFalseQuestions = questions.filter(q => q.type === 'TrueFalse').length;
    this.shortAnswerQuestions = questions.filter(q => q.type === 'ShortAnswer').length;
  }

  private loadResultData(examId: number): void {
    this.resultService.getResultsByExam(examId).subscribe({
      next: (results) => {
        this.calculateResultAnalytics(results);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.handleError('Failed to load result data', err);
      }
    });
  }

  private calculateResultAnalytics(results: any[]): void {
    if (results.length === 0) return;

    this.totalAttempts += results.length;

    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    this.averageScore = Math.round((this.averageScore + totalScore / results.length) / 2);

    const completedResults = results.filter(result => result.status === 'completed');
    this.completionRate = Math.round(
      ((this.completionRate + (completedResults.length / results.length) * 100) / 2)
    );

    const examScores = results.reduce((acc: any, result: any) => {
      acc[result.examId] = (acc[result.examId] || 0) + result.score;
      return acc;
    }, {});

    const topExamId = Object.keys(examScores).reduce((a, b) =>
      examScores[a] > examScores[b] ? a : b
    );

    this.topScore = Math.max(this.topScore, ...results.map(r => r.score));
    this.topPerformingExam = `Exam ${topExamId}`;
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.error = message;
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
