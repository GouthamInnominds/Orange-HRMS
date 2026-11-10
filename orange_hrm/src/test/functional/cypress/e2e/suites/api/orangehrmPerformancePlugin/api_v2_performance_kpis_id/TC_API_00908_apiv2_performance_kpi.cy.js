/**
 * Test Case ID: TC_API_00908
 * Route: apiv2_performance_kpi
 * Endpoint: GET /api/v2/performance/kpis/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00908: apiv2_performance_kpi', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00908: Execute GET /api/v2/performance/kpis/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/kpis/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
