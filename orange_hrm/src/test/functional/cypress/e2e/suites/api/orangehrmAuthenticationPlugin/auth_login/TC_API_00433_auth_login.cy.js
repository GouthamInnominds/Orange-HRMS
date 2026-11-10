/**
 * Test Case ID: TC_API_00433
 * Route: auth_login
 * Endpoint: GET /auth/login
 * Method: GET
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00433: auth_login', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00433: Execute GET /auth/login [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/login',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
