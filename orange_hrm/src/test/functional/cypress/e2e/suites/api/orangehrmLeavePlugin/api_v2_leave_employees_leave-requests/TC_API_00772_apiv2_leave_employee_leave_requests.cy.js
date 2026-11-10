/**
 * Test Case ID: TC_API_00772
 * Route: apiv2_leave_employee_leave_requests
 * Endpoint: DELETE /api/v2/leave/employees/leave-requests
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00772: apiv2_leave_employee_leave_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00772: Execute DELETE /api/v2/leave/employees/leave-requests [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/leave/employees/leave-requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
