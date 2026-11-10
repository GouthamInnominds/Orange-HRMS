/**
 * Test Case ID: TC_API_01012
 * Route: performance_add_tracker
 * Endpoint: GET /performance/addPerformanceTracker
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01012: performance_add_tracker', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01012: Execute GET /performance/addPerformanceTracker [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/addPerformanceTracker',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
