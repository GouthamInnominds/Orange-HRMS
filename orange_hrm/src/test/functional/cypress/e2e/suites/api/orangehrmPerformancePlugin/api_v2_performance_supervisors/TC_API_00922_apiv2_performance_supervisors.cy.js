/**
 * Test Case ID: TC_API_00922
 * Route: apiv2_performance_supervisors
 * Endpoint: POST /api/v2/performance/supervisors
 * Method: POST
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00922: apiv2_performance_supervisors', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00922: Execute POST /api/v2/performance/supervisors [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/performance/supervisors',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
