import { PatientState } from "../patients/patient-states";
import { Drug } from "../treatments/drugs";
import { Rule } from "./rule";

export class RuleRegistry {
  private rules: Rule[] = [];

  constructor(rules: Rule[]) {
    this.rules = rules;
    this.sortRulesByPriority();
  }

  private sortRulesByPriority(): void {
    this.rules.sort((a, b) => a.category - b.category);
  }

  public addRule(rule: Rule): void {
    this.rules.push(rule);
    this.sortRulesByPriority();
  }

  public applyRules(state: PatientState, drugs: Set<Drug>): PatientState {
    for (const rule of this.rules) {
      if ('diagnosisContext' in rule && rule.diagnosisContext(state, drugs)) {
        return rule.consequence(state);
      }
    }

    return state;
  }
}
