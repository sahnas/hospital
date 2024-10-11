import { Expect, Setup, Test, TestFixture } from "alsatian";
import { Quarantine } from "../services/quarantine";
import { createDefaultRuleRegistry, RuleCategory } from "../domain/rules";
import { PatientState } from "../domain/patients";
import { Drug } from "../domain/treatments/drugs";

@TestFixture()
export class QuarantineTest {
  private quarantine: Quarantine;

  @Setup
  public setup() {
    // The responsibility of the Quarantine object is to simulate diseases on a group of patients.
    // It is initialized with a list of patients' health status, separated by a comma.
    // Each health status is described by one or more characters
    // (in the test below, we will always have only one disease / patient)
    // The characters mean:
    // H : Healthy
    // F : Fever
    // D : Diabetes
    // T : Tuberculosis

    this.quarantine = new Quarantine({
      F: 1,
      H: 2,
      D: 3,
      T: 1,
      X: 0,
    });
    // Quarantine provides medicines to the patients, but can not target a specific group of patient.
    // The same medicines are always given to all the patients.

    // Then Quarantine can provide a report that gives the number of patients that have the given disease.
    // X means Dead
  }

  @Test()
  public beforeTreatment(): void {
    // diabetics die without insulin
    Expect(this.quarantine.report()).toEqual({
      F: 1,
      H: 2,
      D: 3,
      T: 1,
      X: 0,
    });
  }

  @Test()
  public noTreatment(): void {
    this.quarantine.wait40Days();
    // diabetics die without insulin
    Expect(this.quarantine.report()).toEqual({
      F: 1,
      H: 2,
      D: 0,
      T: 1,
      X: 3,
    });
  }

  @Test()
  public aspirin(): void {
    this.quarantine.setDrugs(["As"]);
    this.quarantine.wait40Days();
    // aspirin cure Fever
    Expect(this.quarantine.report()).toEqual({
      F: 0,
      H: 3,
      D: 0,
      T: 1,
      X: 3,
    });
  }

  @Test()
  public antibiotic(): void {
    this.quarantine.setDrugs(["An"]);
    this.quarantine.wait40Days();
    // antibiotic cure Tuberculosis
    // but healthy people catch Fever if mixed with insulin.
    Expect(this.quarantine.report()).toEqual({
      F: 1,
      H: 3,
      D: 0,
      T: 0,
      X: 3,
    });
  }

  @Test()
  public insulin(): void {
    this.quarantine.setDrugs(["I"]);
    this.quarantine.wait40Days();
    // insulin prevent diabetic subject from dying, does not cure Diabetes,
    Expect(this.quarantine.report()).toEqual({
      F: 1,
      H: 2,
      D: 3,
      T: 1,
      X: 0,
    });
  }

  @Test()
  public antibioticPlusInsulin(): void {
    this.quarantine.setDrugs(["An", "I"]);
    this.quarantine.wait40Days();
    // if insulin is mixed with antibiotic, healthy people catch Fever
    Expect(this.quarantine.report()).toEqual({
      F: 3,
      H: 1,
      D: 3,
      T: 0,
      X: 0,
    });
  }

  @Test()
  public paracetamol(): void {
    this.quarantine.setDrugs(["P"]);
    this.quarantine.wait40Days();
    // paracetamol heals fever
    Expect(this.quarantine.report()).toEqual({
      F: 0,
      H: 3,
      D: 0,
      T: 1,
      X: 3,
    });
  }

  @Test()
  public paracetamolAndAspirin(): void {
    this.quarantine.setDrugs(["P", "As"]);
    this.quarantine.wait40Days();
    // paracetamol kills subject if mixed with aspirin
    Expect(this.quarantine.report()).toEqual({
      F: 0,
      H: 0,
      D: 0,
      T: 0,
      X: 7,
    });
  }

  @Test()
  public multipleDrugsWithoutInteraction(): void {
    this.quarantine.setDrugs(["As", "An"]);
    this.quarantine.wait40Days();
    // Aspirin cures Fever, Antibiotic cures Tuberculosis, Diabetics die
    Expect(this.quarantine.report()).toEqual({
      F: 0,
      H: 4,
      D: 0,
      T: 0,
      X: 3,
    });
  }

  @Test()
  public insulinPreventsDeathButDoesNotCureDiabetes(): void {
    this.quarantine.setDrugs(["I", "As"]);
    this.quarantine.wait40Days();
    // Insulin prevents diabetics from dying, Aspirin cures Fever
    Expect(this.quarantine.report()).toEqual({
      F: 0,
      H: 3,
      D: 3,
      T: 1,
      X: 0,
    });
  }

  @Test()
  public rulesPrecedence(): void {
    const criticalQuarantine = new Quarantine({
      F: 2,
      H: 2,
      D: 2,
      T: 2,
      X: 0,
    });
    criticalQuarantine.setDrugs(["P", "As", "An", "I"]);
    criticalQuarantine.wait40Days();
    // Paracetamol and Aspirin cause death (takes precedence over other effects)
    Expect(criticalQuarantine.report()).toEqual({
      F: 0,
      H: 0,
      D: 0,
      T: 0,
      X: 8,
    });
  }

  @Test()
  public onlyOneStateChangePerSimulation(): void {
    const complexQuarantine = new Quarantine({
      F: 2,
      H: 2,
      D: 2,
      T: 2,
      X: 0,
    });
    complexQuarantine.setDrugs(["As", "An", "I"]);
    complexQuarantine.wait40Days();
    // Aspirin cures Fever, Antibiotic cures Tuberculosis, Insulin saves Diabetics,
    // Healthy people catch Fever due to Antibiotic + Insulin
    Expect(complexQuarantine.report()).toEqual({
      F: 2,
      H: 4,
      D: 2,
      T: 0,
      X: 0,
    });
  }

  @Test()
  public invalidDrugInput(): void {
    Expect(() => this.quarantine.setDrugs(["InvalidDrug"])).toThrow();
  }

  @Test()
  public emptyDrugList(): void {
    this.quarantine.setDrugs([]);
    this.quarantine.wait40Days();
    // Should be the same as noTreatment
    Expect(this.quarantine.report()).toEqual({
      F: 1,
      H: 2,
      D: 0,
      T: 1,
      X: 3,
    });
  }

  @Test()
  public constructorWithInvalidState(): void {
    const invalidState = { F: 1, H: 1, Z: 1 };
    Expect(() => new Quarantine(invalidState)).toThrow();
  }
}

@TestFixture()
export class QuarantineExtensibilityTest {
  @Test()
  public addNewRule(): void {
    const quarantine = new Quarantine({ H: 1, F: 1 });
    const customRuleRegistry = createDefaultRuleRegistry();

    customRuleRegistry.addRule({
      name: "Magic Cure",
      category: RuleCategory.PositiveOutcome,
      diagnosisContext: (state, drugs) =>
        state === PatientState.Fever && drugs.has(Drug.Insulin),
      consequence: () => PatientState.Healthy,
    });

    quarantine.setRuleRegistry(customRuleRegistry);
    quarantine.setDrugs([Drug.Insulin]);
    quarantine.wait40Days();

    Expect(quarantine.report()).toEqual({
      F: 0,
      H: 2,
      D: 0,
      T: 0,
      X: 0,
    });
  }
}
