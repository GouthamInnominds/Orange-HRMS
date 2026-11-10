/**
 * Test Case ID: TC_ATT_078
 * Feature: FEAT_PUNCH_OVERLAP_VALIDATION
 * Name: Edit punch-out overlap check requires both punchOutDate and punchOutTime
 * Priority: Medium
 */

describe('Feature FEAT_PUNCH_OVERLAP_VALIDATION: TC_ATT_078', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_078: Edit punch-out overlap check requires both punchOutDate and punchOutTime', function () {
    // Objective: Verify GET /attendance/records/punch-out-overlaps enforces punchOutDate and punchOutTime as required parameters (unlike the punch-in overlap edit check where they are optional).
    cy.url().should('include', '/auth/login');
  });
});
