import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';

export interface IExamResult {
duration: any;
  user: any;
status: any;
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
    return this.http.get<IExamResult[]>(
      `${this.apiUrl}/Results/exam/${examId}`
    );
  }

  getStudentName(userId: string): Observable<{name: string}> {
    return this.http.get<{name: string}>(
      `${this.apiUrl}/Users/${userId}/name`
    );
  }
}
