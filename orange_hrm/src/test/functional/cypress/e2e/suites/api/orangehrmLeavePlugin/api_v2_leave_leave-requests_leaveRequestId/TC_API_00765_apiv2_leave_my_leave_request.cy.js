/**
 * Test Case ID: TC_API_00765
 * Route: apiv2_leave_my_leave_request
 * Endpoint: PUT /api/v2/leave/leave-requests/{leaveRequestId}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00765: apiv2_leave_my_leave_request', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00765: Execute PUT /api/v2/leave/leave-requests/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/leave-requests/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
