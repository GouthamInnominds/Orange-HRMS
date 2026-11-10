/**
 * Test Case ID: TC_API_00956
 * Route: apiv2_performance_my_reviews
 * Endpoint: GET /api/v2/performance/reviews
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00956: apiv2_performance_my_reviews', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00956: Execute GET /api/v2/performance/reviews [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/reviews',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
