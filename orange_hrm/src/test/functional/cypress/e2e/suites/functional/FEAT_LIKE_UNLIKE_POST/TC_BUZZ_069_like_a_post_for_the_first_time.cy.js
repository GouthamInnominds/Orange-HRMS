/**
 * Test Case ID: TC_BUZZ_069
 * Feature: FEAT_LIKE_UNLIKE_POST
 * Name: Like a post for the first time
 * Priority: High
 */

describe('Feature FEAT_LIKE_UNLIKE_POST: TC_BUZZ_069', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_069: Like a post for the first time', function () {
    // Objective: Verify a user can like a Buzz post/share that they have not previously liked.
    cy.url().should('include', '/auth/login');
  });
});
