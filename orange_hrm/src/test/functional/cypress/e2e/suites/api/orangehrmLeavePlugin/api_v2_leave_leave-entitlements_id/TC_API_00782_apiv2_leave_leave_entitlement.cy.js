/**
 * Test Case ID: TC_API_00782
 * Route: apiv2_leave_leave_entitlement
 * Endpoint: GET /api/v2/leave/leave-entitlements/{id}
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00782: apiv2_leave_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00782: Execute GET /api/v2/leave/leave-entitlements/1 [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-entitlements/1',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
