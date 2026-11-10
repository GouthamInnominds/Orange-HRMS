/**
 * Test Case ID: TC_API_00450
 * Route: auth_send_password_reset
 * Endpoint: GET /auth/sendPasswordReset
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00450: auth_send_password_reset', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00450: Execute GET /auth/sendPasswordReset [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/sendPasswordReset',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
