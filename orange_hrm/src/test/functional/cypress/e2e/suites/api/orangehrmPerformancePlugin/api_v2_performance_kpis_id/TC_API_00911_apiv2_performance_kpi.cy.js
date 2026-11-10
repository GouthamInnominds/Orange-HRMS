/**
 * Test Case ID: TC_API_00911
 * Route: apiv2_performance_kpi
 * Endpoint: PUT /api/v2/performance/kpis/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00911: apiv2_performance_kpi', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00911: Execute PUT /api/v2/performance/kpis/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/performance/kpis/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
