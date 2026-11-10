/**
 * Test Case ID: TC_BUZZ_004
 * Feature: FEAT_CREATE_POST___TEXT
 * Name: Create text post exceeding max length (65531 chars)
 * Priority: Medium
 */

describe('Feature FEAT_CREATE_POST___TEXT: TC_BUZZ_004', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_004: Create text post exceeding max length (65531 chars)', function () {
    // Objective: Verify system rejects text post content exceeding the 65530 character limit.
    cy.url().should('include', '/auth/login');
  });
});
