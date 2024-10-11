import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { trigger, transition, style, animate } from '@angular/animations';
import { TreatmentOutcome } from '../../services/treatment.service';
import { PatientState } from '../../models/patient.model';
import { DrugIconComponent } from '../icon-components/drug-icon.component';
import { PatientStateIconComponent } from '../icon-components/patient-state-icon.component';
import { TreatmentPresentationService } from '../../services/treatment-presentation.service';

@Component({
  selector: 'app-treatment-outcomes',
  standalone: true,
  imports: [
    CommonModule, 
    MatExpansionModule,
    MatProgressBarModule,
    MatButtonModule,
    DrugIconComponent,
    PatientStateIconComponent
  ],
  templateUrl: './treatment-outcomes.component.html',
  styleUrls: ['./treatment-outcomes.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class TreatmentOutcomeComponent implements OnChanges {
  @Input() outcomes: TreatmentOutcome[] = [];

  displayedOutcomes: TreatmentOutcome[] = [];
  displayLimit = 10;
  latestOutcomeIndex: number = -1;

  patientStates: PatientState[] = [PatientState.Fever, PatientState.Healthy, PatientState.Diabetes, PatientState.Tuberculosis, PatientState.Dead];

  constructor(public traetmentPresentationService: TreatmentPresentationService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['outcomes']) {
      this.updateDisplayedOutcomes();
    }
  }

  updateDisplayedOutcomes() {
    this.displayedOutcomes = this.outcomes.slice(0, this.displayLimit);
    if (this.displayedOutcomes.length > 0) {
      this.latestOutcomeIndex = 0;
    }
  }

  showMoreOutcomes() {
    this.displayLimit += 3;
    this.updateDisplayedOutcomes();
  }

  onPanelOpened(index: number) {
    if (index !== this.latestOutcomeIndex) {
      this.latestOutcomeIndex = index;
    }
  }

  getProgressBarColor(state: PatientState): 'primary' | 'accent' | 'warn' {
    const colorMap: Record<PatientState, 'primary' | 'accent' | 'warn'> = {
      [PatientState.Fever]: 'warn',
      [PatientState.Healthy]: 'primary',
      [PatientState.Diabetes]: 'accent',
      [PatientState.Tuberculosis]: 'warn',
      [PatientState.Dead]: 'warn'
    };
    return colorMap[state] || 'primary';
  }

  getStateName(state: PatientState): string {
    const stateNames: Record<PatientState, string> = {
      [PatientState.Fever]: 'Fever',
      [PatientState.Healthy]: 'Healthy',
      [PatientState.Diabetes]: 'Diabetes',
      [PatientState.Tuberculosis]: 'Tuberculosis',
      [PatientState.Dead]: 'Dead'
    };
    return stateNames[state];
  }
}