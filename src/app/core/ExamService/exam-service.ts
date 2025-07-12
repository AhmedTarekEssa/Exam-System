import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IStudentResponse } from '../../shared/models/istudent-response';
import { IExamResponse } from '../../shared/models/iexam-response';
import { IExam } from '../../shared/models/iexam';

// Interface for answer submission
export interface IAnswerSubmission {
  questionId: number;
  selectedOptionId: number | null;
}

// Interface for submit exam response
export interface ISubmitExamResponse {
  score: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private baseUrl = 'https://localhost:7110/api/student/StudentExams';

  constructor(private http: HttpClient) {}

  getAllExams(): Observable<IExam[]> {
    return this.http.get<IExam[]>(`${this.baseUrl}`);
  }

  startExam(examId: number): Observable<{ resultId: number }> {
    return this.http.post<{ resultId: number }>(`${this.baseUrl}/${examId}/start`, {});
  }

  getExamByResultId(resultId: number): Observable<IExamResponse> {
    return this.http.get<IExamResponse>(`${this.baseUrl}/results/${resultId}`);
  }

  submitExam(resultId: number, answers: IAnswerSubmission[]): Observable<ISubmitExamResponse> {
    return this.http.post<ISubmitExamResponse>(`${this.baseUrl}/results/${resultId}/submit`, answers);
  }
}