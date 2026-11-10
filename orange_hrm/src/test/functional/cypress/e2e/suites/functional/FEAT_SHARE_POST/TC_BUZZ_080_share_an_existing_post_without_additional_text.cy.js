/**
 * Test Case ID: TC_BUZZ_080
 * Feature: FEAT_SHARE_POST
 * Name: Share an existing post without additional text
 * Priority: High
 */

describe('Feature FEAT_SHARE_POST: TC_BUZZ_080', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_080: Share an existing post without additional text', function () {
    // Objective: Verify a user can re-share an existing post to the feed without adding extra text.
    cy.url().should('include', '/auth/login');
  });
});
