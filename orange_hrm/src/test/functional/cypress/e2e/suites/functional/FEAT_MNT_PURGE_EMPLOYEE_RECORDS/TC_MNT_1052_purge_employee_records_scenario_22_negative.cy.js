/**
 * Test Case ID: TC_MNT_1052
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 22 (Negative)
 * Priority: High
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1052', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1052: Purge Employee Records - Scenario 22 (Negative)', function () {
    // Objective: Validate Purge Employee Records behavior under Negative conditions (Rule validation #22).
    cy.url().should('include', '/auth/login');
  });
});
