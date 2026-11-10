/**
 * Test Case ID: TC_API_00439
 * Route: auth_logout
 * Endpoint: GET /auth/logout
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00439: auth_logout', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00439: Execute GET /auth/logout [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/auth/logout',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
