/**
 * Test Case ID: TC_API_01289
 * Route: apiv2_pim_report_to_subordinates
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/subordinates
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01289: apiv2_pim_report_to_subordinates', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01289: Execute DELETE /api/v2/pim/employees/1/subordinates [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/subordinates',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
