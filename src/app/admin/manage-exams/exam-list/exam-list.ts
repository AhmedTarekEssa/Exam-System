import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ExamService } from '../../../core/admin-serveces/exam-service';
import { IExam } from '../../../shared/models/iexam';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './exam-list.html',
})
export class ExamList implements OnInit {
  exams: IExam[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  deletingIds = new Set<number>();

  constructor(
    private examService: ExamService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadExams();
      });
  }

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.isLoading = true;
    this.error = null;
    console.log('Starting to load exams...');

    this.examService.getAllExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Exams after update:', this.exams);
      },
      error: (err) => {
        console.error('Error loading exams:', err);
        this.error = 'Failed to load exams. Please try again later.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deleteExam(id: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    // icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.deletingIds.add(id);
      this.cdr.detectChanges();

      this.examService.deleteExam(id).pipe(
        finalize(() => {
          this.deletingIds.delete(id);
          this.cdr.detectChanges();
        })
      ).subscribe({
        next: () => {
          this.exams = this.exams.filter(exam => exam.id !== id);
          this.cdr.detectChanges();
          Swal.fire(
            'Deleted!',
            'The exam has been deleted.',
            'success'
          );
        },
        error: (err) => {
          console.error('Error deleting exam:', err);
          Swal.fire(
            'Error!',
            err.error || 'Failed to delete exam. Please try again.',
            'error'
          );

          this.cdr.detectChanges();
        }
      });
    }
  });
}
}
