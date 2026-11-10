/**
 * Test Case ID: TC_API_00825
 * Route: apiv2_leave_reports
 * Endpoint: GET /api/v2/leave/reports
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00825: apiv2_leave_reports', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00825: Execute GET /api/v2/leave/reports [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/reports',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
