import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IQuestion, IQuestionOption } from '../../shared/models/iquestion';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getQuestionsByExam(examId: number): Observable<IQuestion[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<IQuestion[]>(`${this.apiUrl}/exams/${examId}/Questions`, { headers });
  }

  getQuestionById(examId: number, questionId: number): Observable<IQuestion> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<IQuestion>(`${this.apiUrl}/exams/${examId}/Questions/${questionId}`, { headers });
  }

  createQuestion(examId: number, questionData: {
    text: string,
    type: string,
    position: number,
    options: IQuestionOption[]
  }): Observable<IQuestion> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<IQuestion>(`${this.apiUrl}/exams/${examId}/Questions`, questionData, { headers });
  }

  updateQuestion(examId: number, questionId: number, questionData: {
    text: string,
    type: string,
    position: number,
    options: IQuestionOption[]
  }): Observable<IQuestion> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put<IQuestion>(`${this.apiUrl}/exams/${examId}/Questions/${questionId}`, questionData, { headers });
  }

  deleteQuestion(examId: number, questionId: number): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/exams/${examId}/Questions/${questionId}`, { headers });
  }
}
