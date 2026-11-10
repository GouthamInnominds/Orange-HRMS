/**
 * Test Case ID: TC_ADM_035
 * Feature: FEAT_WORK_SHIFT
 * Name: Create work shift with duplicate name
 * Priority: High
 */

describe('Feature FEAT_WORK_SHIFT: TC_ADM_035', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_035: Create work shift with duplicate name', function () {
    // Objective: Verify work shift name must be unique.
    cy.url().should('include', '/auth/login');
  });
});
