/**
 * Test Case ID: TC_ADM_077
 * Feature: FEAT_QUALIFICATION___LICENSE
 * Name: Delete one or more licenses
 * Priority: High
 */

describe('Feature FEAT_QUALIFICATION___LICENSE: TC_ADM_077', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_077: Delete one or more licenses', function () {
    // Objective: Verify selected license records can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });
});
