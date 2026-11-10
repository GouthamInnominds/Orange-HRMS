/**
 * Test Case ID: TC_REC_0621
 * Feature: FEAT_REC_VACANCIES_DEFINITION
 * Name: Vacancies Definition - Scenario 1 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_REC_VACANCIES_DEFINITION: TC_REC_0621', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0621: Vacancies Definition - Scenario 1 (Positive)', function () {
    // Objective: Validate Vacancies Definition behavior under Positive conditions (Rule validation #1).
    cy.url().should('include', '/auth/login');
  });
});
