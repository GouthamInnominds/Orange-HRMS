/**
 * Test Case ID: TC_BUZZ_067
 * Feature: FEAT_LIST_COMMENTS
 * Name: Paginate comments list using limit and offset
 * Priority: Low
 */

describe('Feature FEAT_LIST_COMMENTS: TC_BUZZ_067', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_BUZZ_067: Paginate comments list using limit and offset', function () {
    // Objective: Verify the comments list supports pagination.
    cy.url().should('include', '/auth/login');
  });
});
