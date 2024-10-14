import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { PatientState } from '../models/patient.model';
import { Drug } from '../models/drug.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPatients(): Observable<PatientState[]> {
    return this.http.get<string>(`${this.baseUrl}/patients`).pipe(
      map(response => this.parsePatients(response)),
      catchError(this.handleError)
    );
  }

  getDrugs(): Observable<Drug[]> {
    return this.http.get<string>(`${this.baseUrl}/drugs`).pipe(
      map(response => this.parseDrugs(response)),
      catchError(this.handleError)
    );
  }

  private parsePatients(response: string): PatientState[] {
    return response.split(',').filter(state => Object.values(PatientState).includes(state as PatientState)) as PatientState[];
  }

  private parseDrugs(response: string): Drug[] {
    return response.split(',').filter(drug => Object.values(Drug).includes(drug as Drug)) as Drug[];
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error;
  }
}
