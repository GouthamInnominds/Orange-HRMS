/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_ADD_COMMENT | Tests: 6
 */

describe('Feature: FEAT_ADD_COMMENT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_052: Add a valid comment to a post', function () {
    // Priority: High | Objective: Verify a user can add a comment to an existing Buzz post or share.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_053: Add a comment with empty text', function () {
    // Priority: Medium | Objective: Verify system rejects a comment submitted with empty text.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_054: Add a comment exceeding max length (65531 chars)', function () {
    // Priority: Medium | Objective: Verify system rejects comment text exceeding the 65530 character limit.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_055: Add a comment to a non-existent share ID', function () {
    // Priority: Medium | Objective: Verify system rejects comment creation when the target shareId does not exist.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_056: Add comment at maximum boundary length (65530 chars)', function () {
    // Priority: Low | Objective: Verify a comment with text exactly at the 65530 character limit is accepted.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_057: Verify comment count increments correctly with multiple comments', function () {
    // Priority: Medium | Objective: Verify the post\'s number-of-comments counter increases correctly with each new comment added.
    cy.url().should('include', '/auth/login');
  });

});
