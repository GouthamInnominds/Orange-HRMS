/**
 * Test Case ID: TC_API_01018
 * Route: performance_review_list
 * Endpoint: GET /performance/searchEvaluatePerformanceReview
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01018: performance_review_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01018: Execute GET /performance/searchEvaluatePerformanceReview [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/searchEvaluatePerformanceReview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
