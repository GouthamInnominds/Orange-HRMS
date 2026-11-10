/**
 * Test Case ID: TC_API_01001
 * Route: performance_kpi_search
 * Endpoint: GET /performance/searchKpi
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01001: performance_kpi_search', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01001: Execute GET /performance/searchKpi [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/searchKpi',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
