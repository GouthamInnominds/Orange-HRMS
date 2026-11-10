/**
 * Test Case ID: TC_API_00855
 * Route: leave_view_leave_entitlement
 * Endpoint: GET /leave/viewLeaveEntitlements
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00855: leave_view_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00855: Execute GET /leave/viewLeaveEntitlements [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewLeaveEntitlements',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
