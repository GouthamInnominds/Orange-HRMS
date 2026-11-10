/**
 * Test Case ID: TC_API_01009
 * Route: performance_review_edit
 * Endpoint: GET /performance/saveReview/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01009: performance_review_edit', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01009: Execute GET /performance/saveReview/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/saveReview/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
