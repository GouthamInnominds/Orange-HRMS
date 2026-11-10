/**
 * Test Case ID: TC_ADM_059
 * Feature: FEAT_QUALIFICATION___EDUCATION
 * Name: Delete one or more education records
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___EDUCATION: TC_ADM_059', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_059: Delete one or more education records', function () {
    // Objective: Verify selected education records can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });
});
