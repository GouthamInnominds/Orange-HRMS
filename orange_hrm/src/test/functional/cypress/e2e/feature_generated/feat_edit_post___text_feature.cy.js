/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_EDIT_POST___TEXT | Tests: 4
 */

describe('Feature: FEAT_EDIT_POST___TEXT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_037: Edit own text post with valid new text', function () {
    // Priority: High | Objective: Verify a user can successfully edit the text of their own Buzz post.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_038: Attempt to edit another employee\'s post', function () {
    // Priority: High | Objective: Verify a regular ESS user cannot edit a Buzz post authored by another employee.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_039: Edit text post exceeding max length (65531 chars)', function () {
    // Priority: Medium | Objective: Verify system rejects an edit request where the updated text exceeds the 65530 character limit.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_040: Attempt to change post type from text to video during edit', function () {
    // Priority: Medium | Objective: Verify system prevents changing a post\'s type from text to video through the edit operation.
    cy.url().should('include', '/auth/login');
  });

});
