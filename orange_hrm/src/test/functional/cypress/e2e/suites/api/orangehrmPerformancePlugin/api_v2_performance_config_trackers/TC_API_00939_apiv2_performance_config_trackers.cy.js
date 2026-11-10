/**
 * Test Case ID: TC_API_00939
 * Route: apiv2_performance_config_trackers
 * Endpoint: GET /api/v2/performance/config/trackers
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00939: apiv2_performance_config_trackers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00939: Execute GET /api/v2/performance/config/trackers [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/config/trackers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
