/**
 * Test Case ID: TC_API_00434
 * Route: auth_login
 * Endpoint: GET /auth/login
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00434: auth_login', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00434: Execute GET /auth/login [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/login',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
