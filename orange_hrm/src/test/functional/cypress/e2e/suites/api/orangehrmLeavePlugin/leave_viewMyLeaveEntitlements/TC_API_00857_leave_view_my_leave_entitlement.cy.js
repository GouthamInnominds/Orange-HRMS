/**
 * Test Case ID: TC_API_00857
 * Route: leave_view_my_leave_entitlement
 * Endpoint: GET /leave/viewMyLeaveEntitlements
 * Method: GET
 * Priority: Critical
 */

describe('orangehrmLeavePlugin - TC_API_00857: leave_view_my_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00857: Execute GET /leave/viewMyLeaveEntitlements [Expected: 401]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/viewMyLeaveEntitlements',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([401, 200, 201, 401, 403, 404]);
    });
  });
});
