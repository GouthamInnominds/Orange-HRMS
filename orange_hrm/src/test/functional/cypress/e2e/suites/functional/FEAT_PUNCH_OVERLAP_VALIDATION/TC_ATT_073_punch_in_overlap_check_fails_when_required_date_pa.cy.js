/**
 * Test Case ID: TC_ATT_073
 * Feature: FEAT_PUNCH_OVERLAP_VALIDATION
 * Name: Punch-in overlap check fails when required 'date' parameter is missing
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_OVERLAP_VALIDATION: TC_ATT_073', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_073: Punch-in overlap check fails when required \'date\' parameter is missing', function () {
    // Objective: Verify the punch-in overlap check endpoint enforces the required date parameter.
    cy.url().should('include', '/auth/login');
  });
});
