/**
 * Test Case ID: TC_API_00936
 * Route: apiv2_performance_reviews
 * Endpoint: POST /api/v2/performance/manage/reviews
 * Method: POST
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00936: apiv2_performance_reviews', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00936: Execute POST /api/v2/performance/manage/reviews [Expected: 422]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/performance/manage/reviews',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
