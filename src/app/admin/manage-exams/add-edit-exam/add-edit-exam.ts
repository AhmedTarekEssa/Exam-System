import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ExamService } from '../../../core/admin-serveces/exam-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IExam } from '../../../shared/models/iexam';

@Component({
  selector: 'app-add-edit-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-edit-exam.html',
  styleUrls: ['./add-edit-exam.css']
})
export class AddEditExam implements OnInit {
  examForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  error: string | null = null;
  examId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    public router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef 
  ) {
    this.examForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      durationMinutes: [60, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.examId = +params['id'];
        this.loadExam();
      } else {
        this.isEditMode = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadExam(): void {
    if (!this.examId) return;

    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.examService.getExamById(this.examId).subscribe({
      next: (exam: IExam) => {
        this.examForm.patchValue({
          title: exam.title,
          description: exam.description,
          durationMinutes: exam.durationMinutes
        });
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Failed to load exam details';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.examForm.invalid) return;

    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    const examData = {
      title: this.examForm.value.title,
      description: this.examForm.value.description,
      durationMinutes: this.examForm.value.durationMinutes
    };

    const operation = this.isEditMode && this.examId
      ? this.examService.updateExam(this.examId, examData)
      : this.examService.createExam(examData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/admin/exams']);
      },
      error: (err) => {
        this.error = err.error?.message ||
          (this.isEditMode ? 'Failed to update exam' : 'Failed to create exam');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get title() { return this.examForm.get('title'); }
  get description() { return this.examForm.get('description'); }
  get durationMinutes() { return this.examForm.get('durationMinutes'); }
}
