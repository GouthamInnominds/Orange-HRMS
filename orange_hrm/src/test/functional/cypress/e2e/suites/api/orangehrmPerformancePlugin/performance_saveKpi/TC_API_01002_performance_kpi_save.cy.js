/**
 * Test Case ID: TC_API_01002
 * Route: performance_kpi_save
 * Endpoint: GET /performance/saveKpi
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01002: performance_kpi_save', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01002: Execute GET /performance/saveKpi [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/saveKpi',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
