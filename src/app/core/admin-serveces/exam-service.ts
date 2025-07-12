import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IExam } from '../../shared/models/iexam';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { IQuestion } from '../../shared/models/iquestion';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getAllExams(): Observable<IExam[]> {
  const token = localStorage.getItem('jwtToken');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<IExam[]>(`${this.apiUrl}/Exams`, { headers }).pipe(
    map(exams => exams.map(exam => ({
      ...exam,
      questions: exam.questions?.map(q => ({
        ...q,
        options: q.options || []
      })) || []
    }))),
    catchError(error => {
      console.error('Error loading exams:', error);
      return throwError(() => new Error('Failed to load exams'));
    })
  );
}


 deleteExam(id: number): Observable<void> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete<void>(`${this.apiUrl}/Exams/${id}`, {
      headers,
      observe: 'response'
    }).pipe(
      map(response => {
        if (response.status === 200 || response.status === 204) {
          return;
        }
        throw new Error('Unexpected response status');
      }),
      catchError(error => {
        return throwError(() => ({
          error: error.error?.message || 'Delete failed',
          status: error.status
        }));
      })
    );
  }

createExam(examData: { title: string, description: string, durationMinutes: number }): Observable<IExam> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<IExam>(`${this.apiUrl}/Exams`, examData, { headers });
  }

  updateExam(
  id: number,
  examData: {
    title: string,
    description: string,
    durationMinutes: number,
    questions?: IQuestion[] // Add this line
  }
): Observable<IExam> {
  const token = localStorage.getItem('jwtToken');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.put<IExam>(`${this.apiUrl}/Exams/${id}`, examData, { headers });
}


getExamById(id: number): Observable<IExam> {
  const token = localStorage.getItem('jwtToken');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.get<IExam>(`${this.apiUrl}/Exams/${id}`, { headers }).pipe(
    map(exam => ({
      ...exam,
      questions: exam.questions?.map(q => ({
        ...q,
        options: q.options || []
      })) || []
    })),
    catchError(error => {
      console.error('Error loading exam:', error);
      return throwError(() => new Error('Failed to load exam'));
    })
  );
}
}
