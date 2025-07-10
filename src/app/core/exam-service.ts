import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IExam } from '../shared/models/iexam';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiUrl = 'https://localhost:7110/api/student/StudentExams';

  constructor(private http: HttpClient) {}

getAllExams(): Observable<IExam[]> {
  const token = localStorage.getItem('jwtToken');

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<IExam[]>(this.apiUrl, { headers });
}
}
