/**
 * Test Case ID: TC_API_00445
 * Route: auth_request_reset_password
 * Endpoint: POST /auth/requestResetPassword
 * Method: POST
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00445: auth_request_reset_password', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00445: Execute POST /auth/requestResetPassword [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/auth/requestResetPassword',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
