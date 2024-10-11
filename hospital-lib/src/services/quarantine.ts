import { Drug } from "../domain/treatments/drugs";
import { PatientState, PatientsRegister } from "../domain/patients";
import { createDefaultRuleRegistry, RuleRegistry } from "../domain/rules";

export class Quarantine {
  private patients: Map<PatientState, number> = new Map();
  private drugs: Set<Drug> = new Set();
  private ruleRegistry: RuleRegistry;

  constructor(initialState: PatientsRegister) {
    this.validateInitialState(initialState);

    Object.entries(initialState).map(([state, count]) => {
      this.patients.set(state as PatientState, count);
    });

    this.ruleRegistry = createDefaultRuleRegistry();
  }

  public setDrugs(drugs: string[]): void {
    this.validateDrugs(drugs);
    this.drugs = new Set(drugs as Drug[]);
  }

  public wait40Days(): void {
    const updatedPatientStates = new Map<PatientState, number>();

    for (const [state, count] of this.patients) {
      const newState = this.ruleRegistry.applyRules(state, this.drugs);
      const currentCount = updatedPatientStates.get(newState) || 0;
      updatedPatientStates.set(newState, currentCount + count);
    }

    this.patients = updatedPatientStates;
  }

  public report(): PatientsRegister {
    return Object.fromEntries(
      Object.values(PatientState).map((state) => [
        state,
        this.patients.get(state) || 0,
      ]),
    );
  }

  private validateDrugs(drugs: string[]): void {
    for (const drug of drugs) {
      if (!Object.values(Drug).includes(drug as Drug)) {
        throw new Error(`Invalid drug: ${drug}`);
      }
    }
  }

  private validateInitialState(initialState: PatientsRegister): void {
    for (const state in initialState) {
      if (!Object.values(PatientState).includes(state as PatientState)) {
        throw new Error(`Invalid patient state: ${state}`);
      }
    }
  }

  setRuleRegistry(ruleEngine: RuleRegistry): void {
    this.ruleRegistry = ruleEngine;
  }
}
