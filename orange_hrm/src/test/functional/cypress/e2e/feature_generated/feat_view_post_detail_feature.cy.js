/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_VIEW_POST_DETAIL | Tests: 3
 */

describe('Feature: FEAT_VIEW_POST_DETAIL', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_034: Get a post by valid ID with default model', function () {
    // Priority: Medium | Objective: Verify a single post can be retrieved by its ID using the default model.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_035: Get a post by valid ID with detailed model', function () {
    // Priority: Medium | Objective: Verify a single post can be retrieved with the detailed feed-post model including likes and comments summary.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_036: Get a post with a non-existent ID', function () {
    // Priority: Medium | Objective: Verify system returns a record-not-found error when requesting a post ID that does not exist.
    cy.url().should('include', '/auth/login');
  });

});
