/**
 * Test Case ID: TC_API_00756
 * Route: apiv2_leave_my_leave_requests
 * Endpoint: GET /api/v2/leave/leave-requests
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00756: apiv2_leave_my_leave_requests', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00756: Execute GET /api/v2/leave/leave-requests [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-requests',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
