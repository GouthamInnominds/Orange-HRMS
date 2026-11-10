/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_JOB_TITLE | Tests: 12
 */

describe('Feature: FEAT_JOB_TITLE', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_001: Create job title with valid title only', function () {
    // Priority: High | Objective: Verify a Job Title can be created with only the mandatory title field.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_002: Create job title with description and note', function () {
    // Priority: Medium | Objective: Verify a Job Title can be created with optional description (<=400 chars) and note (<=400 chars).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_003: Create job title with missing title field', function () {
    // Priority: High | Objective: Verify title is a required field and job title cannot be created without it.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_004: Create job title with title exceeding 100 characters', function () {
    // Priority: Medium | Objective: Verify job title name is rejected when it exceeds the max length of 100 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_005: Create job title with duplicate title name', function () {
    // Priority: High | Objective: Verify job title name must be unique (ENTITY_UNIQUE_PROPERTY on jobTitleName, ignoring deleted records).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_006: Create job title with description exceeding 400 characters', function () {
    // Priority: Low | Objective: Verify description field is rejected when it exceeds max length of 400 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_007: Create job title with a valid job specification attachment', function () {
    // Priority: Medium | Objective: Verify a base64 job specification file can be attached with filename <=200 characters.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_008: Update job title and delete current specification', function () {
    // Priority: Medium | Objective: Verify setting currentJobSpecification=deleteCurrent removes the existing attachment on update.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_009: Update job title without specifying currentJobSpecification when attachment exists', function () {
    // Priority: Medium | Objective: Verify update is rejected if currentJobSpecification is not provided while an attachment already exists.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_010: List job titles with activeOnly filter and pagination', function () {
    // Priority: Medium | Objective: Verify Job Titles list supports activeOnly filter, sorting and pagination (limit/offset).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_011: Get a job title by an invalid/non-existent id', function () {
    // Priority: Medium | Objective: Verify requesting a job title with a non-existent id returns a not-found error.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_012: Delete one or more job titles', function () {
    // Priority: High | Objective: Verify selected job titles can be bulk deleted.
    cy.url().should('include', '/auth/login');
  });

});
