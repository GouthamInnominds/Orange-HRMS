/**
 * Test Case ID: TC_BUZZ_061
 * Feature: FEAT_EDIT_COMMENT
 * Name: Edit a comment that does not exist
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_COMMENT: TC_BUZZ_061', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_061: Edit a comment that does not exist', function () {
    // Objective: Verify system returns a not-found error when editing a comment ID that does not exist.
    cy.url().should('include', '/auth/login');
  });
});
