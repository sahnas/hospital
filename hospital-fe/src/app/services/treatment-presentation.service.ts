import { Injectable } from '@angular/core';
import { Drug } from '../models/drug.model';
import { PatientState } from '../models/patient.model';
import { TreatmentOutcome } from './treatment.service';

@Injectable({
  providedIn: 'root'
})
export class TreatmentPresentationService  {
  getUniqueDrugs(drugs: Drug[]): Drug[] {
    return Array.from(new Set(drugs));
  }

  getDrugCount(drugs: Drug[], drug: Drug): number {
    return drugs.filter(d => d === drug).length;
  }

  getUniquePatientStates(patients: PatientState[]): PatientState[] {
    return Array.from(new Set(patients));
  }

  getPatientCount(patients: PatientState[], state: PatientState): number {
    return patients.filter(p => p === state).length;
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }

  getTotalPatients(output: Record<PatientState, number>): number {
    return Object.values(output).reduce((sum, count) => sum + count, 0);
  }

  getTreatmentOutcomeSummary(outcome: TreatmentOutcome): string {
    const totalPatients = this.getTotalPatients(outcome.output);
    const healthyCount = outcome.output[PatientState.Healthy] || 0;
    const healthyPercentage = this.getPercentage(healthyCount, totalPatients);
    return `${healthyCount} healthy (${healthyPercentage.toFixed(1)}%)`;
  }
}