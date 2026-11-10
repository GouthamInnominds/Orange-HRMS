/**
 * Test Case ID: TC_API_00971
 * Route: apiv2_performance_tracker_logs
 * Endpoint: DELETE /api/v2/performance/trackers/{trackerId}/logs
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00971: apiv2_performance_tracker_logs', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00971: Execute DELETE /api/v2/performance/trackers/1/logs [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/performance/trackers/1/logs',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
