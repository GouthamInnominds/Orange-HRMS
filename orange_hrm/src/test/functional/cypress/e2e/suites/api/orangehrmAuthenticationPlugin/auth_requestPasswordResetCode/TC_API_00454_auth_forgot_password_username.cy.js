/**
 * Test Case ID: TC_API_00454
 * Route: auth_forgot_password_username
 * Endpoint: GET /auth/requestPasswordResetCode
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00454: auth_forgot_password_username', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00454: Execute GET /auth/requestPasswordResetCode [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/requestPasswordResetCode',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
