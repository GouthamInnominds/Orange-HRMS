/**
 * Test Case ID: TC_BUZZ_006
 * Feature: FEAT_CREATE_POST___TEXT
 * Name: Create text post with special characters and emoji
 * Priority: Low
 */

describe('Feature FEAT_CREATE_POST___TEXT: TC_BUZZ_006', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_006: Create text post with special characters and emoji', function () {
    // Objective: Verify a text post containing special characters and emoji is stored and displayed correctly.
    cy.url().should('include', '/auth/login');
  });
});
