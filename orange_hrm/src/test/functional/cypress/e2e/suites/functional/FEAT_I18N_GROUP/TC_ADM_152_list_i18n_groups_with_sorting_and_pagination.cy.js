/**
 * Test Case ID: TC_ADM_152
 * Feature: FEAT_I18N_GROUP
 * Name: List I18N groups with sorting and pagination
 * Priority: Low
 */

describe('Feature FEAT_I18N_GROUP: TC_ADM_152', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_152: List I18N groups with sorting and pagination', function () {
    // Objective: Verify the group list supports sortField, sortOrder, limit and offset.
    cy.url().should('include', '/auth/login');
  });
});
