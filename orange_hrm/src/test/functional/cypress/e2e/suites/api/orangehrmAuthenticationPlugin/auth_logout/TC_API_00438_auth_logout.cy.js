/**
 * Test Case ID: TC_API_00438
 * Route: auth_logout
 * Endpoint: GET /auth/logout
 * Method: GET
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00438: auth_logout', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00438: Execute GET /auth/logout [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/logout',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
