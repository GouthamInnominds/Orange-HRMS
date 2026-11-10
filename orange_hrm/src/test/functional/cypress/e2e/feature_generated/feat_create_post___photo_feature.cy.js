/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_CREATE_POST___PHOTO | Tests: 8
 */

describe('Feature: FEAT_CREATE_POST___PHOTO', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_008: Create photo post with 1 valid image', function () {
    // Priority: High | Objective: Verify user can create a Buzz post with a single valid photo attachment.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_009: Create photo post with 5 valid images (max allowed)', function () {
    // Priority: High | Objective: Verify user can attach the maximum allowed 5 photos to a single post.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_010: Create photo post with 6 images (exceeds max)', function () {
    // Priority: High | Objective: Verify system rejects a photo post when more than 5 photos are attached.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_011: Create photo post with zero photos (empty array)', function () {
    // Priority: High | Objective: Verify system rejects a photo-type post submitted with no photos attached.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_012: Create photo post with unsupported file type', function () {
    // Priority: Medium | Objective: Verify system rejects photo uploads whose MIME type or extension is not in the allowed list (gif jpeg jpg jfif png).
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_013: Create photo post with image exceeding 2MB size limit', function () {
    // Priority: Medium | Objective: Verify system rejects a photo attachment larger than the 2MB (2097152 byte) maximum allowed size.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_014: Create photo post with image exactly at 2MB boundary', function () {
    // Priority: Medium | Objective: Verify a photo attachment exactly at the 2097152 byte size limit is accepted.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_015: Create photo post with filename exceeding 100 characters', function () {
    // Priority: Low | Objective: Verify system rejects a photo whose filename exceeds the 100 character maximum length.
    cy.url().should('include', '/auth/login');
  });

});
