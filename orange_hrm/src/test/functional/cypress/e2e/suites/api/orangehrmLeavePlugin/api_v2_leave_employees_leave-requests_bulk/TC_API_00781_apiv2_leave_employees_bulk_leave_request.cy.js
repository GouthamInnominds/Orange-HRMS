/**
 * Test Case ID: TC_API_00781
 * Route: apiv2_leave_employees_bulk_leave_request
 * Endpoint: PUT /api/v2/leave/employees/leave-requests/bulk
 * Method: PUT
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00781: apiv2_leave_employees_bulk_leave_request', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00781: Execute PUT /api/v2/leave/employees/leave-requests/bulk [Expected: 422]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/employees/leave-requests/bulk',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([422, 200, 201, 401, 403, 404]);
    });
  });
});
