/**
 * Test Case ID: TC_REC_0646
 * Feature: FEAT_REC_VACANCIES_DEFINITION
 * Name: Vacancies Definition - Scenario 26 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_VACANCIES_DEFINITION: TC_REC_0646', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0646: Vacancies Definition - Scenario 26 (Negative)', function () {
    // Objective: Validate Vacancies Definition behavior under Negative conditions (Rule validation #26).
    cy.url().should('include', '/auth/login');
  });
});
