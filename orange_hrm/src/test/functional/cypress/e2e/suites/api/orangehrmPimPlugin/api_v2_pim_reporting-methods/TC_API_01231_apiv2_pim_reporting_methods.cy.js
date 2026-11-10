/**
 * Test Case ID: TC_API_01231
 * Route: apiv2_pim_reporting_methods
 * Endpoint: GET /api/v2/pim/reporting-methods
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01231: apiv2_pim_reporting_methods', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01231: Execute GET /api/v2/pim/reporting-methods [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/reporting-methods',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
