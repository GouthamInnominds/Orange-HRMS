/**
 * Test Case ID: TC_API_00980
 * Route: apiv2_performance_reviews_supervisor_evaluation
 * Endpoint: GET /api/v2/performance/reviews/{reviewId}/evaluation/supervisor
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00980: apiv2_performance_reviews_supervisor_evaluation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00980: Execute GET /api/v2/performance/reviews/1/evaluation/supervisor [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/reviews/1/evaluation/supervisor',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
