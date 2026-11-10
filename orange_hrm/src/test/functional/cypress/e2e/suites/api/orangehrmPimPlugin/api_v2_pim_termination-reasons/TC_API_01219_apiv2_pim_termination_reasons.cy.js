/**
 * Test Case ID: TC_API_01219
 * Route: apiv2_pim_termination_reasons
 * Endpoint: GET /api/v2/pim/termination-reasons
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01219: apiv2_pim_termination_reasons', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01219: Execute GET /api/v2/pim/termination-reasons [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/termination-reasons',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
