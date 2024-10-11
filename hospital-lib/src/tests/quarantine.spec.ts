import { beforeEach, describe, expect, test } from "@jest/globals";
import { Quarantine } from "../services/quarantine";
import { createDefaultRuleRegistry, RuleCategory } from "../domain/rules";
import { Drug } from "../domain/treatments/drugs";
import { PatientState } from "../domain/patients";

describe("QuarantineTest", () => {
  let quarantine: Quarantine;

  beforeEach(() => {
    quarantine = new Quarantine({
      F: 1, // Fever
      H: 1, // Healthy
      D: 1, // Diabetes
      T: 1, // Tuberculosis
      X: 0, // Dead
    });
  });

  test("Aspirin cures Fever", () => {
    quarantine.setDrugs([Drug.Aspirin]);
    quarantine.wait40Days();
    expect(quarantine.report()).toEqual({
      F: 0,
      H: 2, // Fever cured
      D: 0, // Diabetic dies without insulin
      T: 1,
      X: 1, // Diabetic patient dies
    });
  });

  test("Antibiotic cures Tuberculosis", () => {
    quarantine.setDrugs([Drug.Antibiotic]);
    quarantine.wait40Days();
    expect(quarantine.report()).toEqual({
      F: 1,
      H: 2, // Tuberculosis cured
      D: 0, // Diabetic dies without insulin
      T: 0, // Tuberculosis cured
      X: 1, // Diabetic patient dies
    });
  });

  test("Sick patients remain sick without proper treatment", () => {
    quarantine.wait40Days();
    expect(quarantine.report()).toEqual({
      F: 1,
      H: 1,
      D: 0, // Diabetic dies without insulin
      T: 1,
      X: 1, // Diabetic patient dies
    });
  });

  test("Insulin prevents diabetic patients from dying", () => {
    quarantine.setDrugs([Drug.Insulin]);
    quarantine.wait40Days();
    expect(quarantine.report()).toEqual({
      F: 1,
      H: 1,
      D: 1, // Diabetic survives
      T: 1,
      X: 0, // No deaths
    });
  });

  test("Insulin mixed with antibiotic causes Fever in healthy people", () => {
    quarantine.setDrugs([Drug.Insulin, Drug.Antibiotic]);
    quarantine.wait40Days();
    expect(quarantine.report()).toEqual({
      F: 2, // Original fever patient + healthy patient who got fever
      H: 1, // Tuberculosis patient cured
      D: 1, // Diabetic patient survives due to insulin
      T: 0, // Tuberculosis cured
      X: 0, // No deaths
    });
  });

  test("Paracetamol cures Fever", () => {
    quarantine.setDrugs([Drug.Paracetamol]);
    quarantine.wait40Days();
    expect(quarantine.report()).toEqual({
      F: 0, // Fever cured
      H: 2, // Fever patient becomes healthy
      D: 0, // Diabetic dies without insulin
      T: 1,
      X: 1, // Diabetic patient dies
    });
  });

  test("Paracetamol kills subjects if mixed with Aspirin", () => {
    quarantine.setDrugs([Drug.Paracetamol, Drug.Aspirin]);
    quarantine.wait40Days();
    expect(quarantine.report()).toEqual({
      F: 0,
      H: 0,
      D: 0,
      T: 0,
      X: 4, // All patients die
    });
  });

  test("Patients change state only once per simulation", () => {
    const complexQuarantine = new Quarantine({
      F: 2,
      H: 2,
      D: 2,
      T: 2,
      X: 0,
    });
    complexQuarantine.setDrugs([Drug.Aspirin, Drug.Antibiotic, Drug.Insulin]);
    complexQuarantine.wait40Days();
    expect(complexQuarantine.report()).toEqual({
      F: 2, // Healthy patients become Fever due to Insulin + Antibiotic
      H: 4, // Fever and Tuberculosis patients are cured
      D: 2, // Diabetic patients survive due to Insulin
      T: 0, // Tuberculosis is cured
      X: 0, // No deaths
    });
  });

  test("Death-causing rules take precedence", () => {
    const criticalQuarantine = new Quarantine({
      F: 2,
      H: 2,
      D: 2,
      T: 2,
      X: 0,
    });
    criticalQuarantine.setDrugs([
      Drug.Paracetamol,
      Drug.Aspirin,
      Drug.Antibiotic,
      Drug.Insulin,
    ]);
    criticalQuarantine.wait40Days();
    expect(criticalQuarantine.report()).toEqual({
      F: 0,
      H: 0,
      D: 0,
      T: 0,
      X: 8, // All patients die due to Paracetamol + Aspirin, which takes precedence
    });
  });
});

describe("QuarantineExtensibilityTest", () => {
  test("addNewRule", () => {
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

    expect(quarantine.report()).toEqual({
      F: 0,
      H: 2,
      D: 0,
      T: 0,
      X: 0,
    });
  });
});
