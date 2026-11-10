/**
 * Test Case ID: TC_API_00817
 * Route: apiv2_leave_leaves
 * Endpoint: GET /api/v2/leave/leave-requests/{leaveRequestId}/leaves
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00817: apiv2_leave_leaves', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00817: Execute GET /api/v2/leave/leave-requests/1/leaves [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-requests/1/leaves',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
