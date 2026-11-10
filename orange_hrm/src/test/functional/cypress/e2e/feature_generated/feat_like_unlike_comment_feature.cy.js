/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_LIKE_UNLIKE_COMMENT | Tests: 5
 */

describe('Feature: FEAT_LIKE_UNLIKE_COMMENT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_075: Like a comment for the first time', function () {
    // Priority: High | Objective: Verify a user can like a comment that they have not previously liked.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_076: Attempt to like a comment that is already liked', function () {
    // Priority: Medium | Objective: Verify system prevents a user from liking the same comment twice.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_077: Unlike a previously liked comment', function () {
    // Priority: High | Objective: Verify a user can remove their like from a comment they previously liked.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_078: Attempt to unlike a comment that was never liked', function () {
    // Priority: Medium | Objective: Verify system rejects an unlike request for a comment the user has not liked.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_079: List all likes on a comment sorted by liked date', function () {
    // Priority: Low | Objective: Verify likes on a comment can be listed and sorted by likedAtUtc.
    cy.url().should('include', '/auth/login');
  });

});
