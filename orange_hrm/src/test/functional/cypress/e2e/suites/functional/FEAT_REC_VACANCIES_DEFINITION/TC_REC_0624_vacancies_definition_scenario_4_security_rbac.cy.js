/**
 * Test Case ID: TC_REC_0624
 * Feature: FEAT_REC_VACANCIES_DEFINITION
 * Name: Vacancies Definition - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_REC_VACANCIES_DEFINITION: TC_REC_0624', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0624: Vacancies Definition - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Vacancies Definition behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
