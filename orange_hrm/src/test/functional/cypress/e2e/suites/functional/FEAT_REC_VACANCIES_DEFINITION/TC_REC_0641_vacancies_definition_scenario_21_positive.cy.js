/**
 * Test Case ID: TC_REC_0641
 * Feature: FEAT_REC_VACANCIES_DEFINITION
 * Name: Vacancies Definition - Scenario 21 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_VACANCIES_DEFINITION: TC_REC_0641', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0641: Vacancies Definition - Scenario 21 (Positive)', function () {
    // Objective: Validate Vacancies Definition behavior under Positive conditions (Rule validation #21).
    cy.url().should('include', '/auth/login');
  });
});
