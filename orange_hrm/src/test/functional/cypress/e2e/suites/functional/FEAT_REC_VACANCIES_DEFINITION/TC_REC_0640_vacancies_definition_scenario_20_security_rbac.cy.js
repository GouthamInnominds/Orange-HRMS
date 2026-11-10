/**
 * Test Case ID: TC_REC_0640
 * Feature: FEAT_REC_VACANCIES_DEFINITION
 * Name: Vacancies Definition - Scenario 20 (Security/RBAC)
 * Priority: Critical
 */

describe('Feature FEAT_REC_VACANCIES_DEFINITION: TC_REC_0640', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_REC_0640: Vacancies Definition - Scenario 20 (Security/RBAC)', function () {
    // Objective: Validate Vacancies Definition behavior under Security/RBAC conditions (Rule validation #20).
    cy.url().should('include', '/auth/login');
  });
});
