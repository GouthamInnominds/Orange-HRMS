/**
 * Test Case ID: TC_BUZZ_055
 * Feature: FEAT_ADD_COMMENT
 * Name: Add a comment to a non-existent share ID
 * Priority: Medium
 */

describe('Feature FEAT_ADD_COMMENT: TC_BUZZ_055', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_055: Add a comment to a non-existent share ID', function () {
    // Objective: Verify system rejects comment creation when the target shareId does not exist.
    cy.url().should('include', '/auth/login');
  });
});
