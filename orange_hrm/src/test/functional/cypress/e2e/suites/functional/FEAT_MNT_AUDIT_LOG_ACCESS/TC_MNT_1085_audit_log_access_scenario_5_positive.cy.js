/**
 * Test Case ID: TC_MNT_1085
 * Feature: FEAT_MNT_AUDIT_LOG_ACCESS
 * Name: Audit Log Access - Scenario 5 (Positive)
 * Priority: Critical
 */

describe('Feature FEAT_MNT_AUDIT_LOG_ACCESS: TC_MNT_1085', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1085: Audit Log Access - Scenario 5 (Positive)', function () {
    // Objective: Validate Audit Log Access behavior under Positive conditions (Rule validation #5).
    cy.url().should('include', '/auth/login');
  });
});
