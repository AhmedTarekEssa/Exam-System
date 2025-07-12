import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface IExamResult {
  id: number;
  score: number;
  totalPoints: number;
  startTime: string;
  endTime: string;
  userId: string;
  percentage?: number;
  studentName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getResultsByExam(examId: number): Observable<IExamResult[]> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<IExamResult[]>(
      `${this.apiUrl}/Results/exam/${examId}`,
      { headers }
    );
  }

  getStudentName(userId: string): Observable<{name: string}> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<{name: string}>(
      `${this.apiUrl}/Users/${userId}/name`,
      { headers }
    );
  }
}
