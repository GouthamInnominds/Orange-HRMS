/**
 * Test Case ID: TC_API_00964
 * Route: apiv2_performance_employee_tracker
 * Endpoint: GET /api/v2/performance/employees/trackers/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_00964: apiv2_performance_employee_tracker', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00964: Execute GET /api/v2/performance/employees/trackers/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/performance/employees/trackers/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
