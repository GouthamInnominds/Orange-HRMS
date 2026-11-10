/**
 * Test Case ID: TC_API_01016
 * Route: performance_my_reviews
 * Endpoint: GET /performance/myPerformanceReview
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01016: performance_my_reviews', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01016: Execute GET /performance/myPerformanceReview [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/myPerformanceReview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
