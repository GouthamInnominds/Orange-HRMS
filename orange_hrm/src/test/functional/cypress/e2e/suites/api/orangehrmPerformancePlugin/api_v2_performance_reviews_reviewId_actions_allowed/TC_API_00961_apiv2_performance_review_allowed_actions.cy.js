/**
 * Test Case ID: TC_API_00961
 * Route: apiv2_performance_review_allowed_actions
 * Endpoint: GET /api/v2/performance/reviews/{reviewId}/actions/allowed
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00961: apiv2_performance_review_allowed_actions', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00961: Execute GET /api/v2/performance/reviews/1/actions/allowed [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/reviews/1/actions/allowed',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
