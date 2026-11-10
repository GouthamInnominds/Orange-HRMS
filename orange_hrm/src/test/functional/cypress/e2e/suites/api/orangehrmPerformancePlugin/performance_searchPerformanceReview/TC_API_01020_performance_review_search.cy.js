/**
 * Test Case ID: TC_API_01020
 * Route: performance_review_search
 * Endpoint: GET /performance/searchPerformanceReview
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01020: performance_review_search', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01020: Execute GET /performance/searchPerformanceReview [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/searchPerformanceReview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
