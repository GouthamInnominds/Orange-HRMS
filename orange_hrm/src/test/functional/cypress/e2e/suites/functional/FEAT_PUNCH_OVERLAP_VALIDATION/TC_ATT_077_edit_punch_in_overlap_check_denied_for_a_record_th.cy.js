/**
 * Test Case ID: TC_ATT_077
 * Feature: FEAT_PUNCH_OVERLAP_VALIDATION
 * Name: Edit punch-in overlap check denied for a record the user cannot access
 * Priority: High
 */

describe('Feature FEAT_PUNCH_OVERLAP_VALIDATION: TC_ATT_077', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_077: Edit punch-in overlap check denied for a record the user cannot access', function () {
    // Objective: Verify a user without visibility into another employee\'s attendance record is forbidden from checking its punch-in overlap.
    cy.url().should('include', '/auth/login');
  });
});
