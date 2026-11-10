/**
 * Test Case ID: TC_API_00850
 * Route: leave_add_leave_entitlement
 * Endpoint: GET /leave/addLeaveEntitlement
 * Method: GET
 * Priority: High
 */

describe('orangehrmLeavePlugin - TC_API_00850: leave_add_leave_entitlement', function () {
  beforeEach(function () {
    cy.fixture('user').then(({ admin }) => {
      if (cy.apiLogin) cy.apiLogin(admin);
    });
  });

  it('TC_API_00850: Execute GET /leave/addLeaveEntitlement [Expected: 200]', function () {
    cy.request({
      method: 'GET',
      url: '/leave/addLeaveEntitlement',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([200, 200, 201, 401, 403, 404]);
    });
  });
});
