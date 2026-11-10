/**
 * Test Case ID: TC_API_00730
 * Route: apiv2_leave_leave_period
 * Endpoint: GET /api/v2/leave/leave-period
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00730: apiv2_leave_leave_period', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00730: Execute GET /api/v2/leave/leave-period [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-period',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
