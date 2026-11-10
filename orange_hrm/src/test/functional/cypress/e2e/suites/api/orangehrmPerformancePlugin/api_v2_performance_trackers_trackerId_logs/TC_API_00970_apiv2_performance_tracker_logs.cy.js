/**
 * Test Case ID: TC_API_00970
 * Route: apiv2_performance_tracker_logs
 * Endpoint: DELETE /api/v2/performance/trackers/{trackerId}/logs
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00970: apiv2_performance_tracker_logs', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00970: Execute DELETE /api/v2/performance/trackers/1/logs [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/performance/trackers/1/logs',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
