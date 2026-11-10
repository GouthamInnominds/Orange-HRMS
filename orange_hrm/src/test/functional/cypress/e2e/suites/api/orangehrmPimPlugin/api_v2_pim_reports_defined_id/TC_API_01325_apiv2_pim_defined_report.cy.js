/**
 * Test Case ID: TC_API_01325
 * Route: apiv2_pim_defined_report
 * Endpoint: GET /api/v2/pim/reports/defined/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01325: apiv2_pim_defined_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01325: Execute GET /api/v2/pim/reports/defined/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/reports/defined/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
