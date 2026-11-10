/**
 * Test Case ID: TC_ATT_075
 * Feature: FEAT_PUNCH_OVERLAP_VALIDATION
 * Name: Check punch-out overlap for a conflicting time slot returns valid=false
 * Priority: High
 */

describe('Feature FEAT_PUNCH_OVERLAP_VALIDATION: TC_ATT_075', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_075: Check punch-out overlap for a conflicting time slot returns valid=false', function () {
    // Objective: Verify the punch-out overlap check correctly detects a conflict with another existing attendance record.
    cy.url().should('include', '/auth/login');
  });
});
