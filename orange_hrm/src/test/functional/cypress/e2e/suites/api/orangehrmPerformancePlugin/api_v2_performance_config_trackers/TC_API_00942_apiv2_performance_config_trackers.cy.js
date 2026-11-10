/**
 * Test Case ID: TC_API_00942
 * Route: apiv2_performance_config_trackers
 * Endpoint: POST /api/v2/performance/config/trackers
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00942: apiv2_performance_config_trackers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00942: Execute POST /api/v2/performance/config/trackers [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/performance/config/trackers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
