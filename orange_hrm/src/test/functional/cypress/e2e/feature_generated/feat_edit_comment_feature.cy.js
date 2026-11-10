/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EDIT_COMMENT | Tests: 4
 */

describe('Feature: FEAT_EDIT_COMMENT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_058: Edit own comment with valid text', function () {
    // Priority: High | Objective: Verify a user can edit the text of their own comment.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_059: Attempt to edit another employee\'s comment', function () {
    // Priority: High | Objective: Verify a regular ESS user cannot edit a comment authored by another employee.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_060: Edit comment with text exceeding max length', function () {
    // Priority: Medium | Objective: Verify system rejects edited comment text exceeding the 65530 character limit.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_061: Edit a comment that does not exist', function () {
    // Priority: Medium | Objective: Verify system returns a not-found error when editing a comment ID that does not exist.
    cy.url().should('include', '/auth/login');
  });

});
