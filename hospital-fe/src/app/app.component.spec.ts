import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { TreatmentService } from './services/treatment.service';
import { PatientState } from './models/patient.model';
import { Drug } from './models/drug.model';
import { of } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PatientListComponent } from './components/patient-list/patient-list.component';
import { DrugListComponent } from './components/drug-list/drug-list.component';
import { TreatmentControlsComponent } from './components/treatment-controls/treatment-controls.component';
import { TreatmentOutcomeComponent } from './components/treatment-outcomes/treatment-outcomes.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiServiceMock: jest.Mocked<ApiService>;
  let treatmentServiceMock: jest.Mocked<TreatmentService>;

  beforeEach(async () => {
    apiServiceMock = {
      getPatients: jest.fn().mockReturnValue(of([])),
      getDrugs: jest.fn().mockReturnValue(of([]))
    } as any;

    treatmentServiceMock = {
      administerDrugsAndObserve: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MatToolbarModule,
        MatCardModule,
        NoopAnimationsModule,
        PatientListComponent,
        DrugListComponent,
        TreatmentControlsComponent,
        TreatmentOutcomeComponent
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: TreatmentService, useValue: treatmentServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should perform a complete treatment cycle', fakeAsync(() => {
    const mockPatients: PatientState[] = [PatientState.Fever, PatientState.Healthy];
    const mockDrugs: Drug[] = [Drug.Aspirin, Drug.Antibiotic];
    const mockTreatmentResult = {
      input: { patients: mockPatients, drugs: mockDrugs },
      output: { F: 0, H: 2, D: 0, T: 0, X: 0 }
    };

    apiServiceMock.getPatients.mockReturnValue(of(mockPatients));
    apiServiceMock.getDrugs.mockReturnValue(of(mockDrugs));
    treatmentServiceMock.administerDrugsAndObserve.mockReturnValue(mockTreatmentResult);

    component.fetchData();
    tick(1500);
    component.administerDrugsAndObserve();
    tick(1500);

    expect(component.patients).toEqual(mockPatients);
    expect(component.drugs).toEqual(mockDrugs);
    expect(component.treatmentOutcomes[0]).toEqual(mockTreatmentResult);
    expect(component.treatmentOutcomes.length).toBeLessThanOrEqual(10);
  }));

  it('should handle empty patient list', fakeAsync(() => {
    apiServiceMock.getPatients.mockReturnValue(of([]));
    apiServiceMock.getDrugs.mockReturnValue(of([Drug.Aspirin]));
    treatmentServiceMock.administerDrugsAndObserve.mockReturnValue({
      input: { patients: [], drugs: [Drug.Aspirin] },
      output: { F: 0, H: 0, D: 0, T: 0, X: 0 }
    });

    component.fetchData();
    tick(1500);
    component.administerDrugsAndObserve();
    tick(1500);

    expect(component.patients).toEqual([]);
    expect(component.treatmentOutcomes[0].output).toEqual({ F: 0, H: 0, D: 0, T: 0, X: 0 });
  }));

  it('should limit treatment results to 10', fakeAsync(() => {
    const mockPatients: PatientState[] = [PatientState.Fever];
    const mockDrugs: Drug[] = [Drug.Aspirin];
    const mockTreatmentResult = {
      input: { patients: mockPatients, drugs: mockDrugs },
      output: { F: 0, H: 1, D: 0, T: 0, X: 0 }
    };

    apiServiceMock.getPatients.mockReturnValue(of(mockPatients));
    apiServiceMock.getDrugs.mockReturnValue(of(mockDrugs));
    treatmentServiceMock.administerDrugsAndObserve.mockReturnValue(mockTreatmentResult);

    for (let i = 0; i < 15; i++) {
      component.administerDrugsAndObserve();
      tick();
    }

    expect(component.treatmentOutcomes.length).toBe(10);
  }));
});