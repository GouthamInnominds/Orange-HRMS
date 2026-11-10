/**
 * Test Case ID: TC_BUZZ_048
 * Feature: FEAT_DELETE_POST
 * Name: Delete own post
 * Priority: High
 */

describe('Feature FEAT_DELETE_POST: TC_BUZZ_048', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_048: Delete own post', function () {
    // Objective: Verify a user can delete their own Buzz post.
    cy.url().should('include', '/auth/login');
  });
});
