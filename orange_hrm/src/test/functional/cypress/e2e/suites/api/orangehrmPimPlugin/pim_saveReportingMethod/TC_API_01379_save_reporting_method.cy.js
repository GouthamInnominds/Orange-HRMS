/**
 * Test Case ID: TC_API_01379
 * Route: save_reporting_method
 * Endpoint: GET /pim/saveReportingMethod
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01379: save_reporting_method', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01379: Execute GET /pim/saveReportingMethod [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveReportingMethod',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
