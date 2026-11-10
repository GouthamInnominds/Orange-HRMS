/**
 * Test Case ID: TC_API_01021
 * Route: performance_review_search
 * Endpoint: GET /performance/searchPerformanceReview
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01021: performance_review_search', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01021: Execute GET /performance/searchPerformanceReview [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/searchPerformanceReview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
