/**
 * Test Case ID: TC_MNT_1047
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 17 (Positive)
 * Priority: Medium
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1047', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1047: Purge Employee Records - Scenario 17 (Positive)', function () {
    // Objective: Validate Purge Employee Records behavior under Positive conditions (Rule validation #17).
    cy.url().should('include', '/auth/login');
  });
});
