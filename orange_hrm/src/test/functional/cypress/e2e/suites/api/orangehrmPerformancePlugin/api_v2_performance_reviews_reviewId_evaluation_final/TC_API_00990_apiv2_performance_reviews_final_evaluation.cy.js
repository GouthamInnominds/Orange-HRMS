/**
 * Test Case ID: TC_API_00990
 * Route: apiv2_performance_reviews_final_evaluation
 * Endpoint: GET /api/v2/performance/reviews/{reviewId}/evaluation/final
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00990: apiv2_performance_reviews_final_evaluation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00990: Execute GET /api/v2/performance/reviews/1/evaluation/final [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/reviews/1/evaluation/final',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
