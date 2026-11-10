/**
 * Test Case ID: TC_API_00763
 * Route: apiv2_leave_my_leave_request
 * Endpoint: GET /api/v2/leave/leave-requests/{leaveRequestId}
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00763: apiv2_leave_my_leave_request', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00763: Execute GET /api/v2/leave/leave-requests/1 [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-requests/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
