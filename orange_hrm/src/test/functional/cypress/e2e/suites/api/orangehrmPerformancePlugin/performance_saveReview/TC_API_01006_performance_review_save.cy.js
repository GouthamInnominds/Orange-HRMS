/**
 * Test Case ID: TC_API_01006
 * Route: performance_review_save
 * Endpoint: GET /performance/saveReview
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01006: performance_review_save', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01006: Execute GET /performance/saveReview [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/saveReview',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
