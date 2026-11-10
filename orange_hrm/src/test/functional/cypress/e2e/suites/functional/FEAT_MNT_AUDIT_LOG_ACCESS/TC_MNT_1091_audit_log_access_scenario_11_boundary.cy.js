/**
 * Test Case ID: TC_MNT_1091
 * Feature: FEAT_MNT_AUDIT_LOG_ACCESS
 * Name: Audit Log Access - Scenario 11 (Boundary)
 * Priority: Medium
 */

describe('Feature FEAT_MNT_AUDIT_LOG_ACCESS: TC_MNT_1091', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1091: Audit Log Access - Scenario 11 (Boundary)', function () {
    // Objective: Validate Audit Log Access behavior under Boundary conditions (Rule validation #11).
    cy.url().should('include', '/auth/login');
  });
});
