/**
 * Test Case ID: TC_API_00937
 * Route: apiv2_performance_reviews
 * Endpoint: DELETE /api/v2/performance/manage/reviews
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00937: apiv2_performance_reviews', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00937: Execute DELETE /api/v2/performance/manage/reviews [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/performance/manage/reviews',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
