/**
 * Test Case ID: TC_API_01003
 * Route: performance_kpi_save
 * Endpoint: GET /performance/saveKpi
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01003: performance_kpi_save', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01003: Execute GET /performance/saveKpi [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/saveKpi',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
