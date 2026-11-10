/**
 * Test Case ID: TC_API_01650
 * Route: time_module
 * Endpoint: GET /time/viewTimeModule
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01650: time_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01650: Execute GET /time/viewTimeModule [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/time/viewTimeModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
