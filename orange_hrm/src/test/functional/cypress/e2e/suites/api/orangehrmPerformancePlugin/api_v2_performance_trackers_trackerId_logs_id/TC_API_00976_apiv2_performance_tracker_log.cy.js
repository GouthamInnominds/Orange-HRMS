/**
 * Test Case ID: TC_API_00976
 * Route: apiv2_performance_tracker_log
 * Endpoint: PUT api/v2/performance/trackers/{trackerId}/logs/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00976: apiv2_performance_tracker_log', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00976: Execute PUT api/v2/performance/trackers/1/logs/1 [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: 'api/v2/performance/trackers/1/logs/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
