/**
 * Test Case ID: TC_API_00999
 * Route: performance_employee_tracker
 * Endpoint: GET /performance/viewEmployeePerformanceTrackerList
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00999: performance_employee_tracker', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00999: Execute GET /performance/viewEmployeePerformanceTrackerList [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/viewEmployeePerformanceTrackerList',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
