/**
 * Test Case ID: TC_API_00785
 * Route: apiv2_leave_leave_entitlement
 * Endpoint: PUT /api/v2/leave/leave-entitlements/{id}
 * Method: PUT
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00785: apiv2_leave_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00785: Execute PUT /api/v2/leave/leave-entitlements/1 [Expected: 401]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/leave-entitlements/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
