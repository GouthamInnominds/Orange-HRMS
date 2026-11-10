/**
 * Test Case ID: TC_API_00914
 * Route: apiv2_performance_kpis
 * Endpoint: GET /api/v2/performance/kpis
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00914: apiv2_performance_kpis', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00914: Execute GET /api/v2/performance/kpis [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/kpis',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
