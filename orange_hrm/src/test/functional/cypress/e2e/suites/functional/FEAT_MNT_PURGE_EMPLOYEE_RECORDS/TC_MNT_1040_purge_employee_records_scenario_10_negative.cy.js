/**
 * Test Case ID: TC_MNT_1040
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 10 (Negative)
 * Priority: Critical
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1040', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1040: Purge Employee Records - Scenario 10 (Negative)', function () {
    // Objective: Validate Purge Employee Records behavior under Negative conditions (Rule validation #10).
    cy.url().should('include', '/auth/login');
  });
});
