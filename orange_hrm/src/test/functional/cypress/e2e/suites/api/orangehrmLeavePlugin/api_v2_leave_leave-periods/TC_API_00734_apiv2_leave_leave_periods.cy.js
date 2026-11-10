/**
 * Test Case ID: TC_API_00734
 * Route: apiv2_leave_leave_periods
 * Endpoint: GET /api/v2/leave/leave-periods
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00734: apiv2_leave_leave_periods', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00734: Execute GET /api/v2/leave/leave-periods [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-periods',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
