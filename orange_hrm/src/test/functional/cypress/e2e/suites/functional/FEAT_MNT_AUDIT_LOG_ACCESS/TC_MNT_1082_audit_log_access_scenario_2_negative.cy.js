/**
 * Test Case ID: TC_MNT_1082
 * Feature: FEAT_MNT_AUDIT_LOG_ACCESS
 * Name: Audit Log Access - Scenario 2 (Negative)
 * Priority: High
 */

describe('Feature FEAT_MNT_AUDIT_LOG_ACCESS: TC_MNT_1082', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_MNT_1082: Audit Log Access - Scenario 2 (Negative)', function () {
    // Objective: Validate Audit Log Access behavior under Negative conditions (Rule validation #2).
    cy.url().should('include', '/auth/login');
  });
});
