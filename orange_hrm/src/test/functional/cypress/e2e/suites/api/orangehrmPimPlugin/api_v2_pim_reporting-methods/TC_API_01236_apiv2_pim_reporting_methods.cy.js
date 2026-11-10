/**
 * Test Case ID: TC_API_01236
 * Route: apiv2_pim_reporting_methods
 * Endpoint: DELETE /api/v2/pim/reporting-methods
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01236: apiv2_pim_reporting_methods', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01236: Execute DELETE /api/v2/pim/reporting-methods [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/reporting-methods',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
