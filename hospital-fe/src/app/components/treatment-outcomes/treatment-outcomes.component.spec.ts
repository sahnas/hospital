import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TreatmentOutcomeComponent } from './treatment-outcomes.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TreatmentOutcome } from '../../services/treatment.service';
import { PatientState } from '../../models/patient.model';
import { Drug } from '../../models/drug.model';

describe('TreatmentOutcomesComponent', () => {
  let component: TreatmentOutcomeComponent;
  let fixture: ComponentFixture<TreatmentOutcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TreatmentOutcomeComponent,
        MatExpansionModule,
        MatProgressBarModule,
        MatIconModule,
        MatTooltipModule,
        MatBadgeModule,
        NoopAnimationsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TreatmentOutcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display simulation outcomes', () => {
    const mockOutcomes: TreatmentOutcome[] = [
      {
        input: { patients: [PatientState.Fever], drugs: [Drug.Aspirin] },
        output: { F: 0, H: 1, D: 0, T: 0, X: 0 }
      }
    ];
    component.outcomes = mockOutcomes;
    component.ngOnChanges({ outcomes: {} as any });
    fixture.detectChanges();

    const resultSummary = fixture.nativeElement.querySelector('.mat-expansion-panel-header-description');
    expect(resultSummary.textContent).toContain('1 healthy (100.0%)');
  });

  it('should limit displayed outcomes to 10', () => {
    const mockOutcomes: TreatmentOutcome[] = Array(15).fill({
      input: { patients: [], drugs: [] },
      output: { F: 0, H: 0, D: 0, T: 0, X: 0 }
    });
    component.outcomes = mockOutcomes;
    component.ngOnChanges({ outcomes: {} as any });

    expect(component.displayedOutcomes.length).toBe(10);
  });

  it('should show more outcomes when requested', () => {
    const mockOutcomes: TreatmentOutcome[] = Array(15).fill({
      input: { patients: [], drugs: [] },
      output: { F: 0, H: 0, D: 0, T: 0, X: 0 }
    });
    component.outcomes = mockOutcomes;
    component.ngOnChanges({ outcomes: {} as any });
    component.showMoreOutcomes();

    expect(component.displayLimit).toBeGreaterThan(10);
    expect(component.displayedOutcomes.length).toBeGreaterThan(10);
  });
});