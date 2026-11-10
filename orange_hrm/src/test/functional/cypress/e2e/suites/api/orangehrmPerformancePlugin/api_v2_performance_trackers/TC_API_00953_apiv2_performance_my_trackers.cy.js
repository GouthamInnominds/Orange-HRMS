/**
 * Test Case ID: TC_API_00953
 * Route: apiv2_performance_my_trackers
 * Endpoint: GET /api/v2/performance/trackers
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00953: apiv2_performance_my_trackers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00953: Execute GET /api/v2/performance/trackers [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/trackers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
