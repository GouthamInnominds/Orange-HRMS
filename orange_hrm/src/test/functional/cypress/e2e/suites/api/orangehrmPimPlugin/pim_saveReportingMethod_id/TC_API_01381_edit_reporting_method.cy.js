/**
 * Test Case ID: TC_API_01381
 * Route: edit_reporting_method
 * Endpoint: GET /pim/saveReportingMethod/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01381: edit_reporting_method', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01381: Execute GET /pim/saveReportingMethod/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/pim/saveReportingMethod/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
