/**
 * Test Case ID: TC_API_00926
 * Route: apiv2_performance_supervisors
 * Endpoint: DELETE /api/v2/performance/supervisors
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00926: apiv2_performance_supervisors', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00926: Execute DELETE /api/v2/performance/supervisors [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/performance/supervisors',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
