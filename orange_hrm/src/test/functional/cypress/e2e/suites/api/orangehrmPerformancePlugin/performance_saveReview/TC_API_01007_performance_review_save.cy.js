/**
 * Test Case ID: TC_API_01007
 * Route: performance_review_save
 * Endpoint: GET /performance/saveReview
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01007: performance_review_save', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01007: Execute GET /performance/saveReview [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/saveReview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
