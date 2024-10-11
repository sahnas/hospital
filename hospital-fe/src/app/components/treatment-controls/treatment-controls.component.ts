import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-simulation-controls',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="controls">
      <button mat-raised-button color="primary" (click)="onFetchData()" [disabled]="isLoading">
        {{ isLoading ? 'Loading...' : 'Fetch Data' }}
      </button>
      <button mat-raised-button color="accent" (click)="onAdministerDrugsAndObserve()" [disabled]="isLoading || treatmentCount >= 10">
        {{ treatmentCount >= 10 ? 'Maximum Treatments Reached' : 'Administer Drugs (' + treatmentCount + '/10)' }}
      </button>
      <button mat-raised-button color="warn" (click)="onReset()" [disabled]="isLoading">Reset</button>
    </div>
  `,
  styles: [`
    .controls {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
    }
  `]
})
export class TreatmentControlsComponent {
  @Input() isLoading: boolean = false;
  @Output() fetchData = new EventEmitter<void>();
  @Output() runTreatment = new EventEmitter<void>();

  treatmentCount = 0;

  onFetchData() {
    this.fetchData.emit();
  }

  onAdministerDrugsAndObserve() {
    if (this.treatmentCount < 10) {
      this.treatmentCount++;
      this.runTreatment.emit();
    }
  }

  onReset() {
    window.location.reload();
  }
}