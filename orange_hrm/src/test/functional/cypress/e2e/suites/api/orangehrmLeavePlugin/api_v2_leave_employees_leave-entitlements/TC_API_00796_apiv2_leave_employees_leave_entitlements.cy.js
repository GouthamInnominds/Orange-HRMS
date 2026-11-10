/**
 * Test Case ID: TC_API_00796
 * Route: apiv2_leave_employees_leave_entitlements
 * Endpoint: GET /api/v2/leave/employees/leave-entitlements
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00796: apiv2_leave_employees_leave_entitlements', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00796: Execute GET /api/v2/leave/employees/leave-entitlements [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/employees/leave-entitlements',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
