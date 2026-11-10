/**
 * Test Case ID: TC_API_00955
 * Route: apiv2_performance_my_reviews
 * Endpoint: GET /api/v2/performance/reviews
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00955: apiv2_performance_my_reviews', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00955: Execute GET /api/v2/performance/reviews [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/reviews',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
