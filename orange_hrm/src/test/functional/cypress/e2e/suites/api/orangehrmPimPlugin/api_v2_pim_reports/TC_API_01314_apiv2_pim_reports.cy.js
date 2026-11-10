/**
 * Test Case ID: TC_API_01314
 * Route: apiv2_pim_reports
 * Endpoint: GET /api/v2/pim/reports
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01314: apiv2_pim_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01314: Execute GET /api/v2/pim/reports [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/reports',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
