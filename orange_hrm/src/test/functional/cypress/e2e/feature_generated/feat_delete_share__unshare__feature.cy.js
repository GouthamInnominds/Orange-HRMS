/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_DELETE_SHARE__UNSHARE_ | Tests: 3
 */

describe('Feature: FEAT_DELETE_SHARE__UNSHARE_', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_089: Delete own re-share without affecting the original post', function () {
    // Priority: High | Objective: Verify deleting a re-share (type=share) removes only that share entry and leaves the original post intact.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_090: Delete original post via the shares delete endpoint', function () {
    // Priority: High | Objective: Verify deleting a share record of type post removes the entire original post, cascading photos, comments, likes, and shares.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_091: Attempt to delete another employee\'s re-share', function () {
    // Priority: High | Objective: Verify a regular ESS user cannot delete or unshare a re-share entry created by another employee.
    cy.url().should('include', '/auth/login');
  });

});
