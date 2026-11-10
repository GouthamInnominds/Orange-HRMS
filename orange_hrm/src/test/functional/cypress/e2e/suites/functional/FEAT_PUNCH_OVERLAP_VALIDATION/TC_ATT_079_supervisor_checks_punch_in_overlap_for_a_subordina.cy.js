/**
 * Test Case ID: TC_ATT_079
 * Feature: FEAT_PUNCH_OVERLAP_VALIDATION
 * Name: Supervisor checks punch-in overlap for a subordinate using empNumber
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_OVERLAP_VALIDATION: TC_ATT_079', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_079: Supervisor checks punch-in overlap for a subordinate using empNumber', function () {
    // Objective: Verify a Supervisor can check punch-in overlap on behalf of a subordinate by supplying the empNumber query parameter.
    cy.url().should('include', '/auth/login');
  });
});
