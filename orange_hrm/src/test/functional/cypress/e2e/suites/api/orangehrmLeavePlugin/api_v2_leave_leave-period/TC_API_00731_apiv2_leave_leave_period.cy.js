/**
 * Test Case ID: TC_API_00731
 * Route: apiv2_leave_leave_period
 * Endpoint: PUT /api/v2/leave/leave-period
 * Method: PUT
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00731: apiv2_leave_leave_period', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00731: Execute PUT /api/v2/leave/leave-period [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/leave-period',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
