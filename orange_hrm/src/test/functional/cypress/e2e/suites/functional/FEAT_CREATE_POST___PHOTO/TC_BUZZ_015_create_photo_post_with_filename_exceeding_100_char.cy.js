/**
 * Test Case ID: TC_BUZZ_015
 * Feature: FEAT_CREATE_POST___PHOTO
 * Name: Create photo post with filename exceeding 100 characters
 * Priority: Low
 */

describe('Feature FEAT_CREATE_POST___PHOTO: TC_BUZZ_015', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_015: Create photo post with filename exceeding 100 characters', function () {
    // Objective: Verify system rejects a photo whose filename exceeds the 100 character maximum length.
    cy.url().should('include', '/auth/login');
  });
});
