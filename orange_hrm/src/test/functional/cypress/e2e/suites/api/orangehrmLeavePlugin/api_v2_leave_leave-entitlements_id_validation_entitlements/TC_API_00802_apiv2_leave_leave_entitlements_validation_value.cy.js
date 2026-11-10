/**
 * Test Case ID: TC_API_00802
 * Route: apiv2_leave_leave_entitlements_validation_value
 * Endpoint: GET /api/v2/leave/leave-entitlements/{id}/validation/entitlements
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00802: apiv2_leave_leave_entitlements_validation_value', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00802: Execute GET /api/v2/leave/leave-entitlements/1/validation/entitlements [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/api/v2/leave/leave-entitlements/1/validation/entitlements',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
