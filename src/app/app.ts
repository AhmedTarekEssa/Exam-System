import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from './student/dashboard/dashboard';
import { ExamList } from './student/exams/exam-list/exam-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Dashboard,ExamList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'exam-system';
}
