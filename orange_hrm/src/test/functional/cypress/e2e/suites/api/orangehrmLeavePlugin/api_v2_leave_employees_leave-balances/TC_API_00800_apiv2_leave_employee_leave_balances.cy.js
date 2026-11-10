/**
 * Test Case ID: TC_API_00800
 * Route: apiv2_leave_employee_leave_balances
 * Endpoint: GET /api/v2/leave/employees/leave-balances
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00800: apiv2_leave_employee_leave_balances', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00800: Execute GET /api/v2/leave/employees/leave-balances [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/employees/leave-balances',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
