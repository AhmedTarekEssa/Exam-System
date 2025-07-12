import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService, IAnswerSubmission, ISubmitExamResponse } from '../../../core/ExamService/exam-service';
import { IExamResponse } from '../../../shared/models/iexam-response';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-take-exam',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './take-exam.html',
  styleUrls: ['./take-exam.css']
})
export class TakeExam implements OnInit {
  resultId!: number;
  exam!: IExamResponse;
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  currentQuestion: any;
  totalTime: number = 0;
  timeRemaining: number = 0;
  examFinished: boolean = false;
  score: number | null = null;
  totalPoints: number | null = null;
  timerInterval: any;

  constructor(
    private route: ActivatedRoute,
    private examSer: ExamService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resultId = +this.route.snapshot.paramMap.get('resultId')!;
    console.log('Result ID:', this.resultId);
    this.loadExam();
  }

  loadExam() {
    this.examSer.getExamByResultId(this.resultId).subscribe({
      next: (data) => {
        console.log('Exam Data:', data);
        this.exam = data;
        this.questions = this.exam.questions.map(q => ({
          ...q,
          type: q.type.replace(' ', ''), // Normalize type
          options: q.options.map((opt: any) => ({
            id: opt.id,
            text: opt.text || `Option ${opt.id}` // Fallback text
          })),
          selectedOptionId: null
        }));
        console.log('Questions:', this.questions);
        this.currentQuestion = this.questions[this.currentQuestionIndex];
        console.log('Current Question:', this.currentQuestion);
        this.totalTime = this.exam.durationMinutes * 60;
        this.timeRemaining = this.totalTime;
        this.cdr.detectChanges();
        this.startTimer();
      },
      error: (err) => {
        console.error('Failed to load exam:', err);
        alert('Failed to load exam.');
      }
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        clearInterval(this.timerInterval);
        this.submitExam();
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }

  getTimeProgress(): number {
    return ((this.totalTime - this.timeRemaining) / this.totalTime) * 100;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.cdr.detectChanges();
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.cdr.detectChanges();
    }
  }

  goToQuestion(index: number) {
    this.currentQuestionIndex = index;
    this.currentQuestion = this.questions[index];
    this.cdr.detectChanges();
  }

  hasAnswered(q: any): boolean {
    return q.selectedOptionId != null;
  }

  onAnswerChange(optionId: number) {
    this.currentQuestion.selectedOptionId = optionId;
    this.cdr.detectChanges();
  }

  getAnsweredCount(): number {
    return this.questions.filter(q => q.selectedOptionId != null).length;
  }

submitExam() {
  clearInterval(this.timerInterval);
  const answers: IAnswerSubmission[] = this.questions.map(q => ({
    questionId: q.id,
    selectedOptionId: q.selectedOptionId
  }));
  console.log('Submitting answers:', JSON.stringify(answers, null, 2));
  this.examSer.submitExam(this.resultId, answers).subscribe({
    next: (res: ISubmitExamResponse) => {
      this.examFinished = true;
      this.score = res.score;
      this.totalPoints = res.total;
      console.log('Exam submitted. Score:', res.score, 'Total:', res.total);
this.router.navigate(['/student/exams/submit'], {
  queryParams: {
    score: res.score,
    total: res.total,
    resultId: this.resultId
  }
});
 // 🔥 navigate to results page
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Failed to submit exam:', err);
      console.log('Error details:', err.error);
      alert('Failed to submit the exam: ' + (err.error?.message || err.message));
    }
  });
}

}