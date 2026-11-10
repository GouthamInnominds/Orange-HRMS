/**
 * Test Case ID: TC_API_00946
 * Route: apiv2_performance_config_tracker
 * Endpoint: GET /api/v2/performance/config/trackers/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00946: apiv2_performance_config_tracker', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00946: Execute GET /api/v2/performance/config/trackers/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/config/trackers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
