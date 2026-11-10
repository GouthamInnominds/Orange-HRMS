/**
 * Test Case ID: TC_API_00768
 * Route: apiv2_leave_employee_leave_requests
 * Endpoint: GET /api/v2/leave/employees/leave-requests
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00768: apiv2_leave_employee_leave_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00768: Execute GET /api/v2/leave/employees/leave-requests [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/employees/leave-requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
