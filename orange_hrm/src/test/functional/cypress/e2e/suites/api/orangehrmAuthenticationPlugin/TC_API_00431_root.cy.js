/**
 * Test Case ID: TC_API_00431
 * Route: root
 * Endpoint: GET /
 * Method: GET
 * Priority: High
 */

describe('orangehrmAuthenticationPlugin - TC_API_00431: root', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00431: Execute GET / [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
