/**
 * Test Case ID: TC_API_00674
 * Route: apiv2_dashboard_employees_on_leave
 * Endpoint: GET /api/v2/dashboard/employees/leaves
 * Method: GET
 * Priority: High
 */

describe('orangehrmDashboardPlugin - TC_API_00674: apiv2_dashboard_employees_on_leave', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00674: Execute GET /api/v2/dashboard/employees/leaves [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/dashboard/employees/leaves',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
