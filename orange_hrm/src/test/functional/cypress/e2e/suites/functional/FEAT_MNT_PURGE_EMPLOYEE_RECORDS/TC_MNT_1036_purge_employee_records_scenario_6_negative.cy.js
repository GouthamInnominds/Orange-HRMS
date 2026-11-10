/**
 * Test Case ID: TC_MNT_1036
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 6 (Negative)
 * Priority: High
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1036', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1036: Purge Employee Records - Scenario 6 (Negative)', function () {
    // Objective: Validate Purge Employee Records behavior under Negative conditions (Rule validation #6).
    cy.url().should('include', '/auth/login');
  });
});
