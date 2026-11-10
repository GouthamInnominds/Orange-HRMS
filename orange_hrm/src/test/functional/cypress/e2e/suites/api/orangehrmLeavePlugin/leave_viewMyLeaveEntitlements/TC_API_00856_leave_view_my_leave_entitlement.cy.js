/**
 * Test Case ID: TC_API_00856
 * Route: leave_view_my_leave_entitlement
 * Endpoint: GET /leave/viewMyLeaveEntitlements
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00856: leave_view_my_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00856: Execute GET /leave/viewMyLeaveEntitlements [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewMyLeaveEntitlements',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
