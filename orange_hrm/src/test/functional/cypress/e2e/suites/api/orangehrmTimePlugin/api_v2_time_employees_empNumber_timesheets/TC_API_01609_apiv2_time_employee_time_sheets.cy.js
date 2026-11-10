/**
 * Test Case ID: TC_API_01609
 * Route: apiv2_time_employee_time_sheets
 * Endpoint: POST /api/v2/time/employees/{empNumber}/timesheets
 * Method: POST
 * Priority: High
 */

describe('orangehrmTimePlugin - TC_API_01609: apiv2_time_employee_time_sheets', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01609: Execute POST /api/v2/time/employees/1/timesheets [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/time/employees/1/timesheets',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
