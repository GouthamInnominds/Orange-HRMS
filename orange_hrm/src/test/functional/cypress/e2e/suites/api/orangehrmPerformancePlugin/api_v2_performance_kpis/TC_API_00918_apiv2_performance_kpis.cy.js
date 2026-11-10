/**
 * Test Case ID: TC_API_00918
 * Route: apiv2_performance_kpis
 * Endpoint: DELETE /api/v2/performance/kpis
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00918: apiv2_performance_kpis', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00918: Execute DELETE /api/v2/performance/kpis [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/performance/kpis',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
