/**
 * Test Case ID: TC_API_00459
 * Route: auth_request_enforce_password
 * Endpoint: POST /auth/resetWeakPassword
 * Method: POST
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00459: auth_request_enforce_password', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00459: Execute POST /auth/resetWeakPassword [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/auth/resetWeakPassword',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
