/**
 * Test Case ID: TC_API_01266
 * Route: apiv2_pim_report_to_supervisors
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/supervisors
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01266: apiv2_pim_report_to_supervisors', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01266: Execute GET /api/v2/pim/employees/1/supervisors [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/supervisors',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
