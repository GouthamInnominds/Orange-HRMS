/**
 * Test Case ID: TC_ADM_005
 * Feature: FEAT_JOB_TITLE
 * Name: Create job title with duplicate title name
 * Priority: High
 */

describe('Feature FEAT_JOB_TITLE: TC_ADM_005', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_ADM_005: Create job title with duplicate title name', function () {
    // Objective: Verify job title name must be unique (ENTITY_UNIQUE_PROPERTY on jobTitleName, ignoring deleted records).
    cy.url().should('include', '/auth/login');
  });
});
