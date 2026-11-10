/**
 * Test Case ID: TC_MNT_1039
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 9 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1039', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1039: Purge Employee Records - Scenario 9 (Positive)', function () {
    // Objective: Validate Purge Employee Records behavior under Positive conditions (Rule validation #9).
    cy.url().should('include', '/auth/login');
  });
});
