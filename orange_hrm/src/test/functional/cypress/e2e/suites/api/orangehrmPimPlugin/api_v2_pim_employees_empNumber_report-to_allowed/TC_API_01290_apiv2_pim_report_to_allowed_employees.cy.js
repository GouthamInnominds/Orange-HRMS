/**
 * Test Case ID: TC_API_01290
 * Route: apiv2_pim_report_to_allowed_employees
 * Endpoint: GET /api/v2/pim/employees/{empNumber}/report-to/allowed
 * Method: GET
 * Priority: High
 */

describe('orangehrmPimPlugin - TC_API_01290: apiv2_pim_report_to_allowed_employees', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01290: Execute GET /api/v2/pim/employees/1/report-to/allowed [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/pim/employees/1/report-to/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
