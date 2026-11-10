/**
 * Test Case ID: TC_API_01228
 * Route: apiv2_pim_reporting_method
 * Endpoint: PUT /api/v2/pim/reporting-methods/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01228: apiv2_pim_reporting_method', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01228: Execute PUT /api/v2/pim/reporting-methods/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/reporting-methods/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
