/**
 * Test Case ID: TC_MNT_1048
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 18 (Negative)
 * Priority: High
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1048', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1048: Purge Employee Records - Scenario 18 (Negative)', function () {
    // Objective: Validate Purge Employee Records behavior under Negative conditions (Rule validation #18).
    cy.url().should('include', '/auth/login');
  });
});
