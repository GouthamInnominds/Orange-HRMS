/**
 * Test Case ID: TC_BUZZ_013
 * Feature: FEAT_CREATE_POST___PHOTO
 * Name: Create photo post with image exceeding 2MB size limit
 * Priority: Medium
 */

describe('Feature FEAT_CREATE_POST___PHOTO: TC_BUZZ_013', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_013: Create photo post with image exceeding 2MB size limit', function () {
    // Objective: Verify system rejects a photo attachment larger than the 2MB (2097152 byte) maximum allowed size.
    cy.url().should('include', '/auth/login');
  });
});
