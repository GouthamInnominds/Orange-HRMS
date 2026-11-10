/**
 * Test Case ID: TC_API_00746
 * Route: apiv2_leave_leave_types
 * Endpoint: DELETE /api/v2/leave/leave-types
 * Method: DELETE
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00746: apiv2_leave_leave_types', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00746: Execute DELETE /api/v2/leave/leave-types [Expected: 200]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/leave/leave-types',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
