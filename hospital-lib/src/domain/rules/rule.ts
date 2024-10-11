import { Drug } from "../treatments/drugs";
import { PatientState } from "../patients/patient-states";
import { RuleCategory } from "./rule-categories";

export interface BaseRule {
  name: string;
  category: RuleCategory;
  consequence: (state: PatientState) => PatientState;
}

export interface SpecificRule extends BaseRule {
  diagnosisContext: (state: PatientState, drugs: Set<Drug>) => boolean;
}

export interface DefaultRule extends BaseRule {
  type: RuleCategory.NeutralOutcome;
}

export type Rule = SpecificRule | DefaultRule;
