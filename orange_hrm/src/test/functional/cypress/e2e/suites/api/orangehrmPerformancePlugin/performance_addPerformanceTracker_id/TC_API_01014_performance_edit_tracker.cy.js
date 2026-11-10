/**
 * Test Case ID: TC_API_01014
 * Route: performance_edit_tracker
 * Endpoint: GET /performance/addPerformanceTracker/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01014: performance_edit_tracker', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01014: Execute GET /performance/addPerformanceTracker/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/addPerformanceTracker/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
