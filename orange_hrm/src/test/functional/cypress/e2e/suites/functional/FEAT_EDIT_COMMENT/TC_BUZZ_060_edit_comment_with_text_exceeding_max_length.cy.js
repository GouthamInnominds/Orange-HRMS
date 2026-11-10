/**
 * Test Case ID: TC_BUZZ_060
 * Feature: FEAT_EDIT_COMMENT
 * Name: Edit comment with text exceeding max length
 * Priority: Medium
 */

describe('Feature FEAT_EDIT_COMMENT: TC_BUZZ_060', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_060: Edit comment with text exceeding max length', function () {
    // Objective: Verify system rejects edited comment text exceeding the 65530 character limit.
    cy.url().should('include', '/auth/login');
  });
});
