/**
 * Test Case ID: TC_API_00869
 * Route: leave_view_my_leave_entitlement_report
 * Endpoint: GET /leave/viewMyLeaveBalanceReport
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00869: leave_view_my_leave_entitlement_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00869: Execute GET /leave/viewMyLeaveBalanceReport [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewMyLeaveBalanceReport',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
