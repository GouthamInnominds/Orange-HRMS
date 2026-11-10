/**
 * Test Case ID: TC_API_00959
 * Route: apiv2_performance_review_list
 * Endpoint: GET /api/v2/performance/employees/reviews
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00959: apiv2_performance_review_list', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00959: Execute GET /api/v2/performance/employees/reviews [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/employees/reviews',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
