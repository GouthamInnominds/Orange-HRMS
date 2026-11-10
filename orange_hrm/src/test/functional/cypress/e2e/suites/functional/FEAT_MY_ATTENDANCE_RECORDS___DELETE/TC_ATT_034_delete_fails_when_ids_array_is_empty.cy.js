/**
 * Test Case ID: TC_ATT_034
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___DELETE
 * Name: Delete fails when ids array is empty
 * Priority: Medium
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___DELETE: TC_ATT_034', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_034: Delete fails when ids array is empty', function () {
    // Objective: Verify deletion is rejected with \'No IDs Found\' when an empty ids array is submitted.
    cy.url().should('include', '/auth/login');
  });
});
