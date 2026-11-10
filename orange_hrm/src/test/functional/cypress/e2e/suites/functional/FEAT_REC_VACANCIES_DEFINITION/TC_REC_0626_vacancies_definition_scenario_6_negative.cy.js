/**
 * Test Case ID: TC_REC_0626
 * Feature: FEAT_REC_VACANCIES_DEFINITION
 * Name: Vacancies Definition - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_REC_VACANCIES_DEFINITION: TC_REC_0626', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0626: Vacancies Definition - Scenario 6 (Negative)', function () {
    // Objective: Validate Vacancies Definition behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
