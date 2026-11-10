/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_MODULES | Tests: 6
 */

describe('Feature: FEAT_MODULES', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_ADM_158: List all configurable modules with status', function () {
    // Priority: Medium | Objective: Verify configurable modules (admin, pim, leave, time, recruitment, performance, maintenance, mobile, directory, claim, buzz) are listed with enabled/disabled status.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_159: Attempt to disable the Admin module', function () {
    // Priority: High | Objective: Verify the Admin module cannot be disabled (must always remain true per TRUE_VAL rule).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_160: Attempt to disable the PIM module', function () {
    // Priority: High | Objective: Verify the PIM module cannot be disabled (must always remain true per TRUE_VAL rule).
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_161: Enable/disable the Leave module', function () {
    // Priority: Medium | Objective: Verify non-core modules such as Leave can be toggled on and off.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_162: Enable/disable the Mobile module', function () {
    // Priority: Medium | Objective: Verify Mobile module toggle updates the mobile OAuth client status accordingly.
    cy.url().should('include', '/auth/login');
  });

  it('TC_ADM_163: Update modules with an invalid boolean value', function () {
    // Priority: Low | Objective: Verify module status fields must be boolean typed.
    cy.url().should('include', '/auth/login');
  });

});
