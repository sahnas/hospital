import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PatientState } from 'hospital-lib';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { Drug } from './models/drug.model';
import { ApiService } from './services/api.service';
import { DrugListComponent } from './components/drug-list/drug-list.component';
import { TreatmentControlsComponent } from './components/treatment-controls/treatment-controls.component';
import { TreatmentOutcomeComponent } from './components/treatment-outcomes/treatment-outcomes.component';
import { TreatmentService, TreatmentOutcome } from './services/treatment.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatProgressBarModule,
    PatientListComponent,
    DrugListComponent,
    TreatmentControlsComponent,
    TreatmentOutcomeComponent,
  ],
  template: `
    <mat-toolbar color="primary">Hospital Simulator</mat-toolbar>
    <div class="container">
      <mat-card>
        <mat-card-content>
          <ng-container *ngIf="isLoading; else loadedContent">
            <div class="skeleton-loader">
              <div class="skeleton-item"></div>
              <p>Fetching data...</p>
            </div>
          </ng-container>
          <ng-template #loadedContent>
            <app-patient-list [patients]="patients"></app-patient-list>
            <app-drug-list [drugs]="drugs"></app-drug-list>
          </ng-template>
          <app-simulation-controls
            (fetchData)="fetchData()"
            (runTreatment)="administerDrugsAndObserve()"
            [isLoading]="isLoading"
          ></app-simulation-controls>
          <app-treatment-outcomes [outcomes]="treatmentOutcomes"></app-treatment-outcomes>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .skeleton-loader {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      height: 100vh;
      width: 100%;
      flex-direction: column;
    }
    .skeleton-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 500px;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
    }
    p {
      position: relative;
      font-size: 1.5rem;
      color: black;
      text-align: center;
    }
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class AppComponent implements OnInit {
  patients: PatientState[] = [];
  drugs: Drug[] = [];
  treatmentOutcomes: TreatmentOutcome[] = [];
  isLoading: boolean = true;

  constructor(
    private apiService: ApiService,
    private treatmentService: TreatmentService
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    forkJoin({
      patients: this.apiService.getPatients(),
      drugs: this.apiService.getDrugs()
    }).subscribe({
      next: (result) => {
        setTimeout(() => {
          this.patients = result.patients;
          this.drugs = result.drugs;
          this.isLoading = false;
        }, 1500);
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    });
  }

  administerDrugsAndObserve() {
    this.isLoading = true;
    forkJoin({
      patients: this.apiService.getPatients(),
      drugs: this.apiService.getDrugs()
    }).subscribe({
      next: (result) => {
        this.patients = result.patients;
        this.drugs = result.drugs;
        const treatmentOutcome = this.treatmentService.administerDrugsAndObserve(this.patients, this.drugs);
        this.treatmentOutcomes = [treatmentOutcome, ...this.treatmentOutcomes].slice(0, 10);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching data for treatment:', error);
        this.isLoading = false;
      }
    });
  }
}