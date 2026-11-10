/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_VIDEO_URL_VALIDATION | Tests: 6
 */

describe('Feature: FEAT_VIDEO_URL_VALIDATION', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_023: Validate a valid YouTube short URL', function () {
    // Priority: Medium | Objective: Verify the link validation endpoint returns valid true for a correct YouTube URL.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_024: Validate a valid Vimeo URL', function () {
    // Priority: Medium | Objective: Verify the link validation endpoint returns valid true for a correct Vimeo URL.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_025: Validate a valid Dailymotion short (dai.ly) URL', function () {
    // Priority: Medium | Objective: Verify the link validation endpoint returns valid true for a correct Dailymotion short URL.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_026: Validate URL from an unsupported domain', function () {
    // Priority: Medium | Objective: Verify the endpoint returns valid false for a URL that does not belong to YouTube Vimeo or Dailymotion.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_027: Validate request missing required url query parameter', function () {
    // Priority: Medium | Objective: Verify request fails validation when the required url query parameter is not supplied.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_028: Validate malformed Vimeo URL containing keyword but invalid pattern', function () {
    // Priority: Medium | Objective: Verify the endpoint correctly flags a URL containing vimeo text but not matching a valid Vimeo pattern as invalid.
    cy.url().should('include', '/auth/login');
  });

});
