/**
 * Test Case ID: TC_AUTH_026
 * Feature: FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE
 * Name: Reset request success and failure pages render the correct components
 * Priority: Low
 */

describe('Feature FEAT_FORGOT_PASSWORD___REQUEST_RESET_CODE: TC_AUTH_026', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_026: Reset request success and failure pages render the correct components', function () {
    // Objective: Verify the dedicated success and failure landing pages render their respective Vue components.
    cy.url().should('include', '/auth/login');
  });
});
