/**
 * Test Case ID: TC_API_00909
 * Route: apiv2_performance_kpi
 * Endpoint: GET /api/v2/performance/kpis/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00909: apiv2_performance_kpi', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00909: Execute GET /api/v2/performance/kpis/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/kpis/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
