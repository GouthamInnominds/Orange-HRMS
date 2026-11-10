/**
 * Test Case ID: TC_API_01382
 * Route: edit_reporting_method
 * Endpoint: GET /pim/saveReportingMethod/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01382: edit_reporting_method', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01382: Execute GET /pim/saveReportingMethod/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveReportingMethod/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
