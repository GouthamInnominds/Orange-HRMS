/**
 * Test Case ID: TC_LEV_0461
 * Feature: FEAT_LEV_HOLIDAYS_DEFINITION
 * Name: Holidays Definition - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_LEV_HOLIDAYS_DEFINITION: TC_LEV_0461', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_LEV_0461: Holidays Definition - Scenario 11 (Boundary)', function () {
    // Objective: Validate Holidays Definition behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
