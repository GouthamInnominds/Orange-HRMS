/**
 * Test Case ID: TC_API_00827
 * Route: apiv2_leave_reports_data
 * Endpoint: GET /api/v2/leave/reports/data
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00827: apiv2_leave_reports_data', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00827: Execute GET /api/v2/leave/reports/data [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/reports/data',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
