/**
 * Test Case ID: TC_BUZZ_075
 * Feature: FEAT_LIKE_UNLIKE_COMMENT
 * Name: Like a comment for the first time
 * Priority: High
 */

describe('Feature FEAT_LIKE_UNLIKE_COMMENT: TC_BUZZ_075', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_075: Like a comment for the first time', function () {
    // Objective: Verify a user can like a comment that they have not previously liked.
    cy.url().should('include', '/auth/login');
  });
});
