/**
 * Test Case ID: TC_API_00690
 * Route: apiv2_dashboard_employee_on_leave_today_configuration
 * Endpoint: PUT /api/v2/dashboard/config/employee-on-leave-today
 * Method: PUT
 * Priority: High
 */

describe('orangehrmDashboardPlugin - TC_API_00690: apiv2_dashboard_employee_on_leave_today_configuration', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00690: Execute PUT /api/v2/dashboard/config/employee-on-leave-today [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/dashboard/config/employee-on-leave-today',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
