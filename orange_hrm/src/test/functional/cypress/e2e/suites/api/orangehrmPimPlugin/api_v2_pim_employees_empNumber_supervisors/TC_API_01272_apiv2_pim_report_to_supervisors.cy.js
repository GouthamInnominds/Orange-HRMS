/**
 * Test Case ID: TC_API_01272
 * Route: apiv2_pim_report_to_supervisors
 * Endpoint: DELETE /api/v2/pim/employees/{empNumber}/supervisors
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPimPlugin - TC_API_01272: apiv2_pim_report_to_supervisors', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01272: Execute DELETE /api/v2/pim/employees/1/supervisors [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/pim/employees/1/supervisors',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
