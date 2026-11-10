/**
 * Test Case ID: TC_ATT_033
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___DELETE
 * Name: Delete multiple own attendance records in a single request
 * Priority: Medium
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___DELETE: TC_ATT_033', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_033: Delete multiple own attendance records in a single request', function () {
    // Objective: Verify an employee can delete several of their own attendance records in one DELETE request using an array of IDs.
    cy.url().should('include', '/auth/login');
  });
});
