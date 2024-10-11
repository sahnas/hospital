import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Drug } from '../../models/drug.model';

@Component({
  selector: 'app-drug-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatBadgeModule, MatTooltipModule],
  template: `
    <div class="square-item" [ngClass]="getDrugClass()" [matTooltip]="drugName">
      <mat-icon 
        [matBadge]="count" 
        matBadgePosition="after" 
        matBadgeColor="accent"
        aria-hidden="false"
        [attr.aria-label]="'Drug ' + drugName + ' count: ' + count">
        {{getIconForDrug()}}
      </mat-icon>
    </div>
  `,
  styles: [`
    .square-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: white;
    }

    .square-item mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .drug-as { background-color: #FF4081; }
    .drug-an { background-color: #00BCD4; }
    .drug-i { background-color: #FF9800; }
    .drug-p { background-color: #8BC34A; }
    .drug-unknown { background-color: #9E9E9E; }

    .square-item:hover {
      transform: scale(1.1);
      transition: transform 0.2s ease-in-out;
    }
  `]
})
export class DrugIconComponent {
  @Input() drug!: Drug;
  @Input() count!: number;

  get drugName(): string {
    return this.getDrugName(this.drug);
  }

  getDrugClass(): string {
    return `drug-${this.drug.toLowerCase()}`;
  }

  getIconForDrug(): string {
    const iconMap: { [key in Drug]: string } = {
      [Drug.Aspirin]: 'healing',
      [Drug.Antibiotic]: 'bug_report',
      [Drug.Insulin]: 'biotech',
      [Drug.Paracetamol]: 'medication'
    };
    return iconMap[this.drug] || 'help_outline';
  }

  getDrugName(drug: Drug): string {
    const drugNames: { [key in Drug]: string } = {
      [Drug.Aspirin]: 'Aspirin',
      [Drug.Antibiotic]: 'Antibiotic',
      [Drug.Insulin]: 'Insulin',
      [Drug.Paracetamol]: 'Paracetamol'
    };
    return drugNames[drug];
  }
}