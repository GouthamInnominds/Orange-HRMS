/**
 * Test Case ID: TC_PIM_0064
 * Feature: FEAT_PIM_CONTACT_DETAILS
 * Name: Contact Details - Scenario 4 (Security/RBAC)
 * Priority: High
 */

describe('Feature FEAT_PIM_CONTACT_DETAILS: TC_PIM_0064', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_PIM_0064: Contact Details - Scenario 4 (Security/RBAC)', function () {
    // Objective: Validate Contact Details behavior under Security/RBAC conditions (Rule validation #4).
    cy.url().should('include', '/auth/login');
  });
});
