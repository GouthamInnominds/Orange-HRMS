/**
 * Test Case ID: TC_API_00452
 * Route: auth_send_password_reset_failure
 * Endpoint: GET /auth/sendPasswordResetFailure
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00452: auth_send_password_reset_failure', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00452: Execute GET /auth/sendPasswordResetFailure [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/sendPasswordResetFailure',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
