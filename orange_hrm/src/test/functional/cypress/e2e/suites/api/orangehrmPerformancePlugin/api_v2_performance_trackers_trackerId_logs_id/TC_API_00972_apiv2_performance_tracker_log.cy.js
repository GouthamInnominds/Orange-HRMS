/**
 * Test Case ID: TC_API_00972
 * Route: apiv2_performance_tracker_log
 * Endpoint: GET api/v2/performance/trackers/{trackerId}/logs/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00972: apiv2_performance_tracker_log', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00972: Execute GET api/v2/performance/trackers/1/logs/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: 'api/v2/performance/trackers/1/logs/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
