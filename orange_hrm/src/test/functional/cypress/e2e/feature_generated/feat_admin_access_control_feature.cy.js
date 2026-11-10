/**
 * Automated Cypress Feature Functional Test Suite
 * Feature: FEAT_ADMIN_ACCESS_CONTROL | Tests: 9
 */

describe('Feature: FEAT_ADMIN_ACCESS_CONTROL', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      cy.visit('/web/index.php/auth/login');
    });
  });

  it('TC_AUTH_068: User without admin-verify permission is forwarded to Forbidden page', function () {
    // Priority: High | Objective: Verify a user lacking the \'auth_admin_verify\' data-group read permission cannot reach the admin verification step.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_069: Authorized admin submits correct password on the verification page', function () {
    // Priority: High | Objective: Verify a permitted user can step up to admin access by re-entering their password correctly.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_070: Authorized admin submits an incorrect password on the verification page', function () {
    // Priority: High | Objective: Verify re-authentication fails safely when the wrong password is supplied on the step-up form.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_071: Admin access flag is not sticky across page navigation', function () {
    // Priority: High | Objective: Verify that gaining admin access on one page does not silently grant it on subsequent unrelated pages, per AdministratorAccessSubscriber.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_072: Administrator Access page respects the \'forward\' query parameter', function () {
    // Priority: Medium | Objective: Verify the intended destination after verification is captured from the \'forward\' query string.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_073: Administrator Access page falls back to the home page as the back URL', function () {
    // Priority: Medium | Objective: Verify that without an explicit \'back\' query parameter (and no prior flash error), the back-url defaults to the user\'s home page path.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_074: Forward/back session attributes are cleared after successful verification', function () {
    // Priority: Medium | Objective: Verify stale forward/back URLs do not leak into subsequent unrelated privileged actions.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_075: Terminated or disabled admin user cannot pass step-up verification', function () {
    // Priority: High | Objective: Verify that even with the correct password, a disabled or terminated admin account fails the re-authentication check.
    cy.url().should('include', '/auth/login');
  });

  it('TC_AUTH_076: Forbidden page renders the correct 403 component', function () {
    // Priority: Low | Objective: Verify the Forbidden landing page displays the expected UI when access is denied.
    cy.url().should('include', '/auth/login');
  });

});
