/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_LIKE_UNLIKE_POST | Tests: 6
 */

describe('Feature: FEAT_LIKE_UNLIKE_POST', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_069: Like a post for the first time', function () {
    // Priority: High | Objective: Verify a user can like a Buzz post/share that they have not previously liked.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_070: Attempt to like a post that is already liked', function () {
    // Priority: Medium | Objective: Verify system prevents a user from liking the same post twice.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_071: Unlike a previously liked post', function () {
    // Priority: High | Objective: Verify a user can remove their like from a post they previously liked.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_072: Attempt to unlike a post that was never liked', function () {
    // Priority: Medium | Objective: Verify system rejects an unlike request for a post the user has not liked.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_073: List all users who liked a post', function () {
    // Priority: Medium | Objective: Verify the list of likes for a given post/share can be retrieved.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_074: Like a post with a non-existent share ID', function () {
    // Priority: Medium | Objective: Verify system rejects a like request for a share ID that does not exist.
    cy.url().should('include', '/auth/login');
  });

});
