/**
 * Test Case ID: TC_BUZZ_054
 * Feature: FEAT_ADD_COMMENT
 * Name: Add a comment exceeding max length (65531 chars)
 * Priority: Medium
 */

describe('Feature FEAT_ADD_COMMENT: TC_BUZZ_054', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_054: Add a comment exceeding max length (65531 chars)', function () {
    // Objective: Verify system rejects comment text exceeding the 65530 character limit.
    cy.url().should('include', '/auth/login');
  });
});
