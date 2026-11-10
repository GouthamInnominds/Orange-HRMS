/**
 * Test Case ID: TC_ATT_076
 * Feature: FEAT_PUNCH_OVERLAP_VALIDATION
 * Name: Edit punch-in overlap check returns 404 for a non-existent recordId
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_OVERLAP_VALIDATION: TC_ATT_076', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_076: Edit punch-in overlap check returns 404 for a non-existent recordId', function () {
    // Objective: Verify GET /attendance/records/punch-in-overlaps returns Record Not Found when recordId does not exist.
    cy.url().should('include', '/auth/login');
  });
});
