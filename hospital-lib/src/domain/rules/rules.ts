import { PatientState } from "../patients/patient-states";
import { Drug } from "../treatments/drugs";
import { RuleCategory } from "./rule-categories";
import { Rule } from "./rule";
import { RuleRegistry } from "./rule-registry";

export const defaultRules: Rule[] = [
  {
    name: "Paracetamol and Aspirin Cause Death",
    category: RuleCategory.CriticalOutcome,
    diagnosisContext: (_, drugs) =>
      drugs.has(Drug.Paracetamol) && drugs.has(Drug.Aspirin),
    consequence: () => PatientState.Dead,
  },
  {
    name: "Diabetic Patient Without Insulin Dies",
    category: RuleCategory.CriticalOutcome,
    diagnosisContext: (state, drugs) =>
      state === PatientState.Diabetes && !drugs.has(Drug.Insulin),
    consequence: () => PatientState.Dead,
  },
  {
    name: "Insulin Prevents Death for Diabetic Patients",
    category: RuleCategory.PositiveOutcome,
    diagnosisContext: (state, drugs) =>
      state === PatientState.Diabetes && drugs.has(Drug.Insulin),
    consequence: () => PatientState.Diabetes,
  },
  {
    name: "Aspirin Cures Fever",
    category: RuleCategory.PositiveOutcome,
    diagnosisContext: (state, drugs) =>
      state === PatientState.Fever && drugs.has(Drug.Aspirin),
    consequence: () => PatientState.Healthy,
  },
  {
    name: "Paracetamol Cures Fever",
    category: RuleCategory.PositiveOutcome,
    diagnosisContext: (state, drugs) =>
      state === PatientState.Fever && drugs.has(Drug.Paracetamol),
    consequence: () => PatientState.Healthy,
  },
  {
    name: "Antibiotic Cures Tuberculosis",
    category: RuleCategory.PositiveOutcome,
    diagnosisContext: (state, drugs) =>
      state === PatientState.Tuberculosis && drugs.has(Drug.Antibiotic),
    consequence: () => PatientState.Healthy,
  },
  {
    name: "Insulin and Antibiotic Cause Fever in Healthy Patients",
    category: RuleCategory.AdverseReaction,
    diagnosisContext: (state, drugs) =>
      state === PatientState.Healthy &&
      drugs.has(Drug.Insulin) &&
      drugs.has(Drug.Antibiotic),
    consequence: () => PatientState.Fever,
  },
  {
    name: "No Effect",
    category: RuleCategory.NeutralOutcome,
    diagnosisContext: () => true,
    consequence: (state) => state,
  },
];

export function createDefaultRuleRegistry(): RuleRegistry {
  return new RuleRegistry(defaultRules);
}
