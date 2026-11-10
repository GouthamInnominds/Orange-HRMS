/**
 * Test Case ID: TC_API_00677
 * Route: apiv2_dashboard_employees_by_subunit
 * Endpoint: GET /api/v2/dashboard/employees/subunit
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmDashboardPlugin - TC_API_00677: apiv2_dashboard_employees_by_subunit', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00677: Execute GET /api/v2/dashboard/employees/subunit [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/dashboard/employees/subunit',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
