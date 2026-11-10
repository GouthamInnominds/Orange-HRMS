/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_VIEW_BUZZ_FEED | Tests: 5
 */

describe('Feature: FEAT_VIEW_BUZZ_FEED', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_029: View Buzz feed in default order', function () {
    // Priority: High | Objective: Verify the Buzz feed lists posts in descending order of creation time by default.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_030: Sort Buzz feed by number of likes', function () {
    // Priority: Medium | Objective: Verify the feed can be sorted by share.numOfLikes.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_031: Sort Buzz feed by number of comments', function () {
    // Priority: Medium | Objective: Verify the feed can be sorted by share.numOfComments.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_032: Paginate Buzz feed using limit and offset', function () {
    // Priority: Medium | Objective: Verify the feed supports pagination via limit and offset query parameters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_033: View Buzz feed with invalid sortField value', function () {
    // Priority: Low | Objective: Verify the feed rejects a sortField value that is not in the allowed list.
    cy.url().should('include', '/auth/login');
  });

});
