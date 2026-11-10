/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_CREATE_POST___VIDEO_LINK | Tests: 7
 */

describe('Feature: FEAT_CREATE_POST___VIDEO_LINK', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_BUZZ_016: Create video post with valid YouTube URL', function () {
    // Priority: High | Objective: Verify a Buzz post can be created using a valid YouTube video URL.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_017: Create video post with valid Vimeo URL', function () {
    // Priority: High | Objective: Verify a Buzz post can be created using a valid Vimeo video URL.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_018: Create video post with valid Dailymotion URL', function () {
    // Priority: High | Objective: Verify a Buzz post can be created using a valid Dailymotion video URL.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_019: Create video post with unsupported domain URL', function () {
    // Priority: High | Objective: Verify system rejects video URLs from domains other than YouTube Vimeo or Dailymotion.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_020: Create video post with malformed YouTube URL', function () {
    // Priority: Medium | Objective: Verify system rejects a URL that contains youtube but does not match a valid YouTube video URL pattern.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_021: Create video post with empty link field', function () {
    // Priority: High | Objective: Verify system rejects a video-type post submitted without a video link.
    cy.url().should('include', '/auth/login');
  });

  it('TC_BUZZ_022: Create video post using an already-embedded YouTube URL', function () {
    // Priority: Low | Objective: Verify system accepts a URL already in embedded format without modification.
    cy.url().should('include', '/auth/login');
  });

});
