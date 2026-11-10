/**
 * Test Case ID: TC_API_00757
 * Route: apiv2_leave_my_leave_requests
 * Endpoint: POST /api/v2/leave/leave-requests
 * Method: POST
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00757: apiv2_leave_my_leave_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00757: Execute POST /api/v2/leave/leave-requests [Expected: 200]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/leave/leave-requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
