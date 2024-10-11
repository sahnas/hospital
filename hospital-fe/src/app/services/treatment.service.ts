import { Injectable } from '@angular/core';
import { Quarantine, PatientsRegister } from 'hospital-lib';
import { PatientState } from '../models/patient.model';
import { Drug } from '../models/drug.model';

type StrictPatientsRegister = {
  [key in PatientState]: number;
};

export interface TreatmentOutcome {
  input: {
    patients: PatientState[];
    drugs: Drug[];
  };
  output: StrictPatientsRegister;
}

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  administerDrugsAndObserve(patients: PatientState[], drugs: Drug[]): TreatmentOutcome {
    const initialState: StrictPatientsRegister = {
      F: 0, H: 0, D: 0, T: 0, X: 0
    };

    patients.forEach(state => initialState[state]++);

    const quarantine = new Quarantine(initialState as PatientsRegister);
    quarantine.setDrugs(drugs);
    quarantine.wait40Days();

    return {
      input: { patients, drugs },
      output: quarantine.report() as StrictPatientsRegister
    };
  }
}