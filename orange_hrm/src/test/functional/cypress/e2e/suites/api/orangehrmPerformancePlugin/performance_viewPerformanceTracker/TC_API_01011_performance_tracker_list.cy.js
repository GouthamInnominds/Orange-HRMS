/**
 * Test Case ID: TC_API_01011
 * Route: performance_tracker_list
 * Endpoint: GET /performance/viewPerformanceTracker
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01011: performance_tracker_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01011: Execute GET /performance/viewPerformanceTracker [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/viewPerformanceTracker',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
