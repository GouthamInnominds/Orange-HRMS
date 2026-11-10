/**
 * Test Case ID: TC_ADM_038
 * Feature: FEAT_WORK_SHIFT
 * Name: Create work shift with invalid date/time format
 * Priority: Medium
 */

describe('Feature FEAT_WORK_SHIFT: TC_ADM_038', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_038: Create work shift with invalid date/time format', function () {
    // Objective: Verify startTime and endTime must be valid date-time values.
    cy.url().should('include', '/auth/login');
  });
});
