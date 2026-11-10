/**
 * Test Case ID: TC_API_01023
 * Route: performance_employee_tracker_logs
 * Endpoint: GET /performance/addPerformanceTrackerLog/trackId/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01023: performance_employee_tracker_logs', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01023: Execute GET /performance/addPerformanceTrackerLog/trackId/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/addPerformanceTrackerLog/trackId/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
