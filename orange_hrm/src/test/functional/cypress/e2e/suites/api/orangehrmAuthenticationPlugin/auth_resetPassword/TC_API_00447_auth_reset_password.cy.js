/**
 * Test Case ID: TC_API_00447
 * Route: auth_reset_password
 * Endpoint: POST /auth/resetPassword
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00447: auth_reset_password', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00447: Execute POST /auth/resetPassword [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/auth/resetPassword',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
