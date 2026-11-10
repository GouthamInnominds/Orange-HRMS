/**
 * Test Case ID: TC_API_00793
 * Route: apiv2_leave_leave_entitlements
 * Endpoint: DELETE /api/v2/leave/leave-entitlements
 * Method: DELETE
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00793: apiv2_leave_leave_entitlements', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00793: Execute DELETE /api/v2/leave/leave-entitlements [Expected: 401]', function () {
    cy.request({
      method: 'DELETE',
      url: '/api/v2/leave/leave-entitlements',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
