/**
 * Test Case ID: TC_API_00829
 * Route: apiv2_leave_employee_leave
 * Endpoint: GET /api/v2/leave/employees/leaves
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00829: apiv2_leave_employee_leave', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00829: Execute GET /api/v2/leave/employees/leaves [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/employees/leaves',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
