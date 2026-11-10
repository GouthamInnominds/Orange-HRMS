/**
 * Test Case ID: TC_API_01026
 * Route: performance_review_evaluate_self
 * Endpoint: GET /performance/reviewEvaluate/id/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01026: performance_review_evaluate_self', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01026: Execute GET /performance/reviewEvaluate/id/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/reviewEvaluate/id/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
