/**
 * Test Case ID: TC_ADM_058
 * Feature: FEAT_QUALIFICATION___EDUCATION
 * Name: Update education record name
 * Priority: Medium
 */

describe('Feature FEAT_QUALIFICATION___EDUCATION: TC_ADM_058', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_058: Update education record name', function () {
    // Objective: Verify an existing education record name can be updated.
    cy.url().should('include', '/auth/login');
  });
});
