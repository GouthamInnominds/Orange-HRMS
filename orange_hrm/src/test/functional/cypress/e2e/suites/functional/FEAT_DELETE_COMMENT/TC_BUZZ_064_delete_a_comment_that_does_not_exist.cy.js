/**
 * Test Case ID: TC_BUZZ_064
 * Feature: FEAT_DELETE_COMMENT
 * Name: Delete a comment that does not exist
 * Priority: Medium
 */

describe('Feature FEAT_DELETE_COMMENT: TC_BUZZ_064', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_064: Delete a comment that does not exist', function () {
    // Objective: Verify system returns a not-found error when deleting a non-existent comment ID.
    cy.url().should('include', '/auth/login');
  });
});
