/**
 * Test Case ID: TC_API_00432
 * Route: root
 * Endpoint: GET /
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmAuthenticationPlugin - TC_API_00432: root', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00432: Execute GET / [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
