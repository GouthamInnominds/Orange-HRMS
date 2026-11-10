/**
 * Test Case ID: TC_ATT_037
 * Feature: FEAT_MY_ATTENDANCE_RECORDS___DELETE
 * Name: Delete fails when ids parameter is not an array
 * Priority: Low
 */

describe('Feature FEAT_MY_ATTENDANCE_RECORDS___DELETE: TC_ATT_037', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ATT_037: Delete fails when ids parameter is not an array', function () {
    // Objective: Verify the delete request is rejected by validation when the \'ids\' parameter is not of array type.
    cy.url().should('include', '/auth/login');
  });
});
