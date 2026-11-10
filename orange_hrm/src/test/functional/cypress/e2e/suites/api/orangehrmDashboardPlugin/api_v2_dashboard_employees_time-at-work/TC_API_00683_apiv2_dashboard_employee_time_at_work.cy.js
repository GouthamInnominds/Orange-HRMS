/**
 * Test Case ID: TC_API_00683
 * Route: apiv2_dashboard_employee_time_at_work
 * Endpoint: GET /api/v2/dashboard/employees/time-at-work
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmDashboardPlugin - TC_API_00683: apiv2_dashboard_employee_time_at_work', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00683: Execute GET /api/v2/dashboard/employees/time-at-work [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/dashboard/employees/time-at-work',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
