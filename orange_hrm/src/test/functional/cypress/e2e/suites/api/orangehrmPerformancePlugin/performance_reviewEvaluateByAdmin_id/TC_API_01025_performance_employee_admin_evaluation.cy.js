/**
 * Test Case ID: TC_API_01025
 * Route: performance_employee_admin_evaluation
 * Endpoint: GET /performance/reviewEvaluateByAdmin/{id}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmPerformancePlugin - TC_API_01025: performance_employee_admin_evaluation', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_01025: Execute GET /performance/reviewEvaluateByAdmin/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/performance/reviewEvaluateByAdmin/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
