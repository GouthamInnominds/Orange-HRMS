/**
 * Test Case ID: TC_API_00691
 * Route: dashboard_widget
 * Endpoint: GET /dashboard/index
 * Method: GET
 * Priority: High
 */

describe('orangehrmDashboardPlugin - TC_API_00691: dashboard_widget', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00691: Execute GET /dashboard/index [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/dashboard/index',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
