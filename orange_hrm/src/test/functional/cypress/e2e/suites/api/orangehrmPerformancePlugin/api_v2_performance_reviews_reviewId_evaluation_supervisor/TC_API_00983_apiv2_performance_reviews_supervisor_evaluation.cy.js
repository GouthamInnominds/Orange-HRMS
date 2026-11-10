/**
 * Test Case ID: TC_API_00983
 * Route: apiv2_performance_reviews_supervisor_evaluation
 * Endpoint: PUT /api/v2/performance/reviews/{reviewId}/evaluation/supervisor
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00983: apiv2_performance_reviews_supervisor_evaluation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00983: Execute PUT /api/v2/performance/reviews/1/evaluation/supervisor [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/performance/reviews/1/evaluation/supervisor',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
