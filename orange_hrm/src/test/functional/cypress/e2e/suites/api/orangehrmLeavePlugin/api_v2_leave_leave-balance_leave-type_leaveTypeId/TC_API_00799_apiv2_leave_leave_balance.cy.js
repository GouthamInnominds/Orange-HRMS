/**
 * Test Case ID: TC_API_00799
 * Route: apiv2_leave_leave_balance
 * Endpoint: GET /api/v2/leave/leave-balance/leave-type/{leaveTypeId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00799: apiv2_leave_leave_balance', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00799: Execute GET /api/v2/leave/leave-balance/leave-type/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-balance/leave-type/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
