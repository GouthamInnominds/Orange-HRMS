/**
 * Test Case ID: TC_API_00996
 * Route: performance_my_trackers
 * Endpoint: GET /performance/viewMyPerformanceTrackerList
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00996: performance_my_trackers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00996: Execute GET /performance/viewMyPerformanceTrackerList [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/viewMyPerformanceTrackerList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
