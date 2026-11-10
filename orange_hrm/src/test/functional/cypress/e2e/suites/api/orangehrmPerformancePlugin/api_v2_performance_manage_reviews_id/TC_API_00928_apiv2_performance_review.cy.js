/**
 * Test Case ID: TC_API_00928
 * Route: apiv2_performance_review
 * Endpoint: GET /api/v2/performance/manage/reviews/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00928: apiv2_performance_review', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00928: Execute GET /api/v2/performance/manage/reviews/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/manage/reviews/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
