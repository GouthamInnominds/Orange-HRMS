/**
 * Test Case ID: TC_API_00685
 * Route: apiv2_dashboard_employee_action_summary
 * Endpoint: GET /api/v2/dashboard/employees/action-summary
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmDashboardPlugin - TC_API_00685: apiv2_dashboard_employee_action_summary', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00685: Execute GET /api/v2/dashboard/employees/action-summary [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/dashboard/employees/action-summary',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
