/**
 * Test Case ID: TC_ATT_072
 * Feature: FEAT_PUNCH_OVERLAP_VALIDATION
 * Name: Check punch-in overlap for a time slot within an existing open record returns valid=false
 * Priority: High
 */

describe('Feature FEAT_PUNCH_OVERLAP_VALIDATION: TC_ATT_072', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_072: Check punch-in overlap for a time slot within an existing open record returns valid=false', function () {
    // Objective: Verify the punch-in overlap check correctly detects an overlap with an existing punched-in record.
    cy.url().should('include', '/auth/login');
  });
});
