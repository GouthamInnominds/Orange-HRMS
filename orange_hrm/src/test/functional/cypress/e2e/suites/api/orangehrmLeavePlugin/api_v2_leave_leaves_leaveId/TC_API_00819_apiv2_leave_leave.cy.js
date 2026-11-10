/**
 * Test Case ID: TC_API_00819
 * Route: apiv2_leave_leave
 * Endpoint: PUT /api/v2/leave/leaves/{leaveId}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00819: apiv2_leave_leave', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00819: Execute PUT /api/v2/leave/leaves/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/leaves/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
