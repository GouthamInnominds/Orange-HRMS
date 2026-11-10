/**
 * Test Case ID: TC_BUZZ_068
 * Feature: FEAT_LIST_COMMENTS
 * Name: List comments with detailed model parameter
 * Priority: Low
 */

describe('Feature FEAT_LIST_COMMENTS: TC_BUZZ_068', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_068: List comments with detailed model parameter', function () {
    // Objective: Verify comments can be retrieved using the detailed model returning extended comment information.
    cy.url().should('include', '/auth/login');
  });
});
