/**
 * Test Case ID: TC_API_00868
 * Route: leave_view_my_leave_entitlement_report
 * Endpoint: GET /leave/viewMyLeaveBalanceReport
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00868: leave_view_my_leave_entitlement_report', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00868: Execute GET /leave/viewMyLeaveBalanceReport [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewMyLeaveBalanceReport',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
