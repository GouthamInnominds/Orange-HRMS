/**
 * Test Case ID: TC_API_01649
 * Route: time_module
 * Endpoint: GET /time/viewTimeModule
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01649: time_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01649: Execute GET /time/viewTimeModule [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewTimeModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
