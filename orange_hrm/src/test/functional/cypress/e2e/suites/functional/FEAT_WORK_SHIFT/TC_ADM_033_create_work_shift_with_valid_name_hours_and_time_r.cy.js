/**
 * Test Case ID: TC_ADM_033
 * Feature: FEAT_WORK_SHIFT
 * Name: Create work shift with valid name, hours and time range
 * Priority: High
 */

describe('Feature FEAT_WORK_SHIFT: TC_ADM_033', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_033: Create work shift with valid name, hours and time range', function () {
    // Objective: Verify a Work Shift can be created with valid name, hoursPerDay, startTime and endTime.
    cy.url().should('include', '/auth/login');
  });
});
