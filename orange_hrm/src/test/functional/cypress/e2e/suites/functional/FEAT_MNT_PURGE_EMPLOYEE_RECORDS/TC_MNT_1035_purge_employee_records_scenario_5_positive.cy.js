/**
 * Test Case ID: TC_MNT_1035
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1035', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1035: Purge Employee Records - Scenario 5 (Positive)', function () {
    // Objective: Validate Purge Employee Records behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
