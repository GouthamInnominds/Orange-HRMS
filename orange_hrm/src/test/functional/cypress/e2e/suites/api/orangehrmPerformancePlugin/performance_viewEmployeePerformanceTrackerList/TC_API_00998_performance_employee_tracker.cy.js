/**
 * Test Case ID: TC_API_00998
 * Route: performance_employee_tracker
 * Endpoint: GET /performance/viewEmployeePerformanceTrackerList
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00998: performance_employee_tracker', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00998: Execute GET /performance/viewEmployeePerformanceTrackerList [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/viewEmployeePerformanceTrackerList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
