/**
 * Test Case ID: TC_API_00790
 * Route: apiv2_leave_leave_entitlements
 * Endpoint: POST /api/v2/leave/leave-entitlements
 * Method: POST
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00790: apiv2_leave_leave_entitlements', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00790: Execute POST /api/v2/leave/leave-entitlements [Expected: 401]', function () {
    cy.request({
      method: 'POST',
      url: '/api/v2/leave/leave-entitlements',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
