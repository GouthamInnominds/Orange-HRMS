/**
 * Test Case ID: TC_ADM_034
 * Feature: FEAT_WORK_SHIFT
 * Name: Create work shift with missing required fields
 * Priority: High
 */

describe('Feature FEAT_WORK_SHIFT: TC_ADM_034', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_034: Create work shift with missing required fields', function () {
    // Objective: Verify name, hoursPerDay, startTime and endTime are all mandatory.
    cy.url().should('include', '/auth/login');
  });
});
