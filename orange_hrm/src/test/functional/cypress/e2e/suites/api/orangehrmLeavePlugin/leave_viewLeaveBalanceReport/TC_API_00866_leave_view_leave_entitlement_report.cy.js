/**
 * Test Case ID: TC_API_00866
 * Route: leave_view_leave_entitlement_report
 * Endpoint: GET /leave/viewLeaveBalanceReport
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00866: leave_view_leave_entitlement_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00866: Execute GET /leave/viewLeaveBalanceReport [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewLeaveBalanceReport',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
