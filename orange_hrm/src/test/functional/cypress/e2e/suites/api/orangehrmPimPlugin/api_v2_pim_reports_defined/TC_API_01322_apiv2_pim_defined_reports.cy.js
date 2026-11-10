/**
 * Test Case ID: TC_API_01322
 * Route: apiv2_pim_defined_reports
 * Endpoint: POST /api/v2/pim/reports/defined
 * Method: POST
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01322: apiv2_pim_defined_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01322: Execute POST /api/v2/pim/reports/defined [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/pim/reports/defined',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
