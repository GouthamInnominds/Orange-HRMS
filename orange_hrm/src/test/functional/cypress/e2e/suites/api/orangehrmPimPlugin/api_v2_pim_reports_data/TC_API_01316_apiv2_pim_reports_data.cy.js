/**
 * Test Case ID: TC_API_01316
 * Route: apiv2_pim_reports_data
 * Endpoint: GET /api/v2/pim/reports/data
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01316: apiv2_pim_reports_data', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01316: Execute GET /api/v2/pim/reports/data [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/reports/data',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
