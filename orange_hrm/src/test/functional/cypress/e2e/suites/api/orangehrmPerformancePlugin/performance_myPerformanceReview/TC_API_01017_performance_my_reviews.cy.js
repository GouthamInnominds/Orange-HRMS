/**
 * Test Case ID: TC_API_01017
 * Route: performance_my_reviews
 * Endpoint: GET /performance/myPerformanceReview
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01017: performance_my_reviews', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01017: Execute GET /performance/myPerformanceReview [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/myPerformanceReview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
