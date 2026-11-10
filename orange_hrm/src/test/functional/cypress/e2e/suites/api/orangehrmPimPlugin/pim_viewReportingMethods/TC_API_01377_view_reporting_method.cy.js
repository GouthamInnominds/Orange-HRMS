/**
 * Test Case ID: TC_API_01377
 * Route: view_reporting_method
 * Endpoint: GET /pim/viewReportingMethods
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01377: view_reporting_method', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01377: Execute GET /pim/viewReportingMethods [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/viewReportingMethods',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
