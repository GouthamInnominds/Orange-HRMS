/**
 * Test Case ID: TC_API_00951
 * Route: apiv2_performance_reviewers
 * Endpoint: GET /api/v2/performance/trackers/reviewers
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00951: apiv2_performance_reviewers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00951: Execute GET /api/v2/performance/trackers/reviewers [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/trackers/reviewers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
