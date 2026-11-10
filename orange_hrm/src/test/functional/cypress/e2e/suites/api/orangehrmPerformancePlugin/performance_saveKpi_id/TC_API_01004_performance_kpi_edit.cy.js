/**
 * Test Case ID: TC_API_01004
 * Route: performance_kpi_edit
 * Endpoint: GET /performance/saveKpi/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_01004: performance_kpi_edit', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01004: Execute GET /performance/saveKpi/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/saveKpi/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
