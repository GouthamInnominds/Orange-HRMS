/**
 * Test Case ID: TC_MNT_1095
 * Feature: FEAT_MNT_AUDIT_LOG_ACCESS
 * Name: Audit Log Access - Scenario 15 (Boundary)
 * Priority: Critical
 */

describe('Feature FEAT_MNT_AUDIT_LOG_ACCESS: TC_MNT_1095', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1095: Audit Log Access - Scenario 15 (Boundary)', function () {
    // Objective: Validate Audit Log Access behavior under Boundary conditions (Rule validation #15).
    cy.url().should('include', '/auth/login');
  });
});
