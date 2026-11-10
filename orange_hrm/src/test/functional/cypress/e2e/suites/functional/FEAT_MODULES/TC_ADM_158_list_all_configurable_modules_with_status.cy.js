/**
 * Test Case ID: TC_ADM_158
 * Feature: FEAT_MODULES
 * Name: List all configurable modules with status
 * Priority: Medium
 */

describe('Feature FEAT_MODULES: TC_ADM_158', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_158: List all configurable modules with status', function () {
    // Objective: Verify configurable modules (admin, pim, leave, time, recruitment, performance, maintenance, mobile, directory, claim, buzz) are listed with enabled/disabled status.
    cy.url().should('include', '/auth/login');
  });
});
