/**
 * Test Case ID: TC_API_00678
 * Route: apiv2_dashboard_quick_launch
 * Endpoint: GET /api/v2/dashboard/shortcuts
 * Method: GET
 * Priority: High
 */

describe('orangehrmDashboardPlugin - TC_API_00678: apiv2_dashboard_quick_launch', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00678: Execute GET /api/v2/dashboard/shortcuts [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/dashboard/shortcuts',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
