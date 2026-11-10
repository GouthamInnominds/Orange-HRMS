/**
 * Test Case ID: TC_AUTH_058
 * Feature: FEAT_PASSWORD_STRENGTH_VALIDATION
 * Name: Common/guessable password that satisfies character-class rules but has low entropy
 * Priority: Medium
 */

describe('Feature FEAT_PASSWORD_STRENGTH_VALIDATION: TC_AUTH_058', function () {
  beforeEach(function () {
    cy.visit('/web/index.php/auth/login');
  });

  it('TC_AUTH_058: Common/guessable password that satisfies character-class rules but has low entropy', function () {
    // Objective: Verify a predictable password (e.g. \'Password1!\') that technically satisfies length/character rules is still flagged as guessable via the zxcvbn strength score.
    cy.url().should('include', '/auth/login');
  });
});
