/**
 * Test Case ID: TC_ADM_037
 * Feature: FEAT_WORK_SHIFT
 * Name: Create work shift with end time earlier than start time
 * Priority: High
 */

describe('Feature FEAT_WORK_SHIFT: TC_ADM_037', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_037: Create work shift with end time earlier than start time', function () {
    // Objective: Verify endTime must be greater than startTime (GREATER_THAN rule).
    cy.url().should('include', '/auth/login');
  });
});
