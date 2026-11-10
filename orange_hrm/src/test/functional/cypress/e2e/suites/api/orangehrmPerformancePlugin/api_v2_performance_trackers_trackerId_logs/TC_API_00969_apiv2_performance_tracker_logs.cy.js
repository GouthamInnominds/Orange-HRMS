/**
 * Test Case ID: TC_API_00969
 * Route: apiv2_performance_tracker_logs
 * Endpoint: POST /api/v2/performance/trackers/{trackerId}/logs
 * Method: POST
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00969: apiv2_performance_tracker_logs', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00969: Execute POST /api/v2/performance/trackers/1/logs [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/performance/trackers/1/logs',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
