import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Drug } from '../../models/drug.model';
import { BaseListComponent, ItemInterface } from '../base-list/base-list.component';

@Component({
  selector: 'app-drug-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatBadgeModule, MatProgressSpinnerModule],
  templateUrl: '../base-list/base-list.component.html',
  styleUrls: ['../base-list/base-list.component.css'],
  animations: [BaseListComponent.fadeInAnimation],
  host: { 'class': 'drug-list' }
})
export class DrugListComponent extends BaseListComponent<Drug> implements OnChanges {
  @Input() drugs: Drug[] = [];

  override ngOnChanges(changes: SimpleChanges) {
    if (changes['drugs']) {
      this.items = this.drugs;
      this.updateUniqueItems();
    }
    super.ngOnChanges(changes);
  }

  override itemInterface: ItemInterface<Drug> = {
    getIconForItem: (drug: Drug) => {
      const iconMap: {[key in Drug]: string} = {
        [Drug.Aspirin]: 'healing',
        [Drug.Antibiotic]: 'bug_report',
        [Drug.Insulin]: 'biotech',
        [Drug.Paracetamol]: 'medication'
      };
      return iconMap[drug] || 'help_outline';
    },
    getItemClass: (drug: Drug) => {
      const classMap: {[key in Drug]: string} = {
        [Drug.Aspirin]: 'drug-as',
        [Drug.Antibiotic]: 'drug-an',
        [Drug.Insulin]: 'drug-i',
        [Drug.Paracetamol]: 'drug-p'
      };
      return classMap[drug] || 'drug-unknown';
    },
    getItemName: (drug: Drug) => {
      const drugNames: {[key in Drug]: string} = {
        [Drug.Aspirin]: 'Aspirin',
        [Drug.Antibiotic]: 'Antibiotic',
        [Drug.Insulin]: 'Insulin',
        [Drug.Paracetamol]: 'Paracetamol'
      };
      return drugNames[drug];
    }
  };
}