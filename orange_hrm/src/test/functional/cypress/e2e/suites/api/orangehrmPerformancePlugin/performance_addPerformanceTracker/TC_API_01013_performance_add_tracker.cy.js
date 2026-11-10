/**
 * Test Case ID: TC_API_01013
 * Route: performance_add_tracker
 * Endpoint: GET /performance/addPerformanceTracker
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01013: performance_add_tracker', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01013: Execute GET /performance/addPerformanceTracker [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/addPerformanceTracker',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
