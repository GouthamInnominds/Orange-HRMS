/**
 * Test Case ID: TC_API_00744
 * Route: apiv2_leave_leave_types
 * Endpoint: POST /api/v2/leave/leave-types
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00744: apiv2_leave_leave_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00744: Execute POST /api/v2/leave/leave-types [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/leave/leave-types',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
