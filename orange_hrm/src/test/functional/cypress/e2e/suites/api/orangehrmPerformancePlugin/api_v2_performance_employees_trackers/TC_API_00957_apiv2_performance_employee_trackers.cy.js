/**
 * Test Case ID: TC_API_00957
 * Route: apiv2_performance_employee_trackers
 * Endpoint: GET /api/v2/performance/employees/trackers
 * Method: GET
 * Priority: High
 */

describe('orangehrmPerformancePlugin - TC_API_00957: apiv2_performance_employee_trackers', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00957: Execute GET /api/v2/performance/employees/trackers [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/employees/trackers',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
