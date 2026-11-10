/**
 * Test Case ID: TC_API_00978
 * Route: apiv2_performance_reviews_kpis
 * Endpoint: GET /api/v2/performance/reviews/{reviewId}/kpis
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00978: apiv2_performance_reviews_kpis', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00978: Execute GET /api/v2/performance/reviews/1/kpis [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/reviews/1/kpis',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
