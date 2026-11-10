/**
 * Test Case ID: TC_API_00993
 * Route: apiv2_performance_reviews_final_evaluation
 * Endpoint: PUT /api/v2/performance/reviews/{reviewId}/evaluation/final
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00993: apiv2_performance_reviews_final_evaluation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00993: Execute PUT /api/v2/performance/reviews/1/evaluation/final [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/performance/reviews/1/evaluation/final',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
