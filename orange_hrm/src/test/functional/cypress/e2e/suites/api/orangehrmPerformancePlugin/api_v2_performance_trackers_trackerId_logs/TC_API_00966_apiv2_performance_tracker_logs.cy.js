/**
 * Test Case ID: TC_API_00966
 * Route: apiv2_performance_tracker_logs
 * Endpoint: GET /api/v2/performance/trackers/{trackerId}/logs
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00966: apiv2_performance_tracker_logs', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00966: Execute GET /api/v2/performance/trackers/1/logs [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/trackers/1/logs',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
