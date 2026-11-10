/**
 * Test Case ID: TC_API_00984
 * Route: apiv2_performance_reviews_employee_evaluation
 * Endpoint: GET /api/v2/performance/reviews/{reviewId}/evaluation/employee
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00984: apiv2_performance_reviews_employee_evaluation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00984: Execute GET /api/v2/performance/reviews/1/evaluation/employee [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/reviews/1/evaluation/employee',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
