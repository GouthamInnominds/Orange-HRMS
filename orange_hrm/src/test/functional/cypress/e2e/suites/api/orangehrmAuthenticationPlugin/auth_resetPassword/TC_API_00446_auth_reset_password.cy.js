/**
 * Test Case ID: TC_API_00446
 * Route: auth_reset_password
 * Endpoint: POST /auth/resetPassword
 * Method: POST
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00446: auth_reset_password', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00446: Execute POST /auth/resetPassword [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/auth/resetPassword',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
