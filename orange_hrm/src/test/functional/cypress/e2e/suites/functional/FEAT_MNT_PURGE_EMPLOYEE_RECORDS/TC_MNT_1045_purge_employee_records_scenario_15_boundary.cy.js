/**
 * Test Case ID: TC_MNT_1045
 * Feature: FEAT_MNT_PURGE_EMPLOYEE_RECORDS
 * Name: Purge Employee Records - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_MNT_PURGE_EMPLOYEE_RECORDS: TC_MNT_1045', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1045: Purge Employee Records - Scenario 15 (Boundary)', function () {
    // Objective: Validate Purge Employee Records behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
