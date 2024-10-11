import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientState } from '../../models/patient.model';
import { BaseListComponent, ItemInterface } from '../base-list/base-list.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatBadgeModule, MatProgressSpinnerModule],
  templateUrl: '../base-list/base-list.component.html',
  styleUrls: ['../base-list/base-list.component.css'],
  animations: [BaseListComponent.fadeInAnimation],
  host: { 'class': 'patient-list' }
})
export class PatientListComponent extends BaseListComponent<PatientState> implements OnChanges {
  @Input() patients: PatientState[] = [];

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['patients']) {
      this.items = this.patients;
      this.updateUniqueItems();
    }
    super.ngOnChanges(changes);
  }

  override itemInterface: ItemInterface<PatientState> = {
    getIconForItem: (state: PatientState) => {
      const iconMap: {[key in PatientState]: string} = {
        [PatientState.Fever]: 'whatshot',
        [PatientState.Healthy]: 'favorite',
        [PatientState.Diabetes]: 'local_pharmacy',
        [PatientState.Tuberculosis]: 'healing',
        [PatientState.Dead]: 'local_hospital'
      };
      return iconMap[state] || 'help_outline';
    },
    getItemClass: (state: PatientState) => `state-${state.toLowerCase()}`,
    getItemName: (state: PatientState) => {
      const stateNames: Record<PatientState, string> = {
        [PatientState.Fever]: 'Fever',
        [PatientState.Healthy]: 'Healthy',
        [PatientState.Diabetes]: 'Diabetes',
        [PatientState.Tuberculosis]: 'Tuberculosis',
        [PatientState.Dead]: 'Dead'
      };
      return stateNames[state];
    }
  };
}