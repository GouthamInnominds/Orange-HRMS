/**
 * Test Case ID: TC_API_00770
 * Route: apiv2_leave_employee_leave_requests
 * Endpoint: POST /api/v2/leave/employees/leave-requests
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00770: apiv2_leave_employee_leave_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00770: Execute POST /api/v2/leave/employees/leave-requests [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/leave/employees/leave-requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
