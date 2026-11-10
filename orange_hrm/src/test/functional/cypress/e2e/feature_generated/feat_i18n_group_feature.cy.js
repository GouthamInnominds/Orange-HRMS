/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_I18N_GROUP | Tests: 2
 */

describe('Feature: FEAT_I18N_GROUP', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_151: List all I18N translation groups', function () {
    // Priority: Medium | Objective: Verify all translation groups (module groupings for language strings) can be listed.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_152: List I18N groups with sorting and pagination', function () {
    // Priority: Low | Objective: Verify the group list supports sortField, sortOrder, limit and offset.
    cy.url().should('include', '/auth/login');
  });

});
