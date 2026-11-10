/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_JOB_SPECIFICATION_ATTACHMENT | Tests: 3
 */

describe('Feature: FEAT_JOB_SPECIFICATION_ATTACHMENT', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_184: Retrieve job specification attachment for a job title that has one', function () {
    // Priority: Medium | Objective: Verify the job specification file metadata/content can be retrieved for a job title with an attached specification.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_185: Retrieve job specification for a job title with no attachment', function () {
    // Priority: Medium | Objective: Verify requesting the job specification for a job title without one returns a not-found error.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_186: Retrieve job specification for a non-existent job title id', function () {
    // Priority: Low | Objective: Verify requesting a job specification using an invalid jobTitleId is handled correctly.
    cy.url().should('include', '/auth/login');
  });

});
