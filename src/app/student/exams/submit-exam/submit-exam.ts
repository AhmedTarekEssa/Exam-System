import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submit-exam',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './submit-exam.html',
  styleUrls: ['./submit-exam.css']
})
export class SubmitExam implements OnInit {
  score: number = 0;
  total: number = 0;
  resultId!: number;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.score = +params['score'];
      this.total = +params['total'];
      this.resultId = +params['resultId'];
    });
  }

  goToDashboard() {
    this.router.navigate(['/student']);
  }
}
