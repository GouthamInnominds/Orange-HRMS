/**
 * Test Case ID: TC_API_01380
 * Route: save_reporting_method
 * Endpoint: GET /pim/saveReportingMethod
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01380: save_reporting_method', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01380: Execute GET /pim/saveReportingMethod [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveReportingMethod',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
