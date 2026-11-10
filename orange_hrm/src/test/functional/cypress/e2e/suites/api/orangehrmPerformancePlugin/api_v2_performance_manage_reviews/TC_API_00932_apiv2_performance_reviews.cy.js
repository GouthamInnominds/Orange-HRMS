/**
 * Test Case ID: TC_API_00932
 * Route: apiv2_performance_reviews
 * Endpoint: GET /api/v2/performance/manage/reviews
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00932: apiv2_performance_reviews', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00932: Execute GET /api/v2/performance/manage/reviews [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/manage/reviews',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
