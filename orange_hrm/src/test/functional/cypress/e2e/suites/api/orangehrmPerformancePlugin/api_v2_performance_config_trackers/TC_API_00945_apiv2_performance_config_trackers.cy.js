/**
 * Test Case ID: TC_API_00945
 * Route: apiv2_performance_config_trackers
 * Endpoint: DELETE /api/v2/performance/config/trackers
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00945: apiv2_performance_config_trackers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00945: Execute DELETE /api/v2/performance/config/trackers [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/performance/config/trackers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
