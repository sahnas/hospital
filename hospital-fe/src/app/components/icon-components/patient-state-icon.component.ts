import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PatientState } from '../../models/patient.model';

@Component({
  selector: 'app-patient-state-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule, MatTooltipModule],
  template: `
    <div class="circle-item" [ngClass]="getStateClass()" [matTooltip]="stateName">
      <mat-icon 
        [matBadge]="count" 
        matBadgePosition="after" 
        matBadgeColor="accent"
        aria-hidden="false"
        [attr.aria-label]="'Patient state ' + stateName + ' count: ' + count">
        {{getIconForState()}}
      </mat-icon>
    </div>
  `,
  styles: [`
    .circle-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: white;
      border-radius: 50%;
    }

    .circle-item mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .state-f { background-color: #FF4081; }
    .state-h { background-color: #4CAF50; }
    .state-d { background-color: #FF9800; }
    .state-t { background-color: #9C27B0; }
    .state-x { background-color: #607D8B; }

    .circle-item:hover {
      transform: scale(1.1);
      transition: transform 0.2s ease-in-out;
    }
  `]
})
export class PatientStateIconComponent {
  @Input() state!: PatientState;
  @Input() count!: number;

  get stateName(): string {
    return this.getStateName(this.state);
  }

  getStateClass(): string {
    return `state-${this.state.toLowerCase()}`;
  }

  getIconForState(): string {
    const iconMap: { [key in PatientState]: string } = {
      [PatientState.Fever]: 'whatshot',
      [PatientState.Healthy]: 'favorite',
      [PatientState.Diabetes]: 'local_pharmacy',
      [PatientState.Tuberculosis]: 'healing',
      [PatientState.Dead]: 'local_hospital'
    };
    return iconMap[this.state] || 'help_outline';
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