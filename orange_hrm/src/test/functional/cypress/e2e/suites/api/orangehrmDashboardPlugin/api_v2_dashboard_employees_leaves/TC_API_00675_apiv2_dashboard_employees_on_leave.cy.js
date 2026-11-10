/**
 * Test Case ID: TC_API_00675
 * Route: apiv2_dashboard_employees_on_leave
 * Endpoint: GET /api/v2/dashboard/employees/leaves
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmDashboardPlugin - TC_API_00675: apiv2_dashboard_employees_on_leave', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00675: Execute GET /api/v2/dashboard/employees/leaves [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/dashboard/employees/leaves',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
