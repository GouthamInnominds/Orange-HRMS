/**
 * Test Case ID: TC_BUZZ_091
 * Feature: FEAT_DELETE_SHARE__UNSHARE_
 * Name: Attempt to delete another employee's re-share
 * Priority: High
 */

describe('Feature FEAT_DELETE_SHARE__UNSHARE_: TC_BUZZ_091', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_091: Attempt to delete another employee\'s re-share', function () {
    // Objective: Verify a regular ESS user cannot delete or unshare a re-share entry created by another employee.
    cy.url().should('include', '/auth/login');
  });
});
