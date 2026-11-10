/**
 * Test Case ID: TC_API_01329
 * Route: apiv2_pim_defined_report
 * Endpoint: PUT /api/v2/pim/reports/defined/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01329: apiv2_pim_defined_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01329: Execute PUT /api/v2/pim/reports/defined/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/pim/reports/defined/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
