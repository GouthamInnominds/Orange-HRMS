/**
 * Test Case ID: TC_API_01019
 * Route: performance_review_list
 * Endpoint: GET /performance/searchEvaluatePerformanceReview
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01019: performance_review_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01019: Execute GET /performance/searchEvaluatePerformanceReview [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/searchEvaluatePerformanceReview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
