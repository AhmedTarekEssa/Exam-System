import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { QuestionService } from '../../../core/admin-serveces/question-service';
import { ActivatedRoute, Router } from '@angular/router';
import { IQuestion, IQuestionOption } from '../../../shared/models/iquestion';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../core/admin-serveces/exam-service';

@Component({
  selector: 'app-add-edit-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-question.html',
  styleUrls: ['./add-edit-question.css']
})
export class AddEditQuestion implements OnInit {
  questionForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  error: string | null = null;
  examId!: number;
  questionId?: number;
  questionTypes = ['MultipleChoice', 'TrueFalse', 'ShortAnswer']; // Updated to match API enum values

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private examService: ExamService,
    private route: ActivatedRoute,
    public router: Router
  ) {
    this.questionForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(5)]],
      type: ['MultipleChoice', [Validators.required]],
      position: [0, [Validators.required, Validators.min(0)]],
      options: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.examId = +this.route.snapshot.params['examId'];
    const questionIdParam = this.route.snapshot.params['questionId'];
    
    if (questionIdParam) {
      this.isEditMode = true;
      this.questionId = +questionIdParam;
      this.loadQuestion();
    } else {
      this.addOption(); // Add one default option for new questions
    }
  }

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  createOption(option?: IQuestionOption): FormGroup {
    return this.fb.group({
      text: [option?.text || '', [Validators.required]],
      isCorrect: [option?.isCorrect || false]
    });
  }

  addOption(): void {
    this.options.push(this.createOption());
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  loadQuestion(): void {
    if (!this.questionId) return;
    
    this.isLoading = true;
    this.questionService.getQuestionById(this.examId, this.questionId).subscribe({
      next: (question) => {
        this.questionForm.patchValue({
          text: question.text,
          type: question.type,
          position: question.position
        });

        // Clear existing options
        while (this.options.length) {
          this.options.removeAt(0);
        }

        // Add loaded options
        question.options?.forEach(option => {
          this.options.push(this.createOption(option));
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load question. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
  if (this.questionForm.invalid) return;

  this.isLoading = true;
  this.error = null;

  const questionData = {
    text: this.questionForm.value.text,
    type: this.questionForm.value.type,
    position: this.questionForm.value.position,
    options: this.questionForm.value.options
  };

  if (this.isEditMode && this.questionId) {
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        const updatedQuestions = exam.questions?.map(q => 
          q.id === this.questionId ? { ...q, ...questionData } : q
        ) || [];
        
        // Create the update payload with all required fields
        const updatePayload = {
          title: exam.title,
          description: exam.description,
          durationMinutes: exam.durationMinutes,
          questions: updatedQuestions
        };

        this.examService.updateExam(this.examId, updatePayload).subscribe({
          next: () => {
            this.router.navigate(['/admin/exams', this.examId, 'questions']);
          },
          error: (err) => {
            this.error = 'Failed to update question. Please try again.';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load exam data. Please try again.';
        this.isLoading = false;
      }
    });
  } else {
    this.questionService.createQuestion(this.examId, questionData).subscribe({
      next: () => {
        this.router.navigate(['/admin/exams', this.examId, 'questions']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to create question. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
}