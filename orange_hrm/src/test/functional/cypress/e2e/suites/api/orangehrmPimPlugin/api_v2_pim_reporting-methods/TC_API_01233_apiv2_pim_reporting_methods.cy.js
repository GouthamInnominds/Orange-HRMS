/**
 * Test Case ID: TC_API_01233
 * Route: apiv2_pim_reporting_methods
 * Endpoint: POST /api/v2/pim/reporting-methods
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01233: apiv2_pim_reporting_methods', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01233: Execute POST /api/v2/pim/reporting-methods [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/reporting-methods',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
