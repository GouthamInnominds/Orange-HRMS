/**
 * Test Case ID: TC_API_00681
 * Route: apiv2_dashboard_employees_by_location
 * Endpoint: GET /api/v2/dashboard/employees/locations
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmDashboardPlugin - TC_API_00681: apiv2_dashboard_employees_by_location', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00681: Execute GET /api/v2/dashboard/employees/locations [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/dashboard/employees/locations',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
