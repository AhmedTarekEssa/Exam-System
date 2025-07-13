import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IResult {
  id: number;
  examId: number;
  examTitle: string;
  score: number;
  totalPoints: number;
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  private baseUrl = 'https://localhost:7110/api/student/StudentExams';

  constructor(private http: HttpClient) {}

  getAllResults(): Observable<IResult[]> {
    return this.http.get<IResult[]>(`${this.baseUrl}/results`);
  }
}
