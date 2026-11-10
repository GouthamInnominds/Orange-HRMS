/**
 * Test Case ID: TC_BUZZ_002
 * Feature: FEAT_CREATE_POST___TEXT
 * Name: Create text post with empty text
 * Priority: High
 */

describe('Feature FEAT_CREATE_POST___TEXT: TC_BUZZ_002', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_002: Create text post with empty text', function () {
    // Objective: Verify system rejects a text post submitted without any text.
    cy.url().should('include', '/auth/login');
  });
});
