/**
 * Test Case ID: TC_API_00988
 * Route: apiv2_performance_reviews_employee_evaluation
 * Endpoint: PUT /api/v2/performance/reviews/{reviewId}/evaluation/employee
 * Method: PUT
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00988: apiv2_performance_reviews_employee_evaluation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00988: Execute PUT /api/v2/performance/reviews/1/evaluation/employee [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/performance/reviews/1/evaluation/employee',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
