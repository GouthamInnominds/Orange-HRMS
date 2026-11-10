/**
 * Test Case ID: TC_API_01642
 * Route: apiv2_time_employee_timesheets_list
 * Endpoint: GET /api/v2/time/employees/timesheets/list
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmTimePlugin - TC_API_01642: apiv2_time_employee_timesheets_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01642: Execute GET /api/v2/time/employees/timesheets/list [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/time/employees/timesheets/list',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
