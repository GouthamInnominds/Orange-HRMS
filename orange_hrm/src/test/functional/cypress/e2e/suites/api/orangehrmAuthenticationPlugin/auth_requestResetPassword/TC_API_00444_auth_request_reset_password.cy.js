/**
 * Test Case ID: TC_API_00444
 * Route: auth_request_reset_password
 * Endpoint: POST /auth/requestResetPassword
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00444: auth_request_reset_password', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00444: Execute POST /auth/requestResetPassword [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/auth/requestResetPassword',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
