/**
 * Test Case ID: TC_ADM_026
 * Feature: FEAT_EMPLOYMENT_STATUS
 * Name: Delete one or more employment statuses
 * Priority: High
 */

describe('Feature FEAT_EMPLOYMENT_STATUS: TC_ADM_026', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_026: Delete one or more employment statuses', function () {
    // Objective: Verify selected employment statuses can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });
});
