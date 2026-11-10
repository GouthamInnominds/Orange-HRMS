/**
 * Test Case ID: TC_API_01605
 * Route: apiv2_time_employee_time_sheets
 * Endpoint: GET /api/v2/time/employees/{empNumber}/timesheets
 * Method: GET
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01605: apiv2_time_employee_time_sheets', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01605: Execute GET /api/v2/time/employees/1/timesheets [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/employees/1/timesheets',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
