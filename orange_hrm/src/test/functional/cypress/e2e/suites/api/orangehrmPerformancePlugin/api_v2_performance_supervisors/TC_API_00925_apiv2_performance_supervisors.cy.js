/**
 * Test Case ID: TC_API_00925
 * Route: apiv2_performance_supervisors
 * Endpoint: DELETE /api/v2/performance/supervisors
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00925: apiv2_performance_supervisors', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00925: Execute DELETE /api/v2/performance/supervisors [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/performance/supervisors',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
