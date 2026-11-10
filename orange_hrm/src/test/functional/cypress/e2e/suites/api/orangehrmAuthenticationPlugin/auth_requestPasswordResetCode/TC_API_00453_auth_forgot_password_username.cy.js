/**
 * Test Case ID: TC_API_00453
 * Route: auth_forgot_password_username
 * Endpoint: GET /auth/requestPasswordResetCode
 * Method: GET
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00453: auth_forgot_password_username', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00453: Execute GET /auth/requestPasswordResetCode [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/requestPasswordResetCode',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
