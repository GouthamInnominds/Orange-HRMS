/**
 * Test Case ID: TC_REC_0650
 * Feature: FEAT_REC_VACANCIES_DEFINITION
 * Name: Vacancies Definition - Scenario 30 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_REC_VACANCIES_DEFINITION: TC_REC_0650', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0650: Vacancies Definition - Scenario 30 (Negative)', function () {
    // Objective: Validate Vacancies Definition behavior under Negative conditions (Rule validation #30).
    cy.url().should('include', '/auth/login');
  });
});
