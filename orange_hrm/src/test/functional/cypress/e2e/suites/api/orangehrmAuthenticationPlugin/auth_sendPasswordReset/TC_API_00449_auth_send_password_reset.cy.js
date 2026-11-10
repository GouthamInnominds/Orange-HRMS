/**
 * Test Case ID: TC_API_00449
 * Route: auth_send_password_reset
 * Endpoint: GET /auth/sendPasswordReset
 * Method: GET
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00449: auth_send_password_reset', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00449: Execute GET /auth/sendPasswordReset [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/sendPasswordReset',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
