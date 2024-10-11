import { TestBed } from '@angular/core/testing';
import { TreatmentService } from './treatment.service';
import { PatientState } from '../models/patient.model';
import { Drug } from '../models/drug.model';
import { Quarantine } from 'hospital-lib';

jest.mock('hospital-lib');

describe('SimulationService', () => {
  let service: TreatmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatmentService);
    
    (Quarantine as jest.Mock).mockImplementation(() => ({
      setDrugs: jest.fn(),
      wait40Days: jest.fn(),
      report: jest.fn()
    }));
  });

  it('should cure fever with aspirin', () => {
    const mockReport = jest.fn().mockReturnValue({ F: 0, H: 1, D: 0, T: 0, X: 0 });
    (Quarantine as jest.Mock).mockImplementation(() => ({
      setDrugs: jest.fn(),
      wait40Days: jest.fn(),
      report: mockReport
    }));

    const result = service.administerDrugsAndObserve([PatientState.Fever], [Drug.Aspirin]);
    expect(result.output).toEqual({ F: 0, H: 1, D: 0, T: 0, X: 0 });
  });

  it('should not cure diabetes with insulin but prevent death', () => {
    const mockReport = jest.fn().mockReturnValue({ F: 0, H: 0, D: 1, T: 0, X: 0 });
    (Quarantine as jest.Mock).mockImplementation(() => ({
      setDrugs: jest.fn(),
      wait40Days: jest.fn(),
      report: mockReport
    }));

    const result = service.administerDrugsAndObserve([PatientState.Diabetes], [Drug.Insulin]);
    expect(result.output).toEqual({ F: 0, H: 0, D: 1, T: 0, X: 0 });
  });

  it('should cause fever in healthy patients when mixing insulin and antibiotic', () => {
    const mockReport = jest.fn().mockReturnValue({ F: 1, H: 0, D: 0, T: 0, X: 0 });
    (Quarantine as jest.Mock).mockImplementation(() => ({
      setDrugs: jest.fn(),
      wait40Days: jest.fn(),
      report: mockReport
    }));

    const result = service.administerDrugsAndObserve([PatientState.Healthy], [Drug.Insulin, Drug.Antibiotic]);
    expect(result.output).toEqual({ F: 1, H: 0, D: 0, T: 0, X: 0 });
  });

  it('should kill patient when mixing paracetamol and aspirin', () => {
    const mockReport = jest.fn().mockReturnValue({ F: 0, H: 0, D: 0, T: 0, X: 1 });
    (Quarantine as jest.Mock).mockImplementation(() => ({
      setDrugs: jest.fn(),
      wait40Days: jest.fn(),
      report: mockReport
    }));

    const result = service.administerDrugsAndObserve([PatientState.Fever], [Drug.Paracetamol, Drug.Aspirin]);
    expect(result.output).toEqual({ F: 0, H: 0, D: 0, T: 0, X: 1 });
  });
});