import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ApiService } from './api.service';
import { PatientState } from '../models/patient.model';
import { Drug } from '../models/drug.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle invalid patient response', () => {
    const mockResponse = 'F,H,InvalidState';

    service.getPatients().subscribe(patients => {
      expect(patients).toEqual([PatientState.Fever, PatientState.Healthy]);
    });

    const req = httpTestingController.expectOne('http://localhost:7200/patients');
    req.flush(mockResponse);
  });

  it('should handle invalid drug response', () => {
    const mockResponse = 'As,InvalidDrug,P';

    service.getDrugs().subscribe(drugs => {
      expect(drugs).toEqual([Drug.Aspirin, Drug.Paracetamol]);
    });

    const req = httpTestingController.expectOne('http://localhost:7200/drugs');
    req.flush(mockResponse);
  });
});