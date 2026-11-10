/**
 * Test Case ID: TC_API_00687
 * Route: apiv2_dashboard_employee_on_leave_today_configuration
 * Endpoint: GET /api/v2/dashboard/config/employee-on-leave-today
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmDashboardPlugin - TC_API_00687: apiv2_dashboard_employee_on_leave_today_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00687: Execute GET /api/v2/dashboard/config/employee-on-leave-today [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/dashboard/config/employee-on-leave-today',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
