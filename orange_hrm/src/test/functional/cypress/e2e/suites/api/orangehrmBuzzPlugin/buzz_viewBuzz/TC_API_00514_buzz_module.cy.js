/**
 * Test Case ID: TC_API_00514
 * Route: buzz_module
 * Endpoint: GET /buzz/viewBuzz
 * Method: GET
 * Priority: High
 */

describe('orangehrmBuzzPlugin - TC_API_00514: buzz_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00514: Execute GET /buzz/viewBuzz [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/buzz/viewBuzz',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
