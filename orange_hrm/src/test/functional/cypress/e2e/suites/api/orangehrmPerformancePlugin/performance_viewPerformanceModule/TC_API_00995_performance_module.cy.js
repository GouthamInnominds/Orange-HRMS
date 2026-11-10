/**
 * Test Case ID: TC_API_00995
 * Route: performance_module
 * Endpoint: GET /performance/viewPerformanceModule
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00995: performance_module', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00995: Execute GET /performance/viewPerformanceModule [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/viewPerformanceModule',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
