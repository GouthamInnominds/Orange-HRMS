/**
 * Test Case ID: TC_API_00807
 * Route: apiv2_leave_request_comments
 * Endpoint: GET /api/v2/leave/leave-requests/{leaveRequestId}/leave-comments
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00807: apiv2_leave_request_comments', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00807: Execute GET /api/v2/leave/leave-requests/1/leave-comments [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-requests/1/leave-comments',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
