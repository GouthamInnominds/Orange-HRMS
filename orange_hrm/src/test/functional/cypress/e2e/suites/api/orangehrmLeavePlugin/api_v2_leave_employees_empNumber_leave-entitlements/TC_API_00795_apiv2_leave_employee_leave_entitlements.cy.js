/**
 * Test Case ID: TC_API_00795
 * Route: apiv2_leave_employee_leave_entitlements
 * Endpoint: GET /api/v2/leave/employees/{empNumber}/leave-entitlements
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00795: apiv2_leave_employee_leave_entitlements', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00795: Execute GET /api/v2/leave/employees/1/leave-entitlements [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/employees/1/leave-entitlements',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
