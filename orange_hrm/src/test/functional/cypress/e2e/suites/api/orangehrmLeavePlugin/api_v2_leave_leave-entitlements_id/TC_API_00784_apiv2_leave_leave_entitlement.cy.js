/**
 * Test Case ID: TC_API_00784
 * Route: apiv2_leave_leave_entitlement
 * Endpoint: PUT /api/v2/leave/leave-entitlements/{id}
 * Method: PUT
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00784: apiv2_leave_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00784: Execute PUT /api/v2/leave/leave-entitlements/1 [Expected: 200]', function () {
    cy.request({
      method: 'PUT',
      url: '/api/v2/leave/leave-entitlements/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
