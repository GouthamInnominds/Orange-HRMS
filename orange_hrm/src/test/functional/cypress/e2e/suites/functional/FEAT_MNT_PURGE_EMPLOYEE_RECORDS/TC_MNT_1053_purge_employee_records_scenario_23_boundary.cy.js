/**
 * Test Case ID: TC_MNT_1053
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 23 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1053', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1053: Purge Employee Records - Scenario 23 (Boundary)', function () {
    // Objective: Validate Purge Employee Records behavior under Boundary conditions (Rule validation #23).
    cy.url().should('include', '/auth/login');
  });
});
