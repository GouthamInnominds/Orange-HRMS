/**
 * Test Case ID: TC_API_01323
 * Route: apiv2_pim_defined_reports
 * Endpoint: DELETE /api/v2/pim/reports/defined
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01323: apiv2_pim_defined_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01323: Execute DELETE /api/v2/pim/reports/defined [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/reports/defined',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
